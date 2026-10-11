# 个人主页设计与实施方案（PLAN）

> **本文件是整个项目的唯一权威设计文档。**
> 所有后续 agent 按本文件「第六节 路线图」逐步执行，**不应再做新的设计决策**；若发现必须偏离，请先更新本文件对应章节，再执行改动。

**⚠️ 本地目录布局已变更（P1 执行后调整）**：本仓库现位于 **`D:\WZC\mypage\WauZonC.github.io\`**（外层 `mypage` 文件夹 + `WauZonC.github.io` 仓库目录）。这是**纯本地存放位置变更，不改变任何发布行为**——GitHub Pages 的 URL 路径只由 GitHub 仓库名决定。

- 仓库名（目标，GitHub 侧）：`WauZonC.github.io`
- 线上地址（目标）：<https://wauzonc.github.io>
- 本地仓库根目录：`D:\WZC\mypage\WauZonC.github.io`
- 当前阶段：**P6 已完成 —— 站点已上线：<https://wauzonc.github.io>（P0–P6 全部完成）**
- 文档版本：v1.8（P6 完成：远端仓库已创建并推送 `main`，首次 Actions 运行 build+deploy **全绿**；站点 6 条路由实测 200、中文正常、部署产物与本地 `dist` **逐字节一致**；关闭两处开放项——用户决定**不绑定自定义域名**、仓库**公开**）；上一版 **v1.7**（P5 完成：`.github/workflows/deploy.yml` 落地；Action 版本按 Node 24 代际裁定并实测；本地 actionlint 0 告警 + `pnpm install --frozen-lockfile`/`pnpm build` 退出码 0）；上一版 **v1.6**（P4 完成：真实内容上站——博客 3 篇、项目 4 条、`about` 重写；建立"两阶段人工审批 + 发布前泄漏扫描"流程）

---

## 1. 项目目标与成功标准

### 1.1 目标
用 Astro 构建一个内容驱动、默认零客户端 JS 的个人主页，通过 GitHub Pages 用户主站发布，并保证后续可用纯 Markdown 持续增量添加博客与项目条目。

### 1.2 成功标准（完工验收）
| 编号 | 标准 | 验收方式 |
|---|---|---|
| G1 | `https://wauzonc.github.io` 返回 200，中文正常显示 | `Invoke-WebRequest -Method Head https://wauzonc.github.io` → 200 |
| G2 | 首页、`/about`、`/blog`、`/projects`、`/404` 五条路由可访问 | 部署后逐条请求，均 200（`/404` 为自定义页，直连返回 404 状态但渲染自定义内容） |
| G3 | 全站内容由 Markdown 驱动，新增一篇文章 = 新增一个 `.md` 文件 | 不修改任何 `.astro` 文件即可新增文章 |
| G4 | `pnpm build` 退出码 0，无 Astro 类型/校验报错 | 本地与 CI 均通过 |
| G5 | 移动端与桌面端均可读，无横向滚动 | 浏览器 375px / 1440px 两档目测 |
| G6 | 推送 `main` 后 Actions 自动部署，无需手动操作 | Actions 绿色通过，站点内容更新 |

> **验收状态（2026-10-11，P6 上线后实测）**：G1 ✅ `https://wauzonc.github.io` → **200**（`charset=utf-8`、中文正常、canonical 为根路径、**无** `/mypage/` 前缀）；G2 ✅ 首页 `/about/` `/blog/` `/projects/` `/404.html` 及 3 篇博客详情**全部 200**，且不存在路径返回 **404 状态**并渲染自定义 404 内容；G3 ✅ 全站由 Markdown 驱动（P4 起新增条目未改任何 `.astro`）；G4 ✅ 本地与 CI 的 `pnpm build` **均退出码 0**；G5 ✅ P4 已用同源 iframe 探针实测 24 组（8 路由 × 320/390/1440）无横向滚动，且**部署产物与本地 `dist` 逐字节一致**，结论适用；G6 ✅ 推送后首次 Actions 运行的 **build 与 deploy 两个作业全绿**，站点内容已更新

---

## 2. 已确认的环境事实（P0 实测）

| 项目 | 实测结果 |
|---|---|
| 工作区 | P0 时为 `D:\WZC\mypage`（当时**完全为空**）；P1 + 布局调整后为 **`D:\WZC\mypage\WauZonC.github.io\`**（外层容器 + 仓库目录） |
| git | `2.51.0.windows.1` |
| 全局身份 | `user.name=WauZonC`、`user.email=2665****09@qq.com`（**本文件会随公开仓库发布，故邮箱在此脱敏**；需要完整值时用 `git config user.email` 查询，不要写回本文件） |
| 全局默认分支 | `init.defaultBranch=main` |
| 仓库本地配置 | `core.quotepath=false`、`core.autocrlf=false`（P0 设置） |
| Node | `v24.18.0`（满足 Astro 7 的 `engines.node >=22.12.0`） |
| pnpm / npm / Python | `11.21.0` / `11.18.0` / `3.13.5` |
| `gh` CLI | **未安装** —— 仓库创建只能走 GitHub 网页或 HTTPS API |
| GitHub SSH | **已验证通过**：`ssh -T git@github.com` → `Hi WauZonC!`，密钥 `~/.ssh/id_ed25519` |
| HTTPS 连通性 | `api.github.com` 直连 200 |
| `WauZonC/WauZonC.github.io` | **不存在**（GitHub API 404） |
| `https://wauzonc.github.io` | **尚未上线**（404）—— 此行为 P0 时实测；**P6 已上线**，见 §1.2 验收状态 |
| 依赖版本基线 | Astro `7.3.8`；GitHub Actions（P5 于 2026-10-11 按 Releases 实测）：`actions/checkout@v7.0.1`、`pnpm/action-setup@v6.1.0`、`actions/setup-node@v7.1.0`、`actions/upload-pages-artifact@v5.0.0`、`actions/deploy-pages@v5.0.1` |

---

## 3. 技术选型决策记录（ADR）

### ADR-1：站点生成器 = Astro 7
- **决策**：使用 Astro（基线 `7.3.8`）。
- **理由**：内容优先、默认零客户端 JS（利于 G5 与性能）、原生 Content Collections 带 schema 校验（利于 G3）、静态输出天然适配 GitHub Pages。
- **放弃的方案**：纯静态手写 HTML（新增文章成本高，违背 G3）；Vite+React SPA（对内容站过重，且 Pages 需额外 SPA 回退配置）。
- **约束**：不引入 React/Vue/Svelte 集成，除非出现明确的交互需求并先更新本文件。

### ADR-2：托管 = GitHub Pages 用户主站
- **决策**：GitHub 仓库名 `WauZonC.github.io`，`site: 'https://wauzonc.github.io'`，**不配置 `base`**。
- **理由**：仓库名与账号同名即用户主站，URL 最短（根路径）、无子路径前缀问题、无需处理资源路径重写。
- **本地存放位置（2026-10-11 用户确认，与发布 URL 无关）**：本地目录结构调整为 **`D:\WZC\mypage\WauZonC.github.io\`** —— 用户要求把本仓库放在 `mypage` 文件夹下。
  - **关键澄清**：**GitHub Pages 的 URL 路径只由 GitHub 仓库名决定，与本地目录嵌套层级无关**。因此把仓库放进本地 `mypage/` 文件夹**不会**让站点发布到 `/mypage/`，站点仍在 `https://wauzonc.github.io/`，`base` 保持不设置。本地目录名与线上路径是两件事。
  - 若将来希望线上路径为 `/mypage/`，**必须把 GitHub 仓库名改为 `mypage`**（项目站），届时才需要 `site` + `base: '/mypage'` 并全站改用 `import.meta.env.BASE_URL`；**此变更需先更新本 ADR 再执行**。
