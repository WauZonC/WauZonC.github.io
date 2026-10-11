# demo/ —— iOS 26 风格「液态玻璃」原型（M-3）

> **这是原型，不是站点的一部分。** 该目录**不参与 Astro 构建**、不进入 `dist/`、不影响
> <https://wauzonc.github.io>。站点现有的毛玻璃设计（[PLAN.md](../PLAN.md) ADR-7）**一行都没改**。
>
> 目的：让你在**真实首页版式**上判断「要不要换成液态玻璃」，以及「换成什么样」。
> 决定之后，正式改造走 PLAN.md §10 的**轨道 B**（改样式），并且**必须先立 ADR**（见文末）。

---

## 怎么看

**双击 `index.html` 即可**，无需起服务器、无需构建、无需联网。三个页面：

| 页面 | 看什么 |
|---|---|
| **`real-home.html`** | ★ 真实首页版式 + 液态玻璃（页头 / hero 面板 / 卡片 / 药丸按钮） |
| **`real-home-plain.html`** | 同一份内容 + **现有的毛玻璃**。与上一页唯一差别是材质，用于 A/B |
| **`real-home-photo.html`** | 背景换成**你的照片**（整页，滚动时照片固定） |
| **`real-home-photo-band.html`** | 同上，但照片**只占首屏一条且下缘渐隐** |
| **`index.html`** | 参数与观感对比：同一块玻璃压在四种不同频率的底上；四层材质逐层叠加；三种角色差异；参数速查表 |

### 照片背景（`real-home-photo*.html`）

原图 4096×3072 / 4.9 MB。用于演示的是**另存的一份** `demo/backgroud_chunk.jpg`：
缩到 **2560×1920 / 1.6 MB**，并**清空了全部 EXIF**。⚠️ **必须知道的原因见下方「隐私」一节。**
仓库根目录的原始文件 `backgroud_chunk.jpg` **没有被修改**，也**不要提交**。

三个可调参数都在 `liquid-glass.css` 末尾：

| 参数 | 默认 | 作用 |
|---|---|---|
| `--photo-dim` | `0.42` | 压暗照片。**这是保证正文对比度的关键** |
| `--photo-blur` | `1.5px` | 轻微模糊 |
| `--photo-band` | `34rem` | 照片只占首屏时的高度 |

**为什么必须压暗 + 覆盖文字颜色**：照片中段是深蓝海面，站点浅色主题的正文是深色文字，
直接叠上去**明显读不清**（实测踩到）。所以 `liquid-glass.css` 里对照片背景做了
**作用域文字令牌覆盖**：只在 `.bg-photo` / `.bg-photo-band` 内把 `--fg` / `--fg-muted` /
`--accent` 换成浅色，并给标题加一层极淡描影。站点其它页面完全不受影响。

**照片背景下的折射反而更明显**。这是实测数据（同一块玻璃面板 900×300、同一材质，
只差 `url()` 位移滤镜；数值 = 有折射与纯模糊的像素差异）：

| 背景 | 差异 > 8/255 的像素 | 最大通道差 | 说明 |
|---|---|---|---|
| 站点柔光渐变底 | **0.0%** | 5 | **几乎完全看不出折射** |
| 你的照片 | **35.0%** | 44 | 折射明显 |
| 高频条纹 | 4.0% | 40 | 结构上能看出被推挤，但绝对像素差不大 |

第一行和第二行的对比就是 `demo/README.md` 第 1 条结论的直接证据：**折射看不看得出来，
取决于玻璃背后有没有细节**。站点现在的柔光渐变非常平滑，所以玻璃压在纯背景上时
换成液态玻璃几乎无收益；**如果改成照片底，液态玻璃的收益才会真正体现出来**——
这是本轮最重要的一个发现，比「材质本身好不好看」更影响决策。


> `real-home.html` 里有一块标着「**demo 专用区块 · 真实站点没有**」的虚线区块，这是**唯一一处**
> 有意偏离真实首页的地方。它的作用见下一节。
> （`real-home-photo*.html` 没有这块：照片本身就是高频内容，不需要再放试金石。）

---

## ⚠️ 隐私：原图带 GPS，绝不能直接提交

你放进仓库根目录的原图 `backgroud_chunk.jpg` 的 EXIF 里带有**精确位置信息**：

