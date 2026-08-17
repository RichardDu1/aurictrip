# AuricTrip (鎏光旅行) 完整交接文档

> 目的：供下一位 Agent 无缝接手项目。本文档事无巨细地记录项目状态、技术架构、已完成工作、关键约定与遗留事项。
> 生成日期：2026-07-29（今日日期线之后由接手者更新）
> 当前位置 HEAD：`7b3c955`，最新 tag：`v0.2-checkpoint`

---

## 0. 项目一句话

**面向中国高净值人群的全球高端旅行定制网站**。核心策略是 **"Black Tomato 级的产品力 + 赞那度级的中文呈现"**——用西方高端站的editorial产品叙事，以中文富人习惯的配置式决策结构（显价、具名酒店、费用清单）呈现。竞争定位是**英国根基 + 欧洲深度**，不与赞那度的"国内出发+含机票"正面竞争。

---

## 1. 技术栈与运行方式

| 项 | 值 |
|---|---|
| 框架 | Astro 5.18（`output: "static"`） |
| 渲染 | 完全静态生成，全部页面在构建时预渲染 |
| 部署适配 | `@astrojs/cloudflare` adapter（Cloudflare Pages） |
| 样式 | Tailwind CSS 4（通过 Vite 插件）+ 组件级 `<style>` scoped CSS |
| JS 交互 | **零框架**，全部用组件内原生 `<script>` 块（IntersectionObserver、CustomEvent 等） |
| 路径别名 | `@`/`@components`/`@layouts`/`@styles`/`@assets`/`@content`/`@lib`（见 `astro.config.ts` + `tsconfig.json`，两处必须同步加） |
| 构建 | `npm run build`（= `astro check && astro build`，check 带 TS strict 类型检查） |
| 本地开发 | `npm run dev`（默认 4321 端口） |
| 类型 | TypeScript strict 模式，模板里的 `.map()` 回调参数必须显式写类型（`(j: CollectionEntry<"journeys">)` 或 interface），否则 7006 隐式 any 报错 |

**构建验证要点**：每次改动后 `npm run build` 必须 **0 errors 0 warnings**。strict 模式下最常见的坑是模板内 map 回调缺类型注解。

---

## 2. 内容系统（核心数据源）

### 2.1 内容集合
Schema 定义在 [src/content/config.ts](src/content/config.ts)，collection 名为 `journeys`，内容是 `.md` 文件（**注意不是 .mdx**——glob-loader 在静态构建下找不到 .mdx，之前踩过坑）。

**53 个 journey 文件**在 `src/content/journeys/*.md`，文件名即 slug（如 `kenya-safari.md` → URL `/journeys/kenya-safari`）。

### 2.2 frontmatter 完整字段（当前全部 53 条已填）
```yaml
---
label: "旷野呼唤"                    # 诗意中文名
destination: "肯尼亚"                # 目的地（一个目的地可能对应多条行程）
days: 10                            # 数字
nights: 9                           # 数字
price: 72800                        # 起价（数字，无引号）
priceLevel: "鎏光远征"               # 枚举：鎏光定制|鎏光臻选|鎏光远征
type: "野奢自然"                     # 枚举：私人定制|臻选小团|亲子时光|里程碑时刻|极地探索|文化深度|美食美酒|野奢自然
season: "7月-10月"                   # 最佳季节文字
featured: true                      # 是否首页精选
heroImage: "/images/journeys/kenya-safari/kenya-safari-1.jpg"
gallery:                            # 6张画廊图数组
  - "/images/journeys/kenya-safari/kenya-safari-1.jpg"
  - "...-2.jpg" ... "...-6.jpg"
packages:                           # 3档套餐
  - name: "鎏光臻选"                 # 固定三档名
    price: 65500
    description: "标准五星酒店，含中文向导"  # 贴合真实酒店名
    hotelTier: "奢华五星"            # 可选
  - name: "鎏光定制"
    price: 91000
  - name: "鎏光远征"
    price: 123800
subtitle: "..."                    # 一行副标题
highlights: [ "...", "..." ]       # 行程亮点字符串数组（5条）
hotels:                            # 具名酒店（中国客户把酒店当卖点）
  - name: "Angama Mara"
    location: "马赛马拉"
    description: "..."
included: [ "..." ]               # 费用包含（字符串数组）
excluded: [ "..." ]               # 费用不含
bookingNotes: "..."               # 预订须知
cancellationPolicy: "..."         # 退改政策
faqs:                             # 常见问题
  - question: "..."
    answer: "..."
---
```

