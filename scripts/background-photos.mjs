#!/usr/bin/env node
/**
 * Background photo pool maintenance (PLAN.md ADR-12, M-4).
 *
 * Sub-commands
 *   sync   scan public/images/backgrounds/, regenerate src/backgrounds/generated.ts,
 *          verify config.ts references + rule ordering, print the pool report.
 *   check  same verification, but never writes (non-zero exit if out of sync).
 *   add    import ONE local photo: strip EXIF/GPS + resize + compress via
 *          scripts/prepare_photo.py, then place it as <id>.jpg in the pool.
 *
 * Design notes
 *   - Zero npm dependencies: Node builtins + the already-available Python/Pillow
 *     toolchain used by M-3. `child_process.spawnSync` with `stdio: 'inherit'`
 *     is deliberate: capturing a child's piped stdout can be denied by the
 *     sandbox, so the Python helper's JSON report is written to a temp FILE.
 *   - The photos on disk are the source of truth for WHICH photos exist; config.ts
 *     is the source of truth for WHAT THEY MEAN (default photo, date rules).
 *     `sync` fails loudly when the two disagree, so `config.ts` can never point
 *     at a photo that no longer exists.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

const CONFIG_TS = path.join(ROOT, 'src', 'backgrounds', 'config.ts');
const GENERATED_TS = path.join(ROOT, 'src', 'backgrounds', 'generated.ts');
const POOL_DIR = path.join(ROOT, 'public', 'images', 'backgrounds');
const PREPARE_PY = path.join(HERE, 'prepare_photo.py');

const ID_RE = /^[a-z0-9][a-z0-9-]{0,40}$/;
const EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
/** Soft budget for the whole pool; a full-viewport photo is ~1.2-1.6 MB. */
const BUDGET_BYTES = 18 * 1024 * 1024;

const fail = (msg) => {
  console.error('ERROR: ' + msg);
  process.exitCode = 1;
};
const warn = (msg) => console.warn('WARN:  ' + msg);
const info = (msg) => console.log(msg);
const fmtMB = (b) => (b / 1024 / 1024).toFixed(2) + ' MB';

// ---------------------------------------------------------------------------
// reading the two sources of truth
// ---------------------------------------------------------------------------

