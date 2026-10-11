# WauZonC.github.io

个人主页本地仓库。

- 线上地址：<https://wauzonc.github.io>（尚未上线，见 `PLAN.md` 路线图 P5–P6）
- 技术栈：Astro + Markdown Content Collections
- 包管理器：pnpm

> **当前状态：P2 完成 —— Astro 7.3.8 脚手架与页面骨架已落地，`pnpm build` 通过，6 条路由可构建；尚未创建远端仓库、尚未上线。**
> 唯一权威设计文档是 **[PLAN.md](./PLAN.md)**，所有后续开发步骤以它为准。

## 目录结构（P2 结束后）

```
D:\WZC\mypage\                 # 外层容器目录
└── WauZonC.github.io\         # 本仓库根目录
    ├── astro.config.mjs       # site = https://wauzonc.github.io（不设 base）
    ├── package.json           # astro ^7.3.8
    ├── pnpm-lock.yaml         # 入库
    ├── tsconfig.json          # 继承 astro/tsconfigs/strict
    ├── public/                # favicon.svg、images/
    ├── src/
    │   ├── components/        # BaseHead / Header / Footer / PostCard
    │   ├── content/           # Markdown 条目：blog/、projects/
    │   ├── content.config.ts  # 集合定义（Astro 7：loader: glob(...)）
    │   ├── layouts/           # BaseLayout / PostLayout
    │   ├── pages/             # 6 条路由，见 PLAN.md §4.1
    │   └── styles/global.css  # P2 骨架样式，主题化留给 P3
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

## 后续步骤

见 [PLAN.md](./PLAN.md) 的「路线图 P2–P6」。P2（Astro 脚手架与页面骨架）已完成，下一步是 **P3：样式与布局打磨**。

> 所有命令请在 `D:\WZC\mypage\WauZonC.github.io` 下执行。