### 2.3 三档套餐定价规则（已应用到全部 53 条）
基于每条行程当前的 `price` 推导：
- **鎏光臻选** = round(price × 0.9 / 100) × 100 —— 起价档，标准五星
- **鎏光定制** = round(price × 1.25 / 100) × 100 —— 中高档，奢华五星/特色酒店
- **鎏光远征** = round(price × 1.7 / 100) × 100 —— 顶档，顶级野奢/远征

### 2.4 图片资源
- **318 张图**：53 条 × 6 张，在 `public/images/journeys/{slug}/{slug}-{1-6}.jpg`
- 来源：Unsplash 免费图，**已下载到本地**管理（未 hotlink）
- 命名约定：`-1` 是主封面（`heroImage`），`-2`~`-6` 是画廊
- 少数行程可能有轻微重复图（如 maldives 之前手动补过），不影响功能

---

## 3. 页面结构（src/pages/）

| 路由 | 文件 | 说明 |
|---|---|---|
| `/` | [src/pages/index.astro](src/pages/index.astro) | 首页，纵向拼接各组件 |
| `/destinations` | [src/pages/destinations/index.astro](src/pages/destinations/index.astro) | **动态**读 collection 按大洲分组 |
| `/journeys` | [src/pages/journeys/index.astro](src/pages/journeys/index.astro) | 全部旅程列表（读 collection，排序） |
| `/journeys/[slug]` | [src/pages/journeys/[slug].astro](src/pages/journeys/[slug].astro) | 详情页核心路由 |
| `/journey-types/[type]` | [src/pages/journey-types/[type].astro](src/pages/journey-types/[type].astro) | 旅行形态落地页（收费光费率3档） |
| `/inspiration` | [src/pages/inspiration/index.astro](src/pages/inspiration/index.astro) | 灵感中心 |
| `/about` | [src/pages/about/index.astro](src/pages/about/index.astro) | 关于我们 |
| `/contact` | [src/pages/contact/index.astro](src/pages/contact/index.astro) | 联系表单 |
| `/why-aurictrip` | [src/pages/why-aurictrip/index.astro](src/pages/why-aurictrip/index.astro) | **竞争叙事页**（英国根基+欧洲深度） |

### 3.1 详情页 [slug].astro 数据流（关键 Pattern）
```astro
// getStaticPaths: 遍历 collection 生成 /journeys/{slug}
export async function getStaticPaths() {
  const journeys = await getCollection("journeys");
  return journeys.map((j) => ({ params: { slug: j.id.replace(/\.md$/, "") } }));
}
export const prerender = true;   // 必须，否则静态构建失效

// 页面体：find 匹配 → 解构 data/body → 透传给组件
const { data, body } = journey;
const { Content } = await journey.render();
const subtitle = data.subtitle || (body.match(/^##\s*(.+)/m)?.[1]?.replace(/^[^·]+·\s*/, "") || "");
const gallery = data.gallery?.length ? data.gallery : (data.heroImage ? [data.heroImage] : []);
const packages = data.packages ?? [];
const lowestPrice = packages.length ? Math.min(...packages.map(p => p.price)) : data.price;
```

组件装配顺序：`Gallery(或HeroImage) → TitlePrice → StickyTabNav → TripHighlights → DayTimeline → Content(正文) → CostComparison → HotelSection → TrustAnchors → BookingNotes → FAQ → Footer → FloatingCTA(底栏)`

### 3.2 多套餐联动机制（关键 Pattern）
- [TitlePrice.astro](src/components/detail/TitlePrice.astro) 渲染 3 档套餐卡，点击时 `window.dispatchEvent(new CustomEvent("package-change", { detail: { price, name } }))`
- [FloatingCTA.astro](src/components/detail/FloatingCTA.astro) 监听 `package-change` 事件更新底部价格栏
- 这俩是**同页面跨组件通信**，靠 window CustomEvent 解耦

---

## 4. 组件清单（src/components/）

### 4.1 首页组件
| 组件 | 说明 |
|---|---|
| [Navigation.astro](src/components/Navigation.astro) | 固定导航，含"为什么选择鎏光"入口，滚动变背景，移动端汉堡菜单 |
| [Hero.astro](src/components/Hero.astro) | **首页 hero 轮播**：读 collection featured 行程，全屏本地图，品牌首载居中后淡出，底部目的地信息，右侧竖排导航点，进度条，悬停暂停 |
| [TrustBar.astro](src/components/TrustBar.astro) | 信任条：ATOL/ABTA · 48h方案 · 24/7中文管家 · 30天改期 · 品牌直签 |
| [AudienceEntry.astro](src/components/AudienceEntry.astro) | 目标人群入口 |
| [EmotionEngine.astro](src/components/EmotionEngine.astro) | 情感叙事引擎 |
| [IPProductLines.astro](src/components/IPProductLines.astro) | 鎏光产品线（定制/臻选/远征） |
| [JourneyCards.astro](src/components/JourneyCards.astro) | **精选旅程**：读 collection featured，1大editorial hero卡+5网格卡，显示起价 |
| [ExpertTeam.astro](src/components/ExpertTeam.astro) | 专家团队 |
| [CustomizationFlow.astro](src/components/CustomizationFlow.astro) | 定制流程 |
| [CustomerStories.astro](src/components/CustomerStories.astro) | 客户故事 |
| [CTA.astro](src/components/CTA.astro) | 转化引导 |
| [Footer.astro](src/components/Footer.astro) | 页脚（含英国公司信任锚点） |
| [WeChatShare.astro](src/components/WeChatShare.astro) | 微信分享 |
| [ProgressiveImage.astro](src/components/ProgressiveImage.astro) | 智能图片（有src渲染img，无src渲染色块占位） |