- **回退方案**：若因故必须改动本地布局，把仓库目录在 `D:\WZC\` 下平级放置即可（如 `D:\WZC\WauZonC.github.io\`），**不涉及任何代码或配置改动**——因为发布 URL 与本地路径无关。**唯一权威本地路径**为 `D:\WZC\mypage\WauZonC.github.io`。

### ADR-3：包管理器 = pnpm
- **决策**：统一使用 pnpm，锁文件 `pnpm-lock.yaml` 入库。CI 同样使用 pnpm。
- **理由**：本地已安装 11.21.0，依赖去重与安装速度优于 npm。

### ADR-4：内容载体 = Markdown Content Collections
- **决策**：博客与项目条目均放在 `src/content/` 下，使用 zod schema 校验 frontmatter。
- **理由**：构建期即校验字段缺失，避免线上渲染异常（服务 G4）。

### ADR-5：样式方案 = 原生 CSS（Astro `<style>` + CSS 变量）
- **决策**：不引入 Tailwind 等 CSS 框架，使用 CSS 自定义属性实现主题色与暗色模式。
- **理由**：体量小、无构建额外负担、便于后续 agent 局部修改。

### ADR-6：语言与排版 = 中文优先（`zh-CN`）
- **决策**：`<html lang="zh-CN">`，字体栈包含中文字体回退。
- **理由**：内容以中文为主，避免字体回退导致的字形不一致。

### ADR-7：视觉方案 = 风格 10「玻璃拟态渐变」（P2.5 用户选定，2026-10-11）
- **决策**：P3 采用 `demo/10-glass.html` 的视觉语言落地到全站 —— 柔光渐变背景（多层 `radial-gradient`，纯 CSS 无位图）+ 毛玻璃面板/卡片（`backdrop-filter: blur() saturate()`）+ 大圆角（面板 24px / 卡片 14px）+ 药丸式导航与标签。
- **理由**：用户从 16 种样例中选择 10；该方案在同一样例中已验证「零外部请求、375/1440 无横向滚动、可自动适配暗色」，且全部为原生 CSS，与 ADR-5 一致、可 1:1 移植，不引入任何新依赖。
- **明确的取舍（用户未要求混合元素，按纯风格 10 落地）**
  1. **不加手动暗色切换按钮**：暗色仅由 `prefers-color-scheme` 自动切换，以维持 ADR-1 的「零客户端 JS」；§5.2 中「P3 决定是否加手动切换按钮」的答案即**否**。若日后需要手动切换，必须新增 ADR 并接受一小段内联脚本。
  2. **容器宽度偏离 §5.2 的 720–880px，定为 960px**：玻璃卡片网格需要更宽的画布；正文可读性改由「文本类页面用 `.measure`（44rem ≈ 700px）居中约束」保证，两者不冲突。
  3. **`backdrop-filter` 必须有兜底**：不支持该属性的环境（部分旧 Firefox）自动降级为更不透明的实色玻璃（`@supports not (...)`），保证正文对比度不受影响。

---

## 4. 目标信息架构

### 4.1 路由表
| 路由 | 文件 | 用途 |
|---|---|---|
| `/` | `src/pages/index.astro` | 首页：简介摘要 + 最新 3 篇文章 + 精选项目 |
| `/about` | `src/pages/about.astro` | 个人简介与履历 |
| `/blog` | `src/pages/blog/index.astro` | 文章列表（按 `pubDate` 倒序，过滤 `draft: true`） |
| `/blog/[slug]` | `src/pages/blog/[...slug].astro` | 文章详情 |
| `/projects` | `src/pages/projects.astro` | 项目/作品集列表 |
| `/404` | `src/pages/404.astro` | 自定义未找到页面 |

### 4.2 目录结构（P2 结束后的目标形态）
```
.
├── .github/workflows/deploy.yml
├── public/
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── components/
│   │   ├── BaseHead.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── PostCard.astro
│   ├── content/                  # 内容条目（Markdown）
│   │   ├── blog/
│   │   └── projects/
│   ├── content.config.ts         # Content Layer 集合定义（Astro 7 强制位置，见 4.3）
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/            # 见 4.1 路由表
│   └── styles/global.css
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

### 4.3 内容 Schema（`src/content.config.ts`）

> **⚠️ Astro 7 硬性要求（P2 执行时实测核实，属「必须偏离」的实现细节修正，字段设计零变化）**
> 1. 集合定义文件位置**必须是项目根下的 `src/content.config.ts`**。旧写法 `src/content/config.ts` 在 Astro 6 已被移除，Astro 7 一旦发现该路径直接抛 `LegacyContentConfigError` 并中止构建。
> 2. 每个集合**必须显式声明 `loader`**（Content Layer API）。旧版「`type: 'content'` + 目录约定」写法已不可用；本项目用 `glob({ pattern: '**/*.md', base: './src/content/<集合名>' })`，`base` 相对**项目根目录**解析（源码实测 `new URL(globOptions.base, config.root)`），条目 `id` 由文件路径生成，即 slug。
> 3. `z` 从 **`astro/zod`** 导入。`import { z } from 'astro:content'` 自 Astro 7 起标记弃用、Astro 8 移除。
> 4. 渲染入口为 `astro:content` 的 `render(entry)`（返回 `{ Content }`），不再是 `entry.render()`。
>
> 以上 4 点已在本节下方示例与 P2 实现中落地；**下方两张字段表（字段名、类型、必填性、默认值）保持不变，仍为唯一权威。**

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()).default([]),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { blog, projects };
```

**`blog` 集合**
| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `title` | string | 是 | 标题 |
| `description` | string | 是 | 摘要，用于列表与 meta description |
| `pubDate` | date | 是 | 发布日期 |
| `updatedDate` | date | 否 | 更新日期 |
| `tags` | string[] | 否，默认 `[]` | 标签 |
| `draft` | boolean | 否，默认 `false` | `true` 时构建期排除 |
| `cover` | string | 否 | 封面图路径（相对 `public/`） |

**`projects` 集合**
| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `title` | string | 是 | 项目名 |
| `description` | string | 是 | 一句话说明 |
| `tech` | string[] | 否，默认 `[]` | 技术栈标签 |
| `repoUrl` | string(url) | 否 | 仓库地址 |
| `demoUrl` | string(url) | 否 | 演示地址 |
| `featured` | boolean | 否，默认 `false` | 是否在首页展示 |
| `order` | number | 否，默认 `0` | 排序权重，大者靠前 |

---

## 5. 站点配置要点

### 5.1 `astro.config.mjs` 关键项
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wauzonc.github.io',  // 用户主站：绝对不要设置 base
  output: 'static',
  markdown: { shikiConfig: { theme: 'github-light' } },
});
```

### 5.2 其他约定
- **中文排版**：字体栈 `-apple-system, "Segoe UI", "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif`；正文 `line-height: 1.8`；段落间距略大于英文习惯。
- **暗色模式**：使用 CSS 变量 + `prefers-color-scheme` 媒体查询自动切换（P3 决定是否加手动切换按钮）。
- **`BaseHead.astro`**：统一输出 `<title>`、`<meta name="description">`、`og:*`、`viewport`、favicon 引用。
- **SEO**：可后续增加 `sitemap` 与 `robots.txt`（不在 P0–P6 承诺范围内）。

---

## 6. 路线图（P0–P6）

> 每个阶段都标注：**产出物 / 写作用域 / 前置依赖 / 验收命令**。后续 agent 请严格按阶段推进，一个阶段验收通过后再进入下一阶段。

### P0 —— 仓库骨架与设计方案 ✅ 已完成
- **产出物**：`.gitignore`、`.gitattributes`、`README.md`、`PLAN.md`，首次提交
- **写作用域**：仓库根目录
- **不做**：不装依赖、不建远端、不改全局 git 配置、不搬内容

### P1 —— 目录改名与本地布局确定 ✅ 已完成（2026-10-11）
- **产出物**：仓库本地路径最终为 **`D:\WZC\mypage\WauZonC.github.io\`**（仅目录移动，无文件内容变更）
- **前置条件**：确认目标目录未被任何进程占用（关闭资源管理器窗口、编辑器、终端中该目录的会话）
- **执行步骤**（两段，均已完成）
  1. 目录改名：`Rename-Item -Path 'D:\WZC\mypage' -NewName 'WauZonC.github.io'`
  2. 布局调整：把仓库放入外层 `mypage` 文件夹 → `D:\WZC\mypage\WauZonC.github.io\`
- **失败处理**：若报“文件被占用”，用 `Get-Process | Where-Object { $_.Path -like '*mypage*' }` 定位并关闭占用进程后重试；**不要**用复制再删除的方式迁移带 `.git` 的目录
- **写作用域**：目录重命名/移动（无文件内容变更）
- **验收命令**：`git -C 'D:\WZC\mypage\WauZonC.github.io' log --oneline` 输出 P0 那条提交

#### P1 实际执行记录（2026-10-11）
- **执行结果**：改名成功，`.git` 与 P0 提交历史连续（`f745730`），工作树干净（`## main`，无未跟踪/未提交项）
- **实测验收**：`Test-Path '...\.git'` → `True`；旧路径 `D:\WZC\mypage` 一度为空壳；本地配置 `core.quotepath=false`、`core.autocrlf=false` 保持不变
- **遇到的真实障碍（对后续 agent 有价值）**：首次 `Rename-Item` 报 `[InvalidOperation] 因为它在使用中`。根因是**执行改名的工作进程自身工作目录就在待改目录内**（或瞬态子进程持有该目录）。改为**以 `D:\WZC` 作为工作目录**执行后一次成功
- **对后续 agent 的强制要求**：在仓库目录内执行改名/移动类操作时，命令的工作目录**不要**设在该目录内；建议以 `D:\WZC` 为工作目录执行
- **与预期的差异**：无（目录内容、提交历史、仓库配置均未受影响）
- **遗留问题**：无

#### P1 补充：本地布局调整（2026-10-11，用户要求）
- **原因**：用户要求把仓库整体存放在 `mypage` 文件夹下
- **最终结构**：
  ```
  D:\WZC\mypage\                    ← 外层容器（用户指定）
  └── WauZonC.github.io\            ← Git 仓库根目录（.git / PLAN.md / README.md / .gitignore / .gitattributes）
  ```
