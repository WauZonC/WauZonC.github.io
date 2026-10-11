# 个人主页设计与实施方案（PLAN）

> **本文件是整个项目的唯一权威设计文档。**
> **本工作区自 2026-10-11 起进入「维护阶段（Maintenance）」**：开发阶段 P0–P6 已全部完成并通过线上验收，站点 <https://wauzonc.github.io> 已对外服务。
> 后续所有改动（**新增博客 / 修改主页风格 / 新增功能**）一律按 **§10 维护阶段操作手册**执行：先在 §10 立项（`M-<编号>` + 轨道 + 写作用域 + 验收命令 + 风险门禁），再动手；凡涉及设计决策的（新增依赖、引入客户端 JS、改变 `site`/`base`、引入 CSS 框架、改动内容 schema）**必须先新增或修改 ADR**。§1–§9 是已验收的历史事实记录，除同步事实与标注「已过时」外不得回改。

**⚠️ 本地目录布局已变更（P1 执行后调整）**：本仓库现位于 **`D:\WZC\mypage\WauZonC.github.io\`**（外层 `mypage` 文件夹 + `WauZonC.github.io` 仓库目录）。这是**纯本地存放位置变更，不改变任何发布行为**——GitHub Pages 的 URL 路径只由 GitHub 仓库名决定。

- 仓库名（GitHub 侧，**已创建**）：`WauZonC.github.io`（公开；Pages 来源 = GitHub Actions）
- 线上地址（**已上线，维护中**）：<https://wauzonc.github.io>
- 本地仓库根目录：`D:\WZC\mypage\WauZonC.github.io`
- **工作区状态：🟢 维护阶段（Maintenance）** —— 自 2026-10-11 起；开发阶段 P0–P6 **全部完成**，站点已上线 <https://wauzonc.github.io>，推送 `main` 即自动构建并部署（操作手册：§10）
- 维护期内容基线（对照基准，2026-10-11 实测）：博客 **3** 篇 / 项目 **4** 条 / 构建页面 **8** 个 / `dist` 内 `.js` **0** 个
  - **m2.2 更新（M-1 + M-2 后）**：构建页面 **8 → 13**（+5 条英文镜像路由，见 §4.1）；博客仍 **3**、项目仍 **4**（英文集合 `blogEn`/`projectsEn` 为空，正文待翻译）；`dist` 内 `.js` 仍为 **0**。**页面数基线自此改为 13**
  - **M-4 更新（2026-10-11）**：页面仍 **13**、`.js` 仍 **0**，但**每页 `<script>` 由 2 段变为 3 段**（ADR-12）；新增 `public/images/backgrounds/` 照片池（**当前 3 张**：`default`（原 `background.jpg` 迁入）/ `green-valley` / `colorful-danxia`，共 3.96 MB，EXIF/GPS 全为 0）；**深浅色切换静默**（恒定浅色，代码保留）；`config.ts` 带两条真实日期规则
- 已知未闭合项（维护期待办）：**英文正文翻译**（M-2 只交付了框架，接缝见 ADR-10）；RSS / 站点搜索 / 评论 / 访问统计 / 文章 TOC（§9 开放项 3 → §10.3 候选清单）；手势识别项目缺配图；「本站」项目卡片可补 `repoUrl`；根目录原始照片仍未移出仓库（M-3 遗留项，本轮未擅自删除）
- `demo/` 当前状态（**M-3，2026-10-11**）：**原型的内容已落地到正式站点**（ADR-11）——站点现在就是「液态玻璃 + 照片背景」。`demo/` 保留为**设计过程证据与调参沙盒**（含改造前的毛玻璃对照组 `real-home-plain.html`），按 §10.2 轨道 B 惯例属**临时目录**，正式验收后可删除。
- 文档版本：**v2.6**（2026-10-11，**M-4 已发布**：背景升级为「照片池 + 客户端日期映射 + 随机换背景按钮」，并按要求**静默停用深浅色切换**（保留全部代码、恒定浅色）；新增 **ADR-12**，新增 `src/backgrounds/**`（配置 / 求解 / 运行期脚本生成）、`scripts/**`（导入与同步，零 npm 依赖）、`src/components/BackgroundButton.astro`、`public/images/backgrounds/`；`global.css` 改背景为两个固定层 + `--bg-photo`、给 `@media (prefers-color-scheme: dark)` 加 `gate-dark` 门控；`Header`/`BaseHead`/`BaseLayout`/`i18n`/`package.json` 同步；实测 `pnpm build` 退出码 0 / **13 页** / `dist` 内 `.js` **0** / 每页 `<script>` **3**、**52 组无横向滚动**、**构建期与运行期 1461 天逐日一致**（含真实浏览器）、逐张照片 EXIF/GPS 为 0 且过 WCAG AA；**提交 `167de44` 已推送，Actions run `38142571316` 的 Build/Deploy 均 success，线上 R6 + 14 项接线断言全过**）；上一版 **v2.5**（2026-10-11，**M-3 正式落地**：全站改为 iOS 26 风格**液态玻璃 + 照片背景**（新增 **ADR-11**，取代 ADR-7 的材质与背景）；`src/styles/global.css` 重写材质层（四层 + 4 组角色化滤镜 + 三层兜底），11 个组件/页面改标记，新增 `public/images/background.jpg`（**EXIF/GPS 已清空**），`theme-color` 同步；实测 `pnpm build` 退出码 0 / **13 页** / `dist` 内 `.js` **0** / 产物 CSS 外部请求 **0**、**44 组无横向滚动全过**、**对比度全部过 WCAG AA**（浅色态最低 4.94，深色态最低 7.93）、R5 泄漏扫描 0 命中；**关键发现**：原型的「白玻璃 + 浅色文字」在这张照片上只有约 2.2:1，改为**深色玻璃**后 6.5~6.9:1，故两态玻璃都是深色底；**尚未 `git push`**）；上一版 **v2.3**（2026-10-11，**M-1 + M-2 已发布**：提交 `7b5e9c0` 推送 `origin/main`（`d9f451c..7b5e9c0`），Actions run [`38134469679`](https://github.com/WauZonC/WauZonC.github.io/actions/runs/38134469679) 的 **Build 与 Deploy 两个作业均 success**；**线上 R6 实测**：13 条资源全部 **200**（含 5 条新增 `/en/` 路由）、不存在路径 → **404**、线上 `index.html` 与本地 `dist/index.html` 的 **SHA-256 相同**（`42393CB1…D6C2AF`），并实测线上页面确实带上了两个新按钮与首屏前主题脚本；§10.5 台账两行状态按 §10.4 步骤 7 回填为「已发布」）；上一版 **v2.2**（2026-10-11，**M-1 + M-2 落地**：页头新增「中英文切换」与「浅色/深色切换」两个按钮；新增 **ADR-9**（主题手动切换，取代 ADR-7 取舍第 1 条）与 **ADR-10**（`/`+`/en/` 两套真实路由）；§4.1/4.2/4.3 同步、§1.2 的 R2/R3 基线更新、新增 **§10.6 维护任务执行记录**；本地门禁全绿，**尚未 `git push`**，故 §10.5 状态为「本地已验收 · 待推送」）；上一版 **v2.1**（2026-10-11，维护期**首次发布**：文档同步提交 `98454f6` 已推送 `origin/main`，Actions run `38129131299` **build + deploy 全绿**，本地 R1–R3、R5 与线上 R6 实测通过，线上产物 SHA-256 与 P6 一致）；上一版 **v2.0**（2026-10-11，**工作区状态由「开发」切换为「维护」**：新增 ADR-8「维护模式」、新增 §10 维护阶段操作手册（三条轨道 A 内容 / B 样式 / C 功能 + 立项模板 + 发布流程 + 回滚 + 维护纪律 + 任务台账）、§1.1 增补维护期目标、§1.2 增补维护期回归验收 R1–R6、§6 路线图标注全部完成并冻结、§7 增补 4 行维护期风险、§8 与 §9 按维护边界改写、变更记录 v2.0）；上一版 **v1.8**（P6 完成：远端仓库已创建并推送 `main`，首次 Actions 运行 build+deploy **全绿**；站点 6 条路由实测 200、中文正常、部署产物与本地 `dist` **逐字节一致**；关闭两处开放项——用户决定**不绑定自定义域名**、仓库**公开**）；上一版 **v1.7**（P5 完成：`.github/workflows/deploy.yml` 落地；Action 版本按 Node 24 代际裁定并实测；本地 actionlint 0 告警 + `pnpm install --frozen-lockfile`/`pnpm build` 退出码 0）；上一版 **v1.6**（P4 完成：真实内容上站——博客 3 篇、项目 4 条、`about` 重写；建立"两阶段人工审批 + 发布前泄漏扫描"流程）

---

## 1. 项目目标与成功标准

### 1.1 目标
用 Astro 构建一个内容驱动、默认零客户端 JS 的个人主页，通过 GitHub Pages 用户主站发布，并保证后续可用纯 Markdown 持续增量添加博客与项目条目。

**维护期目标（2026-10-11 起，本阶段的首要目标；开发期目标已达成并转为约束）**：
1. **保持已上线站点可用**：<https://wauzonc.github.io> 持续返回 200；任何改动推送后 Actions 全绿、线上内容与本地 `dist` 一致（R6）。
2. **低摩擦增量**：新增一篇博客 = 新增一个 `.md` 文件（G3 不变），**不需要**改任何 `.astro`；完整流程见 §10.2 轨道 A。
3. **受控演进**：修改主页风格（轨道 B）与新增功能（轨道 C）必须先在 §10.1 立项并写清验收；涉及设计决策的先立/改 ADR。
4. **不退化**：每次发布后 `dist` 内客户端 JS 仍为 **0**、无横向滚动、敏感信息扫描 **0 命中**（即 §1.2 的 R1–R6）。
5. **不做大重构**：维护期以「改不坏」为第一性质，架构性改动另立项目（§8.3）。

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

#### 维护期回归验收（每次发布必跑，v2.0 新增）

> G1–G6 是**上线验收**（一次性历史结论，2026-10-11 已全部通过）；R1–R6 是**回归验收**（维护期每一次改动都要过，包括纯文档改动推送前）。
> 具体执行方法与门禁说明见 §10.4。

| 编号 | 标准 | 验收方式（命令 / 方法） | 基线（2026-10-11 实测） |
|---|---|---|---|
| R1 | 本地构建通过 | `pnpm build` → 退出码 `0`，日志无 `[InvalidContentEntryDataError]` | `8 page(s) built` |
| R2 | 页面数与内容数一致 | `dist` 下 `.html` 文件数 = 路由数；`src/content/blog` 下非 draft `.md` 数 = 文章数 | `.html` **8**；博客 **3**、项目 **4**（2026-10-11 基线）。**M-2 后：`.html` 13**（+5 条英文路由）；博客仍 3、项目仍 4（英文集合为空） |
| R3 | 零客户端 JS 未被破坏（ADR-1） | `(Get-ChildItem -Recurse -File -Filter *.js dist).Count` → `0` | `0`。**⚠️ M-1 后此命令的含义需要正确理解**：命令本身**未变、仍应为 0**，但「零客户端 JS」已不再是字面事实——`src/**` 里有 2 段 `is:inline` 内联脚本（主题切换，ADR-9）。`is:inline` 不产出 `.js` 文件，所以命令返回 0。**禁止**把该命令改写成「HTML 里没有 `<script>`」来掩盖这次变化。**M-4 / ADR-12 后为 3 段**（新增首屏背景与背景按钮各一段，主题那段仍在但不渲染），命令仍为 `0`、每页 `<script>` 计数为 **3** |
| R4 | 无横向滚动 | `pnpm preview` + 同源 iframe 探针，各路由 × 320/390/1440 全部 `scrollWidth <= clientWidth` | 24 组全过（方法见 P4 执行记录） |
| R5 | 无隐私 / 版权泄漏 | 对 `src/`、`public/`、`dist/` 扫描硬红线（手机号 / 学号 / 真名 / 他人姓名 / 成绩 / 身份证 / 入党等）→ **0 命中** | **0 命中**（唯一命中项为用户批准公开的邮箱） |
| R6 | 线上一致且 Actions 绿 | push 后 Actions `build` + `deploy` 全绿；线上关键产物与本地 `dist` 一致（至少核对 `index.html` 的 SHA-256） | run `38128165438` 全绿；`index.html` SHA-256 相同 |

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

### ADR-8：工作区进入「维护阶段」（2026-10-11，用户指示）

- **决策**：站点 <https://wauzonc.github.io> 已上线并验收通过（§1.2），本工作区状态**由「开发」切换为「维护」**。此后所有改动收敛为三条受控轨道：**A 新增内容（博客 / 项目条目）**、**B 修改主页风格**、**C 新增功能**，操作手册见 §10。
- **理由**：开发阶段的 6 阶段路线图已完成，线上站点已是对外服务的既成事实。此时项目的第一性质从「尽快建起来」变为「**改不坏**」——需要的是低摩擦的增量入口（加一个 `.md` 就发布）与明确的门禁（构建、零 JS、无横向滚动、泄漏扫描、线上一致），而不是继续扩张。
- **维护阶段与开发阶段的差别**

  | 维度 | 开发阶段（P0–P6，已结束） | 维护阶段（2026-10-11 起） |
  |---|---|---|
  | 首要目标 | 把站点建起来并上线 | **保持可用 + 受控增量**，不弄坏已上线的东西 |
  | 推进单位 | 路线图阶段 P0…P6（顺序推进） | 维护任务 `M-<编号>`（按需立项，可并行，无固定顺序） |
  | 验收 | 阶段验收 G1–G6（一次性） | **回归验收 R1–R6（每次发布都跑）** |
  | 允许的动作 | 建结构、引入依赖、改 ADR | 加内容（默认）、改样式令牌、按立项加功能；**不做大重构** |
- **硬性约束（维护期）**
  1. **G3 契约不变**：新增博客仍是「加一个 `.md`」——**不得**为了加内容去改 `.astro`。
  2. **零客户端 JS 不变（ADR-1）**：需要 JS 的功能必须先立新 ADR。
  3. **不做大重构**（§8.3）；需要重构时另立项目。
  4. **每次改动先立项**（§10.1），并跑完 R1–R6。
- **放弃的方案**：①「继续按 P 阶段推进」——已无阶段可推，且会诱导无收益的扩张；②「完全冻结、不再改动」——用户明确要求后续仍能加博客、改风格、加功能；③「无门禁的随手改」——公开站点的隐私 / 版权红线与零 JS 契约会被逐步侵蚀。

### ADR-9：主题手动切换（浅色 / 深色）—— 取代 ADR-7 的取舍第 1 条（2026-10-11，用户指示）

- **决策**：在页头右上角新增**手动浅色 / 深色切换按钮**，行为模型 = **默认仍跟随系统**（`prefers-color-scheme`）；**用户点击后锁定其选择并写入 `localStorage`**，此后跨页面、跨刷新保持。纯两态，**不提供**第三个「跟随系统」档。
- **为什么现在做**：用户 2026-10-11 明确要求（同时参考 csdiy.wiki 的实现）。ADR-7 当年把「不加手动暗色切换」写成明确取舍，并留下了条件——「若日后需要手动切换，**必须先新增 ADR 并接受一小段内联脚本**」。本 ADR 就是那个「日后」。
- **与 ADR-7 的关系**：本 ADR **取代**（不删除）ADR-7 取舍第 1 条；ADR-7 的其余内容（玻璃拟态视觉语言、容器 960px、`backdrop-filter` 兜底、零外部请求）**继续有效**。§10.2 轨道 B 约束 3「不新增手动切换按钮」自本 ADR 起同步改写。
- **两个参考实现的评估（用户提供）**
  1. **[csdiy.wiki](https://csdiy.wiki/)（Material for MkDocs）**：页头两个 `type=radio`、`name=__palette`，配 `data-md-color-media` / `data-md-color-scheme`，用 `:has()` 选中后换肤；另用 `__md_get/__md_set` 把选择写进 `localStorage`（key 带 `pathname` 前缀）。→ **采纳其行为模型**（跟随系统 → 点击后持久化）。
  2. **[jh3y《Night && Day Toggle》](https://codepen.io/jh3y/pen/LYgjpYZ)（CodePen `LYgjpYZ`）**：用一个 `[aria-pressed=true] { --dark: 1 }` 的 0/1 变量 + `calc()` 驱动全部过渡，可访问性建立在真实 `<button>` 上。→ **只采纳这个机制**（`aria-pressed` + `--dark`），**不搬它的视觉素材**。
- **明确不做：不原样搬 jh3y 那个动画开关**（4 条实测硬冲突，保留在此以免日后重犯）
  1. 它自带 `body { display: grid; place-items: center; min-height: 100vh; overflow: hidden; background: var(--bg) }`——`overflow: hidden` 会让**整页无法滚动**，`background` 会覆盖 ADR-7 的玻璃拟态渐变背景；
  2. 它是 **hero 级尺寸**（`--width: clamp(200px, 45vmin, 500px)`、`aspect-ratio: 8 / 3`，桌面端约 500×187px），页头塞不下（那里还要放站名 + 4 个导航项）；
  3. 它自带 `:root` 变量（`--bg`/`--color`/`--sun`/`--moon`/`--crater`）与 `color-scheme: light only`，会与 `global.css` 的令牌体系冲突；
  4. 它**缺两个多页站点必需的能力**：没有 `localStorage`（跳一次页面就重置）、没有 `prefers-color-scheme`（会丢掉现有的自动暗色）；素材约 60KB 内联 SVG + 约 500 行 CSS，每页一份，且两条无限动画没有 `prefers-reduced-motion` 兜底。
- **CSS 侧实现（关键决策）：`data-theme` 属性 + `@media` 兜底，放弃 `light-dark()` 方案**
  - 要让选择**同时**受 `prefers-color-scheme` 与用户选择影响，而 CSS **无法把 `@media` 与属性选择器 OR 在同一个规则里**。曾考虑的 `light-dark()` + `color-scheme`（令牌成对声明、零重复）**未采用**：不支持 `light-dark()` 的浏览器会让 `var(--token)` 全部变成 guaranteed-invalid，**整套配色与背景一起失效**（不是「退回浅色」），而本项目把「改不坏」放在第一位。
  - 最终结构：浅色在 `:root`；暗色**出现两处且必须保持同步**——`:root[data-theme='dark']`（手动覆盖）与 `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) }`（未手动选择时跟随系统，**含无 JS 环境**）。这是本 ADR 明确接受的一处重复，理由是**零浏览器特性依赖**；`global.css` 中已就地写明同步要求。
  - `color-scheme` 同步切换（`data-theme='light' | 'dark'`），保证滚动条与表单控件配色一致。
- **JS 侧实现**：仅两段 `<script is:inline>`。**必须 `is:inline`**——Astro 默认把 `<script>` 打包成模块并**产出 `.js` 文件**，那会同时打破 R3 与「渲染前应用」的时序。
  1. `BaseHead.astro` 的 `<head>` 内：**渲染前**读 `localStorage.theme`，命中即设 `document.documentElement.dataset.theme`（避免首屏闪白/闪黑），并给 `<html>` 加 `js` 类。
  2. `Header.astro` 按钮之后：同步 `aria-pressed` / 无障碍标签 / `theme-color`；点击时翻转 `data-theme` 并写 `localStorage`；无手动选择时监听系统配色变化。
  - 按钮**仅在 JS 可用时显示**（`html.js .theme-toggle`），避免无 JS 环境下出现一个点了没反应的死按钮。文案通过 `data-*` 属性传进内联脚本（`is:inline` 的内容不做模板插值）。
- **约束与已披露的代价**
  1. **ADR-1「默认零客户端 JS」的性质发生变化**：`src/**` 里出现两段内联脚本。但 **R3 的判定命令不变且仍应为 `0`**——`is:inline` 不产出 `.js` 文件，`(Get-ChildItem -Recurse -File -Filter *.js dist).Count` 仍是 `0`。**不得**把该命令改写成「HTML 里没有 `<script>`」来掩饰这次性质变化。
  2. 无 JS 时：回到「浅色 + 跟随系统」的原始行为，主题按钮不显示。
  3. `localStorage` 只存一个枚举字符串（`'light'` / `'dark'`）；无第三方请求、无新依赖、无隐私影响。
- **被放弃的方案**：①原样搬 jh3y 的完整动画开关（理由见上 4 条）；②mkdocs-material 的 radio + `:has()` 全套（需每页输出两个 radio 与两份图标，语义也不如真实 `<button aria-pressed>`）；③三态（浅 / 深 / 跟随系统）——用户本轮选择两态，日后要改再立 ADR；④`light-dark()`（见上，浏览器特性风险不可接受）。
- **归属（MIT）**：机制取自 jh3y《Night && Day Toggle》（CodePen `LYgjpYZ`）。CodePen 公开 pen 默认 **MIT** 许可，可自由使用；仓库为公开站点，故按 MIT 要求在组件注释中保留出处与许可说明。

### ADR-10：中英文双语 = 真实路由（`/` + `/en/`），语言按钮是链接（2026-10-11，用户指示）

- **决策**：语言切换采用**两套真实路由**，而不是在同一页面里用 JS 换字。中文站点保留原路径（`/`、`/about/`、`/blog/<slug>/`、`/projects/`、`/404.html`）；英文站点为 **`/en/` 前缀镜像**（`/en/`、`/en/about/`、`/en/blog/`、`/en/projects/`、`/en/404/`）。页头右上角一个**链接按钮**：中文页显示 `EN`、英文页显示 `中`，点击直接跳到**对应语言的同一页面**。
  - **实测修正（构建后才发现）**：英文 404 页落在 **`/en/404/`** 而**不是 `/en/404.html`** —— Astro 只把**根目录**的 `src/pages/404.astro` 特殊化为 `404.html`，`src/pages/en/404.astro` 只是个普通页面，产物为 `dist/en/404/index.html`。因此两侧语言按钮的地址是 `/404.html` ↔ `/en/404/`（不对称，但两边都是真实存在的页面）。
  - **由此暴露的一个既有局限（不在本次范围内）**：GitHub Pages 对**全站**未命中路径只返回**根** `404.html`（中文版）。所以访问 `/en/does-not-exist/` 会看到中文 404 页，`/en/404/` 只能从中文 404 页的语言按钮或直接输入到达。这是静态托管「只有一个 404 页」的固有限制；要修得在根 404 页做客户端语言判断（等于再引入一段 JS），本次不做，仅如实记录。
- **理由**
  1. **与参考实现一致**：csdiy.wiki 正是这么做的——它的语言按钮是一个下拉，里面是 `<a href="/" hreflang="zh">简体中文</a>` 与 `<a href="/en/" hreflang="en">English</a>` 两个**真实链接**，两套页面各自完整（**不是** JS 换字）。
  2. **语言切换零 JS**：链接天然可用——JS 失效、爬虫抓取、新标签页打开、分享链接全都正常。
  3. **SEO 正确**：每页可输出 `hreflang` 互指，避免「一个 URL 两种语言」的歧义。
  4. 静态站无运行时成本，与 ADR-1 的取向一致。
- **本期范围（用户 2026-10-11 明确选择「先搭框架」）**
  - **交付**：`/en/` 全部路由 + 英文界面文案（导航 / 页脚 / 按钮 / 页面标题）+ 语言切换按钮 + 内容接缝（`blogEn` / `projectsEn` 两个集合）+ `hreflang`。
  - **暂不交付**：英文**正文**（3 篇博客、4 个项目、`about` 正文的翻译）。英文页在正文位置显示**明确的「翻译中」提示 + 回到中文版的链接**，**不复用中文正文**（避免重复内容与中英混排）。
  - **接缝用法（日后轨道 A 的扩展）**：新增一篇英文文章 = 在 `src/content/blog-en/` 放一个**与中文同名**的 `.md`（如 `cuda-notes.md`），frontmatter 与中文 schema 完全一致。`/en/blog/<slug>/` 会自动生成，**不需要改任何 `.astro`**——G3 契约在英文侧同样成立。
- **新增集合（附加变更，向后兼容）**
  - 新增 `blogEn` / `projectsEn`，`base` 分别为 `./src/content/blog-en` 与 `./src/content/projects-en`；**与既有 `blog` / `projects` 共用同一份 zod schema**（提取为 schema 常量，避免两处漂移）。
  - **刻意用「兄弟目录」而非 `blog/en/` 子目录**：`blog` 的 glob 是递归的 `**/*.md`，若把英文放进 `src/content/blog/en/`，英文文章会被中文集合**一并收走**（同一篇出现在两种语言里）。兄弟目录从根本上避免这个冲突，且**既有 loader 的 `base` 与 pattern 零改动**。
  - 英文条目与中文条目**同名即同 slug**，语言互跳天然一一对应。
- **URL 契约**
  - 中文路径**一个都不变**（ADR-8「不动已上线 URL」的延续）。
  - 英文一律 `/en/` 前缀；`/en/` 本身是英文首页。
- **被放弃的方案**
  1. **JS 换字（`data-i18n` + 字典）**：需要客户端 JS（再碰 ADR-1）、SEO 差（爬虫只看到单一语言）、Markdown 正文无法参与、首屏可能闪原文。
  2. **只切换界面文字、正文永远中文**：与 csdiy.wiki 的做法不符，英文读者依然读不到内容，属半成品。
  3. **Astro 内置 i18n 路由（`i18n` 配置 + `prefixDefaultLocale`）**：会改动 `astro.config.mjs` 与既有中文 URL 的生成方式，风险与收益不匹配（§8.3 不做大重构）；手工镜像路由的产物形态完全可控。
  4. **第三方翻译服务 / 中英并排**：引入外部依赖与隐私问题，阅读体验也差。
- **约束**
  1. 语言按钮**必须总是**落在存在的页面上：若目标语言没有对应内容（如某篇博客暂无英文版），回退到该语言的列表页 / 首页，**不得**产生死链。
  2. `hreflang` 只在**双侧都存在**的页面输出；仅单侧存在的页面输出 `x-default` 指向中文版。
  3. 英文页的 `<html lang>` 必须是 `en`；中文保持 `zh-CN`（ADR-6 不被推翻）。

### ADR-11：视觉方案改为「液态玻璃 + 照片背景」—— 取代 ADR-7 的材质与背景（2026-10-11，用户指示）

- **决策**：把全站材质由 ADR-7 的**毛玻璃拟态**换成 **iOS 26 风格「液态玻璃」**，同时把页面背景由「多层柔光渐变」换成**用户自拍的照片**。用户在原型的两个背景版本中**明确选定 `real-home-photo.html` 这一版**（整页照片，滚动时照片固定）。
- **为什么现在做**：用户 2026-10-11 要求「把当前的毛玻璃改成 iOS26 那种液态玻璃效果」。先按要求做了原型（`demo/`，见 §10.5 的 M-3 与 §10.6 的执行记录），用户看过后选定照片背景版并要求正式落地。
- **与 ADR-7 的关系**：本 ADR **取代**（不删除）ADR-7 的**视觉语言部分**（毛玻璃材质、柔光渐变背景、`.glass` 工具类、`--glass-*` 令牌）。ADR-7 的以下内容**继续有效**：
  1. **`backdrop-filter` 的 `@supports not (...)` 兜底不得删除**（不支持的浏览器降级为不透明玻璃）；
  2. **零外部请求**（不引外部字体 / CDN；照片是本地文件）；
  3. 大圆角、药丸式导航与标签的**形态语言**；
  4. 文本类页面用 `.measure`（44rem）约束行宽、`.container` 维持 960px。
- **材质实现（四层）**：真折射只是其中一层，其余三层保证观感不塌。

  | 层 | 内容 | 生效范围 |
  |---|---|---|
  | ① 折射 | `backdrop-filter: blur() url(<SVG 滤镜 data URI>) blur()` | **仅 Chromium** |
  | ② 磨砂 | `blur + saturate + brightness` | 所有支持 `backdrop-filter` 的浏览器 |
  | ③ 镜面 | `::before` 斜向高光 + 顶部径向光晕 | 同上 |
  | ④ 厚度 | 内侧顶部高光 + 发丝内描边 + 双层外投影 | 全部浏览器 |

- **位移贴图与滤镜（关键决策）：由 SVG 图元现拼、编码为 data URI 挂在 `backdrop-filter` 上**
  - 贴图 = `feImage` 引用一张由 `linearGradient` + `feGaussianBlur` + `mix-blend-mode: screen` 拼出的 SVG（中心中性灰 = 零位移，边缘渐变 = 折射方向）。
  - 滤镜整体也是一个 data URI（`url("data:image/svg+xml;utf8,<filter>#d")`）。
  - **好处**：**无需在文档里插入 `<svg>`、无需 JS 注入、零 DOM 污染、零外部请求**，且天然可被 `@supports` 门禁。
  - **被放弃的方案**：① 引入 [rdev/liquid-glass-react](https://github.com/rdev/liquid-glass-react)（需 React 19 + `react-dom` peer 依赖 + 客户端 JS + `ResizeObserver` 逐实例重算，与 ADR-1 / ADR-5 / §8.1 直接冲突）；② 把 `<svg><filter>` 写进每个页面的 DOM 再用 `url(#id)` 引用（会在全站每页重复一份标记，且需处理 id 冲突）；③ WebGL / Canvas 方案（无法采样 DOM 背景像素，且要重建页面）。
  - **借鉴来源（均为 MIT，未复制其代码文件，只借鉴公开的视觉配方与工程结论）**：`rdev/liquid-glass-react` 的视觉配方（内置贴图、三次 `feDisplacementMap` 做色散、`feColorMatrix` 抽 R/G/B、`feBlend screen` 合成、边缘掩膜 + 干净中心）；`nikdelvin/liquid-glass` 的「滤镜 = data URI」实现路线；`SquareMediaGroup/glassfx` 的工程取舍（`@supports` 门禁、Safari/Firefox 降级、≤768px 关折射、honour `prefers-reduced-transparency`）。
- **新增令牌（`src/styles/global.css`）**：`--lg-tint` / `--lg-alpha` / `--lg-saturate` / `--lg-brightness` / `--lg-sheen` / `--lg-rim` / `--lg-hair` / `--lg-radius` / `--lg-shadow`，以及照片背景的 `--photo-dim` / `--photo-position`。**`--glass` / `--glass-solid` / `--glass-border` 废弃**（`--tint-soft` 接任「极淡表面」的通用半透明色，供页脚与标签等轻量场景使用）。
- **新增工具类**：`.lg`（材质底座）、`.lg-refract`（挂折射，默认卡片用）、`.lg-panel`（大面板）、`.lg-header`（sticky 页头）、`.lg-pillbtn`（药丸）。**`.glass` 工具类删除**；`.card` / `.panel` 保留但**只负责间距**，材质交给 `.lg`。
- **照片背景**：`public/images/background.jpg`（2560×1920 / 1.6 MB，**已清空全部 EXIF**），`body` 上以 `linear-gradient` 压暗 + `background-attachment: fixed` 铺满。
  - **⚠️ 为什么必须清空 EXIF**：用户原图（`backgroud_chunk.jpg`）的 EXIF 带 **GPS 36°02′59.4″N / 120°20′36.0″E**、拍摄时间与设备型号，而本仓库是**公开**的，提交即等于公开拍摄地点。原图已用 `.gitignore` 精确忽略（`/backgroud_chunk.jpg`），**不得提交**；入库的是清空元数据的副本。与 §10.2 A1「图片先剥离 EXIF」的既有要求一致。
  - **⚠️ 文字颜色必须随背景一起改**：原图是**深色照片**（礁石 + 深蓝海面），若沿用 ADR-7 的「浅色底 + 深色文字」，正文会**明显读不清**（原型阶段实测踩到）。故全站文字令牌改为**浅色**，并给标题加一层极淡描影。
  - **⚠️ 玻璃必须是深色底（实测结论）**：照片底 + 浅色文字的前提下，「浅色（白）玻璃」在照片较亮处只有约 **2.2:1**，**且提高不透明度也救不回来**（白玻璃越实越雪白，反而降到 1.9:1）。改成深色玻璃后升到 **6.5~6.9:1**。因此**浅/深两态的玻璃都是深色底**，两态的区别改由 `--photo-dim`（0.42 / 0.62）与 `--lg-alpha`（0.44 / 0.58）承担。这是本方案与「浅色主题 = 浅色界面」常规直觉的一次实质偏离。
- **实测依据（为什么值得做）**：折射的可见度**取决于玻璃背后有没有细节**。同一块玻璃、同一材质，只差 `url()` 位移滤镜时的像素差异：

  | 背景 | 差异 > 8/255 的像素 | 最大通道差 |
  |---|---|---|
  | 站点原柔光渐变底 | **0.0%** | 5 |
  | **用户照片** | **35.0%** | 44 |
  | 高频条纹（上界） | 4.0% | 40 |

  即：**在原来的平滑渐变底上换成液态玻璃几乎零收益；换照片底后收益才真正显现。**
- **明确的取舍**
  1. **不引入客户端 JS**：贴图按「名义尺寸」烘焙、由 `feImage width/height=100% + preserveAspectRatio=none` 拉伸，**圆角半径会随元素尺寸缩放**。要逐元素精确需 `ResizeObserver` + JS → 触碰 **ADR-1**，须另立 ADR。
  2. **`corner-shape: squircle` 用 `@supports (corner-shape: squircle)` 门禁**，不支持的浏览器保持普通圆角（贴图里的圆角是圆弧，与超椭圆几何不完全一致，属已知瑕疵）。
  3. **≤768px 关闭折射**（手机卡片密集，折射收益低、GPU 成本高），只保留磨砂 + 镜面 + 厚度。
  4. **暗色模式不再是「换配色」**：背景是照片，浅/深主题都显示同一张照片，暗色只把照片压得更暗、玻璃更实。**这是本方案对 ADR-9 的实质影响，如实记录**：ADR-9 的「手动切换 + 持久化」机制**全部保留不变**，但两态的视觉差异比 ADR-7 时期小。
  5. **照片是位图**：ADR-7 时代的「零位图背景」性质**到此结束**，如实记录；换取的是用户明确选定的视觉效果。照片已压到 1.6 MB 并转为渐进式 JPEG。
- **被放弃的方案**
  1. **保持 ADR-7 的毛玻璃不换**：用户在看过原型后明确要求换成液态玻璃，且实测显示照片底下收益明显。
  2. **只换材质、不换背景**：实测（上表第一行）在平滑渐变底上两种材质几乎无差别，等于白改。
  3. **引入 `liquid-glass-react` 或任何运行时依赖**：与 ADR-1 / ADR-5 / §8.1 冲突。
  4. **把照片做成 CDN 资源**：违背 ADR-7 的「零外部请求」。
- **约束**
  1. `@supports not (...)` 的**不透明兜底分支不得删除**（承接 ADR-7）。
  2. 不得引入客户端 JS 与 CSS 框架（ADR-1 / ADR-5 不变）；滤镜与照片都必须自包含。
  3. 页面结构（§4.1 路由表）与内容契约（G3）**零变化**：本次是纯样式与资源改动。
  4. 照片**必须**保持已清空 EXIF 的副本；根目录原图不得入库。

### ADR-12：背景改为「照片池 + 客户端日期映射 + 随机换背景按钮」，并静默停用主题切换（2026-10-11，用户指示）

- **决策**：把 ADR-11 的「一张写死的照片」升级为**照片池**，并同时做三件事：
  1. **照片池**：`public/images/backgrounds/<id>.jpg`，id 即文件名（`[a-z0-9-]`）；目录里有什么 = 池里有什么（由 `pnpm sync:backgrounds` 扫描成 `src/backgrounds/generated.ts`）。
  2. **按日期固定**：`src/backgrounds/config.ts` 的 `rules` 定义「日期 → 照片」，优先级**从上到下**，支持 `YYYY-MM-DD`（一次性）/ `MM-DD`（每年）/ `0`–`6`（星期几），都没命中则按 `fallback`（`hash` 稳定打散 / `cycle` 按天轮转）兜底。求解函数是**纯函数**，日期由调用方传入。
  3. **页头第二个按钮换成「随机换背景」**（替换原深浅色切换按钮的位置）；深浅色切换**静默**：保留全部代码，但页头不再渲染、`<html>` 不再带 `gate-dark` 类。
- **为什么现在做**：用户 2026-10-11 明确要求「可以更换背景图片；把一个目录作为背景源，我可以上传自己喜欢的照片；把原来深浅色按钮改成随机切换背景按钮；刷新不改变当前背景；按客户端日期设计一个函数，某个日期打开一定是固定一张，并且我可以在本地调整映射值（例如指定某个节假日用某张）」，同时要求「深色与浅色切换静默（保留代码但不在页面上展示），保持当前的浅色状态」。
- **构建期 + 运行期双实现（本 ADR 的核心取舍）**：日期必须取**客户端**的，而站点是**静态**的，所以：
  - **构建期**（`runtime.ts`）：构建机当天算一次，写进内联 `<style>`（`--bg-photo`）与内联 JSON。作用有三 —— 无 JS 时也有确定的一张；构建机与访客同一天时运行期**不需要改任何东西**（不闪图、不多发一次请求）；`<link rel="preload">` 可以预取那一张。
  - **运行期**（`is:inline` 脚本）：读同一个 JSON，用**客户端本地日期**重算，只在与构建期不同才覆写 `--bg-photo`；并读 `localStorage['bg-v1']` 处理「点过按钮」的情况。
  - 两端的算法**只有一份真实来源**：`src/backgrounds/date-map.ts` 里的函数，运行期脚本用的是它的**源码字符串**（不能 import —— 那会产出 `.js` 文件，打破 R3）。
  - **一致性靠测试而不是注释**：`tmp/test_bg_map.mjs` 断言「构建期与运行期在 **1461 天**上给出完全相同的 id 与 reason」；`tmp/probe_browser.py` + `tmp/check_bg_days.mjs` 再断言「**真实浏览器里**跑的产物与 TS 实现逐日一致」（1461 天 0 差异）。
- **优先级与语义**
  1. 当天点过「随机」按钮 → 用它（`persist: 'day'` 时只认**当天**写入的记录，隔天自动回到日期规则）；
  2. 精确日期 → `MM-DD` → 星期几（数组顺序即优先级，`sync:backgrounds` 会拦下「精确日期写在 `MM-DD` 之后」这种永不命中的写法）；
  3. 兜底 hash（FNV-1a）或 cycle —— **同一天在任何设备上恒定同一张**，这是「某天打开一定固定一张」的保证。
- **背景渲染方式：两个固定层交叉淡入（而非直接改 `body` 的 `background-image`）**
  - 层 1/层 2 都是 `position: fixed; inset: 0; z-index: -1; pointer-events: none`，照片 + 压暗渐变都在这两层里（**不重复**）；`[data-active]` 切换可见性，过渡写在**不依赖该属性**的基类规则里（M-3 踩过「叠加选择器把过渡覆盖掉」的坑）。
  - 两层各用一个变量：`--bg-photo`（前层）/ `--bg-photo-back`（后层），初值相同。交叉淡入要求两层**各自持有自己的图**，所以任何写背景的地方都**必须成对更新**这两个变量（首屏内联 `<style>` 与运行期 `apply()` 都是如此）——只写一个会让另一层永远停在初值。
  - **首屏注入必须用 `:root:root` 提高特异性**：Astro 会把打包 CSS 提升到 `<head>` 末尾，而注入的内联 `<style>` 在它之前；两者都写 `:root` 时同优先级、后写的赢，于是注入的当日照片会被 CSS 里静态兜底的 `default.jpg` 静默覆盖（页面看起来完全正常，只是**永远显示兜底那张**）。这个坑实际发生过，见下方执行记录。
  - `background-attachment: fixed` 与 ADR-11 保持一致（滚动时照片不动）。
- **「刷新不改变当前背景」= `localStorage['bg-v1'] = { id, date }`**，键名带 `-v1` 便于日后改语义；无第三方请求、不上传任何数据；隐私模式下 `localStorage` 不可用时降级为「只按日期规则」。
- **隐私门禁（承接 ADR-11 的教训）**：新增 `pnpm add:background -- <文件> --id <slug>`，它调用 `scripts/prepare_photo.py`：**先（可选）把 EXIF 方向烘焙进像素，再剥掉全部元数据**、长边压到 2560、转渐进式 JPEG，然后**重新打开产物实测** `EXIF 0 标签 / GPS 0 条目`，不干净就拒绝写盘。第一张背景图曾带 GPS `36°02′59.4″N / 120°20′36.0″E`，仓库是公开的，因此这条门禁是硬性的；`pnpm check:backgrounds` 与 `tmp/check_bg_privacy.py` 会再验一遍。
- **静默停用主题切换的精确做法（可一行恢复）**：`config.ts` 导出 `THEME_TOGGLE_ENABLED = false`。
  - `false` 时：`Header.astro` **不渲染** `ThemeToggle`；`BaseLayout` 不给 `<html>` 加 `gate-dark` 类；因此 `global.css` 里 `@media (prefers-color-scheme: dark)` 那条**跟随系统**的深色令牌**不生效**，站点恒定浅色。
  - 为什么要门控而不是删代码：否则「系统设为深色的访客」会看到深色外观，却**已经没有按钮可以切回**，直接违背「保持当前的浅色状态」。`gate-dark` 这个类名**不是死代码**，注释里已写明来历。
  - 保留清单（**一行都没删**）：`ThemeToggle.astro` 及其内联脚本、`html:not(.js) .theme-toggle` 样式、`:root[data-theme='dark']` 与 `@media (prefers-color-scheme: dark)` 两处深色令牌、`i18n` 里的 `themeSwitch` 文案、`color-scheme: light dark` 与两条 `theme-color`。
  - `BaseHead` 里**移除了**「读 `localStorage.theme` 并设置 `data-theme`」的 4 行 —— 否则以前点过深色的访客会被**静默锁在深色**且再也无法退出。
- **代价（如实记录）**
  1. **每页 `<script>` 由 2 段变 3 段**（ADR-1 的「零客户端 JS」性质进一步变化）。**R3 的判定命令不变且仍应为 `0`**：`is:inline` 不产出 `.js` 文件。**不得**把该命令改写来掩盖这一点。
  2. **构建期常量会被内联**：实测产物里 `data.persist` 被替换为字面量 `"day"`、函数源码被重排（制表符/CRLF/去注释/加 `/* @__PURE__ */`）。因此**不能假设产物脚本文本与源码逐字节相同**；改 `config.ts` 后**必须重新构建**才会生效（本仓库「推送即重建」，无需额外操作）。
  3. **照片是位图且会随提交累积**：单张软预算 ≤2 MB，池总量软预算 18 MB，`sync` 超预算会告警；替换过的版本**永久留在 Git 历史**（维护期不做历史重写）。
  4. **客户端日期跨时区可能落在不同的一天**：这是「按客户端日期」的题中之义（UTC+8 与 UTC-8 的「今天」不同），已在文档中写明。
- **被放弃的方案**
  1. **构建期决定一切**（不引入运行期脚本）：构建机时区 ≠ 访客时区，无法满足「根据客户端的日期」，且构建产物会被缓存到换日之后。
  2. **运行期 `fetch` 清单/规则**：多一次请求、首屏会闪一帧错图；改为把数据内联进 HTML（数据本身不含隐私，且 `<` 已转义）。
  3. **把映射写进 CSS**：CSS 表达不了「精确日期 / 每年 / 星期几」的优先级，也拿不到客户端日期。
  4. **引入 JS 依赖 / 框架做背景切换**：与 ADR-1 / ADR-5 / §8.1 冲突，且这点逻辑不值得。
  5. **用 `sessionStorage` 或 URL 参数保存选择**：前者一跳页/新标签就丢，后者会污染 URL 契约。
- **约束**
  1. `@supports not (backdrop-filter)` 与 `prefers-reduced-transparency` 的兜底分支**不得删除**（承接 ADR-7 / ADR-11）。
  2. 不引入客户端 JS 依赖、CSS 框架、CDN（ADR-1 / ADR-5 不变）；照片与规则都自包含。
  3. 路由表（§4.1）与内容契约（G3）**零变化**；本次是纯功能与样式改动。
  4. **照片必须经 `pnpm add:background` 导入**（或自行剥净元数据），入库前 EXIF/GPS 必须为 0。
  5. 不可访问的 `config.ts` 规则（写错形状、指向不存在的 id、顺序导致永不命中）必须**构建/同步期报错**，不得静默失效。

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
| `/404` | `src/pages/404.astro` | 自定义未找到页面（Astro 只把**根目录**的 `404.astro` 特殊化为 `404.html`） |
| **— 英文镜像路由（M-2 / ADR-10，2026-10-11 新增）—** | | |
| `/en/` | `src/pages/en/index.astro` | 英文首页（界面文案已英文；正文待翻译，当前显示「翻译中」提示） |
| `/en/about/` | `src/pages/en/about.astro` | 英文关于页（同上） |
| `/en/blog/` | `src/pages/en/blog/index.astro` | 英文文章列表（读 `blogEn` 集合，当前为空） |
| `/en/blog/[slug]` | `src/pages/en/blog/[...slug].astro` | 英文文章详情（`blogEn` 为空 → 不生成任何页面，属预期） |
| `/en/projects/` | `src/pages/en/projects.astro` | 英文项目列表（读 `projectsEn` 集合，当前为空） |
| `/en/404/` | `src/pages/en/404.astro` | 英文 404。**注意**：产物是 `/en/404/`，**不是** `/en/404.html`——Astro 只对根目录的 `404.astro` 做特殊化 |

### 4.2 目录结构（M-2 落地后的实际形态；P2 骨架 + 双语与主题切换）
```
.
├── .github/workflows/deploy.yml
├── scripts/                      # 仓库自带的本地工具（零 npm 依赖）
│   ├── background-photos.mjs     #   sync / check / add —— 照片池维护与规则校验（ADR-12）
│   └── prepare_photo.py          #   剥 EXIF/GPS + 压尺寸 + 实测元数据为 0（ADR-12 隐私门禁）
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── backgrounds/          # 背景照片池：文件名 = id（ADR-12）
│       │   └── default.jpg       #   原 background.jpg 迁移而来（内容未变，EXIF 0）
│       └── pku-table-canvas.png
├── src/
│   ├── backgrounds/              # 背景照片池的配置与求解（ADR-12）
│   │   ├── config.ts             #   ★ 用户唯一需要手改的文件：defaultId / persist / fallback / rules
│   │   ├── generated.ts          #   由 `pnpm sync:backgrounds` 生成，勿手改
│   │   ├── date-map.ts           #   日期 → 照片的纯函数（构建期与运行期共用同一份源码）
│   │   └── runtime.ts            #   生成浏览器端内联脚本 + 计算首屏默认背景
│   ├── components/
│   │   ├── BaseHead.astro        # <head>：注入 bg-config JSON / 当日背景 / 内联脚本；hreflang（ADR-9/10/12）
│   │   ├── Header.astro          # 壳：站名 + 语言感知导航 + 语言按钮 + 背景按钮
│   │   ├── BackgroundButton.astro# 「随机换背景」按钮（ADR-12，取代主题按钮的位置）
│   │   ├── LangSwitch.astro      # 中英文切换按钮（纯链接，零 JS，ADR-10）
│   │   ├── ThemeToggle.astro     # 浅色/深色切换按钮 —— ADR-12 起**静默保留但不再渲染**
│   │   ├── LangNotice.astro      # 英文页的「翻译中」提示（ADR-10）
│   │   ├── NotFoundPanel.astro   # 404 面板（中英共用）
│   │   ├── Footer.astro
│   │   ├── PostCard.astro        # 语言感知（链接前缀 / 日期本地化）
│   │   ├── ProjectCard.astro     # 语言感知（链接文案 / 配图 alt）
│   │   └── ProjectBody.astro
│   ├── content/                  # 内容条目（Markdown）
│   │   ├── blog/                 # 中文博客（既有，未改动）
│   │   ├── blog-en/              # 英文博客镜像（新集合 blogEn，当前为空）
│   │   ├── projects/             # 中文项目（既有，未改动）
│   │   └── projects-en/          # 英文项目镜像（新集合 projectsEn，当前为空）
│   ├── content.config.ts         # Content Layer 集合定义（Astro 7 强制位置，见 4.3）
│   ├── content-types.ts          # 中英集合条目的联合类型 + 集合键映射（ADR-10）
│   ├── i18n/
│   │   └── ui.ts                 # 界面文案字典（zh/en）+ 路由前缀助手（ADR-10）
│   ├── layouts/
│   │   ├── BaseLayout.astro      # lang / altHref / translated 三个与双语有关的 props
│   │   └── PostLayout.astro
│   ├── pages/            # 中文路由，见 4.1
│   │   └── en/           # 英文镜像路由，见 4.1
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
  schema: projectsSchema,
});

// ---- M-2 / ADR-10 新增：英文镜像集合 ----
// 刻意用「兄弟目录」（blog-en / projects-en）而不是 blog/en/ 子目录：
// 中文集合的 glob 是递归的 `**/*.md`，子目录里的英文文章会被中文集合**一并收走**。
// 文件名即 slug，因此 `blog-en/cuda-notes.md` 与 `blog/cuda-notes.md` 天然一一对应。
const blogEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog-en' }),
  schema: blogSchema,
});

const projectsEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects-en' }),
  schema: projectsSchema,
});

export const collections = { blog, blogEn, projects, projectsEn };
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
| `cover` | string | 否 | 卡片配图路径（P4 新增，相对 `public/`） |

**英文镜像集合 `blogEn` / `projectsEn`（M-2 / ADR-10 新增）**
- 字段与 `blog` / `projects` **完全一致**——`src/content.config.ts` 里两套集合**共用同一个 schema 常量**，因此不可能漂移；上两张表同时就是它们的字段表。
- 目录为 `src/content/blog-en/` 与 `src/content/projects-en/`（**兄弟目录**，理由见上方代码注释与 ADR-10）。
- **既有中文集合的 loader / `base` / schema 与 4 个既有 `.md` 零改动**：本次是纯附加变更，没有任何字段从可选变成必填。
- **新增一篇英文文章 = 在 `src/content/blog-en/` 放一个与中文同名的 `.md`**，`/en/blog/<slug>/` 自动生成，**不需要改任何 `.astro`**（G3 契约在英文侧同样成立）。
- ⚠️ **已知噪音（预期内）**：英文集合为空时构建会打印 `[glob-loader] No files found matching "**/*.md"` 与 `The collection "blogEn" does not exist or is empty` 若干条告警（P2 已记录同类行为）。**退出码仍为 0**，不是故障；往 `blog-en/` 放入第一篇 `.md` 后即消失。

**背景照片池的配置（M-4 / ADR-12 新增，`src/backgrounds/config.ts`）**
> 注意：它**不是** Content Collection（不进 `src/content/`、不改 `content.config.ts`、不走 zod 校验），而是普通 TS 模块。
> 原因：照片是**二进制资源**而不是「有条目 frontmatter 的内容」，且它的消费者是**浏览器内联脚本**（需要一份能序列化进 HTML 的最小数据集），走集合 API 只会凭空多一层。

| 字段 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `dir` | string | `public/images/backgrounds` | 照片目录（相对仓库根）；一般不用改 |
| `urlBase` | string | `/images/backgrounds` | 站点路径前缀；一般不用改 |
| `defaultId` | string | `default` | 兜底照片 id；**必须**在目录里真实存在，否则 `sync` 报错 |
| `persist` | `'day' \| 'forever'` | `'day'` | 点过随机按钮后的结果保留多久：当日 / 永久 |
| `fallback` | `'hash' \| 'cycle'` | `'hash'` | 日期规则都没命中时怎么挑（同一天恒定同一张） |
| `fadeMs` | number | `420` | 换图交叉淡入时长；`prefers-reduced-motion` 下 CSS 会关掉 |
| `rules` | `{ on, bg }[]` | `[]` | **日期 → 照片**，命中顺序 = 数组顺序；`on` 取 `'YYYY-MM-DD'` / `'MM-DD'` / `'0'`–`'6'` |

- **照片池清单**：`public/images/backgrounds/<id>.jpg`（png/webp 亦可），文件名即 id，规则只允许 `[a-z0-9-]{1,41}`
- **生成物**：`src/backgrounds/generated.ts`（`BACKGROUND_POOL` / `BACKGROUND_IDS`），由 `pnpm sync:backgrounds` 写入，**入库但勿手改**
- **校验**：`pnpm check:backgrounds`（= `sync --check`，不写文件）在「配置与目录不一致」时**非 0 退出**；`sync` 还会拦下非法 `on` 形状、`'06'` 这类会静默失效的星期几写法、指向不存在照片的 `bg`、以及「精确日期排在 `MM-DD` 之后」的死规则
- **导入**：`pnpm add:background -- <本地文件> --id <slug>`（剥 EXIF/GPS + 压尺寸 + 实测 0 元数据；`--rotate` 烘焙方向、`--force` 覆盖）
- ⚠️ **这四处必须保持一致**：`config.ts` 的规则、目录里的文件、`generated.ts`、以及**已构建的产物**（改规则后要重新构建才生效）

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

## 6. 路线图（开发阶段 P0–P6 —— ✅ 全部完成，已冻结）

> **本节已冻结为历史记录**：P0–P6 **全部完成并于 2026-10-11 上线**（验收结论见 §1.2）。
> **后续任何改动都不再属于本路线图，请到 §10「维护阶段操作手册」立项（`M-<编号>`）**，不要在本节追加步骤、也不要把维护任务写成 `P7`。
> 每个阶段都标注：**产出物 / 写作用域 / 前置依赖 / 验收命令**。

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

### P2.5 —— 风格选型样板（临时目录 `demo/`）✅ 已完成（样例生成）· ✅ 用户已选定「风格 10 玻璃拟态渐变」（见 ADR-7；`demo/` 已于 P3 验收后删除）

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

| **维护期新增内容夹带隐私 / 版权素材** | 站点**公开可检索**，推送即被缓存与归档，**不可逆** | 复用 P4 的**两阶段人工审批**（待审批稿放 `p4-review/`，**不入库**）+ 发布前泄漏扫描 0 命中（R5）。维护期取材红线与 P4 完全一致，见 §10.2 轨道 A 与上方两行 |
| **维护期改样式后只验浅色** | 暗色下玻璃面板发灰、对比度下降，但本地浅色预览「看起来没问题」 | 改任何颜色 / 玻璃令牌后**必须**按 P3 方法强制验**浅色与暗色两套**配色；`@supports not (backdrop-filter)` 兜底分支不得删除（§10.2 轨道 B） |
| **维护期新增依赖但忘记提交 `pnpm-lock.yaml`** | CI 使用 `pnpm install --frozen-lockfile`，锁文件不一致会**直接失败**，站点无法更新 | 新增 / 升级依赖后必须把 `pnpm-lock.yaml` 一并提交；若 pnpm 主版本变化，同步更新 `.github/workflows/deploy.yml` 中 `pnpm/action-setup` 的 `version`（当前 `11.21.0`） |
| **维护期改动已上线文章的 slug（文件名）** | 旧 URL 立即 404，而本站**没有**重定向机制 | 默认**不改**已上线条目的文件名。确需改名时，另在 `src/pages/blog/<旧 slug>.astro` 放一个 meta refresh 跳转页，并在 §10.5 记录；不要只改文件名 |
| **维护期为「顺手」放宽 ADR 约束**（引入客户端 JS / CSS 框架 / 框架集成） | 破坏 G3、G5 与零 JS 契约，且不再可低成本回退 | 任何触碰 ADR-1 / ADR-5 / ADR-7 的改动**必须先立新 ADR 或修改既有 ADR**再动手，见 §10.4 维护纪律 |
| **改暗色令牌时只改一处**（`global.css` 里暗色块有两处：`data-theme='dark'` 与 `prefers-color-scheme` 兜底） | 「手动切换到深色」与「跟随系统变深色」两条路径配色不一致，**且只在其中一条路径下能看出来**，浅色验收完全发现不了 | 改暗色**必须同步两处**；验收时两条路径都要走（手动点击 → 变深色；`--blink-settings=preferredColorScheme` 或不加参数让其跟随系统）。理由与取舍见 ADR-9 |
| **误认为 `/en/404.html` 存在** | Astro 只把**根目录** `404.astro` 特殊化为 `404.html`；`src/pages/en/404.astro` 的产物是 `/en/404/`。按 `/en/404.html` 写链接会得到**死链**（M-2 第一版即踩到） | 英文 404 的地址是 **`/en/404/`**；改语言按钮或新增镜像页后，务必跑「语言按钮落点断言 + 站内链接 200 检查」两道（只做后者会漏掉「指向了错误的但存在的页面」这类 bug） |
| **给英文站加内容时文件名与中文不一致** | 语言互跳靠「同名即同 slug」，文件名不一致会让 `hasTranslation` 判为 false，语言按钮退回列表页（不报错，只是跳不到对应文章） | 英文条目的文件名必须与中文**逐字同名**（如 `blog/cuda-notes.md` ↔ `blog-en/cuda-notes.md`）；模板/脚本化添加时以中文文件名为准 |
| **把 `hreflang` / `canonical` 写成站内相对路径** | 搜索引擎无法把相对地址当作语言互指，双语 SEO 失效（页面本身仍正常，属静默失效） | `BaseHead.astro` 已统一用 `new URL(href, Astro.site)` 补全为绝对 URL；新增语言相关 `<link rel="alternate">` 时保持该写法 |
| **无头截图在 `< 500px` 时的「右侧被裁」假象**（P4 已记录，M-1/M-2 再次踩到） | 误判移动端横向溢出，或误判页头两个新按钮放不下 | 窄屏判断**只用同源 iframe 探针**；要看真实窄屏版式，把 320/390 宽的 iframe 嵌进一个更宽的页面再截图（M-1/M-2 采用此法）。另：`--blink-settings=preferredColorScheme=2` 在本机 Edge 上不生效，深色截图请**不加该参数** |

**维护期风险（M-4 / ADR-12 新增）**

| 风险 | 影响 | 应对 |
|---|---|---|
| **新背景照片夹带 EXIF/GPS** | 仓库公开，提交即公开拍摄地点（第一张图曾带 GPS `36°02′59.4″N / 120°20′36.0″E`，不可逆） | **必须**经 `pnpm add:background` 导入（`prepare_photo.py` 剥净后**再实测** EXIF 0 / GPS 0，不干净拒绝写盘）；`pnpm check:backgrounds` 与 `tmp/check_bg_privacy.py` 再验一遍；**禁止**手工把原图拷进 `public/` |
| **新照片偏亮导致正文对比度跌破 WCAG AA** | 浅色文字叠在深色玻璃上读不清，而**浅色环境下肉眼看不出来**（ADR-11 踩过：白玻璃只有约 2.2:1） | 照片入库前跑 `node tmp/check_bg_contrast.py`：按真实像素合成「压暗 + 玻璃」取最差 10% 区域，正文与次要文字都要 ≥4.5；不达标就换图或先压暗 |
| **改动 `config.ts` 的规则却忘记重新构建** | 规则只在构建期烘焙进页面；只改文件不重新构建 → 线上行为不变，且**没有任何报错**（看起来像「规则不生效」） | 改完必须 `pnpm sync:backgrounds` + `pnpm build`；本仓库「推送即重建」因此推送后自动生效。`sync` 的 `check` 模式在 `generated.ts` 过期时非 0 退出 |
| **规则写错导致永不命中**（`'06'` 当星期几、精确日期排在 `MM-DD` 之后、`bg` 指向已删除的照片） | **静默失效**：页面照常显示兜底照片，看起来「好像没事」，但用户指定的节假日永远不生效 | `pnpm sync:backgrounds` **直接报错拦下**这三类写法（`tmp/check_bg_rules.py` 逐条断言）；改规则后务必看这条命令的退出码 |
| **两个背景固定层破坏层级或引入横向滚动** | 内容被遮住 / 出现横向滚动条 | 层是 `position: fixed; inset: 0; z-index: -1; pointer-events: none`，不参与滚动宽度计算；改这两层后必须重跑 `tmp/probe_browser.py` 的 52 组无横向滚动 + 层级断言 |
| **照片池累积导致仓库膨胀** | 每次替换都会在 Git 历史留下旧版本，**不可回收**（维护期不做历史重写） | 单张软预算 2 MB、池总量 18 MB（`sync` 超预算告警）；替换前先想清楚；必要时先用 `tmp/check_bg_contrast.py` 选图再导入 |
| **误以为 `gate-dark` 是死代码而删掉**（或把深色令牌当「已废弃」清理） | 用户要求的「**保留代码**、静默、需要时可恢复」被破坏；恢复主题切换会变成要重新写一遍 | ADR-12 明确规定：`ThemeToggle.astro`、两处深色令牌、`themeSwitch` 文案**一行未删**；`gate-dark` 是恢复开关的关键，`global.css` 与 `config.ts` 里均已就地写明来历 |
| **把 R3 的判定命令改写来掩盖内联脚本变多** | 「零客户端 JS」的性质被悄然抹掉（ADR-9 已明文禁止） | R3 命令保持原样且必须为 `0`；每页 `<script>` 计数由 2 变 3 这件事**如实记账**在 §1.2 与 ADR-12 |


---

## 8. 明确不做的事（范围边界）

### 8.1 长期边界（开发期 + 维护期共同适用）
- 不改动全局 git 配置（`http.sslverify` 只报告不修改）
- 不改动全局 Node/pnpm 配置
- 不触碰 `D:\WZC` 下除本项目外的任何目录（取材读取**仅限只读**，并须遵守 P4 的素材归属核对与隐私红线）
- 不提交 `dist/`、`node_modules/`、`.astro/`、`p4-review/`、编辑器私有配置（`.gitignore` 已兜住；**不得** `git add -f`）
- 不引入 React/Vue/Svelte 集成，不引入 CSS 框架（ADR-1 / ADR-5）
- 不为本地目录名去设置 `base: '/mypage'`（ADR-2：线上路径只由 GitHub 仓库名决定）

### 8.2 开发期专属（历史条目，已不再适用）
- ~~不在 P0 阶段安装任何依赖或创建远端仓库~~ —— P2（装依赖）与 P6（建远端仓库）均已完成

### 8.3 维护期边界（2026-10-11 起新增）
- **不做大重构**：不重写 `global.css` 体系、不更换站点生成器、不迁移内容目录结构、不改路由表；确实需要时另立项目，不在维护期悄悄做
- **不动已上线的 URL 契约**：不改已上线条目的 slug 与 §4.1 路由表，除非同步给出跳转页并在 §10.5 记录
- **不静默偏离 ADR**：触碰 ADR-1 / ADR-5 / ADR-7 的改动先立或改 ADR
- **不做「顺手」的批量格式化或全仓重排**：会让 diff 不可审，也会掩盖真实改动
- **不回改 §1–§9 的历史结论**：除补充事实、同步状态、标注「已过时」外不改写

---

## 9. 待用户决定的开放项

> **状态说明（v2.0）**：开发阶段的开放项 **1、2、4 均已闭合**；**开放项 3 是维护期唯一仍在开放的「功能候选清单」**，已登记到 §10.3（含代价与是否触碰「零客户端 JS」的评估）。
> 本节保留为历史结论，**不再在此追加新项** —— 新的需求请到 §10.1 立项。

以下事项不阻塞 P1–P3，但在对应阶段前需要用户确认：

1. **自定义域名**：是否绑定个人域名？（影响 P6 与 `astro.config.mjs` 的 `site`）→ **已闭合（2026-10-11，P6 用户决定）：不绑定**，站点以 <https://wauzonc.github.io> 上线，`site` 保持 `https://wauzonc.github.io`，未添加 `public/CNAME`。若日后绑定，须先更新本项与 ADR-2，再改 `site` 并放 `CNAME`
2. **首页布局**：**结论（P2.5 随选型一并决定）：保持多页导航式**——用户选定的风格 10 为多页式样例，`demo/07-onepage.html` 的单页方案不采用；§4.1 路由表维持 6 条路由不变（原问题：单页滚动式还是多页导航式）
3. **是否增加**：RSS 订阅、站点搜索、评论系统（utterances / giscus）、访问统计、文章目录（TOC）
4. **公开范围**：**P4 已逐项确认并闭合**——`about` **不**包含手机号、学号、出生日期、成绩、住址；只用 `WauZonC`（不露真名），只写学院不写年级与专业，不放头像与简历 PDF，公开 `zhongchangwang25@…` 与 `WauZonC@qq.com` 两个邮箱。**仓库是否公开**：**已闭合（2026-10-11，P6 用户决定）＝公开**——免费账号的 Pages 用户主站需要公开仓库，且 `api.github.com` 实测 `private: false`；站点内容已通过 P4 泄漏扫描（`src/`、`public/`、`dist/` 0 命中）

---

## 10. 维护阶段操作手册（2026-10-11 起）

> **本节是维护期的唯一执行入口。** 用户后续提出的「加一篇博客 / 换个主页风格 / 加个功能」都在这里立项、执行、验收。
> 维护任务编号统一用 `M-<序号>`；**一条任务 = 一个可独立验收的最小改动**。开发阶段的 P0–P6 已冻结（§6），维护任务**不叫** `P7`。

### 10.1 立项模板（每次改动的第一步）

先在 §10.5 台账登记一行：

| 编号 | 轨道 | 目标 | 写作用域 | 验收命令 | 风险门禁 | 状态 |
|---|---|---|---|---|---|---|
| M-1 | A / B / C | 一句话说清「改完是什么样」 | 允许写的文件前缀（**越窄越好**） | 至少含 `pnpm build` 退出码 0 + 该改动的专属验证 | 触碰隐私 / 版权 / ADR / 破坏性操作时写明 | 待办 / 进行中 / 已发布 |

**立项规则**
1. **一任务一轨道**：既要加内容又要改样式 → 拆成 `M-x` + `M-y` 两条，便于分别回滚。
2. **写作用域必须显式**：默认只允许改该轨道预定义的作用域（见 10.2）；要超出就在「写作用域」列写明并说明理由（P0–P6 的执行记录都是这样披露的）。
3. **验收命令必须可执行**：写清命令与期望输出（如「`pnpm build` 退出码 0，`8 → 9 page(s) built`」），不写「检查页面正常」这类无法判定的表述。
4. **涉及 ADR 的先改 ADR**：先改 §3 的决策，再动代码。
5. **破坏性 / 不可逆操作先停下问用户**：删除文件、`git reset --hard`、`push --force`、改已上线 URL 均属此类。

### 10.2 三条轨道

#### 轨道 A —— 新增内容（默认轨道，摩擦最低）

**A1 新增一篇博客**
- **写作用域**：`src/content/blog/<slug>.md`（配图另加 `public/images/<name>.png`）
- **步骤**
  1. 新建 `src/content/blog/<slug>.md`。**文件名即 URL**（`/blog/<slug>/`）：只用小写字母、数字与连字符，**不要用中文文件名**
  2. frontmatter 按 §4.3 的 blog schema 填：**必填** `title`、`description`、`pubDate`；可选 `updatedDate`、`tags`、`draft`、`cover`
     - ⚠️ 缺 `description` 等必填字段会让构建**非 0 退出**（Windows 实测 `-1073740791` / `0xC0000409`），这是 G4 的**期望行为**、不是环境故障：看日志里的 `[InvalidContentEntryDataError]` 与字段名去修即可
     - `draft: true` 的文章**不参与构建**，适合先提交草稿
     - `pubDate` 决定 `/blog` 列表与首页「最新文章」的顺序；写成未来日期会让它长期占首位（P4 踩过）
  3. 正文用 Markdown；Obsidian 的 `[[双链]]` 必须转成普通链接或纯文本（P4 约定）
  4. 图片放 `public/images/`，正文用 `/images/<name>.png` **绝对路径**引用；图片先剥离 EXIF（P4 做法）
  5. **不需要改任何 `.astro` 文件** —— 这就是 G3 契约
- **验收**：R1（`pnpm build` 退出码 0，页面数 `+1`）、R3、R4、R5；`dist/blog/<slug>/index.html` 存在；`/blog` 列表出现该篇且排序正确
- **门禁**：内容涉及**本人隐私**（手机号 / 学号 / 成绩 / 住址 / 身份证 / 政治面貌等）或**他人信息与版权素材**（他人姓名清单、合影正脸、期刊摘要与整段中译、课程讲义）时，**必须**先按 P4 方式产出待审批稿（放 `p4-review/`，**不入库**）→ 用户逐项审批 → 只写被保留的内容。红线清单见 P4 执行记录

**A2 新增 / 更新一个项目条目**
- **写作用域**：`src/content/projects/<slug>.md`、`public/images/**`（可选配图）
- **步骤**：按 §4.3 的 projects schema 填写。**必填** `title`、`description`；可选 `tech`、`repoUrl`、`demoUrl`、`featured`、`order`、`cover`；`featured: true` 才进首页精选，`order` 控制 `/projects` 排序
- **已知待补**：手势识别项目缺配图（`vision/` 无任何图片、运行需真实摄像头）；「本站」项目卡片可补 `repoUrl = https://github.com/WauZonC/WauZonC.github.io`（远端仓库已存在）
- **验收**：同 A1

#### 轨道 B —— 修改主页风格（改样式，不改结构）

- **写作用域**：`src/styles/global.css`、`src/components/**`、`src/layouts/**`（**不含** `src/content/**`）
- **首选做法（低成本、易回退）**：只改 `global.css` 顶部 `:root` 的设计令牌（颜色、渐变、圆角、字体栈、`--glass-*`）。想换整体观感，**先改令牌**，不动结构与类名
- **约束**
  1. 不引入 CSS 框架（ADR-5）；不引入外部字体、CDN（维持 ADR-7 / P2.5 的「零外部请求」性质）。
     ⚠️ **「不引入位图背景」这一条自 M-3 / ADR-11 起已作废**（背景就是位图），M-4 / ADR-12 又把它变成**照片池**；
     现行约束是「照片必须是本地文件、逐张清空 EXIF/GPS、单张 ≤2 MB（软预算）」，见 ADR-12 与 §4.3
  2. `backdrop-filter` 的 `@supports not (...)` 兜底分支**不得删除**（ADR-7）
  3. **暗色**：**默认仍自动跟随系统**；手动切换按钮已由 **ADR-9**（2026-10-11）立项落地，**取代** ADR-7 取舍第 1 条。⚠️ 改动暗色令牌时**必须同步 `global.css` 中两处暗色块**（`:root[data-theme='dark']` 与 `@media (prefers-color-scheme: dark)` 兜底），漏改一处会让「手动切换」与「跟随系统」两条路径配色不一致。
     ⚠️ **M-4 / ADR-12 起本条被静默**：两条路径的令牌**必须继续保留**（一行都没删），但「跟随系统」那条被 `html.gate-dark` 门控，默认不生效 —— 站点恒定浅色，界面与改动前一致。
     恢复方式：把 `src/backgrounds/config.ts` 的 `THEME_TOGGLE_ENABLED` 改成 `true`。**不要把 `gate-dark` 当死代码删掉**（那是恢复开关的关键）。
  4. 文本类页面继续用 `.measure` 约束行宽；`.container` 维持 960px（ADR-7）
  5. 新页面**复用**既有工具类（`.glass` / `.card` / `.panel` / `.pill` / `.measure`），不要另起一套卡片样式
- **验收**：R1、R3；**必须浅色 + 暗色两套都验**（浅色用 `--blink-settings=preferredColorScheme=1` 强制，或把产物里的暗色媒体查询改成永不匹配，方法见 P3 记录）；R4 探针三档宽度无横向滚动
- **禁止**：在仓库根重跑 `pnpm create astro`（模板会覆盖 `README.md` / `.gitignore`，P2 已踩过）；改 `astro.config.mjs` 的 `site` / `base` 需先改 ADR-2

#### 轨道 C —— 新增功能（新页面 / 新集合 / 站点能力）

- **前置**：**必须先立项**（10.1），写清范围、验收与回滚方式；**影响 ADR 的先立 ADR**
- **三类常见功能与注意事项**
  1. **新增静态页面**（如 `/uses`、`/links`）：作用域 `src/pages/**`（+ 可选 `src/content/**`）；需同步 §4.1 路由表与 `Header.astro` 导航；先确认导航放得下
  2. **新增内容集合**（如 `notes/`）：作用域 `src/content.config.ts` + `src/content/<集合>/**`；必须用 Astro 7 的 `loader: glob(...)`、`z` 从 `astro/zod` 导入（ADR-4 与 P2 硬性要求）。**改 schema 属接口变更**：已有 `.md` 必须仍能通过校验（只增可选字段），不得把可选字段改成必填
  3. **站点能力**：sitemap / robots.txt / RSS / 搜索 / 评论 / 访问统计 / 文章 TOC（候选评估见 §10.3）
     - **RSS / sitemap / robots.txt / TOC**：可静态集成，代价最低，推荐优先
     - **搜索 / 评论 / 统计**：**大概率需要客户端 JS** → 触碰 ADR-1 的「零客户端 JS」，**必须先立新 ADR** 写明取舍、外部依赖与隐私影响，再实现
     - **评论 / 统计属第三方服务**：需评估隐私（访客数据出境）与可用性（服务停服 / 被墙时的降级）
- **新增依赖的额外要求**：在本节或 §3 记录版本；**提交 `pnpm-lock.yaml`**；CI 用 `--frozen-lockfile`，锁文件不一致会直接失败；若 pnpm 主版本变化，同步 `deploy.yml` 里 `pnpm/action-setup` 的 `version`
- **验收**：R1–R6 全跑 + 该功能的专属验收（新路由 200 / 新 schema 校验 / 第三方不可用时的降级表现）

### 10.3 功能候选清单（来自 §9 开放项 3，用户尚未决定）

| 候选 | 代价 | 是否触碰「零客户端 JS」（ADR-1） | 备注 |
|---|---|---|---|
| RSS 订阅 | 低 | 否 | 可用 `@astrojs/rss`，需新增依赖并提交锁文件 |
| sitemap + robots.txt | 低 | 否 | 可用 `@astrojs/sitemap` |
| 文章 TOC | 低 | 否 | 构建期即可生成 |
| 站点搜索 | 中 | **是** | 需要客户端索引 / 脚本 → 先立 ADR |
| 评论（giscus / utterances） | 中 | **是** | 第三方 + 依赖仓库公开（当前已公开） |
| 访问统计 | 低 | **是** | 引入第三方脚本，需评估隐私 |

### 10.4 发布流程与维护纪律（每次改动都走一遍）

**发布流程**
1. 在 §10.5 立项（定轨道、写作用域、验收命令、风险门禁）
2. 只改写作用域内的文件；**改前先读文件**
3. 本地跑 R1–R5：`pnpm build` → 页面数 / `.js` 计数 → `pnpm preview` + 探针 → 泄漏扫描
4. `git add <明确路径>`（**不要** `git add -A`，避免误纳 `p4-review/` 与临时文件）→ 提交（沿用现有前缀风格：`feat(blog):` / `style:` / `docs(plan):` / `fix:`）
5. `git push origin main` → 等 Actions **build + deploy 全绿**（纯文档改动也会触发一次部署，属预期行为）
6. 线上抽查（至少：目标路由 200；`index.html` 与本地 `dist` 的 SHA-256 是否一致）→ 即 **R6**
7. 回填：§10.5 状态改为「已发布」，并在「变更记录」追加一行

**回滚**
- **首选**：`git revert <sha>` 后重新 push —— GitHub Pages 会按新提交重建，自动回到上一版内容，无需手动操作线上文件
- **仅在确需抹掉历史时**（高风险，**必须先征得用户确认**）：`git reset --hard <sha>` + `git push --force-with-lease origin main`
- 回滚后同样要跑 R1–R6 确认站点已恢复

**维护纪律**
1. **先立项再动手**：没有 `M-<编号>` 的改动不做（唯一例外：修错别字、同步本文件事实这类纯文档改动，可记为单行 `docs` 提交）
2. **写作用域纪律**：一次改动只改立项时写明的路径；需要扩展就**先更新立项行**（P0–P6 的执行记录均如此披露）
3. **不静默偏离 ADR**：要碰 ADR 就先改 ADR
4. **不做大重构、不批量重排格式**（§8.3）
5. **隐私红线优先于进度**：内容有疑问就停下来问用户，不要「先推上去再删」—— 公开站点的推送不可逆
6. **诚实记录**：验收没跑到就写没跑到（P5 曾如实声明远端验收须等 P6），不要写「应该没问题」

### 10.5 维护任务台账

| 编号 | 轨道 | 目标 | 写作用域 | 验收命令 | 风险门禁 | 状态 |
|---|---|---|---|---|---|---|
| M-1 | C | 页头右上角新增**浅色/深色切换按钮**：默认跟随系统，点击后锁定并持久化 | `src/styles/global.css`、`src/components/BaseHead.astro`、`src/components/Header.astro`、`src/components/ThemeToggle.astro`、`src/layouts/BaseLayout.astro` | `pnpm build` 退出码 0；`dist` 内 `.js` 计数仍为 **0**；浅/暗两态无头截图目视；刷新与跳页后选择保持；系统配色改变且无手动选择时跟随 | 触碰 ADR-1（零 JS）与 ADR-7 取舍 1 → **先立 ADR-9**；需 2 段内联脚本 | **已发布** |
| M-2 | C | 页头右上角新增**中英文切换按钮** + `/en/` 全套路由框架（界面文案双语，正文待翻译） | `src/i18n/**`、`src/pages/en/**`、`src/content.config.ts`、`src/content/blog-en/**`、`src/content/projects-en/**`、`src/components/**`、`src/layouts/**`、`src/pages/**`、`src/content-types.ts` | `pnpm build` 退出码 0；页面数 **8 → 13**；5 条 `/en/` 路由均 200；语言按钮在中英两侧都落在存在的页面（无死链） | 触碰 ADR-1 / ADR-6 → **先立 ADR-10**；不得改既有中文 URL；不得把 schema 可选字段改成必填 | **已发布** |
| M-3 | B | 把现有毛玻璃升级为 iOS 26 风格**液态玻璃 + 照片背景**：先做原型 `demo/`（用户选定照片版），按 **ADR-11** 正式落地到站点 | `demo/**`、`src/styles/global.css`、`src/components/{Header,Footer,PostCard,ProjectCard,LangNotice,NotFoundPanel,LangSwitch,ThemeToggle,BaseHead}.astro`、`src/layouts/PostLayout.astro`、`src/pages/{index,about}.astro`、`public/images/background.jpg`、`PLAN.md`、`.gitignore` | `pnpm build` 退出码 0、`13 page(s) built`、`dist` 内 `.js` = **0**；**44 组（11 路由 × 320/390/768/1440）无横向滚动全过**；**对比度实测全过 WCAG AA**（最差 10% 区域：浅色态正文 ≥5.99、次要文字 ≥4.94；深色态 ≥11.15/≥7.93）；R5 泄漏扫描 0 命中且入库照片 EXIF/GPS 为 0 | 触 ADR-7 材质与背景 → **先立 ADR-11**；**照片带 GPS，必须用清空 EXIF 的副本，原图不得入库**；不引入客户端 JS / 框架 / CDN | **已发布** |
| M-4 | C+B | **背景照片池 + 按客户端日期固定某张 + 页头「随机换背景」按钮**；同时按用户要求**静默停用深浅色切换**（保留代码、保持浅色外观） | `src/backgrounds/**`、`scripts/**`、`src/components/{BaseHead,Header,BackgroundButton}.astro`、`src/layouts/BaseLayout.astro`、`src/styles/global.css`、`src/i18n/ui.ts`、`public/images/backgrounds/**`、`package.json`、`PLAN.md`、`README.md`、`docs/操作手册.md` | `pnpm build` 退出码 0、`13 page(s) built`、`dist` 内 `.js` = **0**（每页 `<script>` = **3**）；`pnpm check:backgrounds` 退出码 0；**52 组（13 路由 × 320/390/768/1440）无横向滚动**；**构建期与运行期在 1461 天上逐日一致**（Node + 真实浏览器各一遍）；刷新/跳页保持点击结果、隔天回落日期规则；页头**无**主题按钮且系统为深色时仍保持浅色；逐张照片 EXIF/GPS = 0 且过 WCAG AA | 触碰 ADR-1（内联脚本 2→3 段）与 ADR-9（主题静默）→ **先立 ADR-12**；照片必须经 `pnpm add:background` 导入（GPS 红线）；改规则后必须重新构建 | **已发布** |

> M-1 与 M-2 的写作用域在 `src/components/Header.astro`、`src/components/BaseHead.astro`、`src/layouts/**` 上**重叠**，因此**串行执行**，不做并行写入。两者均属轨道 C，但语言与主题互不依赖，故拆成两条以便分别回滚。
>
> **状态口径说明**：本表原定状态只有「待办 / 进行中 / 已发布」。M-1 / M-2 在本地门禁通过后曾暂记为「本地已验收 · 待推送」；**提交 `7b5e9c0` 已推送 `origin/main`，Actions run `38134469679` 的 Build 与 Deploy 均 success，线上 R6 实测通过**，故按 §10.4 步骤 7 回填为「已发布」。

### 10.6 维护任务执行记录

> 开发期 P0–P6 的执行记录在 §6。维护任务的记录写在这里，格式对齐 P 阶段：产出物 / 实测验收 / 发现的真实问题 / 与设计的偏离 / 遗留项。

#### M-1 + M-2 实际执行记录（2026-10-11）

- **执行方式**：两条任务在**同一轮工作**里落地，但**验收分开做**——先满足 M-1 的全部验收（主题切换），再补齐 M-2 的 `/en/` 路由。原因是两者的写作用域在 `Header.astro` / `BaseHead.astro` / `BaseLayout.astro` 上重叠，强行拆成两次提交只会产生一整轮中间态；**已在 §10.5 披露该偏离**（原计划要求 M-1 完全验收后才动 M-2）。
- **产出物（新增）**：`src/i18n/ui.ts`（界面文案字典 + 路由助手）、`src/content-types.ts`、`src/components/ThemeToggle.astro`、`src/components/LangSwitch.astro`、`src/components/LangNotice.astro`、`src/components/NotFoundPanel.astro`、`src/pages/en/{index,about,projects,404}.astro`、`src/pages/en/blog/{index,[...slug]}.astro`、`src/content/blog-en/.gitkeep`、`src/content/projects-en/.gitkeep`
- **产出物（修改）**：`src/styles/global.css`（主题令牌双块 + `color-scheme` 切换 + `.toggle-btn` + 上移 `.home-grid`/`.project-grid`）、`src/components/{BaseHead,Header,Footer,PostCard,ProjectCard}.astro`、`src/layouts/{BaseLayout,PostLayout}.astro`、`src/pages/{index,projects,404,blog/[...slug]}.astro`、`src/content.config.ts`、`PLAN.md`
- **实测验收（本地，2026-10-11）**
  - `pnpm build` **退出码 0**，`13 page(s) built`；`dist` 下 `.html` **13**、`.js` **0**（R2/R3 ✅）
  - **全部 10 条代表性路由 HTTP 200**（`/`、`/about/`、`/blog/`、`/projects/`、`/404.html`、`/en/`、`/en/about/`、`/en/blog/`、`/en/projects/`、`/en/404/`）
  - **无横向滚动**：同源 iframe 探针 **33 组（11 路由 × 320/390/1440）全部 `scrollWidth <= clientWidth`**，0 失败（R4 ✅）
  - **主题切换（真实浏览器探针，两种系统配色各测一遍）**：未手动选择时 `data-theme` 为空、配色跟随系统（系统浅 → `rgb(234,241,251)`；系统深 → `rgb(11,16,32)`），按钮 `aria-pressed` 与之一致；点击后写入 `localStorage.theme`、`color-scheme` 与 `body` 背景色同步切换；**新开页面（等价于跳页/刷新）首屏即带上 `data-theme`**，无闪色；再点一次可切回；预置 `theme=dark` 后加载英文页同样生效
  - **无 JS 降级**：移除 `js` 类后主题按钮 `display: none`（不出现死按钮），语言按钮仍为 `flex`（纯链接不受影响）
  - **链接完整性**：抓取全部路由的站内链接，**13 个唯一地址全部 200，0 死链**（ADR-10 约束 1 ✅）
  - **语言按钮落点**：11 个页面逐一核对，中↔英互跳全部落在存在的页面上，`allOk = true`
  - **R5 泄漏扫描**：`手机号 / 18 位身份证 / 学号 / 成绩排名 / 政治面貌 / 学号邮箱` 在 `src/`、`public/`、`dist/` **0 命中**；`src/`+`dist/` 内唯一命中项是**用户批准公开**的 `zhongchangwang25@stu.pku.edu.cn`（与 v2.1 基线一致）。`PLAN.md` / `README.md` 里的「学号 / 政治面貌 / 成绩」命中均为**红线规则本身的描述文字**，非真实数据
  - **目视复核**：浅色 / 深色两套首页无头截图；英文首页与 320/390px 窄屏改用**同源 iframe 画布**渲染（见下）
- **发现的真实问题（对后续 agent 有价值）**
  1. **Astro 只把根目录的 `404.astro` 特殊化成 `404.html`**。`src/pages/en/404.astro` 是普通页面，产物是 `dist/en/404/index.html`。第一版把语言按钮指向 `/en/404.html` → **死链**。已在 ADR-10 与 §4.1 记录，最终地址对为 `/404.html` ↔ `/en/404/`。
  2. **`hreflang` 必须是绝对 URL**。`altHref` 传入的是站内相对路径（`/en/`），直接输出会得到 `<link rel="alternate" hreflang="en" href="/en/">`，而中文那条是绝对 URL——两条不对等。已在 `BaseHead.astro` 里用 `new URL(href, Astro.site)` 统一补全。
  3. **语言按钮在有译文的判断上曾写错回退目标**：`PostLayout` 最初用「当前语言的列表页」当回退，导致一篇无英文译文的博客上，语言按钮指向 `/blog/`——**用户正在看的那个页面**（点击等于没反应）。探针按「期望落点」逐条断言才暴露出来。正确做法是回退到**目标语言**的列表页（`/en/blog/`）。**注意：链接完整性检查抓不到这个 bug**——`/blog/` 是 200，只是落点错了。
  4. **`--blink-settings=preferredColorScheme=2` 在本机 Edge 上不生效**（`=1` 浅色有效），深色截图需**不加该参数**（该环境默认即深色）。不要据此以为暗色样式没生效。
  5. **`< 500px` 的无头截图仍不可信**（P4 已记录，本次再次踩到：`--window-size=390` 截出的页头右侧被裁，但 iframe 探针在 390/320 两档都判定无横向滚动）。最终改用**同源 iframe 画布**（把 320/390 宽的 iframe 嵌在 1180 宽的页面里截图）才看到真实窄屏版式——页头在 320px 会自然折成三行（站名 / 导航 / 两个按钮），390px 单行放得下。
  6. **`matchMedia` 可能在内联脚本执行时尚未解析完成**：无头 Chromium 下实测到 `body` 背景已经是深色（CSS 的 `prefers-color-scheme` 已生效），但脚本里 `matchMedia('(prefers-color-scheme: dark)').matches` 仍返回 `false`，于是按钮显示「切换到深色」而页面已是深色——**按钮状态与真实配色不一致**。已在 `ThemeToggle.astro` 增加 `window.addEventListener('load', paint)` 兜底重绘（另有 `change` 监听）。复验方式：把「`aria-pressed` 是否等于背景确为深色」写成**不变量断言**，两种系统配色下各跑两遍，全部 `consistent: true`。**这类不一致浅色验收看不出来**，所以要靠不变量而不是目视。
- **与设计的偏离（均已披露）**
  1. **M-1 与 M-2 合并为一轮实现**（理由见上，§10.5 已注明）。
  2. **`.home-grid` / `.home-column` / `.project-grid` 从页面 scoped 样式上移到 `global.css`**：英文镜像页需要同一套栅格，否则要复制出第二份必然漂移的规则。这会让 `index.astro` / `projects.astro` 各少一段 `<style>`（行为不变）。
  3. **新增 `NotFoundPanel.astro`**：中英 404 共用同一份标记与样式，取代原先内联在 `404.astro` 的写法。
  4. **CSS 重复一处（ADR-9 明确接受）**：暗色令牌在 `global.css` 出现两次（手动 `data-theme` 一块 + 跟随系统兜底一块）。放弃 `light-dark()` 的理由见 ADR-9：不支持它的浏览器会让整套令牌一起失效。**改暗色必须同步两处**，`global.css` 中已就地写明。
- **遗留项（交给后续任务）**
  1. **英文正文未翻译**（用户选择「先搭框架」）：3 篇博客 + 4 个项目 + `about` 正文。接缝已就位——在 `src/content/blog-en/` 放同名 `.md` 即可，无需改 `.astro`。
  2. `/en/does-not-exist/` 会看到**中文** 404 页（GitHub Pages 全站只认根 `404.html`），原因与修法见 ADR-10。
  3. 英文集合为空会让每次构建打印若干 `[glob-loader]` / `collection ... is empty` **告警**（退出码 0，非故障）；放入第一篇英文文章后消失。
  4. 主题按钮是**两态**（浅/深），没有第三个「跟随系统」档；要加需再立 ADR。

#### M-3 原型实际执行记录（2026-10-11，**仅原型，未接入站点**）

- **用户需求**：把当前毛玻璃改成 iOS 26 系统那种液态玻璃效果，参考
  [rdev/liquid-glass-react](https://github.com/rdev/liquid-glass-react)；**先做一版 demo 放在新建的 `demo/` 下，不急于改现有设计**。
- **产出物（新增，6 个文件，全部在 `demo/`）**
  | 文件 | 作用 |
  |---|---|
  | `demo/liquid-glass.css` | 材质层：设计令牌 + 四层材质 + 4 组角色化滤镜 + `@supports` 降级 + 无障碍分支 |
  | `demo/real-home.html` | ★ 真实首页版式 + 液态玻璃 |
  | `demo/real-home-plain.html` | 对照组：同一内容 + 现有毛玻璃 |
  | `demo/index.html` | 参数与观感对比页（四种底频 / 四层材质 / 三种角色 / 参数速查） |
  | `demo/site.css` | 站点自身样式（从 `dist` 产物提取，剥掉 Astro 作用域属性，只为让 demo 能 `file://` 打开） |
  | `demo/README.md` | 方案、参数表、浏览器支持、已量化验收、正式接入路径 |
- **技术路线（与参考实现的关系，均为 MIT）**
  1. **不引入 React、不引入任何依赖**（`liquid-glass-react` 需 React 19 + `react-dom` peer 依赖 + 客户端 JS，
     与 ADR-1 / ADR-5 / §8.1 直接冲突）。只借鉴其**视觉配方**：内置位移贴图、三次 `feDisplacementMap`
     做色散、`feColorMatrix` 抽 R/G/B、`feBlend screen` 合成、**边缘掩膜 + 干净中心**。
  2. **实现路线取自 [nikdelvin/liquid-glass](https://github.com/nikdelvin/liquid-glass)（同样是 Astro 站）**：
     位移贴图由 **SVG 图元现拼**（`feImage` + `linearGradient` + `mix-blend-mode: screen`），
     整个 `<filter>` 编码成 **data URI** 直接挂在 `backdrop-filter: url(...)` 上。
     → **无需在文档里插入 `<svg>`、无需 JS 注入、零 DOM 污染、零外部请求**，比参考实现的注入式做法更干净。
  3. **工程取舍参考 [SquareMediaGroup/glassfx](https://github.com/SquareMediaGroup/glassfx)**：
     折射用 `@supports` 门禁、Safari/Firefox 降级为磨砂、**≤768px 关闭折射**、honour `prefers-reduced-transparency`。
- **实测验收（本地，2026-10-11）**
  - **零脚本**：`demo/` 内 3 个 HTML 的 `<script` 计数均为 **0**；无 `http(s)` 外链、无 `@import`；
    id / 锚点完整；`lg-*` 类全部有定义（自动断言，`tmp/check_demo.py`）
  - **真折射确实发生（A/B 量化）**：同一材质、同一底、只差 `url()` 位移滤镜 → 像素差 > 8/255 的面积 **33.5%**、
    > 32/255 的面积 4.0%；**水平结构强度 10.82（有折射）vs 1.03（纯模糊）= 10.5×**。
    判据是「结构还在但被弯折」，不是「变糊」
  - **无横向滚动**：3 页面 × **9 档宽度**（320/360/390/430/640/768/960/1200/1440）= **27 组全过**，`scrollWidth == clientWidth`
  - **可读性未退化**：同一底、同一文案的 A/B，正文最深像素亮度差仅 **0.4/255**，明暗跨度（stdev）**完全相等**
  - **降级分支可用**：宽窗（1370px）`backdrop-filter` 5002 字符含 `url()`；窄窗（670px）**41 字符不含 `url()`**
  - **浅色 / 深色两态**目视通过；`--force-prefers-reduced-motion` 实测媒体特性为 `true`
  - **站点门禁未破**：`pnpm build` 退出码 **0**、`13 page(s) built`、`dist` 内 `.html` **13**、`.js` **0**（R1/R2/R3 ✅）
  - **写作用域纪律**：`git diff HEAD -- src public astro.config.mjs package.json pnpm-lock.yaml` **无输出**（D8 ✅）
- **发现的真实问题（对后续 agent 有价值）**
  1. **`@media` 内部的 `@supports` 覆盖必须与角色规则同特异性**。≤768px 的「关闭折射」第一版只写
     `.lg-refract`（`0,1,0`），被 `.lg-refract.lg-panel` / `.lg-refract.lg-header`（`0,2,0`）压住，
     **移动端关折射完全没生效**（宽窗与窄窗读到的 `backdrop-filter` 都是 5002 字符含 `url()`）。
     改为逐角色各写一条后窄窗读数 41 字符。**这是本轮唯一的功能性 bug，靠「读计算样式」而不是目视才发现**。
  2. **headless Edge 存在约 504px 的窗口最小宽度**：`--window-size=320/390` 实际得到 `innerWidth=504`，
     据此算出的「无横向滚动」结论**全是假的**。正确做法是用**精确 CSS 宽度的 iframe**，
     再以 `--allow-file-access-from-files` 打开探针页（不加该 flag 时 `file://` iframe 的
     `contentDocument` 为 `null`）。M-1 记录的「同源 iframe 探针」其实依赖这个 flag。
  3. **`demo/` 的样式不能直接引用 `dist` 产物**：两个 demo 页面若各自内联一份产物样式，
     会人为放大 diff、也让 A/B 无法唯一归因；故提取为共享的 `demo/site.css`，
     并**剥掉 Astro 的 `[data-astro-cid-*]` 属性**（demo 复刻真实标记但拿不到那些内容哈希，
     不剥则组件样式全部不命中——第一版页头导航堆成竖排就是这个原因）。
  4. **`backdrop-filter: url()` 的真折射目前仅 Chromium 生效**，Safari / WebKit 侧对应 WebKit Bug 245510，
     W3C SVG WG [issue #1142](https://github.com/w3c/svgwg/issues/1142)（2026-06 提出，**至今 open**）记录该不可互操作性。
     故材质做成四层（折射 / 磨砂 / 镜面 / 厚度），**让观感像 iOS 26 的主要是后三层**，不支持折射的浏览器不会看到空壳。
  5. **折射只有在玻璃背后有高频细节时才可见**（本站背景是平滑柔光渐变）。这是物理限制，
     故 `demo/real-home.html` 特意加了一块标注「demo 专用区块 · 真实站点没有」的高频条纹区，
     用来把 sticky 页头滚动时的折射展示出来——**这是本轮唯一有意偏离真实首页的地方**。
- **与设计的偏离（已披露）**
  1. **`demo/` 里放了一份站点样式的提取物 `demo/site.css`**：它是 `dist/_astro/*.css` 与
     `dist/index.html` 两段页面级 `<style>` 的拼接（生成脚本 `tmp/gen_site_css.py`），
     **不是手写样式**；站点样式一改就需重跑。若日后并入正式改造，该文件应当删除而非维护。
  2. **`.lg` 不能叠加在 `.glass` 上**：`.glass { background: var(--glass) }` 在样式表中位置更靠后，
     会覆盖新材质的底色（本轮原型实测踩到，表现为玻璃变成一块实色深块）。
     正式接入时必须**摘掉** `.glass` / `.card` / `.panel` 再换 `.lg` 角色类，不能只做叠加。
- **遗留项（交给后续任务）**
  1. **尚未接入站点**（用户明确要求「不急于改现有设计」）：`src/**` 零改动。
  2. **正式接入前必须先立 ADR-11**（详见 `demo/README.md` 末节）。
  3. **`demo/` 按 P2.5 惯例属临时目录**：正式改造验收通过后应整目录删除（或先入库以便跨设备复核）。
  4. **贴图按名义尺寸烘焙、由 `feImage width/height=100% + preserveAspectRatio=none` 拉伸**，
     因此**圆角半径会随元素尺寸缩放**。要逐元素精确需客户端按真实尺寸现场生成贴图
     （即 `ResizeObserver` + 一段 JS）→ 触碰 **ADR-1**，需另立 ADR；本轮刻意不做。
  5. **`corner-shape: squircle`（iOS 26 方角，本机 Edge 155 实测支持）与贴图里的 `rx`（圆弧）几何不完全一致**，
     边缘形状有细微出入；要精修需改用超椭圆路径生成贴图。
  6. **滚动性能未实测帧率**：`backdrop-filter` + sticky 页头在长页面滚动时的合成成本需要真机复核后
     再决定是否全站铺开（本原型已把折射限制在 4 类角色并在 ≤768px 关闭）。

#### M-3 正式落地执行记录（2026-10-11，**已接入站点**）

- **用户决定**：在原型两个背景版本中**选定 `real-home-photo.html`**（整页照片 + 液态玻璃），并要求正式改造。
- **先立 ADR 再动代码**（§10.1 规则 4）：先写 **ADR-11**，再改 `src/**`。
- **产出物**：新增 `public/images/background.jpg`（2560×1920 / 1.6 MB / **EXIF 与 GPS 已清空**）；
  `src/styles/global.css` 重写材质层（四层 + 4 组角色化滤镜 + 三层兜底，`.glass` 删除、`.card`/`.panel` 只留间距）；
  11 个组件与页面改标记（Header / Footer / PostCard / ProjectCard / LangNotice / NotFoundPanel /
  LangSwitch / ThemeToggle / PostLayout / pages/index / pages/about）；
  `BaseHead` 与 `ThemeToggle` 的 `theme-color` 同步改为 `#1b2a3d` / `#0d1420`（背景已非浅底，
  地址栏配色必须跟着改，否则移动端会出现一条与页面不符的浅色条）。
- **实测验收（本地，2026-10-11）**
  - **R1**：`pnpm build` 退出码 **0**、`13 page(s) built`
  - **R2/R3**：`dist` 下 `.html` **13**、`.js` **0**；每页 `<script>` 仍只有已知的 2 段 `is:inline`（ADR-9），
    **没有新增任何脚本**；产物 CSS 中**外部 `url()` 0 个、`@import` 0 个**
  - **R4**：**44 组（11 路由 × 320/390/768/1440）`scrollWidth == clientWidth` 全过**
  - **对比度（本轮新增的量化门禁）**：对**实际入库的照片像素**逐元素合成「压暗 + 玻璃」，
    取该区域**最差 10%** 的对比度：

    | 区域 | 浅色态 正文 / 次要文字 | 深色态 正文 / 次要文字 |
    |---|---|---|
    | sticky 页头 | 5.99 / 4.94 | 11.15 / 7.93 |
    | hero 面板 | 6.21 / 5.12 | 11.34 / 8.06 |
    | 文章卡片 | 10.73 / 8.85 | 14.41 / 10.25 |
    | 项目卡片 | 8.15 / 6.72 | 12.84 / 9.12 |

    **全部 ≥4.5（WCAG AA 正文要求）**，最低 4.94。
  - **R5**：手机号 / 18 位身份证 / 学号 / 成绩排名 / 政治面貌 / 入党 / 住址 在 `src/`、`public/`、`dist/` **0 命中**；
    邮箱仍只有用户批准公开的两个；**入库照片实测 EXIF 0 标签、GPS 0 条目**
- **发现的真实问题（对后续 agent 有价值）**
  1. **「浅色文字 + 白玻璃」在照片上根本读不清**。第一版照原型照搬，实测导航与标签发灰。
     用真实照片像素做合成计算后确认：同一位置只有约 **2.2:1**（AA 要 4.5:1），
     而且**提高不透明度也救不回来**（白玻璃越实越雪白，反而降到 **1.9:1**）。
     改成**深色玻璃**后升到 **6.5~6.9:1**。因此**浅/深两态的玻璃都是深色底**，
     两态的区别改由「照片压多暗 + 玻璃多实」承担 —— 这是本方案对「浅色主题」直觉的一次实质偏离，如实记录。
  2. **照片最亮处正好在顶部**（海面高光亮度 p90 = 251），而那正是 sticky 页头所在的位置。
     把 `--photo-position` 调到 `center bottom` 也只能把该带压到 p90 = 140，收益有限；
     真正解决问题的是上面那条「深色玻璃」。
  3. **`.glass` 不能只叠加、必须摘掉**：`.glass { background: var(--glass) }` 在样式表中位置更靠后，
     会覆盖新材质的底色（原型阶段就踩到，表现为玻璃变成一块实色深块）。本次是**直接删除** `.glass` 并改标记。
  4. **`.card:hover` 与 `.lg` 特异性相同、且 `.card` 在源序更靠后**：在 `.card:hover` 里重设 `box-shadow`
     会连**未悬浮状态**一起覆盖掉材质的「内侧高光 + 发丝边 + 投影」。最终让悬浮只做 `translateY`，不碰阴影。
  5. **`.lg > *` 需显式 `position: relative; z-index: 1`**：镜面层是 `position: absolute` 的伪元素，
     否则会盖到内容上面。
  6. **`corner-shape: squircle` 必须包在 `@supports (corner-shape: squircle)` 里**
     （Chromium 实测支持，`getComputedStyle` 读出 `superellipse(2)`），否则不支持的浏览器会整条规则失效。
- **与设计的偏离（已披露）**
  1. **ADR-7 时代「零位图背景」的性质到此结束**：背景是 1.6 MB 渐进式 JPEG。
     **零外部请求仍成立**（照片是本地文件），**零客户端 JS 仍成立**。
  2. **浅/深两态的玻璃都是深色底**（理由见上），与「浅色主题 = 浅色界面」的常规预期不同；
     `color-scheme` 仍随主题切换，滚动条与表单控件配色正确。
  3. **`theme-color` 连带改动**（见上）。
  4. **`demo/backgroud_chunk.jpg` 删除**：与 `public/images/background.jpg` 完全相同，
     留两份 1.6 MB 图片没有意义；`demo/liquid-glass.css` 的照片引用已改为相对 `public/` 的路径。
  5. **`demo/site.css` 已重新生成**（它是 `dist` 产物提取快照，站点改了就必须重跑 `tmp/gen_site_css.py`）。
  6. **原型记录里的遗留项 1~3 已由本次闭合**（正式接入、ADR-11、demo 定位），保留原文以便回溯。
- **遗留项（交给后续任务）**
  1. **滚动帧率未实测**（无头环境不可信）：`backdrop-filter` + sticky 页头在长列表滚动时的合成成本需真机复核。
  2. **贴图按名义尺寸拉伸 → 圆角随尺寸缩放**，不做逐元素精确（要精确需 `ResizeObserver` → 触碰 ADR-1）。
  3. **Safari / Firefox 的降级观感未实测**（本机只有 Chromium）。
  4. **根目录的原始照片仍未清出仓库**（只是被 `.gitignore` 精确忽略）；
     建议用户把它移出仓库目录，否则任何 `git add -f` 仍可能带上 GPS。
  5. **`demo/` 的去留**：按 §10.2 轨道 B 惯例属临时目录，正式验收后可删除。

#### M-4 实际执行记录（2026-10-11，**已发布**）

- **用户需求（原话要点）**：可以更换背景图片；深色与浅色切换**静默**（保留代码但不在页面上展示），保持当前浅色状态；把一个**目录**作为背景源、可以上传自己喜欢的照片；把原来深浅色交换按钮改成**随机切换背景**按钮；**刷新不改变当前背景**；按**客户端日期**设计一个函数，某个日期打开网站一定是**固定的一张照片**，并且可以在**本地调整这个映射值**（例如指定某个节假日全部用某一张照片）。
- **先立 ADR 再动代码**（§10.1 规则 4）：先写 **ADR-12**，再改 `src/**`。
- **产出物（新增）**
  | 文件 | 作用 |
  |---|---|
  | `src/backgrounds/config.ts` | ★ 用户唯一手改的文件：`defaultId` / `persist` / `fallback` / `fadeMs` / `rules` + `THEME_TOGGLE_ENABLED` |
  | `src/backgrounds/date-map.ts` | 日期 → 照片的纯函数；**函数源码字符串**供运行期内联脚本复用（两端只此一份真源） |
  | `src/backgrounds/runtime.ts` | 生成浏览器内联脚本；算「构建机当天」的默认背景；导出主题门控类名 |
  | `src/backgrounds/generated.ts` | 由 `pnpm sync:backgrounds` 生成（照片 id 列表 + 体积），入库 |
  | `src/components/BackgroundButton.astro` | 「随机换背景」按钮 + 内联脚本 + 读屏播报区 |
  | `scripts/background-photos.mjs` | `sync` / `check` / `add` 三个子命令：扫描目录、校验规则、导入照片，**零 npm 依赖** |
  | `scripts/prepare_photo.py` | 剥 EXIF/GPS + 压尺寸 + **实测产物元数据为 0**（隐私门禁），并输出亮度摘要 |
  | `public/images/backgrounds/default.jpg` | 原 `public/images/background.jpg` **git mv 而来，内容零改动**（2560×1920 / 1.57 MB / EXIF 0） |
  | `public/images/backgrounds/green-valley.jpg` | 用户 2026-10-11 导入（源 `D:\WZC\mypage\valley.jpg`，**MPO 4096×3072，导入前 15 个 EXIF 标签 / 9 条 GPS**）→ 2560×1920 / 1.19 MB / **EXIF 0 · GPS 0** |
  | `public/images/backgrounds/colorful-danxia.jpg` | 用户 2026-10-11 导入（源 `D:\WZC\mypage\danxia.jpg`，MPO 4096×3072，14 个 EXIF 标签）→ 2560×1920 / 1.19 MB / **EXIF 0 · GPS 0** |
  | `src/backgrounds/config.ts` 的 `rules` | 两条真实规则：`2026-10-01 → colorful-danxia`（精确日期，一次性）、`01-01 → green-valley`（每年元旦）；其余日期走兜底 hash，三张照片各约 1/3 |
- **产出物（修改）**：`src/components/BaseHead.astro`（注入 `bg-config` JSON + 内联当日背景 + 内联脚本；**移除**读 `localStorage.theme` 的 4 行）、`src/components/Header.astro`（主题按钮改由 `THEME_TOGGLE_ENABLED` 门控 + 渲染背景按钮）、`src/layouts/BaseLayout.astro`（`html` 加 `gate-dark` 门控类 + 两个背景固定层）、`src/styles/global.css`（`--bg-photo` / `--photo-fade`、两个 `.bg-layer`、`@media` 深色块加 `.gate-dark` 门控、`html:not(.bg) .bg-toggle`）、`src/i18n/ui.ts`（`backgroundSwitch` 文案）、`package.json`（3 个新脚本）、`README.md`、`docs/操作手册.md`（新增第 3 章「背景照片」并把后续章节顺延）。
- **实测验收（本地，2026-10-11）**
  - **R1/R2/R3**：`pnpm build` 退出码 **0**、**13 page(s) built**；`dist` 内 `.html` **13**、`.js` **0**；每页 `<script>` 计数 **3**（原 2 段 + 背景一段），页面结构断言逐页通过（两个 `.bg-layer`、`#bg-config`、`#bg-toggle`、**无** `#theme-toggle`、无 `localStorage.getItem('theme')`）
  - **R4**：`python tmp/probe_browser.py` 用**真实浏览器 CDP** 实测 **52 组（13 路由 × 320/390/768/1440）`scrollWidth <= clientWidth` 全过**
  - **日期映射一致性（本轮新增的核心门禁）**：`tmp/test_bg_map.mjs` 断言「构建期与运行期在 **1461 天**（2024–2027）上 id 与 reason 完全相同」，并覆盖精确日期 / 跨年 `MM-DD` / 闰日 / 星期几 / 兜底 hash 分布（5 张照片各出现 56–116 次，未退化）/ `cycle` 轮转 / `stored` 的当日与跨天语义 / 空池与打错字的 `defaultId`
  - **真实浏览器里的产物**：`tmp/probe_browser.py` 在页面内跑同一批日期并导出，`tmp/check_bg_days.mjs` 与 TS 实现比对 → **1461 天 0 差异**
  - **交互语义**：连续点 24 次按钮 → 每次都换了一张（`['default','charlie','alpha','bravo','default','bravo', …]`，无「点了没反应」）、抽到的都在池内、写入 `localStorage['bg-v1']`、读屏播报为「背景已更换为 …」；**刷新后与跳页后背景不变**；把存储日期改成 `2000-01-01` 后**回落日期规则**
  - **静默生效**：DOM 中**没有** `#theme-toggle`、`data-theme` 未设置；`html` 无 `gate-dark`；**系统配色实测为深色**时 `--photo-dim` 仍是 `0.42`、`body` 底色仍是 `rgb(13,20,32)`、玻璃区配色与改动前一致（即门控真的生效，不会被系统深色带走）
  - **对比度（逐张门禁）**：`tmp/check_bg_contrast.py` 对 `default.jpg` 用真实像素合成「压暗 + 玻璃」，取最差 10% → 页头 5.99/4.94、hero 6.20/5.12、文章卡 10.73/8.85、项目卡 8.14/6.71，**与 M-3 记录值一致（仅浮点末位差）**
  - **隐私与体积**：`tmp/check_bg_privacy.py` → 池内每张 **EXIF 0 / GPS 0**、单张 ≤2 MB（池总量 1.57 MB / 1 张）；`src/`、`public/`、`dist/`、`scripts/` 硬红线扫描 **0 命中**
  - **导入管道端到端演练**：用一张**带 GPS 4 条目 + 3 个 EXIF 标签**的合成照片跑 `pnpm add:background` → 产物 `EXIF 0 / GPS 0 -> CLEAN`；导入后 `pnpm check:backgrounds` **按预期失败**（`generated.ts is out of date`），`sync` 后 2 张照片入池、构建 13 页、探针全过；演练产物已删除并重新 `sync` 回单张池（`git status` 确认干净）
  - **规则校验门禁**：`tmp/check_bg_rules.py` 用 `RULES_JSON` 覆盖（**不改动入库的 config**）逐条断言：空规则/合法 `MM-DD`/精确日期在前 → 通过；精确日期排在 `MM-DD` 之后、`'06'` 两位星期几、`'7'` 越界、`'1-1'` 残缺、`bg` 指向不存在照片、`bg` 非法 id → **全部按预期非 0 退出**
- **发现的真实问题（对后续 agent 有价值，本轮的坑几乎都在「静默失效」这一类）**
  0. **【最重要】注入的首屏背景被提升后的打包 CSS 静默覆盖**：Astro 会把打包 CSS 提升到 `<head>` **末尾**，而注入的内联 `<style>` 在它**之前**；两者都写 `:root` 时同优先级、**后写的赢**，于是「按日期算出的那张」被静态兜底 `default.jpg` 覆盖 —— 页面看起来完全正常，只是**永远显示兜底那张**（首屏、无 JS、K 上的实际显示全是错的）。发现方式：真实浏览器探针同时读 `getComputedStyle(root).getPropertyValue('--bg-photo')` 与 `__dshBg.current()`，两者**不一致**（前者 default、后者 green-valley）；纯静态检查完全看不出来。修法：内联样式改用 `:root:root`（特异性 0,2,0）+ 运行期脚本在结果与构建期不同时用元素内联样式兜底。回归门：`tmp/probe_browser.py` 新增「可见层必须真的显示算出来的那张」，`tmp/check_bg_dist.py` 断言内联样式确实是 `:root:root`。
  1. **`new Function` 拿到函数声明的两种错法都会静默返回 `undefined`**。实测对照：`new Function('a','b','c', 声明源码)` 与 `new Function('a','b','c', '('+源码+')')` 都返回 `undefined`（函数体只是一条声明语句）；后者再加 `()` 直接抛 `(intermediate value)(...) is not a function`；**唯一可用的是 `new Function('return (' + 源码 + ')')()`**。第一版两种都踩过 —— 现象是**按钮完全没反应、`__dshBg` 从未被赋值**，而页面看起来一切正常（因为首屏背景来自构建期注入的 CSS，被这层「兜底」掩盖了）。现在 `tmp/probe_fnrule.mjs`（单元）、`tmp/test_bg_map.mjs`（产物）、`tmp/probe_browser.py`（真实浏览器）三道门分别拦住它。**教训：静态检查与「页面看起来对」都抓不到这类 bug，必须有真实浏览器探针。**
  2. **`--bg-photo` / `--bg-photo-back` 必须成对更新**（见 ADR-12 的渲染方式一节）：首屏内联样式与 `apply()` 若只写一个，另一层会停在旧值 —— 这是第 0 条的另一半成因。
  3. **Astro/Vite 会对 `is:inline` 脚本的内容做一次打印重排，并把构建期常量内联进脚本**：实测产物里出现制表符缩进、CRLF、单行 `return` 被加上花括号、注释被删、`/* @__PURE__ */` 被插入、括号被去掉，且 `backgroundData.persist` 被替换成字面量 `"day"`（因为数据来自 `config.ts`）。因此**不能断言产物脚本与源码逐字节相同**；`tmp/test_bg_map.mjs` 的断言相应改为「行为等价」（1461 天逐日一致）+「构造方式与站点相同」。
  4. **生成内联脚本的模板字符串里不能出现反引号**：注释里写反引号会提前结束模板字符串，报错位置指向**下一个** token，误导性极强（本轮被误导了两次）。已在 `runtime.ts` 就地写明，并可用「模板内反引号计数必须为 2」自检。
  5. **验收探针必须从「配置/目录」推导期望值，不能把某次的数据写死**：导入第二批照片后，`check_bg_dist.py` 与 `probe_browser.py` 里「ids 只有 default」「默认照片 = default」「抽到的都在真实池内」等断言全部变成假失败。已改为：从 `config.ts` + 目录推导 ids/rules/期望照片，并用「可见层 = current()」这类不变量断言。
  6. **`tmp/probe_browser.py` 的 `os.chdir(DIST)` 会改变进程工作目录**：后续用相对路径读 `dist/index.html` 的脚本随之失败（`ENOENT`）。改为给 `SimpleHTTPRequestHandler` 传 `directory=DIST`，不 `chdir`。
  7. **浏览器缓存会让探针量测到上一版产物**：本地静态服务必须发 `Cache-Control: no-store`，否则「重建 + 重跑探针」会静默地验证旧构建。
  8. **探索时踩到的两个次要坑**：① 星期几规则写成 `'06'` 会被当成「6 月某日」的残缺写法而**永不命中**（本轮自测里就写错过，现已由 `sync` 直接报错拦下）；② 配置解析器必须**先剥注释**，否则 `config.ts` 里注释掉的示例规则会被当成真规则，`sync` 会要求并不存在的照片。
- **与设计的偏离（均已披露）**
  1. **背景改用两个固定层 + 交叉淡入**，而不是（计划里写的）`body::before/::after` 双层。原因：`body` 上会各自触发属性的重新计算与重复请求，且 `::after` 需要处理层级；改为两个显式 `.bg-layer` 元素后层级、可见性、过渡都能用普通选择器明确表达。代价是**每页多两个空元素**（`aria-hidden`、`pointer-events: none`），以及两层各用一个变量（`--bg-photo` / `--bg-photo-back`，**必须成对更新**）。
  2. **`persist` 语义定为「当日有效」**（`config.ts` 可改成 `'forever'`）：这样「刷新不变」与「某日期一定是固定一张」不再互相打架 —— 当天点过就保持你点的那张，隔天回到日期规则。
  3. **`add:background` 与 `sync:backgrounds` 走 Node + Python（Pillow），未新增任何 npm 依赖**（Pillow 是本机已有、且 M-3 的剥 EXIF 就用的它）；子进程输出用临时文件回传，避免管道捕获限制。
  4. **`docs/操作手册.md` 一并更新并纳入本次提交**（新增第 3 章、后续章节顺延）：该文件此前是**未跟踪**状态（上一轮工作产物），本轮把它与本次文档改动一起提交，属写作用域扩展，在此披露。
  5. **验收探针全部改为「从 config + 目录推导期望值」**（导入第二批照片后暴露了写死断言的假失败），并新增两条不变量回归门：「可见层显示的必须等于 `current()`」与「内联样式必须是 `:root:root`」。
  6. **`default.jpg` 暂时保留在池内**（三张并列）：它是 ADR-11 的原始照片，作为「兜底/对照」留着；若要把它移出池，删文件 + `pnpm sync:backgrounds` 即可（记得把 `defaultId` 指向一张仍存在的照片）。
  7. **`demo/`、`tmp/`** 未纳入提交（`demo/` 是 P2.5 惯例的临时目录；`tmp/` 已在 `.gitignore`）；本轮所有验收探针都放在 `tmp/` 下（`test_bg_map.mjs`、`check_bg_days.mjs`、`check_bg_dist.py`、`check_bg_contrast.py`、`check_bg_privacy.py`、`check_bg_rules.py`、`probe_browser.py`、`probe_fnrule.mjs`、`make_fixture.py`、`verify_live_bg.py`、`shot_live_bg.py`），可随时重跑但不入库。
- **遗留项（交给后续任务）**
  1. **手机端性能未真机复核**：仍是 `background-attachment: fixed` + 1.6 MB 照片（M-3 的遗留项 1 未变，本轮也未新增压缩档位）。
  2. **不做多分辨率 `srcset`**：池内照片统一 2560px 长边，窄屏也下同一张；若要省流量需引入响应式图片（另立项）。
  3. **根目录原始照片仍然在**（`.gitignore` 精确忽略，M-3 遗留项 4 未闭合）：建议用户把它移出仓库目录；本轮**未擅自删除**（属破坏性操作，PLAN.md §10.1 规则 5）。
  4. **照片池的 Git 体积**：每次替换都会在历史里留下旧版本，不可回收（维护期不做历史重写）；`sync` 只做软预算告警（单张 2 MB / 总量 18 MB）。
  5. **`tmp/probe_browser.py` 依赖 CDP + 本机 Edge 路径**，不是通用 CI 脚本；若日后要进 CI，需要改成无浏览器依赖的子集（`test_bg_map.mjs` 已经可以无浏览器运行）。

- **发布与线上验收（R6，2026-10-11）**
  - 提交 `167de44`（`feat(bg): 背景改为照片池 + 客户端日期映射 + 随机换背景按钮，深浅色切换静默（ADR-12 / M-4）`，17 文件 / `1891 插入 / 55 删除`）已 `git push origin main`（`da6cbc3..167de44`，退出码 0；暂存路径逐个显式列出而非 `git add -A`；提交前把消息文件的 **UTF-8 BOM 去掉**后再核对 —— M-1/M-2 回填时踩过这个坑）
  - Actions run [`38142571316`](https://github.com/WauZonC/WauZonC.github.io/actions/runs/38142571316)（`head_sha=167de44`）**run 与 Build / Deploy 均为 success**
  - 线上 **15 条资源全部 200**（13 条路由 + `/images/backgrounds/default.jpg` + `/favicon.svg`），旧路径 `/images/background.jpg` → **404**，不存在路径 `/no-such-page-xyz/` → **404**
  - 线上 `index.html` 与本地 `dist/index.html` 的 SHA-256 **均为 `7051DF0084A04C29F9D303676FA158C68C34A31D6B5A362F1D1D60B98DEB446E`**（线上 = 本地构建产物）
  - `tmp/verify_live_bg.py` 逐项核对线上 HTML 确实带上了这次的接线（**14 项全过**）：`bg-config` 的 JSON 与 `ids=["default"]` / `persist="day"`、首屏默认背景指向 `backgrounds/default.jpg`、**不再引用旧 `/images/background.jpg`**、两个 `.bg-layer`、`#bg-toggle` 存在而 `#theme-toggle` **不存在**、不再有 `localStorage.getItem('theme')`、带 `__dshBg` 且用「可调用」的形式构造求解函数、`<html>` 未带 `gate-dark`；英文镜像页同样带配置与按钮、无主题按钮
- **第二批照片导入 + 一次线上 bug 修复（2026-10-11 同日，用户提供 `valley.jpg` / `danxia.jpg`）**
  - **导入**（用户要求「先忽略对比度」）：`green-valley`（源 `valley.jpg`，MPO 4096×3072，导入前 **15 个 EXIF 标签 / 9 条 GPS**）与 `colorful-danxia`（源 `danxia.jpg`，14 个 EXIF 标签）→ 各 2560×1920 / 1.19 MB / **EXIF 0 · GPS 0**。`config.ts` 写入两条真实规则：`2026-10-01 → colorful-danxia`（精确日期）、`01-01 → green-valley`（每年元旦）；其余日期兜底 hash，三张照片各约 1/3（实测 730 天分布 239 / 237 / 254）。
  - **对比度实测（虽被要求忽略，仍记录）**：`default` 最差 4.94、`green-valley` 5.73、`colorful-danxia` 5.88 —— **三张实际都 ≥4.5，并未跌破 WCAG AA**；导入脚本的亮度 WARN 只是保守提示（阈值按 `meanLuma > 120` 触发，实测表明这个阈值偏保守，可作为已知的「狼来了」噪音）。
  - **发现并修掉一个线上真实 bug（第 0 条，见上）**：首屏按日期注入的照片**从未真正显示过**，一直是 CSS 里静态兜底的 `default.jpg`。
  - 提交 `93a8e28`（`fix(bg): 修掉首屏背景被提升后的打包 CSS 覆盖（内联样式改用 :root:root），并导入 green-valley / colorful-danxia`，8 文件）已推送；Actions run [`38144356654`](https://github.com/WauZonC/WauZonC.github.io/actions/runs/38144356654)（`head_sha=93a8e28`）**success**。
  - **线上复验**：三张照片资源均 **200**（1650995 / 1250384 / 1246655 字节），旧路径 **404**；线上配置实测 `ids=["colorful-danxia","default","green-valley"]`、两条规则与 `config.ts` 一致；`tmp/verify_live_bg.py` 扩到 **18 项全过**（新增 `:root:root`、成对变量、两张新照片在池内、规则存在）。
  - **线上真实浏览器证据（`tmp/shot_live_bg.py`：把假客户端日期注入到**线上**页面）**：

    | 注入的客户端日期 | 线上解析结果 | 可见层 URL |
    |---|---|---|
    | 不注入（今天 2026-10-11） | `green-valley`（兜底 hash） | `.../green-valley.jpg` ✅ |
    | 2026-10-01 | `colorful-danxia`（**精确日期规则**生效） | `.../colorful-danxia.jpg` ✅ |
    | 2027-01-01 | `green-valley`（**每年 `MM-DD` 规则**在别的年份也生效） | `.../green-valley.jpg` ✅ |

    点击随机按钮：`green-valley → default`，`localStorage` 写入 `{"id":"default","date":"2026-10-11"}`；**刷新后仍是 `default`** ✅

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
| v2.0 | 维护 | **工作区状态由「开发」切换为「维护」**（用户指示：站点已上线）。新增 **ADR-8「工作区进入维护阶段」**（三条轨道 A 内容 / B 样式 / C 功能、维护期与开发期的差别、4 条硬性约束、3 个被放弃的方案）；新增 **§10 维护阶段操作手册**（10.1 立项模板与规则、10.2 三条轨道的写作用域 + 步骤 + 验收 + 门禁 + 禁止事项、10.3 功能候选清单「RSS / sitemap+robots / TOC / 搜索 / 评论 / 统计」含代价与是否触碰零 JS、10.4 发布流程 / 回滚 / 6 条维护纪律、10.5 空台账）；**§1.1** 增补 5 条维护期目标；**§1.2** 新增**维护期回归验收 R1–R6**（构建 / 页面数 / 零 JS / 无横向滚动 / 泄漏扫描 / 线上一致，含 2026-10-11 实测基线：8 页面、博客 3、项目 4、`dist` `.js` 0）；**§6** 路线图标注「全部完成，已冻结」并指向 §10（维护任务不得写成 `P7`）；**§7** 新增 4 行维护期风险（内容夹带隐私素材 / 只验浅色 / 新增依赖未提交锁文件 / 改已上线 slug）；**§8** 拆为 8.1 长期边界 + 8.2 开发期历史条目 + 8.3 维护期边界（不做大重构、不动 URL 契约、不静默偏离 ADR、不批量重排）；**§9** 加状态说明（开放项 1/2/4 已闭合，开放项 3 转入 §10.3）。**未改动任何代码 / 配置 / 内容文件**（`src/**`、`public/**`、`astro.config.mjs`、`package.json`、`pnpm-lock.yaml`、`.github/**` 零改动）；**`README.md` 同批同步**（改为维护阶段状态、补三条轨道表、补新增文章规范与隐私门禁、改写后续计划）——本次提交与推送、线上核验的记录见 v2.1 行 |
| v2.1 | 维护 | **文档同步 + 维护期首次发布**。提交 `98454f6`（`docs(plan): 状态由开发切换为维护（ADR-8 + §10 维护手册 + R1-R6）并同步 README`，2 文件 / `216 插入 / 16 删除`）并 `git push origin main`（SSH，`28e258c..98454f6`）。**本地门禁实测（R1–R3、R5）**：`pnpm build` 退出码 **0**（`8 page(s) built`，2.09 s）；`dist` 下 `.html` **8** = 路由数，博客非 draft **3**、项目 **4**（R2 ✅）；`dist` 内 `.js` **0**（R3 ✅）；对 `src/`、`public/`、`dist/` 扫硬红线（手机号 / 18 位身份证 / 「学号 + 数字」/ 政治面貌 / 成绩排名）**全部 0 命中**，出现的邮箱仅用户批准公开的 `WauZonC@qq.com` 与 `zhongchangwang25@stu.pku.edu.cn`（R5 ✅）。**R4 说明（诚实标注）**：本次**未**改动 `src/**`、`public/**`，构建产物与已通过 24 组 iframe 探针的版本**逐字节相同**，故 R4 由同一性保证，**未**重复起服务实测。**线上门禁实测（R6）**：Actions run [`38129131299`](https://github.com/WauZonC/WauZonC.github.io/actions/runs/38129131299)（`head_sha=98454f6`）**run 与 Build / Deploy 两个作业全绿**（`Install dependencies`、`Build site`、`Upload Pages artifact`、`Deploy to GitHub Pages` 每一步 success）；线上 10 条资源全部 **200**（`/` `/about/` `/blog/` `/projects/` `/404.html` + 3 篇博客详情 + `/favicon.svg` + `/images/pku-table-canvas.png`），不存在路径 `/no-such-page-xyz/` → **404**；线上 `index.html` 与本地 `dist/index.html` 的 SHA-256 **均为** `71B2DAF6AD25D62FF801CF5CCF2F2DD370090AE2E1EFC9456DC41AAB646DB22C`，**与 P6 记录的值相同** → 纯文档改动确实未改变站点产物。**补充记录**：前一条 P6 文档推送（`28e258c`）触发的运行 `38128305072` 亦为 **success**（P6 记录中的「副作用说明」已预测该行为，此处补上实测编号）。**未改动任何代码 / 配置 / 内容文件**；PLAN.md 与 README.md 之外零改动 |
| v2.2 | 维护 | **M-1 + M-2 落地：页头右上角新增「中英文切换」与「浅色/深色切换」两个按钮**（用户 2026-10-11 需求，参考 csdiy.wiki 的实现）。**先改 ADR 后动代码**：新增 **ADR-9**（主题手动切换，**取代** ADR-7 取舍第 1 条）与 **ADR-10**（中英文 = `/` + `/en/` 两套真实路由，语言按钮是纯链接）；§10.5 台账新增 M-1 / M-2 两行并附「写作用域重叠 → 串行」说明；新增 **§10.6 维护任务执行记录**；§4.1 路由表补 5 条英文路由、§4.2 目录树更新、§4.3 新增 `blogEn`/`projectsEn` 集合说明；§1.2 的 R2 基线由 8 页改为 **13 页**，R3 明确标注「命令仍为 0，但零 JS 已不再是字面事实」。**实测（本地）**：`pnpm build` 退出码 **0**、**13 page(s)**；`dist` 内 `.js` **0**；10 条代表性路由全 **200**；**33 组（11 路由 × 320/390/1440）无横向滚动**；真实浏览器探针验证主题「跟随系统 → 点击锁定 → 刷新保持 → 可切回」在**浅色与深色两种系统配色下各通过一遍**，且无 JS 时主题按钮自动隐藏；站内链接 **13 个唯一地址 0 死链**；泄漏扫描 `src/`+`dist/` 仅命中用户批准公开的邮箱。**过程中发现并修正 3 个真实 bug**：① 英文 404 产物是 `/en/404/` 而非 `/en/404.html`（第一版指向死链）；② `hreflang` 输出了相对 URL；③ `PostLayout` 的语言按钮在无译文时回退到了**当前中文页**（点击等于没反应，且链接完整性检查抓不到）。**未推送**（§10.5 状态记为「本地已验收 · 待推送」） |
| v2.3 | 维护 | **M-1 + M-2 发布回填**。提交 `7b5e9c0`（`feat(ui): 页头新增中英文与浅色/深色切换按钮（ADR-9 / ADR-10 + /en 路由框架）`，29 文件 / `1345 插入 / 191 删除`）已 `git push origin main`（`d9f451c..7b5e9c0`，退出码 0；推送前工作树无 `dist/`、`tmp/`、`p4-review/` 混入，暂存路径逐个显式列出而非 `git add -A`）。**发现并修正一处提交卫生问题**：首次提交的消息文件被 PowerShell 写入了 **UTF-8 BOM**，提交标题变成 `<BOM>feat(ui): …`；用 `git cat-file commit HEAD` **逐字节**核对发现（`Format-Hex`/字符串比较会被 PowerShell 的解码器吃掉 BOM 而看不出来），已 `git commit --amend` 去掉 BOM 后重推。**Actions**：run [`38134469679`](https://github.com/WauZonC/WauZonC.github.io/actions/runs/38134469679)（`head_sha=7b5e9c0`）**Build 与 Deploy 均 success**。**线上 R6 实测**：13 条资源全部 **200**（`/` `/about/` `/blog/` `/projects/` `/404.html` `/blog/cuda-notes/` `/en/` `/en/about/` `/en/blog/` `/en/projects/` `/en/404/` `/favicon.svg` `/images/pku-table-canvas.png`）；不存在路径 `/no-such-page-xyz/` → **404**；线上 `index.html` 与本地 `dist/index.html` 的 SHA-256 **均为 `42393CB1580313BA56E44D6AD2D35A9B9BC8AF38584016471CF623D886D6C2AF`**（线上 = 本地构建产物）；线上页面实测带 `lang-toggle`（href `/en/`）、`theme-toggle`、首屏前 `localStorage.getItem('theme')` 脚本与绝对 URL 的 `hreflang="en"`，`/en/` 实测含英文导航与「翻译中」面板。**本次为回填提交（仅 PLAN.md）**，按 §10.4 说明纯文档改动同样会触发一次部署，属预期行为 |
| v2.4 | 维护 | **M-3 液态玻璃原型（仅 `demo/`，未接入站点）**。用户需求：把当前毛玻璃改成 iOS 26 风格液态玻璃，参考 [rdev/liquid-glass-react](https://github.com/rdev/liquid-glass-react)，**先做 demo 在新目录 `demo/`，不急于改现有设计**。故本轮**只新增 `demo/`（6 文件）+ 本文件同步**，**`src/**`、`public/**`、`astro.config.mjs`、`package.json`、`pnpm-lock.yaml` 零改动**。**技术路线**：不引入 React / 任何依赖（`liquid-glass-react` 需 React 19 + 客户端 JS，与 ADR-1 / ADR-5 / §8.1 冲突），只借鉴其视觉配方（内置位移贴图 + 三次 `feDisplacementMap` 色散 + 颜色通道抽取 + screen 合成 + 边缘掩膜与干净中心）；实现路线取自同为 Astro 站的 [nikdelvin/liquid-glass](https://github.com/nikdelvin/liquid-glass)：**位移贴图由 SVG 图元现拼并编码成 data URI，直接挂在 `backdrop-filter: url(...)`**，因此**无需插入 `<svg>`、无需 JS 注入**；工程取舍（`@supports` 门禁 / Safari 降级 / ≤768px 关折射 / `prefers-reduced-transparency`）参考 [SquareMediaGroup/glassfx](https://github.com/SquareMediaGroup/glassfx)。**实测（本地）**：`demo/` 3 个 HTML **`<script` 计数均为 0**、无外链、无 `@import`；**真折射 A/B 量化** 像素差 > 8/255 面积 **33.5%**、水平结构强度 **10.82 vs 1.03（10.5×）**；**无横向滚动 27 组（3 页面 × 320/360/390/430/640/768/960/1200/1440）全过**；可读性 A/B 正文最深像素亮度差仅 **0.4/255**；宽窗 `backdrop-filter` 5002 字符含 `url()`、窄窗 **41 字符不含**（分支可用）；`pnpm build` 退出码 **0**、**13 页**、`dist` 内 `.js` **0**；`git diff HEAD -- src public` **无输出**。**发现并修正 1 个功能性 bug + 记录 2 条测量陷阱**：① ≤768px 关折射的第一版选择器特异性不足（`.lg-refract` 被 `.lg-refract.lg-panel` 压住）**完全没生效**，改为逐角色各写一条后复测通过；② **headless Edge 有约 504px 窗口最小宽度**，`--window-size=390` 实际得到 `innerWidth=504`，据此得出的「无横向滚动」结论**全部无效**，必须改用**精确 CSS 宽度的 iframe**（且 `file://` iframe 需要 `--allow-file-access-from-files` 才能读 `contentDocument`）；③ demo 复刻真实标记但拿不到 Astro 的 `[data-astro-cid-*]` 内容哈希，样式的**作用域属性必须剥离**，否则组件样式全部不命中。**新增 §10.5 台账 M-3 行**、**新增 §10.6「M-3 原型实际执行记录」**。**遗留**：正式接入前**必须先立 ADR-11**（取代 ADR-7 材质部分、保留其 `@supports` 兜底、明确不引入 JS）；贴图按名义尺寸烘焙并拉伸 → 圆角随尺寸缩放；`demo/` 按 P2.5 惯例属临时目录。**未推送** |
| v2.5 | 维护 | **M-3 正式落地：全站改为 iOS 26 风格「液态玻璃」+ 照片背景（ADR-11）**。用户看过原型后**选定 `real-home-photo.html`** 并要求正式改造。**先立 ADR-11 再动代码**（§10.1 规则 4）：ADR-11 取代 ADR-7 的材质与背景，保留其 `@supports` 兜底、零外部请求、`.measure` 行宽与 `container` 960px；新增 `--lg-*` / `--photo-*` 令牌，删除 `--glass` / `--glass-solid` / `--glass-border` / `--shadow` / `--radius` / `--blur`。**实现**：`global.css` 四层材质（折射 / 磨砂 / 镜面 / 厚度）+ 4 组角色化滤镜（位移贴图由 SVG 图元现拼、编码为 data URI，**无需插入 `<svg>`、无需 JS**）+ 三层兜底（不支持 `backdrop-filter: url()` → 磨砂；完全不支持 `backdrop-filter` → 不透明；`prefers-reduced-transparency` → 不透明；≤768px 关折射）；`.glass` 工具类删除、`.card`/`.panel` 只留间距；11 个组件与页面改标记；**新增 `public/images/background.jpg`（2560×1920 / 1.6 MB / EXIF 与 GPS 已清空）**；`BaseHead` 与 `ThemeToggle` 的 `theme-color` 同步改为 `#1b2a3d/#0d1420`。**实测**：`pnpm build` 退出码 0、**13 页**、`dist` 内 `.js` **0**、产物 CSS 外部 `url()`/`@import` 均 **0**；**44 组（11 路由 × 320/390/768/1440）无横向滚动全过**；**新增对比度量化门禁**——对实际入库照片像素逐元素合成「压暗 + 玻璃」，取最差 10% 区域，浅色态正文 ≥**5.99**、次要文字 ≥**4.94**，深色态 ≥**11.15**/≥**7.93**，**全部过 WCAG AA**；R5 泄漏扫描 0 命中且入库照片 EXIF/GPS 为 0。**发现并修掉的关键问题**：① 照搬原型的「白玻璃 + 浅色文字」在这张照片上只有约 **2.2:1**，且**提高不透明度反而更差**（1.9:1）——改成**深色玻璃**后 6.5~6.9:1，因此浅/深两态的玻璃**都是深色底**，两态差异改由「照片压多暗 + 玻璃多实」承担（对「浅色主题」直觉的实质偏离，已如实记录）；② 照片最亮处正好在 sticky 页头所在的顶部（海面高光 p90=251），调 `--photo-position` 收益有限；③ `.glass` 覆盖新材质底色（必须删除而非叠加）；④ `.card:hover` 与 `.lg` 同特异性且源序更后，重设阴影会连未悬浮状态一起覆盖；⑤ `.lg > *` 需显式提层，否则镜面伪元素盖住内容；⑥ `corner-shape: squircle` 必须包 `@supports`。**已披露的偏离**：ADR-7 时代「零位图背景」性质结束（零外部请求与零客户端 JS 仍成立）；`theme-color` 连带改动；`demo/backgroud_chunk.jpg` 删除（与 `public/images/background.jpg` 重复）；`demo/site.css` 重新生成。**遗留**：滚动帧率未实测、贴图按名义尺寸拉伸故圆角随尺寸缩放、Safari/Firefox 降级观感未真机复核、根目录原始照片仍建议移出仓库 |
| v2.6 | 维护 | **M-4 落地：背景照片池 + 按客户端日期固定某张 + 页头「随机换背景」按钮，并静默停用深浅色切换（ADR-12）**。用户 2026-10-11 要求：可更换背景、把一个**目录**当背景源可上传自己喜欢的照片、把原深浅色按钮改成**随机换背景**按钮、**刷新不改变当前背景**、按**客户端日期**让某天打开一定固定一张且映射值可在本地调整（如节假日指定某张）、深色浅色切换**静默**（保留代码、不在页面展示、保持当前浅色）。**先立 ADR-12 再动代码**（§10.1 规则 4）。**架构**：照片池 = `public/images/backgrounds/`（文件名即 id）；规则 = `src/backgrounds/config.ts` 的 `rules`（`YYYY-MM-DD` 一次性 / `MM-DD` 每年 / `'0'`-`'6'` 星期几，命中顺序即优先级，未命中按 FNV-1a hash 或按天轮转兜底 → **同一天恒定同一张**）；**构建期**算出「构建机当天」写进内联 `<style>` 与内联 JSON（无 JS 也有确定的一张、同一天访问零多余改动），**运行期** `is:inline` 脚本按**客户端本地日期**重算（只在不同才覆写），两端共用 `date-map.ts` 的同一份函数源码。「刷新不变」= `localStorage['bg-v1'] = {id, date}`，`persist: 'day'` 语义（当日有效、隔天回落日期规则）。**主题静默**：`THEME_TOGGLE_ENABLED = false` → 不渲染 `ThemeToggle`、`<html>` 不加 `gate-dark`，于是 `@media (prefers-color-scheme: dark)` 那条跟随系统的深色令牌**不生效**，站点恒定浅色；否则系统为深色的访客会「看到深色却已无按钮可切回」，正好违背用户要求。**保留清单一行未删**（`ThemeToggle.astro` 与其内联脚本、两处深色令牌、`themeSwitch` 文案、`color-scheme`、两条 `theme-color`）；只**移除**了 `BaseHead` 里读 `localStorage.theme` 的 4 行（否则旧访客会被静默锁在深色）。**隐私门禁**：新增 `pnpm add:background`（`scripts/prepare_photo.py`：可选烘焙 EXIF 方向 → 剥全部元数据 → 长边 ≤2560 → 渐进式 JPEG → **重新打开产物实测 EXIF 0 / GPS 0**，不干净拒绝写盘）与 `pnpm sync:backgrounds` / `pnpm check:backgrounds`（扫描目录生成 `generated.ts`；拦下非法 `on` 形状、`'06'` 这种永不命中的星期几、指向不存在照片的 `bg`、以及「精确日期排在 `MM-DD` 之后」的死规则）。**实测（本地，2026-10-11）**：`pnpm build` 退出码 **0**、**13 page(s)**、`dist` 内 `.js` **0**、每页 `<script>` **3**；**52 组（13 路由 × 320/390/768/1440）无横向滚动全过**（真实浏览器 CDP）；**构建期与运行期在 1461 天（2024–2027）上 id 与 reason 完全一致**，且**真实浏览器里跑的产物**与 TS 实现逐日比对 **0 差异**；连续点 24 次按钮每次都换（无「点了没反应」）、刷新与跳页保持、把存储日期改旧后回落日期规则；**系统配色实测为深色时 `--photo-dim` 仍为 0.42、`body` 底色仍为 `rgb(13,20,32)`**（门控确实生效）；逐张对比度门禁与 M-3 记录值一致（页头 5.99/4.94、hero 6.20/5.12、文章卡 10.73/8.85、项目卡 8.14/6.71）；池内照片 **EXIF 0 / GPS 0**、硬红线扫描 **0 命中**；导入管道用一张**带 GPS 4 条目**的合成照片端到端演练通过（产物 `CLEAN`），演练产物已删除并复原为单张池。**发现并修掉的关键问题**：① **`new Function` 拿函数声明的两种错法都静默返回 `undefined`**（写声明 / 只加外层括号都不行，唯一可用的是 `new Function('return (' + 源码 + ')')()`）——现象是按钮完全没反应、`__dshBg` 从未被赋值，而页面看起来一切正常（首屏背景来自构建期 CSS，掩盖了故障）；现在单元（`tmp/probe_fnrule.mjs`）、产物（`tmp/test_bg_map.mjs`）、真实浏览器（`tmp/probe_browser.py`）**三道门**分别拦住它；② Astro/Vite 会对 `is:inline` 脚本内容做**打印重排并内联构建期常量**（实测 `data.persist` 变成字面量 `"day"`），故**不能断言产物脚本与源码逐字节相同**，一致性断言改为「行为等价 + 构造方式相同」；③ 生成内联脚本的**模板字符串里不能出现反引号**（注释里写反引号会提前结束模板，报错位置还指向下一个 token）；④ 探针脚本 `os.chdir(dist)` 会污染进程工作目录，导致后续相对路径 `ENOENT`（改为 `directory=` 参数）；⑤ 本地静态服务必须发 `Cache-Control: no-store`，否则「重建 + 重跑」会静默验证**旧构建**；⑥ 星期几规则写成 `'06'` 会永不命中（自测里就写错过，现已由 `sync` 报错拦下）。**已披露的偏离**：背景改为两个显式 `.bg-layer` 固定层 + 交叉淡入（而非 `body::before/::after`），代价是每页多两个空元素与 `global.css` 里刻意的 `url()` 重复；`persist` 定为「当日有效」（可改 `'forever'`）；导入工具为 Node + Python(Pillow) 且**未新增任何 npm 依赖**；`docs/操作手册.md`（此前未跟踪）一并更新并纳入本次提交。**遗留**：手机端性能未真机复核、不做多分辨率 `srcset`、根目录原始照片仍在（未擅自删除，属破坏性操作）、照片池会累积 Git 历史体积。**已发布**：提交 `167de44`（17 文件 / `1891 插入 / 55 删除`）推送 `origin/main`（`da6cbc3..167de44`），Actions run [`38142571316`](https://github.com/WauZonC/WauZonC.github.io/actions/runs/38142571316) **Build 与 Deploy 均 success**；线上 15 条资源全 **200**、旧路径 `/images/background.jpg` → **404**、线上 `index.html` 与本地 `dist` **SHA-256 相同**（`7051DF00…EB446E`），`tmp/verify_live_bg.py` 的 **14 项线上接线断言全过**（含「线上已无 `#theme-toggle`」「英文镜像页同样带配置与按钮」）。
**同日后续（第二批照片导入 + 修掉一个线上真实 bug）**：用户提供 `valley.jpg` / `danxia.jpg` 并要求「先忽略对比度」→ 导入为 `green-valley` / `colorful-danxia`（各 1.19 MB，**EXIF 0 · GPS 0**；`green-valley` 导入前带 **9 条 GPS**），`config.ts` 写入 `2026-10-01 → colorful-danxia` 与 `01-01 → green-valley` 两条真实规则。**发现并修掉：首屏按日期注入的照片从未真正显示过** —— Astro 把打包 CSS 提升到 `<head>` 末尾、与注入的内联 `<style>` 同为 `:root` 且在其后，**后写的赢**，于是当日照片被静态兜底 `default.jpg` 静默覆盖（页面看起来完全正常；静态检查发现不了，是真实浏览器探针比对 `--bg-photo` 计算值与 `__dshBg.current()` 才暴露）。修法：内联样式改 `:root:root`（0,2,0）+ 两个背景固定层各用一个变量并**成对更新**；回归门：`probe_browser` 断言「可见层必须等于 `current()`」、`check_bg_dist` 断言 `:root:root` 与两变量成对。提交 `93a8e28`（8 文件）推送，Actions run [`38144356654`](https://github.com/WauZonC/WauZonC.github.io/actions/runs/38144356654) **success**；线上三张照片均 200、`tmp/verify_live_bg.py` **18 项全过**，并用**注入假客户端日期打到线上页面**验证：不注入 → `green-valley`、2026-10-01 → `colorful-danxia`（精确规则）、2027-01-01 → `green-valley`（每年规则）；点按钮 `green-valley → default` 并**刷新保持**。对比度实测（虽被要求忽略）：三张最差 4.94 / 5.73 / 5.88，**实际都过 WCAG AA**。 |
