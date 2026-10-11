/**
 * 日期 -> 背景照片的**唯一算法**（PLAN.md ADR-12，M-4）。
 *
 * 这份文件被两个地方使用，因此必须做到「一处定义、两处行为完全一致」：
 *   1. 构建期：Astro 直接 `import` 本文件，算出「构建机当天」的那张照片，
 *      写进首屏的 CSS 变量与内联 JSON（无 JS 时的背景、以及同一天访问时的零闪图路径）。
 *   2. 运行期：浏览器里的那段 `is:inline` 脚本。它**不能** import 模块（那会产出 .js 文件，
 *      打破 R3「dist 内 .js 计数为 0」），所以它用的是 `CHOOSE_BACKGROUND_SRC`
 *      —— 下面那个函数的**源码字符串**。存在两个物理副本，但只有一个真实来源。
 *
 * ⚠️ 保证一致性的手段是**测试**而不是注释：`tmp/test_bg_map.mjs` 会把
 *    `CHOOSE_BACKGROUND_SRC` 拿去 `new Function(...)` 执行，与 TS 版本逐日对比 366 天。
 *    改这里之后**必须**跑 `node tmp/test_bg_map.mjs`（或在 `tmp/` 里等价地重跑）。
 */

export interface BackgroundRule {
  /** 'YYYY-MM-DD' 精确某天 | 'MM-DD' 每年同月同日 | '0'..'6' 星期几（0 = 周日） */
  on: string;
  /** 背景照片 id（= public/images/backgrounds/<id>.jpg 的文件名） */
  bg: string;
}

export interface BackgroundData {
  ids: readonly string[];
  defaultId: string;
  persist: string;
  fallback: string;
  rules: readonly BackgroundRule[];
}

export interface StoredBackgroundChoice {
  id: string;
  /** 写入时的本地日期 YYYY-MM-DD；persist='day' 时用它判断是否已过期 */
  date: string;
}

export interface BackgroundChoice {
  id: string;
  reason: 'stored' | 'exact' | 'annual' | 'weekday' | 'fallback' | 'default';
}

/** 与 `src/backgrounds/config.ts` 的 `persist` / `fallback` 取值对应 */
export type PersistMode = 'day' | 'forever';
export type FallbackMode = 'hash' | 'cycle';

/**
 * 求解「某个日期应该用哪张背景」。
 *
 * 函数体同时是运行期脚本的源码（见文件头说明）：
 *   · 只使用 ES5 语法、`String`/`Math`，**不引用任何外部变量**、不使用模板字符串与箭头函数，
 *     因此既能被 TypeScript 直接调用，也能被 `new Function('backgroundData', 'dateYMD', 'stored', src)` 执行。
 *   · 不触碰 DOM / localStorage / 时钟 —— 日期一律由调用方传入，才能保证可测。
 *   · 入参 `backgroundData` / `dateYMD` / `stored` 在校验脚本里被改名，所以实现里必须用这三个名字。
 */
const CHOOSE_BACKGROUND = function chooseBackground(backgroundData: BackgroundData, dateYMD: string, stored: StoredBackgroundChoice | null | undefined): BackgroundChoice {
  var ids = (backgroundData && backgroundData.ids) || [];
  var defaultId = (backgroundData && backgroundData.defaultId) || '';
  var rules = (backgroundData && backgroundData.rules) || [];

  // 池里一张照片都没有（理论上不会发生：至少要有 default）—— 仍然给出确定的答案
  if (ids.length === 0) return { id: defaultId, reason: 'default' };

  // 1) 用户在当天点过随机按钮（persist='day' 时只认当天的记录）
  if (stored && stored.id && ids.indexOf(stored.id) !== -1) {
    if (backgroundData.persist !== 'day' || stored.date === dateYMD) {
      return { id: stored.id, reason: 'stored' };
    }
  }

  // 2) 规则表：命中顺序 = 数组顺序（config.ts 里已校验过「精确日期在 'MM-DD' 之前」）
  var mmdd = dateYMD.slice(5);
  var weekday = ((new Date(dateYMD + 'T00:00:00Z').getUTCDay() % 7) + 7) % 7;
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    if (!rule) continue;
    if (rule.on === dateYMD) return { id: rule.bg, reason: 'exact' };
    if (rule.on === mmdd) return { id: rule.bg, reason: 'annual' };
    if (rule.on === String(weekday)) return { id: rule.bg, reason: 'weekday' };
  }

  // 3) 兜底：同样是纯函数，同一天在任何设备上结果相同
  var index;
  if (backgroundData.fallback === 'cycle') {
    // 自 UTC 纪元起的天数，按天轮转
    index = Math.floor(new Date(dateYMD + 'T00:00:00Z').getTime() / 86400000);
  } else {
    // FNV-1a（32 位）——分布均匀，且对相邻日期不会退化成顺序递增
    var h = 2166136261;
    for (var j = 0; j < dateYMD.length; j++) {
      h = h ^ dateYMD.charCodeAt(j);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    index = h;
  }
  index = ((index % ids.length) + ids.length) % ids.length;
  var picked = ids[index];
  // defaultId 是「人写的」，可能打错字；此时退回池里第一张，保证一定有图
  if (!picked) return { id: ids.indexOf(defaultId) !== -1 ? defaultId : ids[0], reason: 'default' };
  return { id: picked, reason: 'fallback' };
};

/** 构建期可直接调用的类型安全版本 */
export const chooseBackground = CHOOSE_BACKGROUND;

/**
 * 运行期脚本用的源码（ES5）。运行期脚本会用它重建函数：
 *   var choose = new Function('backgroundData', 'dateYMD', 'stored', CHOOSE_BACKGROUND_SRC);
 * 见 `src/backgrounds/runtime.ts` 与 ADR-12。
 */
export const CHOOSE_BACKGROUND_SRC = CHOOSE_BACKGROUND.toString();

/** 浏览器与构建期共用的本地日期格式化（必须是**客户端本地时区**，不能用 toISOString）。 */
export const LOCAL_DATE_SRC = `function localDateYMD(d) {
  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  var day = d.getDate();
  return String(y) + '-' + (m < 10 ? '0' + m : String(m)) + '-' + (day < 10 ? '0' + day : String(day));
}`;

/** 构建期版本（供 BaseHead 与测试使用） */
export function localDateYMD(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}-${m < 10 ? '0' + m : m}-${day < 10 ? '0' + day : day}`;
}