/** Read config.ts as TEXT and pull out only the fields we need (no TS compiler). */
function readConfig() {
  if (!fs.existsSync(CONFIG_TS)) {
    throw new Error('missing ' + path.relative(ROOT, CONFIG_TS));
  }
  const raw = fs.readFileSync(CONFIG_TS, 'utf8');
  // config.ts deliberately ships a commented-out `rules` example, so comments must
  // be stripped before parsing — otherwise the example is read as a real rule and
  // `sync` would demand photos that do not exist. Block comments first, then whole
  // comment LINES only (an inline `// 'x',` inside a kept line is documented as
  // unsupported: write rules one per line).
  const src = raw
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(/\r?\n/)
    .filter((line) => !/^\s*\/\//.test(line))
    .join('\n');
  // Regex literals (not strings) on purpose: a `RegExp` built from a string needs
  // doubled backslashes, which is a silent source of drift when this file is edited.
  const strField = (name) => {
    const m = src.match(new RegExp(name + String.raw`\s*:\s*'([^']*)'`));
    if (!m) throw new Error('config.ts: cannot read string field `' + name + '`');
    return m[1];
  };
  // Rules can be overridden for VERIFICATION ONLY via RULES_JSON (a JSON array of
  // `{ on, bg }`). That lets tmp/check_bg_rules.mjs exercise the validation and the
  // "rule order / '06' weekday" traps without editing the committed config.
  let rules;
  if (process.env.RULES_JSON) {
    try {
      rules = JSON.parse(process.env.RULES_JSON);
    } catch (e) {
      throw new Error('RULES_JSON is not valid JSON: ' + e.message);
    }
    if (!Array.isArray(rules)) throw new Error('RULES_JSON must be a JSON array');
  } else {
    const rulesBlock = src.match(/rules\s*:\s*\[([\s\S]*?)\]/);
    if (!rulesBlock) throw new Error('config.ts: cannot read the `rules` array');
    rules = [...rulesBlock[1].matchAll(/on\s*:\s*'([^']*)'\s*,\s*bg\s*:\s*'([^']*)'/g)].map(
      (m) => ({ on: m[1], bg: m[2] }),
    );
    const rulesDeclared = (rulesBlock[1].match(/on\s*:/g) || []).length;
    if (rulesDeclared !== rules.length) {
      throw new Error(
        'config.ts: parsed ' + rules.length + ' of ' + rulesDeclared + ' rules — each rule must ' +
          "be written exactly as `{ on: '…', bg: '…' }` (quoted, single line) so the build can read it",
      );
    }
  }
  return {
    dir: strField('dir'),
    urlBase: strField('urlBase'),
    defaultId: strField('defaultId'),
    persist: strField('persist'),
    fallback: strField('fallback'),
    rules,
  };
}

/** Which photos actually exist on disk. */
function scanPool() {
  if (!fs.existsSync(POOL_DIR)) return [];
  return fs
    .readdirSync(POOL_DIR, { withFileTypes: true })
    .filter((e) => e.isFile() && EXTS.includes(path.extname(e.name).toLowerCase()))
    .map((e) => {
      const full = path.join(POOL_DIR, e.name);
      return { id: path.basename(e.name, path.extname(e.name)), file: e.name, bytes: fs.statSync(full).size };
    })
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/**
 * Rules must be ordered so that a one-off `YYYY-MM-DD` wins over the recurring
 * `MM-DD` for the same day. That is derived automatically for the same month-day,
 * but a rule placed BEFORE its more specific sibling silently never fires, which
 * is exactly the kind of quiet bug this check exists to prevent.
 *
 * `'06'` is also rejected on purpose: the weekday form is a SINGLE digit `'0'`-`'6'`,
 * so a two-digit value looks like a weekday but is parsed as an (impossible) MM-DD
 * and would silently never match. That mistake was made once while writing this
 * task's own tests; the check stays so nobody pays for it twice.
 */
function checkRuleOrder(rules) {
  const problems = [];
  const rank = { exact: 0, annual: 1, weekday: 2 };
  const kindOf = (on) =>
    /^\d{4}-\d{2}-\d{2}$/.test(on) ? 'exact' : /^\d{2}-\d{2}$/.test(on) ? 'annual' : /^[0-6]$/.test(on) ? 'weekday' : null;
  rules.forEach((r, i) => {
    const kind = kindOf(r.on);
    if (!kind) {
      problems.push(
        `rule #${i + 1}: \`on: '${r.on}'\` is not ` +
          'YYYY-MM-DD (one-off day) / MM-DD (every year) / 0-6 (weekday, 0 = Sunday)',
      );
    } else if (rank[kind] < (rank[kindOf(rules[i - 1]?.on)] ?? -1)) {
      problems.push(`rule #${i}: \`${r.on}\` is unreachable — a broader rule is listed above it`);
    }
    if (!ID_RE.test(r.bg)) problems.push(`rule #${i + 1}: \`bg: '${r.bg}'\` is not a valid photo id`);
  });
  return problems;
}

/** Every id referenced by config.ts must exist in the pool (and vice versa is a warning). */
function checkReferences(cfg, pool) {
  const ids = new Set(pool.map((p) => p.id));
  const problems = [];
  if (!ids.has(cfg.defaultId)) problems.push(`defaultId '${cfg.defaultId}' has no file in ${path.relative(ROOT, POOL_DIR)}`);
  cfg.rules.forEach((r, i) => {
    if (!ids.has(r.bg)) problems.push(`rule #${i + 1} ('${r.on}') points at '${r.bg}', which has no file`);
  });
  const referenced = new Set([cfg.defaultId, ...cfg.rules.map((r) => r.bg)]);
  const unused = pool.map((p) => p.id).filter((id) => !referenced.has(id));
  return { problems, unused };
}

function renderGenerated(cfg, pool) {
  const lines = pool.map((p) => `  { id: '${p.id}', bytes: ${p.bytes} },`);
  return `/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Written by \`pnpm sync:backgrounds\` (scripts/background-photos.mjs) from the
 * files actually present in \`${cfg.dir}\`.
 * Source of truth for what each photo MEANS is \`config.ts\`; this file only says
 * which photos exist. Re-run \`pnpm sync:backgrounds\` after adding/removing a photo.
 *
 * type: '${cfg.persist}'  fallback: '${cfg.fallback}'  default: '${cfg.defaultId}'
 */

export const BACKGROUND_POOL = [
${lines.join('\n')}
] as const;

export type BackgroundId = (typeof BACKGROUND_POOL)[number]['id'];

export const BACKGROUND_IDS: readonly string[] = BACKGROUND_POOL.map((p) => p.id);
`;
}

// ---------------------------------------------------------------------------
// sub-commands
// ---------------------------------------------------------------------------

function cmdSync(write) {
  let cfg;
  try {
    cfg = readConfig();
  } catch (e) {
    return fail(e.message);
  }
  const pool = scanPool();
  const orderProblems = checkRuleOrder(cfg.rules);
  const { problems, unused } = checkReferences(cfg, pool);

  const total = pool.reduce((a, p) => a + p.bytes, 0);
  info(`pool   : ${path.relative(ROOT, POOL_DIR)}  (${pool.length} photo(s), ${fmtMB(total)})`);
  pool.forEach((p) => info(`         - ${p.id.padEnd(24)} ${p.file.padEnd(28)} ${fmtMB(p.bytes)}`));
  info(`config : defaultId='${cfg.defaultId}'  persist='${cfg.persist}'  fallback='${cfg.fallback}'  rules=${cfg.rules.length}`);
  cfg.rules.forEach((r, i) => info(`         ${String(i + 1).padStart(2)}. ${r.on.padEnd(12)} -> ${r.bg}`));
  if (unused.length) warn(`never referenced by config.ts (still clickable by the random button): ${unused.join(', ')}`);
  if (total > BUDGET_BYTES) warn(`pool is ${fmtMB(total)} — over the ${fmtMB(BUDGET_BYTES)} soft budget; every photo is committed to Git history forever`);

  orderProblems.forEach((p) => fail(p));
  problems.forEach((p) => fail(p));
  if (orderProblems.length || problems.length) return;

  const next = renderGenerated(cfg, pool);
  const prev = fs.existsSync(GENERATED_TS) ? fs.readFileSync(GENERATED_TS, 'utf8') : '';
  const changed = prev !== next;

  if (write) {
    fs.mkdirSync(POOL_DIR, { recursive: true });
    fs.writeFileSync(GENERATED_TS, next, 'utf8');
    info(`generated: ${path.relative(ROOT, GENERATED_TS)} ${changed ? '(updated)' : '(already up to date)'}`);
  } else if (changed) {
    fail(`${path.relative(ROOT, GENERATED_TS)} is out of date — run \`pnpm sync:backgrounds\``);
  } else {
    info(`generated: ${path.relative(ROOT, GENERATED_TS)} (up to date)`);
  }
  info('OK');
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) out[a.slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    else out._.push(a);
  }
  return out;
}

function cmdAdd(argv) {
  const args = parseArgs(argv);
  const src = typeof args.src === 'string' ? args.src : args._[0];
  const id = typeof args.id === 'string' ? args.id : undefined;
  if (!src) return fail('add: give a source file, e.g.  pnpm add:background -- "D:/photos/sunset.jpg" --id sunset');
  if (!id) return fail('add: --id is required (it becomes the file name and the value you put in config.ts)');
  if (!ID_RE.test(id)) return fail(`add: --id '${id}' must match ${ID_RE} (lowercase letters, digits, hyphens)`);
  if (!fs.existsSync(src)) return fail('add: source not found: ' + src);

  const ext = path.extname(src).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'].includes(ext)) {
    return fail(`add: unsupported extension '${ext}' (Pillow must be able to open it)`);
  }
  fs.mkdirSync(POOL_DIR, { recursive: true });
  const dst = path.join(POOL_DIR, id + '.jpg');
  if (fs.existsSync(dst) && !args.force) {
    return fail(`${path.relative(ROOT, dst)} already exists — pick another --id, or pass --force to replace it ` +
      '(note: the replaced version stays in Git history forever)');
  }

  const reportPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'bg-')), 'report.json');
  const pyArgs = [PREPARE_PY, '--src', src, '--dst', dst];
  if (args.rotate) pyArgs.push('--rotate');
  if (typeof args.max === 'string') pyArgs.push('--max', args.max);
  if (typeof args.quality === 'string') pyArgs.push('--quality', args.quality);
  pyArgs.push('--report', reportPath);

  info('preparing (EXIF/GPS stripped, resized, recompressed)…');
  const res = spawnSync(args.python || 'python', [...pyArgs], { stdio: 'inherit' });
  if (res.error) return fail('add: could not run python — ' + res.error.message);
  if (res.status !== 0) return fail('add: prepare_photo.py exited with code ' + res.status);

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  info(`imported: ${path.relative(ROOT, dst)}  ${fmtMB(report.bytes)}  ${report.size[0]}x${report.size[1]}`);
  info(`          EXIF ${report.exifTagsAfter} tags / GPS ${report.gpsEntriesAfter} entries (must be 0/0)`);
  if (report.exifTagsAfter || report.gpsEntriesAfter) return fail('add: metadata survived — refusing to continue');

  info('');
  info(`next steps (two things, both required):`);
  info(`  1. add a rule in src/backgrounds/config.ts if you want this photo tied to a date,`);
  info(`     e.g. { on: '01-01', bg: '${id}' }  — without a rule it is reachable via the random button only.`);
  info(`  2. run \`pnpm sync:backgrounds\` (regenerates src/backgrounds/generated.ts).`);
  if (report.meanLuma > 120) {
    warn(`this photo is bright (meanLuma ${report.meanLuma}, p90 ${report.p90Luma}); the light text on it ` +
      'may fall below WCAG AA. Verify with the contrast gate before publishing (PLAN.md ADR-12).');
  }
  info('');
  info('Run `pnpm check:backgrounds` after sync — it will fail if config/index and disk disagree.');
}

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  switch (cmd) {
    case 'sync':
      return cmdSync(true);
    case 'check':
      return cmdSync(false);
    case 'add':
      return cmdAdd(rest);
    default:
      console.log('usage: node scripts/background-photos.mjs <sync|check|add> [options]');
      process.exitCode = 2;
  }
}

main();
