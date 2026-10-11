/**
 * 中英两套集合的条目类型（ADR-10）。
 *
 * 为什么用联合类型而不是两个组件：`blog` / `blogEn`（以及 `projects` / `projectsEn`）
 * 在 `src/content.config.ts` 里**共用同一个 zod schema 对象**，因此 `data` 的形状逐字段相同，
 * 只有 `collection` 这个字面量不同。用联合类型可以让卡片 / 布局组件同时服务两种语言，
 * 避免为了英文再复制一套组件（复制出来的两套必然随时间漂移）。
 *
 * `render()` 的签名是 `render<C extends keyof DataEntryMap>(entry: DataEntryMap[C][string])`，
 * 联合类型会被推断为 `C = 'blog' | 'blogEn'`，可以直接传入，无需断言。
 */
import type { CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'> | CollectionEntry<'blogEn'>;
export type ProjectEntry = CollectionEntry<'projects'> | CollectionEntry<'projectsEn'>;

/** 两个博客集合的键，供需要按语言取集合的页面使用 */
export const BLOG_COLLECTION: Record<'zh' | 'en', 'blog' | 'blogEn'> = {
  zh: 'blog',
  en: 'blogEn',
};

/** 两个项目集合的键 */
export const PROJECTS_COLLECTION: Record<'zh' | 'en', 'projects' | 'projectsEn'> = {
  zh: 'projects',
  en: 'projectsEn',
};
