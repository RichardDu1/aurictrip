# AuricTrip 设计元素体系 v2.0

> 每个设计决策必须有竞品依据。不可凭空设计。
> 依据来源：Black Tomato / Scott Dunn / Audley Travel / Kuoni / 赞那度 / 鸿鹄逸游

---

## 1. 色彩体系

### 1.1 主背景色

| Token | 值 | 用途 | 竞品依据 |
|-------|-----|------|---------|
| `--color-bg-page` | `#FAFAFA` | 全局页面背景（包括 Footer） | Scott Dunn / 赞那度 / 鸿鹄逸游 / Audley Travel / Kuoni 均为浅色全局背景。Black Tomato 用黑色是品牌特例（品牌名含 "Black"），不适用 |
| `--color-bg-card` | `#FFFFFF` | 卡片背景 | 所有竞品卡片均为纯白底 |
| `--color-bg-warm` | `#f5f0eb` | 占位图暖色底 | Auric Gold 暖调延伸，暖米色系 |
| `--color-bg-footer` | `var(--color-bg-page)` | Footer 背景 | 浅色 footer 是行业最大公约数（6 家竞品中 4 家用浅色） |

### 1.2 品牌色

| Token | 值 | 用途 | 竞品依据 |
|-------|-----|------|---------|
| `--color-brand` | `#C9A96E` (Auric Gold) | 文字链接、下划线、小装饰、标签 | Black Tomato 金色点缀；赞那度金色 Logo；鸿鹄逸游暗金 `#DBA53E` |
| `--color-brand-hover` | `#b8934e` | hover 态 | 品牌色加深 10% |

**品牌色使用规则**：只用做点缀，不做实心大按钮、不做大面积背景。用量克制。（设计参考手册 1.1："用量克制，不做实心大按钮"）

### 1.3 文字色

| Token | 值 | 用途 | 竞品依据 |
|-------|-----|------|---------|
| `--color-text-primary` | `#1a1a1a` | 正文、标题 | 所有竞品均用近黑色正文 |
| `--color-text-secondary` | `#4a4a4a` | 次要正文、描述 | 比 primary 浅两档 |
| `--color-text-muted` | `#9ca3af` | 辅助信息、价格后缀、免责声明 | 灰色用于价格/辅助信息（设计参考手册 3.3） |
| `--color-text-on-dark` | `#ffffff` | 首页 Hero 图上的白色文字 | 仅首页 Hero 大图使用 |
| `--color-text-on-dark-muted` | `#94a3b8` | 首页 Hero 图上的辅助文字 | |

### 1.4 页面 Hero 区

