/**
 * 双语界面文案字典与路由助手（决策与理由见 PLAN.md **ADR-10**）。
 *
 * 设计要点：
 * 1. **只放「界面固定文案」**（导航 / 页脚 / 按钮 / 文章页元信息）。
 *    页面级正文文案仍写在各自页面里（与既有中文页面的写法一致），
 *    避免把一份内容拆到两个地方维护。
 * 2. **`en` 用 `typeof zh` 约束**：漏译一个键会直接是 TypeScript 错误，
 *    不会静默回退（构建期即暴露，符合 G4 的取向）。
 * 3. **路由助手是纯字符串运算**，不依赖任何运行时环境，构建期即可求值。
 */

export type Lang = 'zh' | 'en';

/** `<html lang>` 取值。中文保持 ADR-6 的 `zh-CN`。 */
export const HTML_LANG: Record<Lang, string> = { zh: 'zh-CN', en: 'en' };

const zh = {
  siteName: 'WauZonC',
  ogSiteName: 'WauZonC 的个人主页',
  /** 日期本地化（文章页 / 卡片） */
  dateLocale: 'zh-CN',

  defaultTitle: 'WauZonC 的个人主页',
  defaultDescription: 'WauZonC 的个人主页：文章、项目与简介。',

  skipToContent: '跳到正文',
  navLabel: '主导航',
  nav: {
    home: '首页',
    about: '关于',
    blog: '博客',
    projects: '项目',
  },

  /** 语言按钮：中文页上显示 EN，点击去英文站 */
  langSwitch: {
    label: 'EN',
    ariaLabel: 'Switch to English',
    title: 'Switch to English',
  },

  /** 主题按钮（ADR-9）：文案描述「点击后会变成什么」 */
  themeSwitch: {
    toDark: '切换到深色模式',
    toLight: '切换到浅色模式',
  },

  updatedOn: '更新于',
  backToList: '← 返回文章列表',
  repoLink: '仓库',
  demoLink: '演示',

  footer: (year: number) => `© ${year} WauZonC · 由 Astro 构建，托管于 GitHub Pages`,
} as const;

/** `typeof zh` 约束：键必须一一对应，漏译或写错键名会在 `pnpm build` 时报错 */
const en: typeof zh = {
  siteName: 'WauZonC',
  ogSiteName: 'WauZonC — Personal Site',
  dateLocale: 'en-US',

  defaultTitle: 'WauZonC — Personal Site',
  defaultDescription: 'WauZonC’s personal site: writing, projects and a short bio.',

  skipToContent: 'Skip to content',
  navLabel: 'Main navigation',
  nav: {
    home: 'Home',
    about: 'About',
    blog: 'Blog',
    projects: 'Projects',
  },

  langSwitch: {
    label: '中',
    ariaLabel: '切换到中文',
    title: '切换到中文',
  },

  themeSwitch: {
    toDark: 'Switch to dark mode',
    toLight: 'Switch to light mode',
  },

  updatedOn: 'Updated',
  backToList: '← Back to all posts',
  repoLink: 'Repository',
  demoLink: 'Demo',

  footer: (year: number) => `© ${year} WauZonC · Built with Astro, hosted on GitHub Pages`,
};

export const ui: Record<Lang, typeof zh> = { zh, en };

/** 从 `Astro.url.pathname` 判断当前语言。英文站一律以 `/en/` 为前缀。 */
export function getLangFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh';
}

/** 去掉 `/en` 前缀，得到中文站对应的路径。 */
export function stripLang(pathname: string): string {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice('/en'.length);
  return pathname;
}

/** 给中文路径加上目标语言前缀。中文原样返回（中文 URL 契约不变，ADR-10）。 */
export function withLang(pathname: string, lang: Lang): string {
  const bare = stripLang(pathname);
  if (lang === 'zh') return bare;
  return bare === '/' ? '/en/' : `/en${bare}`;
}

/**
 * 语言按钮的目标地址与展示文案。
 * 页面若知道「目标语言没有对应内容」（例如某篇博客暂无英文版），
 * 必须通过 `altHref` 显式覆盖，避免死链（ADR-10 约束 1）。
 */
export function langSwitchInfo(
  pathname: string,
  current: Lang,
  altHref?: string,
): { href: string; label: string; hreflang: Lang; current: Lang } {
  const target: Lang = current === 'zh' ? 'en' : 'zh';
  return {
    href: altHref ?? withLang(pathname, target),
    label: ui[current].langSwitch.label,
    hreflang: target,
    current,
  };
}
