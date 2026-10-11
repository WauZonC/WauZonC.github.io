---
title: 个人主页（本站）
description: 用 Astro 7 构建的静态个人主页：内容全部 Markdown 驱动，页面默认零客户端 JavaScript，托管于 GitHub Pages。
tech:
  - Astro
  - Markdown
  - CSS
  - GitHub Pages
featured: true
order: 90
---

**设计要点**

- **内容驱动**：文章与项目条目都是 `src/content/` 下的 Markdown 文件，frontmatter 由构建期 schema 校验；新增一篇内容不需要改任何页面代码
- **零客户端 JavaScript**：构建产物里没有 `.js` 文件，导航、主题与排版全部由 HTML + CSS 完成
- **样式**：原生 CSS——多层径向渐变背景 + 毛玻璃面板，自动跟随系统的浅色 / 暗色设置，并为不支持 `backdrop-filter` 的浏览器提供实色兜底
- **可读性**：375px 与 1440px 两档分别验证过没有横向滚动

**为什么值得记一笔**

这是我把「内容怎么写」和「页面怎么长」分开的一次实践：页面只管取数据与渲染，内容的增删完全落在 Markdown 文件里——所以后来往站里加文章时，一行 `.astro` 代码都不用动。
