# WauZonC.github.io

个人主页本地仓库。

- 线上地址：**<https://wauzonc.github.io>（已上线）**，由 GitHub Actions 自动部署
- 技术栈：Astro + Markdown Content Collections
- 包管理器：pnpm

> **当前状态：P6 完成（已上线）—— 站点发布在 <https://wauzonc.github.io>，内容为 3 篇博客 / 4 个项目 / `about`，玻璃拟态样式；推送 `main` 即由 `.github/workflows/deploy.yml` 自动构建并部署（首次运行 build+deploy 全绿，6 条路由实测 200、中文正常）。**
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

推送到 `main` 即由 `.github/workflows/deploy.yml` 自动构建并发布到 GitHub Pages（<https://wauzonc.github.io>）；也可在 Actions 页面手动 `workflow_dispatch` 触发。仓库 Pages 来源为 **GitHub Actions**（`Settings → Pages`）。

## 后续步骤

[PLAN.md](./PLAN.md) 的路线图 **P0–P6 已全部完成**，站点已上线。可选增量（均需先在 PLAN.md 中立项）：自定义域名（`public/CNAME` + 同步 `site`）、RSS / 站点搜索 / 评论（giscus）/ 访问统计 / 文章目录、为手势识别项目补配图。

> 所有命令请在 `D:\WZC\mypage\WauZonC.github.io` 下执行。
