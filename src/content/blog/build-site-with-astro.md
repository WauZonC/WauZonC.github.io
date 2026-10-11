---
title: '用 Astro 7 搭一个零客户端 JS 的个人主页'
description: '从零建站的完整记录：路由设计、Content Collections 的 Astro 7 新写法，以及构建期 schema 校验的真实踩坑。'
pubDate: 2026-10-11
tags:
  - Astro
  - 建站
  - Markdown
draft: false
---

这个站点是用 Astro 7 从零搭起来的：内容全部写成 Markdown，页面默认不加载客户端 JavaScript，构建产物直接托管在 GitHub Pages 上。这篇记录选型理由和一路上真实踩到的坑。

## 为什么选 Astro

- **内容优先**：一篇文章就是一个 `.md` 文件，发文章不需要改页面代码。
- **默认零客户端 JS**：静态输出，导航与排版全部由 HTML + CSS 完成，天然适配 GitHub Pages。
- **构建期校验**：frontmatter 由 schema 校验，字段缺失直接在构建阶段报错，而不是等上线后才发现页面渲染异常。

## 页面结构

站点一共 6 条路由：首页、关于、博客列表、博客详情（按 slug 生成）、项目、404 页。文章与项目条目放在 `src/content/` 下的两个集合里，页面只负责取数据与渲染——这条边界让「加内容」和「改样式」互不干扰。

## Astro 7 里踩到的坑

1. **集合定义文件的位置变了**：必须放在项目根的 `src/content.config.ts`。放到旧的 `src/content/config.ts` 会直接抛 `LegacyContentConfigError`，构建立刻中止。
2. **必须显式声明 loader**：Content Layer API 里每个集合都要写 `loader: glob({ pattern, base })`，旧版「`type: 'content'` + 目录约定」的写法已经不可用。
3. **`z` 要从 `astro/zod` 导入**：从 `astro:content` 导入 `z` 已被标记弃用。
4. **渲染入口变成 `render(entry)`**：不再是 `entry.render()`。
5. **frontmatter 不合法时构建会以非 0 退出码中止**（Windows 上观测到的退出表现是 `0xC0000409`），日志里能看到 `[InvalidContentEntryDataError]`，并指明是哪个集合、哪个条目、哪个字段。第一次遇到会以为环境崩了，其实这正是校验在按预期工作。

另外一个和脚手架有关的经验：`pnpm create astro` 在**非空目录**里运行会覆盖同名的 `README.md` 与 `.gitignore`。如果仓库里已经有这两个文件，脚手架最好放在仓库外的临时目录里跑，只把需要的产物取回来。

## 怎么验收

- `pnpm build` 退出码为 0；
- 构建产物里 `.js` 文件数量为 0——「零客户端 JS」这条约定要用事实守住，而不是靠印象；
- 375px 与 1440px 两档、每条路由各测一次横向溢出。

最后一条对我来说最有用：把「没有横向滚动」变成一条可以自动测的断言，比肉眼看着顺眼可靠得多。样式上这件小事也一样——玻璃拟态依赖 `backdrop-filter`，所以额外用 `@supports` 给不支持它的浏览器留了不透明的实色兜底，保证正文对比度不受影响。