### 4.2 详情页组件（src/components/detail/）
| 组件 | 说明 |
|---|---|
| [Gallery.astro](src/components/detail/Gallery.astro) | 6图画廊：21:9主图+5缩略图，原生JS切换，图片计数器 |
| [HeroImage.astro](src/components/detail/HeroImage.astro) | 单一hero图（gallery无图时的回退），src为空显示色块 |
| [TitlePrice.astro](src/components/detail/TitlePrice.astro) | 标题+副标题+天数+季节+决策区（3档套餐卡，默认选最低档） |
| [StickyTabNav.astro](src/components/detail/StickyTabNav.astro) | 粘性标签导航，IntersectionObserver 滚动高亮 |
| [TripHighlights.astro](src/components/detail/TripHighlights.astro) | 行程亮点：带边框编号网格 |
| [DayTimeline.astro](src/components/detail/DayTimeline.astro) | **每日行程**：左右交替图文（每配一张画廊图），圆形序号 |
| [HotelSection.astro](src/components/detail/HotelSection.astro) | **具名酒店**：图片背景卡（用画廊图），No.01编号 |
| [CostComparison.astro](src/components/detail/CostComparison.astro) | 费用包含/不含双列对比，✓/× |
| [BookingNotes.astro](src/components/detail/BookingNotes.astro) | 预订须知+退改政策手风琴 |
| [FAQ.astro](src/components/detail/FAQ.astro) | 常见问题手风琴 |
| [TrustAnchors.astro](src/components/detail/TrustAnchors.astro) | 信任条目（ATOL/FloatingCTA 联动） |
| [FloatingCTA.astro](src/components/detail/FloatingCTA.astro) | 底部固定CTA栏，监听套餐切换更新价格 |

### 4.3 工具库
| 文件 | 说明 |
|---|---|
| [src/lib/journeys-meta.ts](src/lib/journeys-meta.ts) | **slug→大洲映射 + 每条6张图关键词**。53条手动归类7大洲（亚洲/欧洲/非洲/北美洲/南美洲/大洋洲/极地与中东）。含 `groupByRegion()` 和 `getMetaBySlug()` |


---

## 5. 竞品调研结论（重要，影响产品方向）

**已实地浏览器调研 zanadu.com.cn（赞那度）**：
- 赞那度：50+ 目的地、6 大产品类型、**行程标题极长且把所有卖点塞进标题**、**多套餐定价**（同一条坦桑尼亚行程 4 档 ¥79.6K/¥80.8K/¥110.8K/¥139.9K 按季节+酒店等级）、**含国际机票**、**按国内出发城市（北京/上海/香港）分 tab 给参考航班**
- 赞那度的核心优势 = 国内出发整合。我们**不正面竞争**。
- 我们的差异化定位（已确认）：**英国根基 + 欧洲深度**——伦敦团队、ATOL/ABTA 资金法定托管、欧洲小众目的地（苏格兰/格鲁吉亚/葡萄牙/冰岛/希腊/克罗地亚）近水楼台、欧洲端专车+中文管家接驳、48h方案交付、30天免费改期

---

## 6. 已完成工作里程碑（git 历史）

| Commit | 说明 |
|---|---|
| `35eb591` | 重写旅行形态落地页 |
| `b7134b5` | 目录扩展到 22 条旅程 |
| `e595128` | **修复详情页返回首页内容的 bug**（之前 .mdx→.md、YAML、prerender） |
| `648b70d`+`30ac09a` | Tier 1 旅程（12条） |
| `686892e`+`b0f663c` | Tier 2 前半（约5条） |
| `2e2d2f0` | Tier 2 完成（巴西/卢旺达/斯里兰卡/新加坡/马来/斐济/苏格兰） |
| `6cd6ef0` | **Tier 3 完成（7条：蒙古/埃塞俄比亚/格鲁吉亚/马达加斯加/阿曼/巴新/格陵兰），共53条** |
| `cadd9f3` | 产品覆盖计划标记完成 |
| `9133406` | **内容呈现升级**：318张画廊图 + heroImage/gallery/packages schema + 动态目的地页 + Gallery组件 + 多套餐TitlePrice/FloatingCTA + /why-aurictrip页 |
| `7b3c955` | **本文档之前最后一版**：首页hero+详情页editorial布局打磨 |