- **必须澄清的事实**：**GitHub Pages 的 URL 路径只由 GitHub 仓库名决定，与本地目录嵌套层级无关**。因此本次调整**不改变发布行为**，站点仍是 `https://wauzonc.github.io/`，**`base` 依旧不设置**。若将来希望线上路径为 `/mypage/`，必须把 **GitHub 仓库名**改为 `mypage` 并设 `base: '/mypage'` —— 那是另一个决策，需先更新 ADR-2
- **实测验收**：`git -C 'D:\WZC\mypage\WauZonC.github.io' rev-parse --is-inside-work-tree` → `true`；`log --oneline` 输出 P0 与 P1 两条提交；`git fsck` 无错误；`refs/heads/main` 正常；工作树无异常
- **执行中的自纠错（教训）**：首次搬迁时 `robocopy` 的源/目标选择错误，产生了 `mypage\WauZonC.github.io\WauZonC.github.io\` 的多余嵌套。已通过“前置校验 + 上移一层 + 删除空包装目录”纠正，**全程无数据丢失**。教训：对含 `.git` 的目录做搬迁时，必须显式确认目标层级，不要用“把目录移动进它自己的子目录”这种自嵌套写法
- **对后续 agent 的路径约定**：本项目**唯一权威本地路径**是 `D:\WZC\mypage\WauZonC.github.io`；文档中历史出现的 `D:\WZC\mypage`（P0 时期）与 `D:\WZC\WauZonC.github.io`（P1 中间态）均为同一仓库的旧位置

### P2 —— Astro 脚手架与页面骨架 ✅ 已完成（2026-10-11）
- **前置依赖**：P1
- **执行步骤（在 `D:\WZC\mypage\WauZonC.github.io` 内）**
  1. `pnpm create astro@latest . --template minimal --no-install --no-git --typescript strict`
     - **必须使用 `--no-git`**：仓库已有 `.git`，不能让脚手架重新初始化
     - 若脚手架交互无法完全非交互化，则改为手动创建 `package.json`（`"type": "module"`）、`astro.config.mjs`、`tsconfig.json`、`src/pages/index.astro`
  2. `pnpm install`
  3. 按第 4.2 节创建目录结构；按第 4.3 节实现 `src/content.config.ts`（**Astro 7 Content Layer API：`loader: glob(...)`，位置在 `src/` 而非 `src/content/`**，见 4.3 开头的硬性要求）
  4. 实现 `src/layouts/BaseLayout.astro`、`BaseHead.astro`、`Header.astro`、`Footer.astro`
  5. 按第 4.1 路由表实现 6 个页面，内容用占位文本（`src/content/blog/` 放 1 篇 `hello-world.md` 示例）
  6. `astro.config.mjs` 按 5.1 节配置
- **写作用域**：`package.json`、`astro.config.mjs`、`tsconfig.json`、`src/**`、`public/**`
- **验收命令**：`pnpm build` 退出码 `0`；`Test-Path dist\index.html`、`dist\about\index.html`、`dist\blog\index.html`、`dist\projects\index.html` 均为 `True`
- **注意**：`dist/` 与 `node_modules/` 不提交（已在 `.gitignore` 中）

#### P2 实际执行记录（2026-10-11）

- **执行结果**：Astro 7.3.8 脚手架落地，`pnpm build` 退出码 `0`，6 条路由全部生成（`/`、`/about/`、`/blog/`、`/blog/hello-world/`、`/projects/`、`/404.html`）；产物中**无任何 `.js` 文件**（默认零客户端 JS 目标达成）
- **必须偏离设计的一处（已先改本文件再执行）**：Astro 6 起**移除了旧版 Content Collections**，`src/content/config.ts` 会让 Astro 7 直接抛 `LegacyContentConfigError` 中止构建。因此：
  - 集合定义文件改为 **`src/content.config.ts`**（§4.2 目录树、§4.3 已同步更新）
  - 每个集合必须声明 **`loader: glob({ pattern: '**/*.md', base: './src/content/<集合名>' })`**（Content Layer API）；源码实测 `base` 相对**项目根目录**解析，条目 `id` 即 slug
  - `z` 改为从 **`astro/zod`** 导入（`from 'astro:content'` 自 Astro 7 起弃用）
  - 详情渲染入口为 **`render(entry)`**（`astro:content` 导出），不再是 `entry.render()`
  - **字段表本身零变化**：§4.3 两张表的字段名/类型/必填性/默认值原样落地
- **脚手架采用方式（对原步骤 1 的偏差，理由充分）**：`pnpm create astro@latest .` 在**非空目录**中运行会覆盖 `README.md` 与 `.gitignore`（模板自带这两个文件），而它们不在 P2 写作用域内、且含 P0/P1 的项目文档。故改为：
  1. 在仓库外的临时目录 `D:\WZC\mypage\.p2-scaffold-tmp` 执行完全相同的脚手架命令（`--template minimal --no-install --no-git --typescript strict --yes --skip-houston`，退出码 0）
  2. 只把**写作用域内**的产物取回仓库：`package.json`（仅改 `name`）、`tsconfig.json`、`public/favicon.svg`；`astro.config.mjs` 与 `src/**` 按 §5.1/§4.1/§4.3 自行实现
  3. 临时目录已在验收后删除；`README.md`、`.gitignore`、`.gitattributes` 全程未被脚手架触碰
- **实测验收**：
  - `pnpm install` → 退出码 `0`，`astro 7.3.8`（与 §2 依赖版本基线一致），`pnpm-lock.yaml` 已生成
  - `pnpm build` → 退出码 `0`，`6 page(s) built`
  - `Test-Path` 全部 `True`：`dist\index.html`、`dist\about\index.html`、`dist\blog\index.html`、`dist\projects\index.html`、`dist\404.html`、`dist\blog\hello-world\index.html`、`dist\favicon.svg`
  - 首页实测 `<html lang="zh-CN">`、`<title>WauZonC 的个人主页</title>`、canonical `https://wauzonc.github.io/`（`site` 生效且**未设 `base`**，符合 ADR-2）
  - 文章页实测 `<title>Hello, World | WauZonC</title>`、canonical `https://wauzonc.github.io/blog/hello-world/`、中文标题 id 正常
- **两条关键契约的实证（不是仅靠读代码）**：
  - **G3（Markdown 驱动 + 草稿排除）**：临时放入一篇 `draft: true` 的文章后重新构建 → 退出码 `0`，`dist/blog/__draft-probe/index.html` **不存在**，`dist/blog/` 下页面数仍为 `1`
  - **G4 前置（构建期 schema 校验）**：临时放入一篇缺少必填 `description` 的文章 → 构建**非 0 退出**（Windows 观测为 `-1073740791`，即 `0xC0000409`；Astro 在内容校验失败时的中止行为）并打印 `[InvalidContentEntryDataError] blog → __invalid-probe data does not match collection schema.` + `description: Required`
  - 两个探针文件均已删除，并已重新构建确认干净状态（退出码 `0`，无残留）
- **与原步骤的差异**：原步骤 5 只要求放 1 篇 blog 示例。实际**额外**创建了 `src/content/projects/placeholder.md`（`featured: true`），原因：`projects` 集合的 `glob` loader 在 `base` 目录不存在时会告警，且空集合会让首页「精选项目」与 `/projects` 无法目视验证；P4 阶段会用真实项目替换该文件
- **写作用域的实际扩展（已披露）**：额外修改了 `PLAN.md`（本记录 + §4.2/§4.3 修正）与 `README.md`（其中的「P1 完成 / 尚未安装依赖 / 命令尚不可用」表述在 P2 后已过时）。**未**改动 `.gitignore`、`.gitattributes`、`.github/**`、远端配置。另：脚手架临时目录曾创建在仓库外但仍在项目容器内（`D:\WZC\mypage\.p2-scaffold-tmp`），已在验收后**整目录删除**，`Test-Path` 复核为 `False`，未对 `D:\WZC` 下其他目录做任何读写
- **P3 的剩余工作已明确**：P2 的 `src/styles/global.css` 只做「可用骨架」（reset、基本排版、`.container` 最大宽度 800px、行高 1.8）；**CSS 变量体系、暗色模式（`prefers-color-scheme`）、640px 响应式断点、Header 移动端布局**均留给 P3，未提前实现
- **遗留问题**：无阻塞项。已知小瑕疵：`public/images/.gitkeep` 会被一并复制进 `dist/images/`（无害，仅用于让 Git 保留空目录）

### P2.5 —— 风格选型样板（临时目录 `demo/`）✅ 已完成（样例生成）· ⏳ 等待用户选定风格

- **目的**：在 P3 动手改样式之前，先用**同一份内容**做 16 种首页风格样例，由用户选定（或做元素混合），避免 P3 方向错误导致的返工
- **性质**：`demo/` 是**临时目录** —— 不参与 Astro 构建、不随站点发布、**不纳入 Git 提交**；风格定稿并完成 P3 验收后**整目录删除**
- **产出物（17 个 HTML + 1 个 README，全部单文件自包含、零外部请求）**
  - `demo/index.html`：画廊对比页（16 张卡片：编号 / 名称 / 一句话定位 / 关键词 / CSS 色卡 / 入口链接）
  - `demo/01-minimal.html` … `demo/16-swiss.html`：16 个首页样例
  - `demo/README.md`：16 行对照表、查看方式、选择方式、删除计划
- **统一内容基线**（16 个样例逐字一致，只变样式）：导航 4 项（首页 / 关于 / 博客 / 项目）+ 姓名与一句话简介 + 3 篇文章（Hello, World、用 Astro 7 搭建个人主页、Content Collections 的构建期校验）+ 3 个项目（个人主页、pku-table、vision）+ 页脚
- **16 种风格**：01 极简留白｜02 经典博客（基线，当前 P2 骨架的精致化）｜03 终端命令行｜04 杂志排版｜05 便当格 Bento｜06 双栏侧边栏｜07 单页锚点滚动｜08 学术简历｜09 新粗野主义｜10 玻璃拟态渐变｜11 中文书卷水墨｜12 赛博霓虹｜13 文档中心｜14 时间线个人志｜15 暖色友好｜16 瑞士国际主义
- **技术约束**：纯 CSS（与 ADR-5 一致，可 1:1 移植到 `src/**`）｜零外部字体/图片/CDN｜JS 仅装饰且禁用后内容完整可读｜中文排版行高 ≥ 1.7｜含 `viewport` 与媒体查询｜单文件 ≤ 500 行
- **实测验收（P2.5）**
  - 文件齐全：17 个 HTML + `README.md`
  - 零外部请求：正则断言无 `src=http(s)`、`@import`、`rel=stylesheet`、`url(http…)` → **0 命中**
  - 内容一致性：16 个样例均含同一组 10 个关键串（站名、导航 3 项、3 篇文章、3 个项目等）
  - **无横向滚动（自动化）**：用 iframe 探针在真实 375px 与 1440px 两档测量 `documentElement.scrollWidth` / `body.scrollWidth`，16 × 2 = 32 组全部 `scrollWidth == clientWidth`（结论：`ALL OK: no horizontal overflow`）
  - **视觉抽查**：Edge 无头渲染 32 张（375 / 1440）大幅面截图，并用 Pillow 裁出**真实 375px** 单列视图核对；浅色主题通过「把 `prefers-color-scheme: dark` 查询改为永不匹配」的方式强制验证（四角像素为浅色且正文可读）
  - 构建隔离：`pnpm build` 退出码 `0`（6 pages），`Test-Path 'dist\demo'` → `False`
  - `git status --short` → 仅 `?? demo/`（`demo/` 未纳入 Git，符合预期）