| EXIF 字段 | 值 |
|---|---|
| `GPSLatitude` | 36°02′59.4″N |
| `GPSLongitude` | 120°20′36.0″E |
| `DateTime` | 2026-10-02 17:25:02 |
| `Make` / `Model` | HUAWEI / nova 14 Pro |
| `ImageDescription` | `_cuva` |

**本仓库是公开的**（`WauZonC.github.io` 公开仓库 + Pages 用户主站），所以这组坐标一旦提交，
就等于**把拍摄地点公开**。PLAN.md §10.2 A1 也明确要求「图片先剥离 EXIF」（P4 已定下的做法）。

因此本次的处理是：

1. **原始文件没有被修改、也没有被提交**（它目前仍是未跟踪状态，见 `git status`）。
2. 演示用的是一个**另存的副本** `demo/backgroud_chunk.jpg`：缩到 2560×1920、
   **EXIF 与 GPS 全部清空**（已用 `getexif()` 断言为 0 个标签、0 个 GPS 条目）。
3. **本文件与 `demo/` 里没有任何位置信息**，可以安全提交。

> **建议你做的**：把根目录的原始文件**移出仓库**（比如挪到 `D:\WZC\` 下），或者确认它永远不被 `git add`。
> 只要它在仓库目录里，任何一次 `git add -A`（本项目本来就是禁止这样做的，但他人接手不一定知道）
> 都会把它连 GPS 一起提交上去，而**公开仓库的推送不可逆**。


---

## 三条必须先知道的事实

### 1. 折射只有在玻璃**背后有高频细节**时才看得见

这是物理限制，不是实现问题。本站背景是平滑的多层柔光渐变，所以：

- 玻璃压在**纯背景**上 → 液态玻璃和现有毛玻璃**几乎看不出差别**（`index.html` 第一组图第一格就是这个）
- 玻璃压在**文字 / 条纹 / 图片边界**上 → 边缘出现推挤、错位、放大压缩感

所以最直观的验证方式是**向下滚动**：把 `real-home.html` 顶部那块高频条纹滑到 sticky 页头背后，
页头边缘就会出现轻微的错位；换成 `real-home-plain.html` 同样位置只会**变糊**，不会错位。

**已量化验证**（`tmp/` 里的 A/B 探针，同一材质、同一底、只差 `url()` 位移滤镜）：

| 指标 | 结果 |
|---|---|
| 像素差异 > 8/255 的面积 | **33.5%** |
| 像素差异 > 32/255 的面积 | 4.0% |
| 水平结构强度（条纹清晰度，越大越清晰） | 有折射 **10.82** vs 纯模糊 **1.03**（约 **10.5 倍**） |

结论：该滤镜确实在做**位移折射**，而不是「换个参数的模糊」。注意纯模糊会把高频底压成一块平滑渐变，
所以「有折射」的判据不是「变糊了」，而是「结构还在但被弯折了」。

**可读性也已量化对照**（同一底、同一文案，只换材质）：正文最深像素的亮度差仅 **0.4/255**，
明暗跨度（stdev）**完全相等** —— 液态玻璃没有让正文变淡或变糊。


### 2. 真折射**目前只有 Chromium 内核生效**

`backdrop-filter: url(<SVG 滤镜>)` 对 `feDisplacementMap` 的支持**不可互操作**，这是平台现状：

- Chromium（Chrome / Edge）→ **支持**，有真位移
- Safari / WebKit → **不支持**（WebKit Bug 245510：`backdrop-filter: url()` 对 `<feDisplacementMap>` 无效）
- Firefox → **不支持**
- W3C SVG WG 的 [issue #1142](https://github.com/w3c/svgwg/issues/1142)（2026-06 提出，**至今 open**）就是在讨论这件事；
  维护者回复的口径是「这是用量问题，用得多了浏览器会实现」

因此材质被设计成**四层**，真折射只是其中一层：

| 层 | 内容 | 生效范围 |
|---|---|---|
| ① 折射 | `blur() url(滤镜) blur()` | **仅 Chromium** |
| ② 磨砂 | `blur + saturate + brightness` | 所有支持 `backdrop-filter` 的浏览器 |
| ③ 镜面 | `::before` 的斜向高光 + 顶部径向光晕 | 同上 |
| ④ 厚度 | 内侧顶部高光 + 发丝内描边 + 双层外投影 | 全部浏览器 |

**让观感像 iOS 26 的主要是 ②③④，不是 ①。** 所以 Safari / Firefox 用户看到的是「更精致的磨砂玻璃」，
而不是坏掉的透明空壳——这一点在 `index.html` 的「四层材质」一组里可以直接看到。

### 3. 本原型**零脚本、零依赖、零外部请求**

- 页面里**没有任何 `<script>`**（已用脚本断言：3 个 HTML 文件的 `<script` 计数均为 0）
- 不引入 React、不引入任何 npm 依赖
- 位移贴图由 **SVG 图元现拼**（`feImage` + `linearGradient` + `mix-blend-mode: screen`），
  嵌成 **data URI** 写进 CSS，因此没有外部图片、也不用往 DOM 里插 `<svg>`

这一点与站点的 **ADR-1（零客户端 JS）** 一致，正式改造时**不需要**动 ADR-1。

---

## 文件说明

```
demo/
├── README.md                   # 本文件
├── index.html                  # 参数与观感对比页（自包含样例）
├── real-home.html              # 真实首页版式 + 液态玻璃（柔光渐变底）  ← 主产物
├── real-home-plain.html        # 对照组：真实首页版式 + 现有毛玻璃
├── real-home-photo.html        # 背景换成你的照片（整页）
├── real-home-photo-band.html   # 背景换成你的照片（只占首屏一条、下缘渐隐）
├── backgroud_chunk.jpg         # 照片（2560×1920 / 1.6 MB / 已清空 EXIF）⚠️ 见「隐私」一节
├── liquid-glass.css            # ★ 材质层：设计令牌 + 四层材质 + 角色化滤镜 + 降级 + 照片背景
└── site.css                    # 站点自己的样式（从 dist 产物提取，只为让 demo 能 file:// 打开）
```

**`site.css` 是提取物，不要手改**：它是 `dist/_astro/*.css` 加 `dist/index.html` 里两段页面级
`<style>` 的拼接，并且**剥掉了 Astro 的 `[data-astro-cid-*]` 作用域属性**（demo 复刻真实标记但
拿不到那些内容哈希）。克隆重跑：`tmp/gen_site_css.py`。

**`liquid-glass.css` 里的滤镜是生成物，不要手改那一长串百分号编码**：改参数要改
`tmp/gen_lg_maps.py` 的 `ROLES` 字典，再跑 `tmp/gen_lg_css.py` 重新生成。

---

## 材质参数

数字都是 SVG `feDisplacementMap` 的 `scale`（像素量级）。「名义尺寸」是贴图烘焙时假定的元素尺寸——
运行时由 `feImage width/height="100%" + preserveAspectRatio="none"` 拉伸到元素实际尺寸。

| 角色 | 名义尺寸 | 圆角 rx | 边缘厚度 depth | 位移 scale | 色散级差 | 用在哪 |
|---|---|---|---|---|---|---|
| `.lg-header` | 1280 × 58 | 0 | 8 | 26 | 3 | sticky 页头 |
| `.lg-panel` | 960 × 320 | 26 | 16 | 34 | 3 | hero / 大面板 |
| 默认（`.lg-refract`） | 460 × 150 | 16 | 10 | 28 | 2 | 文章卡 / 项目卡 |
| `.lg-pillbtn` | 130 × 34 | 17 | 5 | 18 | 1 | 药丸标签 / 导航 / 切换按钮 |

调参经验（来自参考实现的文档）：三次 `feDisplacementMap` 的 `scale` **均值**决定折射深度，
**级差**决定色散强度。

其它设计令牌都在 `liquid-glass.css` 顶部：`--lg-tint` / `--lg-alpha` / `--lg-alpha` /
`--lg-blur` / `--lg-saturate` / `--lg-brightness` / `--lg-sheen` / `--lg-rim` / `--lg-hair` /
`--lg-shadow` / `--lg-radius`。**改这些不需要重跑生成脚本**，直接改就行。

---

## 浏览器支持与已知代价（如实记录）

| 项 | 状态 |
|---|---|
| Chromium 155（本机 Edge 实测） | ✅ 真折射 + 全部四层 |
| Safari / Firefox | ⚠️ 降级为磨砂 + 镜面 + 厚度（无真折射） |
| 不支持 `backdrop-filter` | ✅ `@supports not (...)` 兜底为不透明玻璃 |
| `corner-shape: squircle`（iOS 26 方角） | ✅ 本机 Edge 155 支持（`superellipse(2)`）；不支持时退回普通圆角 |
| `prefers-reduced-motion` | ✅ 关闭过渡 |
| `prefers-reduced-transparency: reduce` | ✅ 改为近乎不透明 + 去掉 `backdrop-filter` |
| ≤ 768px | 有意**关闭折射**，只保留磨砂 + 镜面 + 厚度（手机上卡片密集，折射收益低、GPU 成本高） |

**本轮实测发现并修掉的一个真实 bug（对后续改写有用，值得记一笔）**：

≤768px 的「关闭折射」最初只写了一条 `.lg-refract`（特异性 `0,1,0`），而上面的逐角色规则是
`.lg-refract.lg-panel` / `.lg-refract.lg-header`（`0,2,0`）。**特异性被压住 → 移动端关折射根本没生效**，
宽窗 1400px 与窄窗 670px 读到的 `backdrop-filter` 长度都是 5002 字符（都带 `url()` 位移滤镜）。
改成**逐角色各写一条**后，窄窗读数为 41 字符且不含 `url()`，宽窗仍为 5002 字符含 `url()` —— 分支确认可用。
教训：覆盖 `.lg-refract` 这种「基类 + 角色类」组合时，选择器必须与角色规则同特异性或更高，
不要图省事只写基类。

**四条已知代价（都建议先接受再推进）**：

1. **贴图被拉伸 → 圆角半径会随元素尺寸缩放。** 同一张贴图铺到不同尺寸的元素上，圆角在视觉上不再等大。
   要逐元素精确，需要在客户端按真实尺寸现场生成贴图（`ResizeObserver`），也就是**引入一段 JS** →
   触碰 ADR-1，需另立 ADR。本原型刻意选择「不引入 JS」。
2. **`corner-shape: squircle` 与贴图里的 `rx`（圆弧）几何不完全一致。** 方角是超椭圆，贴图的圆角是圆弧，
   两者叠在一起时边缘形状会有细微出入。要精修得改用超椭圆路径生成贴图。
3. **`backdrop-filter` + sticky 页头在滚动时逐帧重合成**，成本高于纯色。本原型把折射限制在 4 类角色、
   并在 ≤768px 关掉，但**长页面滚动时仍应实测帧率**再决定是否全站铺开。
4. **`backdrop-filter` 本身的兼容性兜底必须保留**（ADR-7 原有的 `@supports not (...)` 分支已在本文件里重建）。

**已撤销的早期假设**：曾打算把「内置位图贴图」当成参考实现的主线（那是
[rdev/liquid-glass-react](https://github.com/rdev/liquid-glass-react) 的做法——它内置
`standard` / `polar` / `prominent` 三张 256×256 贴图，配一条边缘检测链把色散限制在边缘）。
本原型改为**由 SVG 图元现拼贴图**，理由是纯 CSS 可自包含、参数可读可审；rdev 那三张贴图保留在
`tmp/_lg_research/baked_*.png` 作为保真度参照。

---

## 与参考实现的关系（均为 MIT）

| 参考 | 借鉴了什么 | 没有借鉴什么 |
|---|---|---|
| [rdev/liquid-glass-react](https://github.com/rdev/liquid-glass-react) | **视觉配方**：内置贴图四选一、三次位移做色散、`feColorMatrix` 抽 R/G/B、`feBlend screen` 合成、**边缘掩膜 + 干净中心** | React 组件、`react-dom` peer 依赖、`ResizeObserver` 逐实例重算、指针跟随弹性形变 |
| [nikdelvin/liquid-glass](https://github.com/nikdelvin/liquid-glass) | **实现路线**：贴图由 SVG 图元现拼、滤镜整个做成 **data URI** 直接挂在 `backdrop-filter` 上、Safari 自动降级 | Tailwind、anime.js、位图背景素材、字体文件 |
| [SquareMediaGroup/glassfx](https://github.com/SquareMediaGroup/glassfx) | **工程取舍**：折射用 `@supports` 门禁、Safari/Firefox 降级为磨砂、**≤768px 关掉折射**、honour `prefers-reduced-transparency` | 注入 `<svg>` 的做法（本原型改用 data URI，因此零 DOM 污染、零 JS）、指针跟随光斑 |

本目录代码为**原生 CSS 重写**，未复制上述项目的代码文件，仅借鉴其公开的视觉配方与工程结论。

---

## 已跑过的验收（可复现）

| 验收 | 结果 |
|---|---|
| 无 `<script>` | ✅ 3 个 HTML 均 0 个 `<script>` |
| 无外部请求 | ✅ 无 `http(s)://` 外链、无 `@import`；仅引用同目录 `site.css` / `liquid-glass.css` |
| id 与锚点完整、`lg-*` 类均有定义 | ✅ |
| **真折射确实发生** | ✅ A/B 像素差 **33.5%** 面积 > 8/255；水平结构强度 **10.82 vs 1.03（10.5×）** |
| **无横向滚动** | ✅ 3 页面 × 9 档宽度（320 / 360 / 390 / 430 / 640 / 768 / 960 / 1200 / 1440）= **27 组全过**，`scrollWidth == clientWidth` |
| **≤768px 关折射分支真的生效** | ✅ 宽窗 `backdrop-filter` 5002 字符含 `url()`；窄窗 **41 字符不含 `url()`**（修掉特异性 bug 后复测） |
| **文字可读性未被牺牲** | ✅ 同一底、同一文案下的 A/B：正文最深像素亮度差 **0.4/255**，明暗跨度（stdev）**完全相等** |
| 浅色 + 深色两态 | ✅ 均截图复核 |
| `@supports not (...)` 不透明兜底分支 | ✅ 规则存在且语法平衡（`{`/`}` 各 26） |
| `prefers-reduced-motion` / `prefers-reduced-transparency` | ✅ 规则存在；`--force-prefers-reduced-motion` 实测媒体特性为 `true`（`prefers-reduced-transparency` 本机无强制开关，未实测命中） |
| 站点门禁未破 | ✅ `pnpm build` 退出码 0、`13 page(s) built`、`dist` 内 `.js` 仍为 **0** |


---

## 决定推进之后要做什么（**本轮不做**）

正式改造属于 **PLAN.md §10 轨道 B（修改主页风格）**，动 `src/` 之前必须先过治理关卡：

1. **先立 ADR-11「液态玻璃材质」**（改 `PLAN.md` §3），写清：
   - 它**取代 ADR-7 的材质部分**（`--glass` / `--glass-border` / `--glass-solid` 令牌与 `.glass` 工具类），
     但**保留 ADR-7 的 `@supports` 兜底与「零外部请求」**；
   - 如实记录「`backdrop-filter: url()` 仅 Chromium 生效、Safari/Firefox 降级为磨砂」；
   - 明确**不引入客户端 JS**（因此不做逐元素精确贴图，接受 §「已知代价 1」）；
   - 若届时决定要接受那段 JS，则需**同时改 ADR-1**。
2. **在 §10.5 台账登记 `M-3`**（轨道 B）。
   预计写作用域：`src/styles/global.css`、`src/components/Header.astro`、
   `src/components/{PostCard,ProjectCard,ThemeToggle,LangSwitch}.astro`、`src/layouts/BaseLayout.astro`、`PLAN.md`。
   落地方式：`liquid-glass.css` 的令牌与 `.lg*` 工具类**并入 `global.css`**，然后各组件把
   `.glass` / `.card` / `.panel` 换成对应的 `.lg` 角色类。
   ⚠️ **不能只叠加 `.lg` 而不摘掉 `.glass`**：`.glass` 的 `background: var(--glass)` 在样式表中
   位置更靠后，会**覆盖**新材质的底色（本轮原型已实测踩到，表现是玻璃变成一块实色深块）。
3. **按 §10.4 跑 R1–R6**，其中 R4（无横向滚动）必须**浅色 + 深色各跑一遍**，并额外复测滚动帧率。
4. **`demo/` 的去留**：按 PLAN.md §10.2 轨道 B 的约束，`demo/` 是**临时目录**。P2.5 的先例是
   定稿并验收后**整目录删除**。本轮建议**先入库**（跨设备/跨浏览器复核需要它可复现），
   正式改造验收通过后再删。
