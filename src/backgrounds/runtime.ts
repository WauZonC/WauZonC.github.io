/**
 * 运行期（浏览器）脚本的生成器（PLAN.md ADR-12，M-4）。
 *
 * 为什么是「生成字符串」而不是写一个 `.js` 文件：
 *   Astro 会把 `<script src>` / 非 `is:inline` 的内联脚本打包成**真实 .js 文件**，
 *   而 R3 要求 `dist` 内 `.js` 计数恒为 **0**（ADR-1 / ADR-9 的既有约束）。
 *   所以运行期脚本必须 `is:inline`，其内容由本模块在构建期拼好、用 `set:html` 注入。
 *   `is:inline` 的内容不做模板插值，这正是它需要 `set:html` 的原因。
 *
 * 脚本职责（顺序即执行顺序，任何一步都不等待网络）：
 *   A. 解析注入的 JSON（照片池 + 规则 + 开关）
 *   B. 读 localStorage['bg-v1']，按 persist 语义决定是否沿用
 *   C. 按**客户端本地日期**求解 —— 工具函数挂在 window.__dshBg 上，供按钮那段脚本复用
 *   D. 若结果与「构建期已写进 CSS 的默认值」不同才覆写 --bg-photo（同一天访问时 0 次多余改动）
 *   E. 给 <html> 加 bg 类（CSS 用它显示按钮，无 JS 时不显示死按钮）
 *
 * ⚠️ 实测记录：Astro/Vite 的构建会对 `<script is:inline>` 的**内容**做一次打印重排
 *    （空格→制表符、CRLF、单行 return 加花括号、去掉注释与多余括号），并且会把
 *    `data.persist` 这类**构建期常量**直接内联成字面量（因为数据来自 config.ts）。
 *    这不会改变行为（日期映射的构建期/运行期一致性有 1461 天的逐日断言，见
 *    `tmp/test_bg_map.mjs`），但意味着**不能假设产物里的脚本文本与源码逐字节相同**。
 *    同时它带来一个良性耦合：改 config.ts 的 persist / fallback / 规则后**必须重新构建**
 *    才会反映到线上 —— 这正是本项目「推送即重建」的既有流程，无需额外操作。
 *
 * 注意：这里**不做任何网络请求**（没有 fetch / 没有清单下载），
 * 所以首屏不会因为「等清单」而闪一帧错图。
 */

import { BACKGROUND_IDS } from './generated';
import { BACKGROUND_CONFIG, THEME_TOGGLE_ENABLED } from './config';
import { CHOOSE_BACKGROUND_SRC, LOCAL_DATE_SRC, chooseBackground } from './date-map';
import type { BackgroundData } from './date-map';

export const BACKGROUND_CONFIG_ID = 'bg-config';
export const BACKGROUND_STORAGE_KEY = 'bg-v1';

/** 注入给浏览器的最小数据集（照片 id 列表 + 规则 + 语义开关） */
export const backgroundData: BackgroundData = {
  ids: BACKGROUND_IDS,
  defaultId: BACKGROUND_CONFIG.defaultId,
  persist: BACKGROUND_CONFIG.persist,
  fallback: BACKGROUND_CONFIG.fallback,
  rules: BACKGROUND_CONFIG.rules,
};