- **执行中发现并已修正的问题**：`16-swiss.html` 在 ≤820px 时 `.entry` 由三列塌成两列，`<p>` 落回 3rem 的编号列，正文被挤成逐字竖排；已补 `.entry h3, .entry p { grid-column: 2; }` 并复检 375px 恢复正常
- **✅ 用户选择结果（2026-10-11）**：**风格 10「玻璃拟态渐变」**（单选，无混合元素）→ 决策记入 ADR-7，并据此执行 P3

### P3 —— 样式与布局打磨 ✅ 已完成（2026-10-11）
- **前置依赖**：P2 + **P2.5 风格选型结果**（已选定：风格 10「玻璃拟态渐变」，见 ADR-7）
- **选定方案**：按 `demo/10-glass.html` 的视觉语言落地全站 —— 渐变背景（`--bg-color` + 多层 `--bg-image` 径向渐变）、玻璃面板/卡片（`.glass` / `.card`）、药丸导航与标签（`.pill`）、大圆角、自动暗色（`prefers-color-scheme`）
- **执行步骤**：**在 P2 已建立的 `src/styles/global.css` 骨架基础上**实现 CSS 变量体系、暗色模式（`prefers-color-scheme`）、中文字体栈、`.container` 最大宽度（**960px**，理由见 ADR-7）、响应式断点 **900px（版式）/ 640px（排版）**；`backdrop-filter` 走 `@supports` 兜底；文本类页面用 `.measure`（44rem）居中约束行宽；完善 Header（粘性玻璃栏 + 药丸导航）与移动端布局
- **写作用域**：`src/styles/**`、`src/components/**`、`src/layouts/**`
- **验收命令**：`pnpm build` 通过；`pnpm preview` 后在 375px 与 1440px 两档确认无横向滚动

#### P3 实际执行记录（2026-10-11）

- **选择结果**：风格 **10 玻璃拟态渐变**（单选，无混合元素），决策记入 ADR-7；本节「选定方案」即落地口径
- **产出物（写作用域内，全部为新写/重写）**
  - `src/styles/global.css`：重写为「设计令牌 → 重置 → 排版 → 版式容器 → 玻璃工具类 → prose → 断点」结构；浅/暗两套令牌（`prefers-color-scheme`）、柔光渐变背景（`--bg-color` + 三层 `--bg-image` 径向渐变，纯 CSS 无位图）、`.glass`/`.card`/`.panel`/`.pill`/`.section-title`/`.page-head`/`.stack`/`.measure` 工具类、完整 `prose` 排版（含代码块、引用、表格）、`@supports` 兜底
  - `src/components/Header.astro`：粘性玻璃导航栏 + 药丸导航（`aria-current` 高亮）
  - `src/components/Footer.astro`：半透明 + 发丝线页脚（不再叠一层模糊，避免性能浪费）
  - `src/components/PostCard.astro`：改为玻璃卡片（`.glass card`）
  - `src/components/ProjectCard.astro`：**新增**，项目玻璃卡片（标题 / 说明 / 技术标签 / 仓库与演示链接）
  - `src/layouts/BaseLayout.astro`：新增「跳到正文」跳转链接（默认视觉隐藏、聚焦显现，用 `clip-path` 而非负坐标以免引入横向滚动）；`main` 增加呼吸间距
  - `src/layouts/PostLayout.astro`：文章页改为 `.glass panel .measure` + `.prose`，标题区加发丝分隔线
  - `src/pages/index.astro`：玻璃 Hero 面板（eyebrow / 标题 / 简介 / 药丸标签 / CTA）+ 双列卡片区（≤900px 降单列）
  - `src/pages/blog/index.astro`：`.measure` 行宽约束 + 卡片栈
  - `src/pages/projects.astro`：双列玻璃项目卡片（≤760px 降单列）
  - `src/pages/about.astro`：玻璃面板 + `.prose`（正文内容一字未改，仍为 P4 待替换的占位）
  - `src/pages/404.astro`：居中玻璃面板
  - `src/components/BaseHead.astro`：新增两条 `theme-color`（浅 `#eaf1fb` / 暗 `#0b1020`），与 `--bg-color` 对齐
- **实测验收**
  - `pnpm build` → 退出码 `0`，`6 page(s) built`；6 条路由产物（`index`、`about`、`blog`、`blog/hello-world`、`projects`、`404.html`）全部存在
  - **零客户端 JS 仍然成立**：`dist` 下 `.js` 文件数 = `0`（ADR-1 未被破坏）
  - **无横向滚动（自动化，真实 375 / 1440）**：`pnpm preview`（localhost:4321）起服务后，用同源 iframe 探针逐路由测 `documentElement.scrollWidth` 与 `body.scrollWidth`：`/`、`/about/`、`/blog/`、`/projects/`、`/blog/hello-world/`、`/404.html` × 2 档 = **12 组全部 `scrollWidth == clientWidth`**（结论：`ALL OK: no horizontal overflow`）
  - **视觉抽查（浅色 + 暗色均验）**：Edge 无头渲染 6 条路由桌面图（1440）与「真实 375px 并排条」（用 Pillow 裁出单页图核对移动端版式）；浅色配色通过「把构建产物里的 `prefers-color-scheme:dark` 改成永不匹配」的方式强制验证 —— 渐变柔光斑透出玻璃面板、正文与标签对比度正常、无明显压暗或失色
- **与设计的偏离**：仅 ADR-7 已披露的三项（不加手动暗色切换、容器 960px 而非 720–880px、`backdrop-filter` 兜底）；另新增 `ProjectCard.astro` 与 BaseLayout 的跳转链接属写作用域内的实现细节，不改变信息架构
- **对后续 agent 的提醒**：`global.css` 的工具类（`.glass` / `.card` / `.panel` / `.pill` / `.measure`）是 P4 迁移内容时的现成容器；**新增页面请复用这些类**，不要再引入新的卡片样式或 CSS 框架（ADR-5）
- **验证残留**：探针文件与截图脚本均放在 `dist/`（构建产物、已被 `.gitignore` 忽略），已通过重新构建清除，`Test-Path` 复核为不存在
- **遗留问题**：无阻塞项。已知取舍：暗色不提供手动切换（如需，须先新增 ADR 并接受少量内联脚本）