| 页面类型 | 背景色 | 文字色 | 竞品依据 |
|---------|--------|--------|---------|
| 首页 Hero | 大图（无叠加色块） | 白色文字叠在图上 | Black Tomato/Scott Dunn 首页 Hero 均为全屏大图 |
| 内页 Hero | `var(--color-bg-page)` (#FAFAFA) | `var(--color-text-primary)` | Scott Dunn 内页无深色 hero，直接白色背景开始；赞那度内页也是浅色背景 |
| 详情页 Hero | 大图（无叠加色块） | 文字在图下方 | 设计参考手册 2.1："纯图，不叠字" |

**关键决策：内页不使用深色 hero 背景。** 竞品中没有任何一家在内页顶部用深色横幅——它们要么是大图（Black Tomato），要么直接白色背景开始内容（Scott Dunn、赞那度）。

### 1.5 删除的 Token

| 旧 Token | 删除原因 |
|----------|---------|
| `--color-navy: #0A1628` | 无竞品依据。四家竞品无一使用海军蓝 |
| `--color-bg-hero` | 不再需要，内页 hero 直接用 `--color-bg-page` |
| `--color-bg-footer: #0A1628` | Footer 改为浅色，与页面背景统一 |
| `--color-bg-cta-bar: rgba(10,22,40,0.95)` | 改为白色半透明毛玻璃 |

---

## 2. 字体体系

### 2.1 字体族

| Token | 字体栈 | 用途 | 竞品依据 |
|-------|--------|------|---------|
| `--font-display` | `'Cormorant Garamond', 'Noto Serif SC', serif` | Logo、大标题 | Black Tomato 使用衬线 display 字体 |
| `--font-heading` | `'Playfair Display', 'Noto Serif SC', serif` | 所有标题 h1-h3 | Black Tomato/Scott Dunn 标题均为衬线体（设计参考手册 1.2） |
| `--font-body` | `'Inter', 'Noto Sans SC', sans-serif` | 正文 | Black Tomato/Scott Dunn 正文均为无衬线（设计参考手册 1.2） |
| `--font-price` | `'Cormorant Garamond', 'Noto Serif SC', serif` | 价格数字 | 赞那度/鸿鹄逸游价格均用衬线体 |

### 2.2 字号与行高（不设 token，直接在各组件中使用）

| 元素 | 字号 | 行高 | 字重 | 竞品依据 |
|------|------|------|------|---------|
| h1 (页面主标题) | `clamp(2rem, 4vw, 2.75rem)` | 1.2 | 700 | Black Tomato hero 大标题 |
| h2 (区块标题) | `1.25rem` | 1.3 | 600 | 设计参考手册：正文窄栏阅读 |
| h3 (子标题) | `1rem` | 1.3 | 600 | |
| 正文 p | `0.95rem` | 1.75-1.85 | 400 | 设计参考手册 1.2："杂志正文，宽行距" |
| 小字/辅助 | `0.75-0.8rem` | 1.5 | 400 | |
| 价格大字 | `2rem` | 1.2 | 600 | 赞那度价格展示 |
| 价格小字后缀 | `0.7-0.9rem` | — | 400 | |

---

## 3. 间距体系

| Token | 值 | 用途 | 竞品依据 |
|-------|-----|------|---------|
| `--spacing-section` | `6rem` | 首页区段间距 | 设计参考手册 1.5："区段间距大（py-24 或更大）" |
| `--spacing-section-mobile` | `3rem` | 移动端区段间距 | 减半 |
| `--spacing-content-max` | `680px` | 正文最大宽度 | 设计参考手册 1.2："max-width: 680px"，窄栏阅读 |
| `--spacing-card-gap` | `2rem` | 卡片网格间距 | 所有竞品卡片间距宽松 |

---

## 4. 卡片系统

### 4.1 卡片基类

```css
.card {
  background: var(--color-bg-card); /* #FFFFFF */
  border: none;
  box-shadow: none;
}
```

**竞品依据**：设计参考手册 1.1："无边框、无阴影，靠留白和分割线区分"。Black Tomato/Scott Dunn/赞那度卡片均为无边框无阴影。

### 4.2 卡片 Hover 态

```css
.card:hover {
  opacity: 0.7;
}
```

透明度降低而非上浮/放大/阴影。竞品依据：Black Tomato 卡片 hover 为图片轻微变暗，无上浮动效。

### 4.3 卡片变体

| 变体 | 区别 | 竞品依据 |
|------|------|---------|
| 默认卡片 | 纯白底 + 内边距 | 通用 |
| 图片卡片 | 上图下文，图片区用 `--color-bg-warm` 占位 | Scott Dunn 目的地卡片 |
| 主 CTA 卡片 | 保留金色细线边框（1px）以示强调 | CTA.astro 主卡片 |

---

## 5. 按钮与 CTA 系统

### 5.1 CTA 样式层级

| 层级 | 样式 | 用途 | 竞品依据 |
|------|------|------|---------|
| 主 CTA（文字链接式） | `color: var(--color-brand)` + 箭头 `→` | 导航栏"与顾问对话"、列表页"了解详情" | Black Tomato "Explore →" / "Enquire Now" 均为文字链接式（设计参考手册 1.1） |
| 辅 CTA（细线边框） | `border: 1px solid var(--color-brand)` + 透明背景 | 表单提交、移动端菜单 CTA | 设计参考手册 1.1："辅 CTA 用细线边框" |
| 文本按钮 | 无边框无背景，仅文字 + hover 变色 | Footer 链接、标签导航 | |
| 微信按钮 | `border: 1px solid #07C160` + 微信绿色 | 微信分享 | 微信品牌色 `#07C160`，不可改为品牌色 |

### 5.2 明确禁止的按钮样式

- 实心品牌色大按钮（"立即预订"式） — 鸿鹄逸游用此样式，偏电商，不适合我们的定位
- 圆角按钮（`border-radius` > 0）— Black Tomato/Scott Dunn 按钮均为直角或微圆角
- 阴影按钮 — 违反无阴影原则

---

## 6. 导航系统

### 6.1 桌面端

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 位置 | `position: fixed; top: 0` | 所有竞品 |
| 初始背景 | `transparent` | Black Tomato 首页透明导航 |
| 滚动后背景 | `rgba(250, 250, 250, 0.95)` + `backdrop-filter: blur(8px)` | Black Tomato 滚动后白色半透明导航 |
| Logo 中文 | `font-family: var(--font-display)`, `font-size: 1.25rem`, `font-weight: 700` | |
| Logo 英文 | `font-size: 0.6rem`, `letter-spacing: 0.22em` | Black Tomato 二级文字小号宽字距 |
| 导航链接色（首页） | `rgba(255, 255, 255, 0.85)` | 透明导航，白色文字 |
| 导航链接色（滚动后/内页） | `var(--color-text-primary)` | |
| 导航链接 hover | `var(--color-brand)` | 品牌色点亮 |

### 6.2 移动端汉堡菜单

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 汉堡图标 | 三条横线，22px × 1.5px | 标准汉堡 |
| 展开动画 | 1→X 旋转 + 中间线消失 | |
| 菜单背景 | `var(--color-bg-page)` (#FAFAFA) | 全屏白色 overlay |
| 菜单链接 | `font-family: var(--font-heading)`, `font-size: 1.25rem` | 大号衬线体链接 |
| 菜单链接分隔 | `border-bottom: 1px solid` 浅灰 | |
| 菜单 CTA | 辅 CTA（细线边框式） | |
| Body 滚动 | 菜单打开时 `overflow: hidden` | |

---

## 7. Footer 系统

| 元素 | 样式/内容 | 竞品依据 |
|------|----------|---------|
| 背景 | `var(--color-bg-page)` (#FAFAFA)，与页面背景统一 | 浅色 footer 是最大公约数：Scott Dunn/赞那度/鸿鹄逸游/Audley Travel/Kuoni 均为浅色。Black Tomato 用黑色是品牌特例 |
| 顶部分隔线 | `1px solid color-mix(in srgb, var(--color-text-muted) 15%, transparent)` | 用细线分隔而非色块 |
| 文字色 | `var(--color-text-primary)` (#1a1a1a) | |
| 辅助文字色 | `var(--color-text-muted)` | |
| Logo 区 | 鎏光旅行 + AURICTRIP + tagline | |
| Logo 中文色 | `var(--color-text-primary)` | |
| Logo 英文色 | `var(--color-text-muted)` | |
| Tagline 色 | `var(--color-brand)` (Auric Gold) | 唯一使用品牌色的文字 |
| 链接区 | 三列：旅行/服务/关于 | Scott Dunn footer 多列链接 |
| 列标题 | `color: var(--color-brand)`, `letter-spacing: 0.1em` | 金色点缀 |
| 链接色 | `var(--color-text-muted)`, hover → `var(--color-text-primary)` | |
| 认证行 | ATOL Protected, IATA, UK Company | Black Tomato footer: IATA, Virtuoso, ABTA |
| 联系方式 | +44 电话, service@aurictrip.com | Black Tomato footer: +44 电话 |
| 版权 | `© 2026 鎏光旅行 AuricTrip` | |

---

## 8. 详情页组件体系

按从上到下顺序，每个组件的设计决策：

### 8.1 HeroImage

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 高度（桌面） | `70vh`, `min-height: 420px` | Black Tomato 全屏大图 |
| 高度（移动） | `50vh`, `min-height: 280px` | |
| 文字叠加 | **无**。文字在图下方 TitlePrice 组件中 | 设计参考手册 2.1："纯图，不叠字" |
| 占位色（无图时） | `--color-bg-warm` (#f5f0eb) 暖米色 | 品牌色暖调延伸 |
| 图片加载 | `loading="eager"` (首屏大图) | |

### 8.2 TitlePrice

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 标签 | 小号金色字，`letter-spacing: 0.18em` | 赞那度产品分级标签 |
| 标题 | `font-family: var(--font-heading)`, `clamp(1.75rem, 4vw, 2.5rem)` | |
| 副标题 | `font-size: 1.05rem`, `color: var(--color-text-secondary)` | |
| 元信息（天数/季节） | `font-size: 0.85rem`, `color: var(--color-text-muted)` | |
| 价格 | `font-family: var(--font-price)`, `2rem`, `font-weight: 600` | 赞那度大号衬线体价格 |
| 价格后缀 | `起/人`, 小号灰色 | 赞那度 "起 /单人价格" |
| 免责声明 | "参考价，将根据出行人数、季节和定制需求有所调整" | 赞那度标准免责模板（设计参考手册 2.2） |

### 8.3 StickyTabNav

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 位置 | `sticky`, `top: 60px` | 设计参考手册 2.1："Sticky Tab 导航" |
| 背景 | `rgba(250, 250, 250, 0.95)` + `backdrop-filter: blur(8px)` | |
| 标签 | 行程安排 / 费用说明 / 酒店信息 / 预订须知 | 中式结构四大模块（设计参考手册 2.1） |
| 激活态 | 底部 2px 金色下划线 | |
| 滚动 | `overflow-x: auto`, 隐藏滚动条 | 移动端水平滚动 |
| 滚动监听 | IntersectionObserver, `rootMargin: -80px 0px -70% 0px` | |

### 8.4 TripHighlights

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 图标 | 菱形 `◆` 金色 | 简洁几何符号 |
| 布局 | 2-3 列网格 | |
| 每条 | 图标 + 一句话 | |

### 8.5 DayTimeline

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 布局 | 垂直时间轴，左侧金点 + 连接线 | 赞那度按天展开的行程结构 |
| 金点 | `10px` 圆形，`background: var(--color-brand)` | |
| 连接线 | `1px` 宽，`color-mix(..., 30%)` | |
| Day 标签 | `font-size: 0.65rem`, `letter-spacing: 0.18em`, 金色 | |

### 8.6 HotelSection

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 酒店名 | 具名 + 英文名 | 中式客户把酒店当卖点（设计参考手册 2.1） |
| 介绍 | 50-100 字 | 赞那度酒店介绍 80-200 字（设计参考手册 2.5） |
| 布局 | 卡片网格 | |
| 占位图 | `--color-bg-warm` 暖米色块 | |

### 8.7 CostComparison

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 布局 | 双列对比：✓ 费用包含 / ✕ 费用不含 | 设计参考手册 2.1："✅❌ 双列对比，不是一段文字" |
| 包含色 | `#2d6a4f`（深绿） | |
| 不含色 | `#9b2226`（深红） | |

### 8.8 BookingNotes

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 交互 | 手风琴折叠 | 设计参考手册 2.1 |
| 内容 | 预订流程、退改政策、签证信息、保险 | |

### 8.9 FAQ

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 交互 | 手风琴折叠 | 设计参考手册 2.1 |
| 数据源 | MDX frontmatter `faqs` 数组 | |

### 8.10 TrustAnchors

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 位置 | 酒店信息与预订须知之间 | |
| 布局 | 4 列网格 | |
| 内容 | ATOL保护 / 48h方案 / 24/7中文管家 / 30天改期 | 设计参考手册 2.3："7×24 救援承诺" |
| 图标 | `★` 金色 | |

### 8.11 FloatingCTA

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 位置 | `position: fixed; bottom: 0` | 设计参考手册 2.1："底部悬浮 CTA 栏"，赞那度 |
| 背景 | `rgba(255, 255, 255, 0.95)` + `backdrop-filter: blur(12px)` | 与页面背景同色系，半透明毛玻璃 |
| 顶部分隔 | `1px solid color-mix(in srgb, var(--color-brand) 20%, transparent)` | 金色细线点缀 |
| 显示条件 | 滚动过首屏后出现 | IntersectionObserver |
| 内容 | 左侧价格 + 右侧 "与顾问对话 →" | 赞那度模式 |
| 价格色 | `var(--color-text-primary)` | |
| CTA 色 | `var(--color-brand)` | 文字链接式 |
| iOS 安全区 | `padding-bottom: max(0.75rem, env(safe-area-inset-bottom))` | |

---

## 9. 首页组件体系

### 9.1 Hero

| 属性 | 值 | 竞品依据 |
|------|-----|---------|
| 背景 | 全屏大图（有图时）/ `--color-bg-warm` 渐变（无图时） | Black Tomato 全屏大图 |
| 文字 | 白色叠在图上 | Black Tomato hero 白色文字 |
| 主标题 | "鎏光旅行" | |
| 副标题 | "AURICTRIP" | |
| Tagline | "鎏光所至，皆为风景" / "Travel in a golden light." | |
| CTA | 文字链接式 "探索旅程 →" | Black Tomato "Explore our trips →" |

### 9.2 其他首页组件

| 组件 | 设计要点 | 竞品依据 |
|------|---------|---------|
| IPProductLines | 无边框卡片，hover 透明度 | |
| JourneyCards | 上图下文，指导价小字灰色 | |
| CustomerStories | 客户引言 + 名字 + 目的地 | Black Tomato 客户证言模块 |
| ExpertTeam | 专家介绍 | Scott Dunn "Meet Our Travel Specialists" |
| EmotionEngine | 情绪 → 目的地匹配 | Black Tomato "Feelings Engine" |
| TrustBar | 认证/奖项横条 | Black Tomato 奖项展示 |
| CTA | 主卡片保留金色边框 | |
| AudienceEntry | 客群入口 | Scott Dunn hero 客群胶囊按钮 |
| CustomizationFlow | 定制流程步骤 | Scott Dunn 预订流程 4 步骤 |

---

## 10. 响应式断点

| 断点 | 适用 | 竞品依据 |
|------|------|---------|
| `768px` | 平板/小屏（导航折叠、网格从 3 列变 1 列） | 通用 |
| `480px` | 手机（进一步缩小字号和间距） | |

移动端规则：
- 所有多列网格 → 单列
- 导航 → 汉堡菜单
- 区段间距减半（`--spacing-section-mobile`）
- 正文全宽，不再限制 `max-width`
- StickyTabNav 水平滚动

---

## 11. 禁止使用的设计元素

| 元素 | 原因 |
|------|------|
| 海军蓝 `#0A1628` | 无竞品依据 |
| 卡片 `box-shadow` | 违反西式奢侈品无阴影原则 |
| 卡片 `border`（除主 CTA 外） | 违反西式奢侈品无边框原则 |
| 实心品牌色大按钮 | 偏电商风格，不符合高端定位 |
| 圆角按钮 `border-radius` | Black Tomato/Scott Dunn 不使用 |
| 高饱和度色彩 | editorial reportage 调性要求低饱和 |
| 图标库（Font Awesome 等） | 用 Unicode 字符或 SVG，不加依赖 |
| 动画/transition 超过 0.3s | 西式高端站动效克制 |
| 图片上叠加文字 | 设计参考手册明确禁止 |
| 自动播放视频 | 设计参考手册 1.4："不用自动播放视频" |
| 闪烁/倒计时标签 | 设计参考手册 1.4："不用闪烁标签" |