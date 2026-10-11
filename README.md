# WauZonC.github.io

个人主页本地仓库。

- 线上地址：**<https://wauzonc.github.io>（已上线）**，由 GitHub Actions 自动部署
- 技术栈：Astro + Markdown Content Collections
- 包管理器：pnpm

> 📖 **想手动加文章 / 改内容 / 提交发布？看 [docs/操作手册.md](./docs/操作手册.md)。**
> 它是「**具体怎么敲命令**」的人工操作手册（增添 / 修改 / 删除内容、本地自检 R1–R5、`git add`–`commit`–`push`–等 Actions–回滚、常见问题排查）。
> 本文下方是**项目概览与设计结论**；**唯一权威设计文档仍是 [PLAN.md](./PLAN.md)**（回答「为什么这么设计」「允许改什么」）。

> **当前状态：🟢 维护阶段（Maintenance，自 2026-10-11 起）** —— 开发阶段 P0–P6 **全部完成**，站点发布在 <https://wauzonc.github.io>，内容为 3 篇博客 / 4 个项目 / `about`，**iOS 26 风格「液态玻璃 + 照片背景」**；推送 `main` 即由 `.github/workflows/deploy.yml` 自动构建并部署（首次运行 build+deploy 全绿，路由实测 200、中文正常）。
>
> **2026-10-11 新增（M-3，已上线）**：**视觉方案整体换过一次** —— 由 [PLAN.md](./PLAN.md) **ADR-7** 的「毛玻璃拟态 + 柔光渐变背景」改为 **ADR-11** 的「iOS 26 液态玻璃 + 照片背景」。
> - **材质**：四层叠成（真折射 / 磨砂 / 镜面 / 厚度）。真折射用 `backdrop-filter: url(<SVG 滤镜 data URI>)`，位移贴图由 SVG 图元现拼、**无需插入 `<svg>`、无需任何 JS**；该特性目前**仅 Chromium 生效**，Safari / Firefox 自动降级为磨砂 + 镜面 + 厚度，观感不塌。
> - **背景**：`public/images/background.jpg`（2560×1920 / 1.6 MB / **已清空全部 EXIF**）。⚠️ 原图带 GPS，见 PLAN.md ADR-11 的隐私说明；**根目录的原图不得提交**。
> - ⚠️ **浅/深两态的玻璃都是深色底**，两态的区别是「照片压多暗 + 玻璃多实」。这不是随手选的：照片上的浅色文字配白色玻璃只有约 2.2:1，改成深色玻璃才有 6.5~6.9:1。详见 ADR-11。
> - 设计过程与改造前的对照留在 `demo/`（临时目录，可删）；结论见 [demo/README.md](./demo/README.md)。
>
> **2026-10-11 新增（M-4）**：背景由「一张写死的照片」升级为**照片池**，并把深浅色按钮换成了背景按钮——
> - **📷 换背景**：点一下从照片池里**随机**抽一张（会排除当前那张，所以点了必定换），结果写进 `localStorage`，**刷新与跳页都保持不变**；**第二天自动回到按日期取图**。
> - **按日期固定**：某个日期打开一定是**同一张**照片。规则写在 `src/backgrounds/config.ts` 的 `rules`（支持 `YYYY-MM-DD` 一次性 / `MM-DD` 每年 / `'0'`-`'6'` 星期几），可在本地随意调整，例如让国庆、圣诞各用某一张。**日期取的是访客自己设备的日期**。
> - **照片池**：`public/images/backgrounds/`，**文件名就是 id**；新增照片用 `pnpm add:background -- <你的照片> --id <名字>`（会自动**剥掉 EXIF/GPS**、压到 2560px、并实测元数据为 0），然后 `pnpm sync:backgrounds`。⚠️ **不要手工把手机原图拷进 `public/`** —— 原图带 GPS，仓库是公开的。
> - **🌙 / ☀️ 主题切换已静默**：页头不再有那个按钮，站点**恒定浅色**。**代码一行未删**（`ThemeToggle.astro`、两处深色令牌、`gate-dark` 门控都在），把 `src/backgrounds/config.ts` 的 `THEME_TOGGLE_ENABLED` 改成 `true` 即可恢复。
> - 具体操作步骤见 [docs/操作手册.md](./docs/操作手册.md) 第 3 章；决策与权衡见 [PLAN.md](./PLAN.md) **ADR-12**。
>
> **2026-10-11 新增（M-1 + M-2）**：页头右上角有两个按钮——
> - **`EN` / `中`**：中英文切换。中文站保持原路径，英文站是 `/en/` 前缀镜像（**两套真实路由**，按钮是**纯链接、零 JS**）。⚠️ **英文正文尚未翻译**（用户选择先搭框架），英文页当前显示「翻译中」提示；补正文的方法见下方「新增英文内容」。
> - ~~**🌙 / ☀️**：浅色 / 深色切换~~ → **已由 M-4（ADR-12）按用户要求静默**：不再渲染，代码保留。
>
> 各项功能的决策与权衡记录在 [PLAN.md](./PLAN.md) 的 **ADR-9**（主题手动切换，取代 ADR-7 取舍第 1 条）、**ADR-10**（双语路由）、**ADR-11**（液态玻璃 + 照片背景，取代 ADR-7 的材质与背景）与 **ADR-12**（照片池 + 日期映射 + 主题静默）。
>
> **后续改动（新增博客 / 修改主页风格 / 新增功能）请按 [PLAN.md](./PLAN.md) 的 §10「维护阶段操作手册」执行**：先在 §10.5 台账立项（`M-<编号>` + 轨道 + 写作用域 + 验收命令），再动手，并通过回归验收 **R1–R6**（构建 / 页面数 / 零客户端 JS / 无横向滚动 / 泄漏扫描 / 线上一致）。
> 唯一权威设计文档是 **[PLAN.md](./PLAN.md)**，所有后续步骤以它为准（状态切换见其中的 **ADR-8**）。
>
> ⚠️ **R3 的判读方式已更新**：`(Get-ChildItem -Recurse -File -Filter *.js dist).Count` **仍然应为 `0`**，但「零客户端 JS」自 ADR-9 起**不再是字面事实**——`src/**` 里有 `is:inline` 内联脚本（M-4 / ADR-12 后为 **3 段**：首屏背景、背景按钮、主题切换（静默保留））。`is:inline` 不产出 `.js` 文件，所以命令返回 0、每页 `<script>` 计数为 **3**；**不要**把这理解成「HTML 里没有 `<script>`」。
> ⚠️ 同理，ADR-7 时代的「零位图背景」性质也**已结束**（背景现在是 `public/images/backgrounds/` 里的照片池）；**零外部请求**仍然成立。