### P4 —— 内容取材与迁移 ✅ 已完成（2026-10-11，分两阶段并经用户逐项审批）
- **前置依赖**：P3
- **素材来源（P4 执行后按实测修正，原 v1.5 的文字有事实错误）**
  - `D:\WZC\简历\` 里**用户本人**的简历各版本 → `src/pages/about.astro` 的事实来源。**⚠️ 该目录下另存有一份「他人」的公开学术主页快照（academicpages 风格）——只允许参考版式，其论文/实习/助教等经历一律不得作为本人素材**（为免泄露他人身份与本机路径，此处不写该文件的名称；需要时在本地目录内自行辨认）。v1.5 曾把它写成 about 正文的来源，属事实错误，已在 v1.6 更正
  - `D:\WZC\articles\`（Obsidian 库）→ 实测它是「AI 整理 + 人工审核」的**文献笔记库**，不是本人原创文章，且含期刊摘要英文原文与整段中译（版权风险）。P4 最终**未采用**其中任何一篇
  - `D:\WZC\project\`（`pku-table`、`vision` 等）→ `src/content/projects/*.md`。**`D:\WZC\project\src\**`（保存的北大选课网页面，含姓名 + 学号 + 选课计划）属**排除项**，不得入库
- **强制排除**：`.obsidian/`、`.claude/`、`templates/` 私有配置一律**不得**入库（`.gitignore` 已兜住，但迁移时不要手动 `git add -f`）；内容层面的隐私红线见 §7 新增的两行与下方执行记录
- **写作用域（实际，较原计划有扩展并已披露）**：`src/content/**`、`src/pages/about.astro`、`src/pages/index.astro`（Hero 文案，用户批准）、`src/components/ProjectCard.astro`、`src/components/ProjectBody.astro`（新增）、`src/content.config.ts`（projects 新增可选 `cover`）、`public/images/**`
- **验收命令**：`pnpm build` 退出码 0；文章数与 `src/content/blog/` 下非 draft 的 `.md` 数量一致；**并对 `src/`、`public/`、`dist/`、`PLAN.md`、`README.md` 做敏感模式扫描（要求 0 命中）**
- **注意**：迁移是**人工归纳**而非机械搬运，需保留原文含义、去除 Obsidian 专有语法（如 `[[双链]]` 转为普通链接或纯文本）

#### P4 实际执行记录（2026-10-11）

- **执行方式（用户明确要求）**：P4 分**两阶段**——第一阶段只做**取材**：把"可以展示的内容"整理成待审批 Markdown；第二阶段在用户**逐项人工审批**（改 `状态：保留/删除/改写`，或直接删掉整个小节）之后，才**严格按用户保留下来的信息**设计网页。审批文档放在 `p4-review/`，并已确认它**不进 Git**（`.gitignore` 新增忽略规则，`git check-ignore` 实测命中）。
- **取材范围**（全程只读，未修改 `D:\WZC` 下任何文件）：`简历\`、`articles\`、`project\`，以及 `contest`、`paper`、`Programming`、`Self-Learning`、`北京大学`、`情系母校`、`旅行`、`视频`、`音乐`（实测 `paper` 是空目录、`Programs` 不存在，真实目录名是 `Programming`）。
- **产出物（写作用域内）**
  - `src/content/blog/`：`build-site-with-astro.md`、`self-learning-cs.md`、`cuda-notes.md`（3 篇，均来自本人真实经历；删除占位 `hello-world.md`）
  - `src/content/projects/`：`pku-table.md`、`personal-site.md`、`gesture-recognition.md`、`cs61b-proj3.md`（4 条；删除占位 `placeholder.md`）
  - `src/pages/about.astro`：按审批文案重写为 8 节——简介 / 教育背景 / 技术栈 / 自主学习 / 项目 / 荣誉 / 方向与兴趣 / 联系方式，并以一句「关于本站」收尾
  - `src/pages/index.astro`：Hero 简介换成审批通过的自我介绍；首页精选项目改用紧凑卡片（不显示配图与长正文）
  - `src/components/ProjectCard.astro`：新增配图与 `compact` 模式；`src/components/ProjectBody.astro`：**新增**，卡片正文容器
  - `src/content.config.ts`：`projects` 集合新增**可选** `cover` 字段（向后兼容，既有契约不破）
  - `public/images/pku-table-canvas.png`：pku-table 界面截图（1200×825，105 KB，已剥离全部元数据）
  - `.gitignore`：新增 `p4-review/`
- **用户审批确定的公开范围（§9 开放项 4 由此闭合）**：**只用 `WauZonC`、不露真名**；只写学院、不写年级与专业；**不公开任何成绩/排名/四六级**；不放头像、不放简历 PDF、不配证书图；**完全不提政治面貌**；**不设"活动与志愿"栏目**；`about` 的自主学习只列 CS61A 与 CS61B；公开 `zhongchangwang25@…` 与 `WauZonC@qq.com` 两个邮箱。
- **明确排除（隐私/版权红线，完整清单见 `p4-review/04` 与 `06`）**：手机号；学号（含**文件名称里**的学号）；学号邮箱；出生日期；成绩单与综测/加分材料；**身份证号段**（志愿服务证明）；**录取通知书图像（印有完整学号）**与其开箱视频（含住宅楼外景）；宿舍楼栋号与室友材料；党课/推优/入党材料；他人姓名清单（获奖名单、班级名单、民主测评表、旅行账单与分工表）；班群二维码；含未成年人正脸的照片；期刊摘要原文与整段中译；课程官方讲义与教材 PDF；`vision/.claude`（泄漏本机用户名与绝对路径）；`project/src/**`。
- **pku-table 截图的取图方式**：**没有**启动它的后端与数据库（那会写它的 `dev.db`），而是把项目自带的**零依赖零后端 `frontend-demo/`** 复制到系统临时目录，在副本里自动提交登录表单后用 Edge 无头渲染截图，再删除副本（原目录零改动）。截图中是演示数据与演示用户，不含密码、演示学号或人脸。
- **实测验收**
  - `pnpm build` 退出码 **0**，`8 page(s) built`：`/`、`/about/`、`/blog/`、`/projects/`、3 篇博客详情、`/404.html`
  - 文章数 **3** = `src/content/blog/` 下非 draft `.md` 数 **3** ✅
  - `dist/` 内 `.js` 文件数 **0**（ADR-1 零客户端 JS 未被破坏）
  - **无横向滚动**：同源 iframe 探针实测 **24 组全部通过**（8 条路由 × 320/390/1440），`scrollWidth <= clientWidth`
  - 浅色 / 暗色两套配色均做无头渲染目视复核（浅色用 `--blink-settings=preferredColorScheme=1` 强制）；配图 `/images/pku-table-canvas.png` HTTP 200、EXIF 0 项
  - **发布前泄漏扫描**：`src/`、`public/`、`dist/` 对硬红线模式（手机号 / 学号 / 真名 / 他人姓名 / 成绩 / 身份证 / 入党等）**0 命中**；唯一命中项是用户批准公开的邮箱
  - `git status --short` 中**看不到** `p4-review/`；`git check-ignore` 命中 `.gitignore` 的 `p4-review/` 规则
- **执行中发现的真实问题（对后续 agent 有价值）**
  1. **Astro 模板不能把组件写进 JS 表达式**：`{cond && <Content />}` 编译报 `Unexpected token`，且错误位置指向**前一个**表达式（误导性极强）。HTML 元素可以，组件不行。解法：用一个薄包装组件（本项目为 `ProjectBody.astro`）把组件放回模板顶层，显隐交给 CSS。
  2. **Chromium 无头截图的最小窗口宽度约 500px**：用 `--window-size=390` 截手机版会得到"右侧被裁"的**假象**。判断移动端是否横向溢出一律用**同源 iframe 探针**（320/390/1440），不要靠截图。
  3. `loading="lazy"` 的图片在无头截图的虚拟时间下可能尚未解码，截图里会显示空框；本项目只有一张配图，已去掉 `lazy`。
  4. **P4 原定素材来源第 1 条是事实错误**（把他人主页当成 about 来源）。这类错误照做不会报错，必须核对素材的**归属**（作者/主体是否为用户本人）。
- **与设计的偏离（均已披露）**
  - 写作用域由原定 2 项扩展到上述 8 项——由用户"首页 Hero 要改""项目卡片用截图代替链接"的审批直接导出。
  - `projects` 集合新增可选 `cover` 字段：属**附加**变更。
  - `self-learning-cs.md` 的 `description` 与 `pubDate`（10-18 → 10-11）做了微调：原文案提到"时间分配"而无据可写，且原日期在未来会长期占据"最新文章"首位。
- **遗留项**
  - 手势识别项目卡片**暂缺配图**（用户决定先缺省）：`vision/` 目录里没有任何图片，运行该原型需要真实摄像头，无法生成真实截图；卡片当前为纯文字 + 技术标签，日后用户提供运行画面即可补 `cover`。
  - 目标仓库 `WauZonC/WauZonC.github.io` 尚不存在（P6 才创建），故"本站"项目卡片暂未填 `repoUrl`。

### P5 —— GitHub Actions 自动部署 ✅ 已完成（2026-10-11）
- **前置依赖**：P2（P3/P4 可与 P5 并行，但首次上线建议在 P3 后）
- **产出物**：`.github/workflows/deploy.yml`
- **版本裁定（2026-10-11，先改文档后执行）**：本节原写 `pnpm/action-setup@v4`、`actions/setup-node@v4`、`actions/upload-pages-artifact@v3`，**照抄会导致工作流不可用**。理由与裁定如下（属"依赖版本"事实更新，**不改变本工作流的结构、触发条件、权限与并发设置**）：
  1. **Node 20 运行时已进入移除期**：GitHub 自 2026-06-16 起把托管 runner 的默认运行时切到 Node 24，并计划 **2026 年秋移除 Node 20**。上述三个旧版 Action 的 `runs.using` 均为 `node20`（实测 `pnpm/action-setup@v4/action.yml` → `using: node20`），新写工作流不应采用旧版。
  2. **pnpm 版本必须显式指定**：`pnpm/action-setup` 要求 `version` 输入或 `package.json` 的 `packageManager` 字段；本项目 `package.json` **无** `packageManager` 字段（且该文件不在 P5 写作用域内），故工作流显式传 `version: 11.21.0`——与本地 pnpm 一致，`pnpm-lock.yaml`（`lockfileVersion: 9.0`）即由该版本生成。
  3. **裁定版本**（均于 2026-10-11 按 GitHub Releases 与 `action.yml` 实测存在且为 Node 24）：`actions/checkout@v7`（基线 v7.0.1）／`pnpm/action-setup@v6`（最新 v6.1.0，支持 pnpm 11/12）／`actions/setup-node@v7`（最新 v7.1.0，`cache: pnpm` 仍受支持）／`actions/upload-pages-artifact@v5`（最新 v5.0.0，composite 动作，内部固定 `upload-artifact@v7.0.0`）／`actions/deploy-pages@v5`（基线 v5.0.1）。
  4. **不引入 `actions/configure-pages`**：本节未列该动作；本项目由 P6 手动把仓库 Pages 来源设为 "GitHub Actions"，不需要它的 `enablement` 能力。由此产生的 **P6 执行顺序提醒**见下方 P5 执行记录。
- **工作流要点**
  - 触发：`on: push: branches: [main]` + `workflow_dispatch`
  - 权限：`contents: read`、`pages: write`、`id-token: write`
  - 并发：`concurrency: { group: "pages", cancel-in-progress: false }`
  - `jobs.build`：`actions/checkout@v7` → `pnpm/action-setup@v4` → `actions/setup-node@v4`（`node-version: 24`，`cache: pnpm`）→ `pnpm install --frozen-lockfile` → `pnpm build` → `actions/upload-pages-artifact@v3`（`path: dist`）
  - `jobs.deploy`：`needs: build`，`environment: github-pages`，`actions/deploy-pages@v5`
  - **替代方案**：可用 `withastro/action@v3` 一步替代 build job，但需确认其支持 Astro 7；若不确定，采用上面显式的 pnpm 步骤
- **写作用域**：`.github/workflows/**`
- **验收命令**：推送后 `git log --oneline origin/main` 与新提交一致；Actions 页面 build 与 deploy 两步均绿色

#### P5 实际执行记录（2026-10-11）

- **产出物（写作用域内，1 个文件）**：`.github/workflows/deploy.yml` —— 两个作业（`build` / `deploy`），Node 24 + pnpm 11.21.0，步骤为 checkout → setup pnpm → setup node（`cache: pnpm`）→ `pnpm install --frozen-lockfile` → `pnpm build` → 上传 Pages 产物（`path: dist`）→ 部署（`environment: github-pages`）。触发条件、权限、并发设置**与本节点完全一致**
- **实测验收（本地；**"推送后"的验收本阶段不可能完成**，因为远端仓库要到 P6 才创建）**
  - **actionlint 1.7.12**（从官方 Releases 下载到系统临时目录运行，**未入仓**）：`actionlint -oneline -color .github/workflows/deploy.yml` → **退出码 0、零告警**（YAML 语法、表达式、`uses`/`with` 输入名、`runs-on` 标签、`needs`/`environment` 均已通过静态检查）
  - **结构断言**（PyYAML 6.0.2 解析后逐项 assert）：顶层键 = `name`/`on`/`permissions`/`concurrency`/`jobs`；`on` = `push[main]` + `workflow_dispatch`；`permissions` = `contents:read` + `pages:write` + `id-token:write`；`concurrency` = `{group: pages, cancel-in-progress: false}`；build 各步 `uses` 与 `with`（`version: 11.21.0`、`node-version: 24` + `cache: pnpm`、`path: dist`）逐一相符；deploy = `needs: build` + `environment: github-pages` + `actions/deploy-pages@v5` → **全部通过**
  - **编码与换行**：文件为 UTF-8、**仅 LF、无 BOM**（`.gitattributes` 的 `* text=auto eol=lf` 亦保证入库换行统一）
  - **CI 等价命令本地实跑**：`pnpm install --frozen-lockfile` → 退出码 **0**（`Already up to date`，pnpm v11.21.0，即工作流中 `action-setup` 安装的同一版本）；`pnpm build` → 退出码 **0**，**8 page(s) built**（与 P4 一致）
  - **构建产物**：`dist` 下 `.js` 文件数 **0**（ADR-1 零客户端 JS 未被破坏）、`.html` **8** 个；`dist\index.html`、`about\index.html`、`blog\index.html`、`projects\index.html`、`404.html` 均存在
  - **上传范围核查**：`dist` 内唯一以 `.` 开头的条目是 `dist/images/.gitkeep`（P2 遗留的空目录占位，无内容），`upload-pages-artifact@v5` 默认 `include-hidden-files: false` 会将其排除，**不影响站点**
- **与设计的偏离（已先改文档后执行，见本节"版本裁定"）**：三处 Action 主版本升到 Node 24 代际（`pnpm/action-setup@v4→v6`、`actions/setup-node@v4→v7`、`actions/upload-pages-artifact@v3→v5`），并显式传 `version: 11.21.0`；`checkout@v7`、`deploy-pages@v5` 与本节点一致。**工作流的结构、触发条件、权限、并发零变化**
- **对 P6 的交接提醒（重要）**：本工作流**不含** `actions/configure-pages`（本节点未列该动作），因此 `deploy-pages` 要求仓库 Pages 来源**已是** "GitHub Actions"。而 P6 的顺序是"先 `git push`（步骤 3）再设 Pages 来源（步骤 4）"——**首次 push 触发的运行会在 `deploy` 作业失败**。处理：**先完成步骤 4，再在 Actions 页面 Re-run all jobs（或用 `workflow_dispatch` 手动触发）重跑一次**，此后 build 与 deploy 均应为绿色。这不改变 P6 的任何决策，仅是执行顺序提醒
- **写作用域的实际扩展（已披露）**：除 `.github/workflows/**` 外，另修改了 `PLAN.md`（§2 依赖版本基线、本节"版本裁定"与本执行记录、§7 风险表 3 行、§9 之外的变更记录 v1.7）与 `README.md`（把过时的"P2 完成 / 下一步 P3"更新为当前进度，并在目录树中登记部署工作流）。**未**改动 `src/**`、`public/**`、`astro.config.mjs`、`package.json`、`pnpm-lock.yaml`、`.gitignore`
- **遗留问题**：远端验收（G6：推送后 Actions 两步绿色、站点更新）**待 P6**；本阶段无阻塞项

### P6 —— GitHub 侧配置与首次上线 ✅ 已完成（2026-10-11）
- **前置依赖**：P1（本地仓库位于 `D:\WZC\mypage\WauZonC.github.io`）、P5（工作流文件已提交）
- **手动步骤（在 GitHub 网页完成，`gh` CLI 未安装）**
  1. 登录 `WauZonC` 账号，创建**公开**仓库，名称**精确为** `WauZonC.github.io`，**不要**勾选 "Add a README/.gitignore/license"（避免与本地首次提交冲突）
  2. 本地执行：`git remote add origin git@github.com:WauZonC/WauZonC.github.io.git`
  3. 推送：`git push -u origin main`
  4. 仓库 `Settings → Pages → Build and deployment → Source` 选择 **GitHub Actions**
  5. 等待首次工作流完成，访问 <https://wauzonc.github.io> 验证 G1/G2
     - **P5 交接提醒**：若**首次 push**（步骤 3）触发的运行在 `deploy` 作业失败，属预期——当时 Pages 来源尚未设置（本工作流不含 `actions/configure-pages`，无法自动启用 Pages）。先完成步骤 4，再在 Actions 页面 **Re-run all jobs** 或用 `workflow_dispatch` 手动触发重跑；详见 P5 执行记录
- **可选**：自定义域名——需在 `public/` 放 `CNAME` 文件并在域名商配置 DNS；**若采用自定义域名，必须同步更新 `astro.config.mjs` 的 `site` 为本节约定**（否则 canonical/og URL 错误）
- **验收命令**：`Invoke-WebRequest -Method Head https://wauzonc.github.io` → 200；页面中文正常
- **写作用域**：`git remote` 配置；可选 `public/CNAME`

#### P6 实际执行记录（2026-10-11）

- **前置确认（事实核对，非假设）**：`git ls-remote git@github.com:WauZonC/WauZonC.github.io.git` → `Repository not found`（仓库不存在）；`ssh -T git@github.com` → `Hi WauZonC!`（SSH 认证有效）；`https://wauzonc.github.io` → **404**（尚未上线）。故仓库创建由**用户**在 GitHub 网页完成（无 `gh` CLI、无 token），**未**由本 agent 代为创建
- **用户决策（闭合两处开放项）**：①**不绑定自定义域名**（§9 开放项 1）；②仓库**公开**（§9 开放项 4 末句）。并且用户**先**把仓库 Pages 来源设为 **GitHub Actions** 再让我推送，因此**首次推送即一次通过**，未出现 P5 预警的 `deploy` 失败（该预警已写在 §7 风险表，此处保留作为一般性提醒）
- **执行动作**
  1. 用户建仓后核对：`api.github.com` 返回 `private: false`、`default_branch: main`、`has_pages: true`、`size: 0`；`git ls-remote origin` **无任何 ref**（空仓库 → 无需 `git pull --rebase`，不存在 README 冲突）
  2. `git remote add origin git@github.com:WauZonC/WauZonC.github.io.git`（步骤 2）
  3. `git push -u origin main` → 退出码 **0**，`main` 已跟踪 `origin/main`
- **实测验收**
  - **步骤 3 验收**：`git ls-remote origin` → `refs/heads/main` = `20c2571e9e5e538818b5875025374104a3893586`，与本地 `HEAD` **完全一致**
  - **G6（Actions）**：run `38128165438`（`Deploy to GitHub Pages`，`event=push`，`head_sha=20c2571`）→ **conclusion=success**；**Build 作业**逐步全绿（Checkout / Setup pnpm / Setup Node / Install dependencies / Build site / Upload Pages artifact），**Deploy 作业**全绿（Deploy to GitHub Pages）。**首次运行即成功，无需重跑**。链接：<https://github.com/WauZonC/WauZonC.github.io/actions/runs/38128165438>
  - **G1**：`https://wauzonc.github.io/` → **HTTP 200**（15 341 bytes）；响应头含 `Content-Type: text/html; charset=utf-8`、`Strict-Transport-Security`、`Server: GitHub.com`；页面实测 `<html lang="zh-CN">`、含站名 `WauZonC`、「个人主页」出现 **11 次**、`canonical` = `https://wauzonc.github.io/`、**不含** `/mypage/` 前缀
  - **G2**：`/`、`/about/`、`/blog/`、`/projects/`、`/404.html`、`/blog/build-site-with-astro/`、`/blog/self-learning-cs/`、`/blog/cuda-notes/` **全部 200**；`/favicon.svg`（749 B）、`/images/pku-table-canvas.png`（104 589 B）亦均 200
  - **404 语义**：`/no-such-page-xyz/` → **404 状态**且内容与本地 `dist/404.html` **逐字节一致**；P2 占位文章 `/blog/hello-world/` → **404**（P4 的删除已生效）
  - **部署正确性（最有力的一条）**：线上 `index.html` 与本地 `dist/index.html` 的 **SHA-256 完全相同**（`71B2DAF6AD25D62FF801CF5CCF2F2DD370090AE2E1EFC9456DC41AAB646DB22C`），即"线上 = 本地构建产物"，**未发生路径 / `base` 错配**
  - **G4/G5 的线上等价性**：CI 侧 `pnpm build` 在 Build 作业中成功（`Build site` 步骤 success）；部署内容与本地 `dist` 逐字节一致，故 P4 的 24 组无横向滚动结论对线上同样成立
- **与设计的偏离**：**无**。未绑定域名、未新增 `public/CNAME`；工作流文件在 P6 期间**零改动**（`git hash-object .github/workflows/deploy.yml` 与 `HEAD` blob 一致）
- **写作用域的实际扩展（已披露）**：除 P6 原定（`git remote` 配置）外，另更新了 `PLAN.md`（文档头、§1.2 验收状态、本节执行记录、§9 开放项 1 与 4、变更记录 v1.8）与 `README.md`（状态、线上地址、部署与后续步骤）。**未**改动 `src/**`、`public/**`、`astro.config.mjs`、`package.json`、`pnpm-lock.yaml`
- **副作用说明（预期行为）**：本次 P6 文档更新会**再触发一次** Actions 运行（`push: main`）——这正是 G6 的预期行为；由于 `src/`、`public/` 未变，重新部署的产物与既有站点**逐字节相同**
- **遗留问题**：无阻塞项。可选增量见 §9 开放项 3（RSS / 搜索 / 评论 / 统计 / TOC）与 P4 遗留项（手势识别项目缺配图；**本站项目卡片现可补 `repoUrl` = `https://github.com/WauZonC/WauZonC.github.io`**，因远端仓库已存在）

---

## 7. 风险与注意事项

| 风险 | 影响 | 应对 |
|---|---|---|
| 目录改名/搬迁被占用进程阻塞（P1） | 阻塞 P1，进而阻塞全部后续阶段 | **已发生并已解决**：真实原因是执行改名的工作进程自身工作目录在待改目录内；改为以 `D:\WZC` 为工作目录后成功。禁止复制删除方式迁移 `.git` |
| 把「本地目录名」误当成「Pages URL 路径」 | 可能误加 `base`，导致全站资源 404 | **已澄清**：URL 路径只由 GitHub 仓库名决定。本地仓库放在 `mypage\WauZonC.github.io\` 不影响发布，`base` 保持不设置；仅当 GitHub 仓库名改为 `mypage` 时才需要 `base: '/mypage'`（须先改 ADR-2） |
| 对含 `.git` 的目录做搬迁时产生自嵌套 | 目录层级错误，路径混乱（P1 首次搬迁已发生一次） | 搬迁前显式确认源/目标层级，禁止“把目录移动进它自己的子目录”；操作后立即用 `Test-Path '<repo>\.git'` 校验并 `git fsck` 自检 |
| 远端仓库名不是 `WauZonC.github.io` | 用户主站无法生效，站点落到子路径 | **本地目录已满足前置（P1 完成）**；P6 创建远端仓库时必须使用精确名称 `WauZonC.github.io`；若被迫改名，需先更新 ADR-2 再设 `base` 并重写资源路径 |
| 全局 `http.sslverify=false` 且 `http.sslcainfo` 指向不存在的占位路径 | GitHub HTTPS 连接长期缺少证书校验，存在中间人风险 | **本方案不擅自修改全局配置**；建议后续在确认代理证书路径后改回 `sslverify=true`，或改用 SSH 传输（当前已可用） |
| 中文文件名显示为转义序列 | 阅读 diff 困难 | 仓库已设 `core.quotepath=false`；其他克隆者需自行设置 |
| CRLF 换行污染 | 整文件 diff、跨平台冲突 | 已通过 `.gitattributes` 强制 `eol=lf` |
| 误提交 `dist/`、`node_modules/` | 仓库膨胀 | 已在 `.gitignore` 排除 |
| `demo/` 临时样例被误提交或忘记删除 | 仓库里留下只用于选型的 16 份样例，长期无人维护 | `demo/` **不 `git add`**（P2.5 验收已确认 `git status --short` 仅 `?? demo/`）；风格定稿并完成 P3 验收后，先 `Resolve-Path 'demo'` 校验绝对路径等于 `D:\WZC\mypage\WauZonC.github.io\demo`，再 `Remove-Item -Recurse -Force`。因其从未入库，无需 `git rm` |
| 玻璃拟态依赖 `backdrop-filter`：旧浏览器不支持时面板变半透明、正文对比度下降 | 正文可读性受损 | `global.css` 已用 `@supports not (...)` 兜底为不透明玻璃（`--glass-solid`）；Header 同样处理。**改动令牌后必须复验浅/暗两套配色下的对比度**（方法见 P3 执行记录的「视觉抽查」） |
| 渐变背景使用 `background-attachment: fixed` | 个别移动端浏览器在长页面上滚动性能较差 | 目前 6 条路由均为一屏级内容，影响可忽略；若 P4 后文章变长且出现掉帧，改为固定定位的 `body::before` 装饰层或取消 `fixed` |
| 误提交 `.obsidian/`、`.claude/` | 泄露编辑器私有配置 | 已在 `.gitignore` 排除；P4 明确禁止 `git add -f` |
| **内容取材时把隐私素材搬上站**（手机号 / 学号 / 成绩单 / 身份证号段 / 党课材料 / 他人姓名清单 / 含人脸的合影 / 含学号的录取通知书照片） | 不可逆的隐私泄露——站点是**公开可检索**的，一旦推送即被缓存与归档 | P4 已建立**两阶段人工审批**流程：先产出待审批 Markdown（放 `p4-review/`，**不入库**）→ 用户逐项删改 → 只按"保留下来的内容"建站；并把**发布前泄漏扫描**（`src/`、`public/`、`dist/` 0 命中）写入 P4 验收命令。红线清单见 P4 执行记录 |
| **照搬他人主页内容**（例如把 `简历\` 下他人主页存档的经历写成本人履历） | 身份冒用 + 学术诚信问题，且**自动检查发现不了** | 迁移前必须核对素材的**归属**（作者/主体是不是用户本人）。P4 曾实测到这一错误并更正（原 P4 素材来源第 1 条），见 P4 执行记录 |
| 在 Astro 模板里把组件写进 JS 表达式（`{cond && <Content />}`） | 编译报 `Unexpected token`，且**错误位置指向前一个表达式**，极易误判到别的代码上 | HTML 元素可以，组件不行；用薄包装组件（`ProjectBody.astro`）把组件放回模板顶层、显隐交给 CSS。见 P4 执行记录 |
| 用 Chromium 无头 `--window-size` 截窄屏页面判断移动端溢出 | 窗口宽度有约 500px 下限，截图会出现"右侧被裁"的**假象**，导致误判 | 移动端溢出判断只用**同源 iframe 探针**（320/390/1440 三档），不靠截图；配图不要用 `loading="lazy"`（虚拟时间下可能未解码） |
| 首次提交与 GitHub 自动生成的 README 冲突 | `git push` 被拒 | P6 创建仓库时不勾选自动生成文件；若已发生，用 `git pull --rebase` 处理 |
| **照抄旧版 Content Collections 写法**（`src/content/config.ts`、`type: 'content'`、`entry.render()`、`import { z } from 'astro:content'`） | Astro 6 已移除旧版集合；Astro 7 遇到 `src/content/config.ts` 直接抛 `LegacyContentConfigError` **中止构建**，P2 无法验收 | **P2 已实测并修正**：文件改为 `src/content.config.ts`，集合必须带 `loader: glob(...)`，`z` 从 `astro/zod` 导入，渲染用 `render(entry)`。后续 agent **不要**改回旧写法（见 §4.3 开头） |
| 在**非空仓库目录**里直接跑 `pnpm create astro@latest .` | 模板自带 `README.md` / `.gitignore` 会**覆盖**仓库中的同名文件，P0/P1 的项目文档与忽略规则被冲掉 | **P2 已用规避方案**：脚手架只在仓库外的临时目录运行，仅取回写作用域内的产物；后续 agent 若需重跑脚手架，务必同样避免在仓库根直接生成 |
| 内容 frontmatter 不合规时的构建表现 | 构建**非 0 退出**（Windows 实测 `-1073740791` / `0xC0000409`，属 Astro 内容校验失败的中止行为，**不是**崩溃）；日志含 `[InvalidContentEntryDataError]` 与字段原因 | 这是 G4 期望行为，不要误判为环境故障；先看日志里的集合名、条目名与字段名，再去修 frontmatter |
| **照抄旧版（Node 20 代际）GitHub Action**（`pnpm/action-setup@v4`、`actions/setup-node@v4`、`actions/upload-pages-artifact@v3`） | GitHub 自 2026-06-16 起把托管 runner 默认运行时切到 Node 24、并计划 2026 年秋移除 Node 20；旧版 Action 的 `runs.using` 为 `node20`（P5 已实测），继续沿用随时可能整条工作流失败 | **P5 已裁定并实测升级**：`pnpm/action-setup@v6`、`actions/setup-node@v7`、`actions/upload-pages-artifact@v5`（连同 `actions/checkout@v7`、`actions/deploy-pages@v5`）。后续 agent **不要降级回 `v4`/`v3`**；升级后已用 actionlint 1.7.12 复检（0 告警） |
| `pnpm/action-setup` 未指定 pnpm 版本，且 `package.json` 无 `packageManager` 字段 | 工作流在 "Setup pnpm" 一步直接报错（未指定版本），CI 无法安装依赖 | P5 已在工作流显式传 `with: version: 11.21.0`（与本地 pnpm 及 `pnpm-lock.yaml` 的生成版本一致）。**日后若重新生成锁文件，须同步该版本号** |
| **首次 `git push` 早于「Pages 来源设为 GitHub Actions」**（P6 步骤 3 先于步骤 4） | 首次触发的运行会在 `deploy` 作业失败（Pages 未启用或来源仍为分支），G6 的"首次即绿色"不成立 | 按 P6 顺序**先完成步骤 4**，再在 Actions 页面 **Re-run all jobs**（或 `workflow_dispatch` 手动触发）重跑一次；本工作流不含 `actions/configure-pages`，不会自动启用 Pages |

---

## 8. 明确不做的事（范围边界）

- 不改动全局 git 配置（`http.sslverify` 只报告不修改）
- 不改动全局 Node/pnpm 配置
- 不触碰 `D:\WZC` 下除本项目外的任何目录
- 不提交 `dist/`、`node_modules/`、编辑器私有配置
- 不在 P0 阶段安装任何依赖或创建远端仓库

---

## 9. 待用户决定的开放项

以下事项不阻塞 P1–P3，但在对应阶段前需要用户确认：

1. **自定义域名**：是否绑定个人域名？（影响 P6 与 `astro.config.mjs` 的 `site`）→ **已闭合（2026-10-11，P6 用户决定）：不绑定**，站点以 <https://wauzonc.github.io> 上线，`site` 保持 `https://wauzonc.github.io`，未添加 `public/CNAME`。若日后绑定，须先更新本项与 ADR-2，再改 `site` 并放 `CNAME`
2. **首页布局**：**结论（P2.5 随选型一并决定）：保持多页导航式**——用户选定的风格 10 为多页式样例，`demo/07-onepage.html` 的单页方案不采用；§4.1 路由表维持 6 条路由不变（原问题：单页滚动式还是多页导航式）
3. **是否增加**：RSS 订阅、站点搜索、评论系统（utterances / giscus）、访问统计、文章目录（TOC）
4. **公开范围**：**P4 已逐项确认并闭合**——`about` **不**包含手机号、学号、出生日期、成绩、住址；只用 `WauZonC`（不露真名），只写学院不写年级与专业，不放头像与简历 PDF，公开 `zhongchangwang25@…` 与 `WauZonC@qq.com` 两个邮箱。**仓库是否公开**：**已闭合（2026-10-11，P6 用户决定）＝公开**——免费账号的 Pages 用户主站需要公开仓库，且 `api.github.com` 实测 `private: false`；站点内容已通过 P4 泄漏扫描（`src/`、`public/`、`dist/` 0 命中）

---

## 变更记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | P0 | 初版：环境实测结论、6 项 ADR、信息架构、P0–P6 路线图与验收标准 |
| v1.1 | P1 | P1 完成：`D:\WZC\mypage` → `D:\WZC\WauZonC.github.io`（`.git` 与历史连续）。同步更新：本地工作目录字段、P1 章节（标注完成 + 执行记录 + 占用进程根因）、风险表 |
| v1.2 | P1 后 | 本地布局调整：仓库最终位于 `D:\WZC\mypage\WauZonC.github.io\`（外层 `mypage` 文件夹）。**纯本地存放位置变更，发布配置不变（仍不设 `base`）**。同步更新：ADR-2 增补「本地存放位置」与关键澄清、P1 增补「本地布局调整」小节、工作区字段、P2 命令路径、风险表新增 2 行、README 目录结构 |
| v1.3 | P2 | P2 完成：Astro 7.3.8 脚手架 + 6 条路由 + Content Collections 落地，`pnpm build` 退出码 0、零客户端 JS。**先改文档后执行的必要偏离**：Content Collections 改为 `src/content.config.ts` + `loader: glob(...)` + `astro/zod` + `render(entry)`（Astro 6 移除旧写法）。同步更新：§4.2 目录树、§4.3 新增硬性要求与示例代码（字段表零变化）、P2 标注完成并补执行记录（含实测验收、两条契约实证、脚手架覆盖风险规避、写作用域扩展披露）、P3 明确剩余工作、风险表新增 3 行、当前阶段与文档版本 |
| v1.4 | P2.5 | P2.5 完成：新增**临时**目录 `demo/`（17 个自包含 HTML + README），用统一内容基线做 16 种首页风格样例供选型；自动化验证「32 组 375/1440 无横向滚动 + 零外部请求 + 内容一致 + 构建隔离（`dist/demo` 不存在）」，并修正 `16-swiss.html` 在窄屏的栅格塌列问题。**`demo/` 不纳入 Git、不参与构建**，P3 验收后删除。同步更新：文档头「当前阶段」与版本、新增 §6「P2.5」小节（含 16 风格清单、约束、实测验收、待选项）、P3 前置依赖、§9 开放项 2 标注 |
| v1.5 | P3 | P3 完成：**用户选定风格 10「玻璃拟态渐变」**并落地全站（新增 ADR-7）。重写 `global.css` 设计令牌与玻璃工具类、粘性玻璃导航、玻璃卡片（PostCard/新增 ProjectCard）、文章与关于/404 面板化、跳转链接与 `theme-color`。实测：`pnpm build` 退出码 0、6 条路由、`dist` 零 `.js`、**12 组（6 路由 × 375/1440）无横向滚动**、浅/暗两套配色目视通过。临时目录 `demo/` 已按约定删除。同步更新：文档头「当前阶段」与版本、ADR-7、§9 开放项 2 结论（保持多页式）、P3 章节（选定方案 + 执行记录）、风险表新增 2 行 |
| v1.6 | P4 | P4 完成：按**两阶段人工审批**落地真实内容——博客 3 篇（Astro 建站 / 自学 CS61A·CS61B·15-213 / CUDA 笔记）、项目 4 条（pku-table / 个人主页本站 / 手势识别原型 / CS61B Proj 3）、`about` 重写为 8 节。审批文档置于 `p4-review/`（**不入库**，`.gitignore` 已兜住）。实测：`pnpm build` 退出码 0、8 个页面、`dist` 零 `.js`、**24 组（8 路由 × 320/390/1440）无横向滚动**、浅/暗两套配色目视通过、**发布前泄漏扫描 0 命中**。**修正 4 处事实性错误并新增 4 行风险**：P4 素材来源第 1 条（他人主页存档不得作为本人履历）、`articles` 实为 AI 整理的文献笔记库（未采用）、`project/src/**` 属排除项、§9 开放项 4 结论落地；§2 全局 git 邮箱按「文件会公开」脱敏。同步更新：文档头「当前阶段」与版本、§6 P4 章节（素材来源 / 写作用域 / 验收命令 + 执行记录）、§7 风险表、§9 开放项 4 |
| v1.7 | P5 | P5 完成：写入 `.github/workflows/deploy.yml`（checkout → pnpm → Node 24 → `pnpm install --frozen-lockfile` → `pnpm build` → 上传 Pages 产物 → 部署；触发 `push[main]` + `workflow_dispatch`，权限 `contents:read`/`pages:write`/`id-token:write`，并发 `group: pages` 且不取消进行中部署）。**先改文档后执行的必要偏离（1 处）**：把 `pnpm/action-setup@v4`、`actions/setup-node@v4`、`actions/upload-pages-artifact@v3` 升级到 Node 24 代际的 `@v6`/`@v7`/`@v5`（GitHub 自 2026-06-16 默认 node24、2026 年秋移除 node20；旧版实测 `runs.using: node20`），并显式传 `version: 11.21.0`（`package.json` 无 `packageManager` 字段），`checkout@v7`/`deploy-pages@v5` 与本节点一致，**工作流结构零变化**。实测验收（本地）：actionlint 1.7.12 **退出码 0 零告警**、PyYAML 结构断言全通过、文件 UTF-8/仅 LF/无 BOM、`pnpm install --frozen-lockfile` 与 `pnpm build` **均退出码 0**（8 pages，`dist` 零 `.js`）。**诚实声明**：本节"推送后 origin/main 一致 + Actions 两步绿色"的验收**必须等 P6 建仓后**才能完成。新增 3 行风险（旧版 Action、pnpm 版本未指定、首次 push 早于 Pages 来源设置）；P6 增加 1 条交接提醒（先设 Pages 来源再重跑工作流）。同步更新：文档头「当前阶段」与版本、§2 依赖版本基线、§6 P5 章节（版本裁定 + 执行记录）、§6 P6 步骤 5 提醒、§7 风险表、README.md |
| v1.8 | P6 | P6 完成：站点上线 <https://wauzonc.github.io>。用户建仓（**公开**）并把 Pages 来源设为 **GitHub Actions** → 本地 `git remote add origin`（SSH）→ `git push -u origin main`（退出码 0）。**实测**：`git ls-remote` 的 `refs/heads/main` = 本地 `HEAD`（`20c2571`）；Actions run `38128165438` **首次运行即 build + deploy 全绿**（无需重跑）；`/` `/about/` `/blog/` `/projects/` `/404.html` 与 3 篇博客详情**全部 200**、UTF-8 中文正常、canonical 为根路径、无 `/mypage/` 前缀；不存在路径返回 **404** 且与本地 `dist/404.html` 逐字节一致；线上 `index.html` 与本地 `dist/index.html` **SHA-256 相同**（线上 = 本地构建产物）。**无设计偏离**，工作流文件在 P6 期间零改动。**闭合 §9 开放项 1**（不绑定自定义域名）与**开放项 4 末句**（仓库公开）；§1.2 新增 G1–G6 验收状态。同步更新：文档头「当前阶段」与版本、§1.2、§6 P6 章节（执行记录）、§9、README.md |