### 里程碑汇总
- **内容**：53 条旅程（Tier 1 的12条 table stakes + Tier 2 的13条 parity + Tier 3 的8条 differentiators）全部有完整中文 frontmatter + editoral 正文 + 具名酒店 + 6张图 + 3档套餐
- **图片**：318 张 Unsplash 本地图
- **页面**：首页/目的地/列表/53详情/旅行形态/灵感/关于/联系/为什么选择鎏光 全部可访问
- **Checkpoint tag**：`v0.2-checkpoint`（内容呈现升级完成后的稳定基线，已推送远程）

---

## 7. 关键约定与"踩过的坑"（避免重复踩）

1. **journey 内容用 `.md` 不是 `.mdx`**——静态构建下 .mdx 找不到
2. **YAML frontmatter**：中文内容必须用单引号或双引号包裹，`price`/`days` 用裸数字，不要出现重复 key（之前 oman 有 duplicate highlights key 导致解析失败）
3. **TS strict**：模板里 `.map((x) => ...)` 必须给 x 显式类型，否则 7006
4. **路径别名**：加新 alias 要同步改 `astro.config.ts` 的 vite.alias 和 `tsconfig.json` 的 paths
5. **[slug].astro 必须 `export const prerender = true;`**——否则详情页预渲染失效
6. **slider/轮播、套餐切换等交互全部原生 JS**，不引框架
7. **所有图片存本地** `public/images/`，不 hotlink 远程（避免构建时外部依赖）
8. **多套餐"含机票吗"**：我们的套餐**不含国际机票**（赞那度含），因为不做国内出发整合

---

## 8. 现有 bug / 遗留问题（接手者应检查）

- **尚未人工 QA**：53 个详情页、首页各组件、目的地页、why-aurictrip 页的视觉仅在浏览器抽查过首页/详情/目的地，未全量验证。建议每页截图走查。
- **Maldives 画廊可能有 2 张重复图**（手动补下载时的photo ID 撞了），视觉影响小但可换。
- **酒店/餐厅图**：部分行程的 hotels 用画廊图轮转，但酒店本身没有独立专属照片（画廊里是目的地风景图），如果要求"每间酒店一张真实照片"需要补，工作量较大。
- **无图片懒加载优化**：用原生 `<img>` + `loading="lazy"`，未用 astro:assets 图片优化（构建期优化）。
- **SEO/schema**：详情页没有 JSON-LD（Product/Trip）结构化数据，未做 SSR meta 深度优化。
- **首页 Hero**：`heroJourneys` 只取 featured 且按价格降序，若未来 featured 少于5条会轮播不足——可考虑用 gallery 或 price 补齐。
- **套餐切换状态**：只能在客户端切换，刷新后回到默认最低档。包换 url 参数（如 ?pkg=定制）暂未实现。

---

## 9. 下一步方向建议（基于正在进行的打磨目标）

用户 /goal 指令：**"行程页面还需打磨，首页还不够惊艳，这一版做 checkpoint，然后在这个基础上让首页更惊艳"**。

已完成的打磨（commit `7b3c955`）：
- 首页 Hero 全屏化、首发品牌淡出
- JourneyCards 杂志式大图卡
- 详情页 Gallery 电影宽幅 + DayTimeline 图文交替 + HotelSection 图片卡

**可选继续方向**：
- 全宽目的地大图墙（瀑布流）
- TrustBar 视觉化认证徽章
- 首页加 CTA 高峰区（当前段落多但缺视觉顶点）
- SEO/JSON-LD
- 移动端打磨

---

## 10. 记忆文件（跨会话持久记忆）

已保存到 `C:\Users\Administrator\.claude\projects\d--Projects-travelsite\memory\`：
- `aurictrip-brand.md` —— 品牌 AuricTrip/鎏光旅行，aurictrip.com，品牌色 Auric Gold #C9A96E
- `uk-company-no-chinese-compliance.md` —— 英国公司无需中国合规，信任锚点用ATOL/ABTA/IATA
- `product-positioning-uk-root.md` —— 竞争定位：英国根基+欧洲深度
- `content-presentation-upgrade.md` —— 内容呈现升级的技术细节
- `MEMORY.md` —— 索引

---

*本文档由 Claude 在 2026-07-29 会话结束时生成，用于 Agent 交接。接手者可用 `/browse` 或 Playwright 做视觉走查，用 `npm run build` 验证构建。*