## 目录结构

```
D:\WZC\mypage\                 # 外层容器目录
└── WauZonC.github.io\         # 本仓库根目录
    ├── .github/workflows/     # deploy.yml：推送 main 后自动构建并部署到 GitHub Pages
    ├── astro.config.mjs       # site = https://wauzonc.github.io（不设 base）
    ├── package.json           # astro ^7.3.8；含 sync/check/add:background 三个本地脚本
    ├── pnpm-lock.yaml         # 入库
    ├── tsconfig.json          # 继承 astro/tsconfigs/strict
    ├── docs/操作手册.md        # 给人看的手册：内容 / 背景照片 / 自检 / 提交发布
    ├── scripts/               # 零 npm 依赖的本地工具：背景照片导入与索引生成
    ├── public/                # favicon.svg、images/backgrounds/（照片池）、images/*.png
    ├── src/
    │   ├── backgrounds/       # 背景照片池：config.ts（★手改）/ date-map.ts / runtime.ts / generated.ts
    │   ├── components/        # BaseHead / Header / Footer / PostCard / ProjectCard / ProjectBody
    │   │                      # + LangSwitch（语言按钮）/ BackgroundButton（背景按钮）
    │   │                      # + ThemeToggle（主题按钮；ADR-12 起静默保留、不再渲染）
    │   │                      # + LangNotice（英文「翻译中」提示）/ NotFoundPanel（中英共用 404）
    │   ├── content/           # Markdown 条目
    │   │   ├── blog/          #   中文博客
    │   │   ├── blog-en/       #   英文博客（同名即同 slug，当前为空）
    │   │   ├── projects/      #   中文项目
    │   │   └── projects-en/   #   英文项目（当前为空）
    │   ├── content.config.ts  # 集合定义（Astro 7：loader: glob(...)；中英共用同一 schema）
    │   ├── content-types.ts   # 中英集合条目的联合类型 + 集合键映射
    │   ├── i18n/ui.ts         # 界面文案字典（zh/en）+ 语言前缀路由助手
    │   ├── layouts/           # BaseLayout / PostLayout（含 lang / altHref / translated）
    │   ├── pages/             # 中文路由见 PLAN.md §4.1；en/ 下为英文镜像路由
    │   └── styles/global.css  # 设计令牌 + 液态玻璃材质 + 两个背景固定层
    ├── README.md
    ├── PLAN.md
    └── demo/                  # M-3 液态玻璃原型（临时目录；不参与构建、不进 dist）
```

> **关于 `demo/`**：它是 M-3 的**设计过程证据与调参沙盒**（含改造前的毛玻璃对照组
> `real-home-plain.html`）。**正式实现已并入 `src/styles/global.css`，它不参与构建、不进 `dist`**；
> 按 §10.2 轨道 B 惯例属**临时目录**，正式验收后可整目录删除。详见 [demo/README.md](./demo/README.md)。

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

## 新增英文内容

英文站的文件名与中文**逐字同名**，语言互跳就是靠这一点（同名即同 slug）。所以「给某篇中文博客补英文版」＝ 在 `src/content/blog-en/` 放一个**同名** `.md`：

```
src/content/blog/cuda-notes.md      →  /blog/cuda-notes/
src/content/blog-en/cuda-notes.md   →  /en/blog/cuda-notes/
```

项目同理：`src/content/projects-en/<同名>.md`。frontmatter 字段与中文**完全一致**（两套集合在 `src/content.config.ts` 里共用同一个 schema），**不需要改任何 `.astro` 文件**。

- 放入文件后 `/en/blog/`、`/en/projects/`、`/en/blog/<slug>/` 会自动出现内容并替换掉「翻译中」提示；`hreflang` 与语言按钮也会自动指向对应译文
- 文件名不一致不会报错，只会让语言按钮退回列表页（跳不到对应文章），所以务必**逐字同名**
- 注意：英文 404 的地址是 **`/en/404/`**，不是 `/en/404.html`（Astro 只把根目录的 `404.astro` 特殊化为 `404.html`）

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

**已知待办**：**英文正文翻译**（M-2 只交付了框架，补法见上方「新增英文内容」）；手势识别项目缺配图；「本站」项目卡片可补 `repoUrl`；自定义域名（已决定暂不绑定，见 PLAN.md §9 开放项 1）。

> 所有命令请在 `D:\WZC\mypage\WauZonC.github.io` 下执行。
