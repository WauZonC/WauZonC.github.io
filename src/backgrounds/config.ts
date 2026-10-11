/**
 * ★ 背景照片池的唯一配置文件 —— 你日常只需要改这一个文件。
 *   决策与理由见 PLAN.md **ADR-12**（M-4）。
 *
 * 三件事分开管，互不干扰：
 *   1. 有哪些照片  ->  public/images/backgrounds/ 里的文件（用 `pnpm add:background` 导入）
 *   2. 照片叫什么  ->  文件名即 id（<id>.jpg），config.ts 只引用 id
 *   3. 某天用哪张  ->  下面的 rules（本文件）
 *
 * 改完任何一项后都要跑一次：`pnpm sync:backgrounds`
 *   —— 它会把目录扫描成 src/backgrounds/generated.ts，并校验本文件引用的 id 都真实存在。
 *   忘了跑也不会静默出错：`pnpm check:backgrounds` / `pnpm build` 前的手工检查会直接失败。
 */

export const BACKGROUND_CONFIG = {
  /** 照片目录，相对仓库根目录。一般不需要改。 */
  dir: 'public/images/backgrounds',

  /** 照片的站点路径前缀（对应 public/ 下的目录）。一般不需要改。 */
  urlBase: '/images/backgrounds',

  /**
   * 兜底照片：所有规则都没命中时用它。
   * 它同时是「无 JS 环境」与「首屏构建期默认值」用的那张 —— 用 default 即可。
   */
  defaultId: 'default',

  /**
   * 点「随机换背景」按钮后的结果保留多久：
   *   'day'     = 当日有效；今天刷新/跳页都保持，到了明天自动回到日期规则（推荐）
   *   'forever' = 只要你不手动清理浏览器数据就永远保持
   */
  persist: 'day' as 'day' | 'forever',

  /**
   * 日期规则都没命中时怎么挑：
   *   'hash'  = 按日期字符串哈希打散（同一天恒定同一张，看起来随机）
   *   'cycle' = 按日期顺序轮转（照片少时可以保证每张都轮得到）
   */
  fallback: 'hash' as 'hash' | 'cycle',

  /**
   * 背景换图时的淡入时长（毫秒）。0 = 直接替换。
   * `prefers-reduced-motion: reduce` 的用户始终是直接替换，与这里的取值无关。
   */
  fadeMs: 420,

  /**
   * ★ 日期 -> 照片。**命中顺序 = 从上到下**，写在越靠前优先级越高。
   *
   * `on` 有三种写法：
   *   'YYYY-MM-DD'  只在这一天生效（一次性；例如某个只有今年才有的节日）
   *   'MM-DD'       每年的这个月-日都生效（节假日主要用这种）
   *   '0' .. '6'    每周的星期几，**单个数字**：0 = 周日、1 = 周一 … 6 = 周六
   *                 ⚠️ 不要写成 '06'：那会被当成「6 月某日」的残缺写法而永远不命中
   *                    （`pnpm sync:backgrounds` 会直接报错拦下这种写法）
   *
   * 两条硬规则（写错会 `pnpm sync:backgrounds` 直接报错退出，不会静默失效）：
   *   · 精确日期必须写在同年同月同日的 'MM-DD' **之前**；
   *   · `bg` 必须是背景目录里真实存在的 id。
   *
   * 例子（注释掉是因为这些照片还没导入；导入后取消注释并填自己的 id 即可）：
   *   { on: '2027-01-01', bg: 'new-year' },    // 只有 2027 年元旦
   *   { on: '01-01',      bg: 'new-year' },    // 以后每年元旦
   *   { on: '10-01',      bg: 'national-day' },// 每年国庆
   *   { on: '12-25',      bg: 'christmas' },   // 每年圣诞
   *   { on: '6',          bg: 'weekend-blue' },// 每周六（单个数字 6，不是 '06'）
   *
   * 想让「某个节日跨多天都用同一张」就写多行，例如：
   *   { on: '02-10', bg: 'spring-festival' },
   *   { on: '02-11', bg: 'spring-festival' },
   *   { on: '02-12', bg: 'spring-festival' },
   */
  rules: [
    // ---- 用户自己的指定（2026-10-11 导入 green-valley / colorful-danxia 时加的）----
    // 「带彩霞的丹霞」= colorful-danxia：国庆（10-01）当天优先用它。
    // 精确日期规则放在 'MM-DD' 之前，否则永远不会命中（sync 会拦下写反的情况）。
    { on: '2026-10-01', bg: 'colorful-danxia' },
    // 「绿色山谷」= green-valley：以后每年元旦用这张。
    { on: '01-01', bg: 'green-valley' },
    // ---- 下面这些是写法示例，需要时取消注释并换成你自己的 id ----
    // { on: '10-01',      bg: 'colorful-danxia' },  // 以后每年国庆都用丹霞
    // { on: '12-25',      bg: 'christmas' },
    // { on: '6',          bg: 'green-valley' },     // 每周六（单个数字 6，不是 '06'）
  ] as readonly { on: string; bg: string }[],
} as const;

/**
 * 浅色/深色切换的**静默开关**（M-4，用户要求：保留代码但不在页面上展示，保持浅色）。
 *
 *   false = 关闭（当前状态）：页头不渲染主题按钮；`<html>` 不带 `gate-dark` 类，
 *           因此 `prefers-color-scheme: dark` 那套深色令牌**不再生效**，
 *           站点恒定显示浅色态 —— 界面外观与改动前完全一致。
 *   true  = 恢复：`<html>` 带 `gate-dark`，深色令牌与「跟随系统」恢复，
 *           页头重新渲染 ThemeToggle 按钮。
 *
 * ⚠️ 置回 true 时**只需要改这一行**：ThemeToggle.astro 与其内联脚本、
 *    global.css 里的两处深色令牌块都没有被删除。详见 PLAN.md ADR-12。
 */
export const THEME_TOGGLE_ENABLED = false;
