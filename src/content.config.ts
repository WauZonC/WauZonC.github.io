import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// ---------------------------------------------------------------------------
// 中英两套集合共用同一份 schema（ADR-10）：
// schema 只在这里定义一次，避免两份字段表随时间漂移。
// 注意：**既有中文集合的 loader / base / 字段一律未改**，本次只做「附加」。
// ---------------------------------------------------------------------------

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  cover: z.string().optional(),
});

const projectsSchema = z.object({
  title: z.string(),
  description: z.string(),
  tech: z.array(z.string()).default([]),
  repoUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  // P4 新增（可选，向后兼容）：项目卡片配图，路径相对 public/。
  // 用于展示无法给出公开链接的项目（如仓库仍为私有的 pku-table）。
  cover: z.string().optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: blogSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: projectsSchema,
});

// ---------------------------------------------------------------------------
// 英文镜像集合（ADR-10）
//
// 刻意使用「兄弟目录」（blog-en / projects-en）而不是 blog/en/ 子目录：
// 中文集合的 glob 是递归的 `**/*.md`，若把英文放进 src/content/blog/en/，
// 英文文章会被中文集合**一并收走**，同一篇会同时出现在两种语言里。
// 兄弟目录从根上避免该冲突，且既有 loader 的 base / pattern 零改动。
//
// 文件名即 slug：`blog-en/cuda-notes.md` 与 `blog/cuda-notes.md` 同 slug，
// 语言互跳天然一一对应；新增英文文章不需要改任何 .astro（G3 契约在英文侧同样成立）。
// ---------------------------------------------------------------------------

const blogEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog-en' }),
  schema: blogSchema,
});

const projectsEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects-en' }),
  schema: projectsSchema,
});

export const collections = { blog, blogEn, projects, projectsEn };