/** JSON 里的 `<` / `>` 会提前结束 <script> 标签；转义成 unicode 转义序列最稳。 */
export function serializeBackgroundData(): string {
  return JSON.stringify(backgroundData)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/** 照片的站点 URL。id 已被校验为 [a-z0-9-]，可安全拼进 CSS url() */
export function backgroundUrl(id: string): string {
  return `${BACKGROUND_CONFIG.urlBase}/${id}.jpg`;
}

/**
 * 构建期：算出「构建机本地当天」的照片 URL。
 * 它会以内联 `<style>` 的形式写进首屏：
 *   · 无 JS 时的背景就是它（必须有确定值，不能留空）
 *   · 构建机与访客同一天时，运行期脚本不会覆写它 —— 既不闪图也不多发一次请求
 */
export function buildTimeBackgroundUrl(now: Date): { id: string; src: string; date: string } {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const date = `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
  // 构建期没有 localStorage，等价于 stored = null
  const choice = chooseBackground(backgroundData, date, null);
  return { id: choice.id, src: backgroundUrl(choice.id), date };
}

/** 门控类名（见 config.ts 的 THEME_TOGGLE_ENABLED 与 ADR-12） */
export const THEME_GATE_CLASS = THEME_TOGGLE_ENABLED ? 'gate-dark' : '';

/**
 * 浏览器端 `is:inline` 脚本的源码。
 *
 * ⚠️ 这段脚本**不调用**本地化日期函数：它调用日期映射函数时传入的是脚本内自己算出的
 *    「客户端本地日期」字符串；映射函数只比较传入的字符串，不需要时区知识。
 */
export function backgroundInlineScript(): string {
  const baked = buildTimeBackgroundUrl(new Date()).src;
  return `(function () {
 try {
  var root = document.documentElement;
  root.className += ' js bg';
  // ⚠️ 求解函数必须用「new Function('return (源码)')()」这种形式拿到（下称 D 式）。
  //    实测对照（tmp/probe_fnrule.mjs 里逐条复现过）：
  //      A. new Function('a','b','c', 声明源码)          -> 函数体只是一条声明语句，调用得 undefined
  //      B. new Function('a','b','c', '(' + 源码 + ')')  -> 同上，仍是 undefined
  //      C. B 式后面再加 () 想直接调用                    -> 抛 "(intermediate value)(...) is not a function"
  //      D. new Function('return (' + 源码 + ')')()       -> ✅ 拿到函数
  //    前两种都不报错、只静默返回 undefined —— 表现是按钮完全没反应、__dshBg 从未被赋值，
  //    而页面看起来一切正常（首屏背景来自构建期注入的 CSS）。第一版就踩了这个坑，
  //    现在 tmp/probe_fnrule.mjs（单元）、tmp/test_bg_map.mjs（产物）与
  //    tmp/probe_browser.py（真实浏览器）各有一道门。
  //    ⚠️ 本模板里的注释**不许出现反引号**：它会提前结束模板字符串（这一条也踩过）。
  var choose = new Function('return (' + ${JSON.stringify(CHOOSE_BACKGROUND_SRC)} + ')')();
  var localDateYMD = new Function('return (' + ${JSON.stringify(LOCAL_DATE_SRC)} + ')')();
  var data = JSON.parse(document.getElementById(${JSON.stringify(BACKGROUND_CONFIG_ID)}).textContent);
  var urlBase = ${JSON.stringify(BACKGROUND_CONFIG.urlBase)};
  var baked = ${JSON.stringify(baked)};
  var KEY = ${JSON.stringify(BACKGROUND_STORAGE_KEY)};

  function readStored() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (obj && typeof obj.id === 'string' && typeof obj.date === 'string') return obj;
    } catch (e) {
      /* 隐私模式下 localStorage 可能不可用：退化为「只看日期规则」 */
    }
    return null;
  }

  var today = localDateYMD(new Date());
  var choice = choose(data, today, readStored());
  /** 当前背景 id 的单一真值：初始化一次，之后由 apply 更新 */
  var currentId = choice.id;

  if (urlBase + '/' + currentId + '.jpg' !== baked) {
    root.style.setProperty('--bg-photo', "url('" + urlBase + '/' + currentId + '.jpg' + "')");
  }

  /**
   * 供页头的「随机换背景」按钮使用。
   * 抽签时排除当前这张 —— 否则点一下有一半概率看起来「没反应」。
   */
  window.__dshBg = {
    today: today,
    current: function () { return currentId; },
    urlOf: function (id) { return urlBase + '/' + id + '.jpg'; },
    /** 暴露已注入的求解函数：按钮要用，验收探针也用它（对同一份产物跑合成池的语义测试） */
    choose: choose,
    /** 本页实际注入的配置（照片池 / 规则 / 开关） */
    data: data,
    /** 只做「落盘 + 换图」，抽签策略留在按钮组件里，便于读懂与改动 */
    apply: function (id) {
      if (!id || data.ids.indexOf(id) === -1) return false;
      try {
        window.localStorage.setItem(KEY, JSON.stringify({ id: id, date: today }));
      } catch (e) {
        /* 存不下也不影响本次会话内的显示 */
      }
      var src = this.urlOf(id);
      var layer = document.querySelector('.bg-layer[data-active="true"]');
      var other = document.querySelector('.bg-layer[data-active="false"]');
      if (!layer || !other) {
        root.style.setProperty('--bg-photo', "url('" + src + "')");
      } else {
        // 双层交叉淡入：新图写进当前隐藏的那一层，再翻转可见性。
        // 两层都有图（CSS 里给了同一个初值），所以永远不会露出空白。
        other.style.setProperty('--bg-photo', "url('" + src + "')");
        other.setAttribute('data-active', 'true');
        layer.setAttribute('data-active', 'false');
      }
      choice = { id: id, reason: 'stored' };
      currentId = id;
      return true;
    }
  };
 } catch (err) {  /* 兜底：这段脚本坏掉时**不要**连累页面其余部分。
     最典型的静默失败形态是「按钮点了没反应」——所以这里把错误显式抛到控制台，
     同时保证这仍是一段语法上完整的脚本（is:inline 脚本报错不会渲染到页面上）。 */
  if (window.console && window.console.error) window.console.error('[bg] init failed:', err);
 }
})();`;
}
