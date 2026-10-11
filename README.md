# WauZonC.github.io

个人主页本地仓库。

- 线上地址：**<https://wauzonc.github.io>（已上线）**，由 GitHub Actions 自动部署
- 技术栈：Astro + Markdown Content Collections
- 包管理器：pnpm

> **当前状态：🟢 维护阶段（Maintenance，自 2026-10-11 起）** —— 开发阶段 P0–P6 **全部完成**，站点发布在 <https://wauzonc.github.io>，内容为 3 篇博客 / 4 个项目 / `about`，玻璃拟态样式；推送 `main` 即由 `.github/workflows/deploy.yml` 自动构建并部署（首次运行 build+deploy 全绿，路由实测 200、中文正常）。
>
> **后续改动（新增博客 / 修改主页风格 / 新增功能）请按 [PLAN.md](./PLAN.md) 的 §10「维护阶段操作手册」执行**：先在 §10.5 台账立项（`M-<编号>` + 轨道 + 写作用域 + 验收命令），再动手，并通过回归验收 **R1–R6**（构建 / 页面数 / 零客户端 JS / 无横向滚动 / 泄漏扫描 / 线上一致）。
> 唯一权威设计文档是 **[PLAN.md](./PLAN.md)**，所有后续步骤以它为准（状态切换见其中的 **ADR-8**）。

## 目录结构

```
D:\WZC\mypage\                 # 外层容器目录
└── WauZonC.github.io\         # 本仓库根目录
    ├── .github/workflows/     # deploy.yml：推送 main 后自动构建并部署到 GitHub Pages
    ├── astro.config.mjs       # site = https://wauzonc.github.io（不设 base）
    ├── package.json           # astro ^7.3.8
    ├── pnpm-lock.yaml         # 入库
    ├── tsconfig.json          # 继承 astro/tsconfigs/strict
    ├── public/                # favicon.svg、images/
    ├── src/
    │   ├── components/        # BaseHead / Header / Footer / PostCard / ProjectCard / ProjectBody
    │   ├── content/           # Markdown 条目：blog/、projects/
    │   ├── content.config.ts  # 集合定义（Astro 7：loader: glob(...)）
    │   ├── layouts/           # BaseLayout / PostLayout
    │   ├── pages/             # 见 PLAN.md §4.1
    │   └── styles/global.css  # 设计令牌 + 玻璃拟态工具类（P3 定稿）
    ├── README.md
    └── PLAN.md
```

> **注意**：本仓库的线上路径与本地目录层级**无关**。GitHub Pages 的 URL 路径只由 GitHub 仓库名决定，因此站点仍发布在 <https://wauzonc.github.io/>（根路径），`astro.config.mjs` 中**不设置 `base`**。

## 本地开发命令

```bash
pnpm install     # 安装依赖
pnpm dev         # 本地预览 http://localhost:4321
pnpm build       # 构建静态站点到 dist/
pnpm preview     # 预览构建产物
```

## 新增文章

在 `src/content/blog/` 下新增一个 `.md` 文件即可，**无需修改任何 `.astro` 文件**（这是 G3 契约）；frontmatter 由 `src/content.config.ts` 的 schema 在构建期校验（字段缺失会让 `pnpm build` 非 0 退出，属预期行为）。设 `draft: true` 的文章不参与构建。

- **文件名即 URL**（`/blog/<文件名>/`）：只用小写字母、数字与连字符，**不要用中文文件名**
- **必填字段**：`title`、`description`、`pubDate`；可选 `updatedDate`、`tags`、`draft`、`cover`
- `pubDate` 决定 `/blog` 列表与首页「最新文章」的排序，不要写成未来日期
- 图片放 `public/images/`，正文用 `/images/<name>.png` 引用（先剥离 EXIF）
- ⚠️ 内容涉及**本人隐私**（手机号 / 学号 / 成绩 / 住址 / 身份证 / 政治面貌）或**他人信息与版权素材**时，**必须先经用户逐项审批**再提交；完整流程见 [PLAN.md](./PLAN.md) §10.2 轨道 A（发布前须过泄漏扫描 R5）

## 部署

推送到 `main` 即由 `.github/workflows/deploy.yml` 自动构建并发布到 GitHub Pages（<https://wauzonc.github.io>）；也可在 Actions 页面手动 `workflow_dispatch` 触发。仓库 Pages 来源为 **GitHub Actions**（`Settings → Pages`）。

## 维护阶段与后续计划

开发阶段的路线图 **P0–P6 已全部完成并冻结**（见 [PLAN.md](./PLAN.md) §6），工作区现处于**维护阶段**（ADR-8）。后续改动分三条轨道，操作手册见 [PLAN.md](./PLAN.md) §10：

| 轨道 | 场景 | 写作用域 |
|---|---|---|
| **A** 新增内容 | 新增博客 / 项目条目 | `src/content/**`（配图另加 `public/images/`） |
| **B** 修改风格 | 调整配色、玻璃质感、排版、导航 | `src/styles/global.css`、`src/components/**`、`src/layouts/**` |
| **C** 新增功能 | 新页面 / 新内容集合 / RSS / sitemap / 搜索 / 评论 / 统计 / TOC | 按功能立项（候选与代价见 PLAN.md §10.3） |

**每次改动都必须**先在 [PLAN.md](./PLAN.md) §10.5 台账立项（`M-<编号>`），只改立项写明的写作用域，跑完 R1–R6 后再推送；涉及 ADR 的改动（引入客户端 JS、引入 CSS 框架、改 `site`/`base`、改内容 schema）**必须先改 ADR**。

**已知待办**：手势识别项目缺配图；「本站」项目卡片可补 `repoUrl`；自定义域名（已决定暂不绑定，见 PLAN.md §9 开放项 1）。

> 所有命令请在 `D:\WZC\mypage\WauZonC.github.io` 下执行。
