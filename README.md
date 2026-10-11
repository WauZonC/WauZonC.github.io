# WauZonC.github.io

个人主页本地仓库。

- 线上地址：<https://wauzonc.github.io>（尚未上线，见 `PLAN.md` 路线图 P5–P6）
- 技术栈：Astro + Markdown Content Collections
- 包管理器：pnpm

> **当前状态：P5 完成 —— 全站内容（3 篇博客 / 4 个项目 / `about`）与玻璃拟态样式已落地，GitHub Actions 部署工作流（`.github/workflows/deploy.yml`）已写入并通过本地校验（actionlint 0 告警、`pnpm install --frozen-lockfile` 与 `pnpm build` 均退出码 0）；尚未创建远端仓库、尚未上线。**
> 唯一权威设计文档是 **[PLAN.md](./PLAN.md)**，所有后续开发步骤以它为准。

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

在 `src/content/blog/` 下新增一个 `.md` 文件即可，**无需修改任何 `.astro` 文件**；frontmatter 由 `src/content.config.ts` 的 schema 在构建期校验（字段缺失会让 `pnpm build` 失败）。设 `draft: true` 的文章不参与构建。

## 部署

推送到 `main` 即由 `.github/workflows/deploy.yml` 自动构建并发布到 GitHub Pages（<https://wauzonc.github.io>）；也可在 Actions 页面手动 `workflow_dispatch` 触发。首次上线前需先在仓库 `Settings → Pages` 把来源设为 **GitHub Actions**（详见 `PLAN.md` 的 P6）。

## 后续步骤

见 [PLAN.md](./PLAN.md) 的「路线图 P0–P6」。P0–P5 已完成（脚手架、样式定稿、真实内容、部署工作流），**下一步是 P6：GitHub 侧配置与首次上线**（创建远端仓库、推送、启用 Pages、验证 G1/G2）。

> 所有命令请在 `D:\WZC\mypage\WauZonC.github.io` 下执行。
