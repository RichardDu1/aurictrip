# AuricTrip（鎏光旅行）网站流量诊断报告：结构 / 功能 / 审美 / SEO / GEO

> 诊断日期：2026-11-02
> 诊断对象：https://aurictrip.com （线上实测，Cloudflare Pages）+ 本仓库源码（`main` @ 1ee0f0b）
> 方法：curl 抓取线上 HTML 与响应头、模拟 Googlebot / GPTBot / ClaudeBot / PerplexityBot / Bytespider / Baiduspider / CCBot、本地完整构建后用脚本逐页解析（`scripts/audit-dist.py`）、浏览器在 1440 / 900 / 780 / 375 px 宽度实测、源码审查、品牌词搜索。
> 方法与结论框架沿用 oulutrip 项目的同名诊断报告。

---

## 0. 一句话结论

**这个站目前在搜索引擎眼里几乎是"不可收录"的：没有 sitemap、没有 robots.txt、没有一个 canonical，所有内页都要先 308 跳转一次，任何不存在的地址（包括 `/robots.txt`、`/sitemap.xml`）都以 200 返回首页；行程列表页的 53 个链接全部是死链（多了 `.md` 后缀），首页还有 18 种指向不存在页面的入口。** 内容本身（53 条有逐日行程、具名酒店、费用清单、FAQ 的长文）质量远好于一般模板站，问题集中在技术层与信任表述，修复成本低、收益高。

品牌词搜索 "aurictrip 鎏光旅行"、"aurictrip.com" **查不到本站任何结果**——与上述技术问题一致。

---

## 1. 现状快照（实测数据）

| 指标 | 实测值 | 评价 |
|---|---|---|
| 托管 | Cloudflare Pages（`aurictrip.pages.dev`），NS 为 Cloudflare | — |
| `https://aurictrip.com/journeys` 等所有内页（无斜杠） | **308 → 带 `/` 版本** | ❌ |
| `/robots.txt`、`/sitemap.xml`、`/sitemap-index.xml`、`/llms.txt` | **全部 200，内容是首页 HTML（33105 字节）** | ❌ 软 404 |
| 任意不存在的地址（`/nonexistent-xyz`、`/family`、`/journeys/kenya-safari.md`） | **200 + 首页内容** | ❌ 软 404 |
| `/favicon.ico` | 200，`text/html`（首页） | ❌ |
| canonical | **全站 0 个** | ❌ |
| Open Graph / Twitter 卡片 | **全站 0 个** | ❌ |
| JSON-LD 结构化数据 | **全站 0 个** | ❌ |
| `www.aurictrip.com` | 200 直接返回内容，**不跳转到裸域** | ❌ 重复站点 |
| `aurictrip.pages.dev` | 200，无 noindex | ⚠️ 重复站点 |
| `http://` | 301 → `https://` | ✅ |
| 详情页 `<title>` | `肯尼亚 \| 鎏光旅行 AuricTrip`（只有目的地名） | ⚠️ 关键词太弱 |
| 详情页 description | `肯尼亚 10天9晚 — 鎏光远征`（13 个字） | ⚠️ |
| 首页 `<title>` | `首页 \| 鎏光旅行 AuricTrip` | ❌ |
| 本地构建内部死链（脚本统计） | **558 处，涉及 71 个不同地址** | ❌ |
| 页面体积 | 首页 33 KB，详情页 ~48 KB，均为服务端渲染 | ✅ |
| AI / 搜索爬虫访问详情页 | 7 种 UA 全部 200 | ✅ 未拦截 |
| 安全/缓存头 | 有 nosniff、referrer-policy；HTML `max-age=0`，图片 4 小时 | ⚠️ 图片缓存偏短 |
| 统计 / 站长验证 | 源码与线上 HTML 均**未发现** GA4、Cloudflare Web Analytics、百度统计、Search Console 验证 | ❌ 无法度量 |
| 品牌词搜索 | "aurictrip 鎏光旅行"、"aurictrip.com" 均无本站结果 | ❌ |

---

## 2. SEO 技术层（最紧急）

### 2.1 ❌ P0：Cloudflare 适配器导致"整站软 404"

证据：`astro.config.ts` 使用 `@astrojs/cloudflare` 适配器，但 `output: "static"`，全站没有任何需要服务端运行的页面。构建产物里多了 `_worker.js` 与 `_routes.json`，`_routes.json` 只把已知目录排除在 Worker 之外，其余所有请求都进 Worker——线上表现就是**任何地址都 200 返回首页**：

```
robots.txt 200 33105
sitemap.xml 200 33105
llms.txt 200 33105
nonexistent-xyz 200 33105
journeys/kenya-safari.md 200 33105
favicon.ico 200 text/html
```

后果：
1. 搜索引擎请求 `robots.txt` 得到一份 HTML，按"无效 robots"处理；请求 sitemap 得到 HTML，sitemap 无法提交；
2. 站内 558 处死链在爬虫看来全部是"内容与首页完全相同的页面"，会被判定为大量重复/软 404，拉低整站质量评分；
3. 项目也没有 `404.astro`，即使去掉 Worker，Pages 也会回落成 SPA 模式（同样 200 返回首页）。

### 2.2 ❌ P0：尾斜杠 308 + 没有 canonical + 没有 sitemap

证据：`/journeys`、`/about`、`/journeys/kenya-safari` 全部 `308 → .../`；站内所有链接都写成无斜杠形式（`href="/about"`），所以**每一次站内点击和每一次爬虫跟链都要多一跳**。全站没有 canonical，也没有 sitemap，搜索引擎只能自己猜哪个版本是正版；同时 `www` 与 `pages.dev` 两个主机名也在 200 返回同样内容。这与 oulutrip 的问题同源（Astro 目录式输出 + Cloudflare Pages 的斜杠规则），只是这里连 canonical/sitemap 都没有。

### 2.3 ❌ P0：行程列表页与形态页的全部行程链接是死链

证据：`src/pages/journeys/index.astro:34` 与 `src/pages/journey-types/[type].astro:164` 使用 `href={`/journeys/${j.id}`}`，而本项目的内容集合 `id` 带 `.md` 后缀，线上 HTML 中出现 53 个 `/journeys/kenya-safari.md` 这样的链接（详情页路由已用 `j.id.replace(/\.md$/, "")` 处理，列表页漏掉了）。

后果：**"全部旅程"页——本应是爬虫发现 53 条行程的主入口——一条有效链接都没有**；详情页只能从首页 5 张卡片、Hero 轮播和目的地页的少量入口进入，大部分行程是孤岛。同一个 bug 还让形态页的卡片图片查表失败（`journeyImages[j.id]`），卡片全部空白。

### 2.4 ❌ P1：首页与页脚 18 种指向不存在页面的入口

本地构建脚本统计（每个地址被引用的次数）：

| 地址 | 引用次数 | 来源 |
|---|---|---|
| `/journey-types` | 192 | 导航"旅行形态"、页脚 |
| `/family`、`/bespoke`、`/groups` | 64–65 | 页脚"服务"栏（每页都有） |
| `/honeymoon`、`/solo`、`/senior` | 1 | 首页"你想怎样出发" |
| `/journey-types/stargazing` 等 6 个 | 1 | 首页"鎏光产品线" |
| `/inspiration/wonder` 等 5 个 | 1 | 首页"此刻你想要怎样的情绪" |

**主导航第二项就是死链**，每个页面都有 4 个页脚死链。

### 2.5 ⚠️ P1：标题与描述缺少搜索意图

- 首页 title 是"首页"；详情页 title 只有目的地名（"肯尼亚"），没有"天数 / 定制旅行 / 行程名"等用户实际会搜的词；
- 详情页 description 只有"肯尼亚 10天9晚 — 鎏光远征"，没有价格、季节、亮点；
- `BaseLayout.astro` 里还有一条全站默认 description（目前各页都传了值，未触发，但属于隐患）。

### 2.6 ⚠️ P2：结构化数据与分享卡片完全缺失

53 个详情页有现成的逐日行程、三档价格、FAQ，但没有 `TouristTrip` / `Offer` / `FAQPage` / `BreadcrumbList`；首页没有 `TravelAgency` / `WebSite`；也没有 `og:image`，在微信、WhatsApp 中分享链接时没有缩略图和摘要——对一个依赖私域转发的高端旅行品牌，这一点直接影响转化。

### 2.7 ⚠️ P2：其他

- **Google Fonts 同步加载 5 个字体族（含两套中文全量字体）**：目标客户在中国大陆，`fonts.googleapis.com` 在大陆不可达，`<link rel="stylesheet">` 是渲染阻塞资源，页面会白屏到请求超时；
- `journey-types` 页的 hero 图使用 `images.unsplash.com` 外链（大陆访问不稳定，且与站内本地图库不一致）；
- 图片：318 张 1200px 宽 JPG，共 82 MB，单张最大约 340 KB，没有 WebP/AVIF 与响应式尺寸；图片缓存只有 4 小时；
- 没有 favicon；
- `npm test` 现有 24 个用例失败（测试仍在找 `.mdx` 文件，内容早已改为 `.md`），测试已失去保护作用。

---

## 3. 网站结构与信息架构

- **结构本身清晰**：首页 → 目的地 / 旅行形态 / 灵感 → 行程详情，53 条行程都是服务端渲染的独立页面，正文平均 100+ 行，这是好底子。
- ❌ **列表页链接全坏（见 2.3）**，导致"首页 → 全部旅程 → 详情"这条主路径断开。
- ❌ **详情页之间没有互链**：详情页底部没有"相关行程"，爬虫与用户到了详情页就无路可走。
- ⚠️ **"旅行形态"只有 3 个价格档位页 + 1 个总览**，而首页、页脚承诺的"亲子 / 蜜月 / 独行 / 银发 / 星空 / 美食 / 故事 / 秘境"等入口都没有对应页面。内容集合里其实有 `type` 字段（文化深度 22 条、野奢自然 17 条、美食美酒 5 条……），这些聚合页是否要做、做成什么样属于产品决策（见第 9 节）。
- ⚠️ **形态页 URL 用中文**（`/journey-types/鎏光臻选`）：技术上可用，分享时会变成一长串 `%E9%8E%8F...`。

---

## 4. 内容质量与 E-E-A-T

### 做得好的
- 每条行程有具名酒店、逐日安排、费用包含/不含、退改政策、FAQ——这些正是 AI 搜索与高端客户都看重的"可核实细节"。

### ❌ 无法核实或可能有法律风险的表述（需要所有者确认）
| 表述 | 位置 | 风险 |
|---|---|---|
| "ATOL/ABTA 保护 · 资金法定托管" | 首页信任条 `TrustBar.astro` | 站内没有任何 ATOL 编号、ABTA 会员号；在英国，**无证宣称 ATOL 保护属违法**（CAA 执法） |
| "ATOL Protected · ABTA Member · IATA Accredited · UK Registered Company" | 每页页脚 `Footer.astro` | 同上；也没有公司全称和注册号 |
| "我们持有 ATOL 和 IATA 认证" / "公司注册号与 IATA 资质公开可查" | `about`、`why-aurictrip` | 说"公开可查"却不给编号，反而降低可信度 |
| 三位客户证言（"张女士 2024年7月坦桑尼亚"等） | 首页 `CustomerStories.astro` | 若非真实客户，属于英国 DMCC Act 2024 明确禁止的虚假评价 |
| 四位"目的地专家"（林语洲、苏望川……）及"在当地生活超过十年" | 首页 `ExpertTeam.astro` | 无照片、无履历；若为虚构人物会严重伤害信任 |
| "48小时方案 / 24/7 中文管家 / 30天免费改期" | 信任条、详情页 | 服务承诺，需确认能兑现，且与各行程 `cancellationPolicy` 是否一致 |

本轮**没有修改**这些表述（是否真实只有所有者能确认）。所有者已明确要求这类内容在代码中保持原样，此处仅保留核实建议，列入第 9 节待决策清单。

### ⚠️ 价格口径不一致
- 列表页、形态页、目的地页显示 `price` 字段（如肯尼亚 ¥72,800 起），详情页首屏和底栏显示三档套餐中的最低价（¥65,500 起），**同一行程两个"起价"**；
- 详情页顶部标签写"鎏光远征"（`priceLevel`），默认选中的套餐却叫"鎏光臻选"，产品线名与套餐名混用。

---

## 5. 功能与转化路径

| 问题 | 证据 | 影响 |
|---|---|---|
| ❌ 联系表单不提交到任何地方 | `contact/index.astro` 的 `<form>` 没有 `action`、输入框没有 `name`、也没有脚本 | 访客填完点提交，页面刷新、信息丢失，**是最直接的询盘流失** |
| ⚠️ 主 CTA 都指向 `/contact` | 导航、详情页底栏 | 依赖上面那个坏表单；电话/WhatsApp/微信可用 |
| ⚠️ 无统计 | 见 1 | 不知道哪个渠道、哪条行程带来询盘 |

---

## 6. 审美与视觉

- 整体"静奢"方向成立：大幅 hero、衬线中文标题、留白、金色点缀，首页轮播质感好。
- ❌ **"全部旅程"列表页的 53 张卡片图片位全部是空白色块**（`listing-card-img` 是空 `<div>`），这是全站最影响观感的页面；形态页卡片同样空白（见 2.3）。
- ⚠️ 平板宽度（768–1024px）列表页仍是 3 列，卡片过窄；手机端没有横向溢出。
- ✅ 导航在 780 / 900 px 宽度下单行显示，未出现 oulutrip 那样的折行。
- ⚠️ 专家卡片只有一个空白头像圆圈，进一步放大了"虚构团队"的观感。

---

## 7. GEO（ChatGPT / Perplexity / Google AI Overview / 豆包 / Kimi）

### 已经做对的
- 所有爬虫 UA（含 GPTBot、ClaudeBot、PerplexityBot、Bytespider）都能 200 拿到详情页完整 HTML；
- 行程正文事实密度高（酒店名、天数、季节、每日安排），非常适合被引用。

### 问题
1. **`llms.txt` 不存在**（请求返回首页 HTML）；
2. **没有任何实体信号**：没有 Organization/TravelAgency 结构化数据，页面上也没有公司全称、注册号、地址；AI 做实体识别时无法把"鎏光旅行""AuricTrip""aurictrip.com"关联为同一家公司；
3. **品牌在搜索中不存在**，AI 搜索引用的前提是先被搜索引擎收录与第三方提及；
4. 价格口径不一致（见 4）会让 AI 摘要给出互相矛盾的数字。

---

## 8. 渠道与战略层

目标客户是中国高净值人群，主要在小红书、微信、抖音和熟人推荐里决策；Google 在大陆不可用，百度未做任何提交。与 oulutrip 相同的判断：**网站的首要任务是"承接与成交"——让从私域、小红书过来的人相信你（真实资质、真实案例）、方便留资（能用的表单）、能被统计**；SEO/GEO 是中长期渠道，但先要让站点"可被收录"。

---

## 9. 整改路线图

### 第 1 周：技术止血（本轮已完成，见 `docs/SEO技术修复成果报告.md`）
1. 去掉 Cloudflare 适配器，改纯静态 + `build.format: 'file'`，增加真正的 404 页；
2. 全站 canonical、OG、结构化数据；sitemap（行程按 git 提交时间给 lastmod）；robots.txt；llms.txt；favicon；
3. 修复 558 处内部死链（列表页 `.md`、导航与首页 18 个不存在的入口），旧地址 301；
4. 每页唯一、带搜索意图的 title 与 description；
5. 列表页/形态页配图、详情页"相关行程"互链；
6. 字体异步加载；联系表单可用（邮件兜底）；统计与站长验证可通过环境变量开启。

### 需要所有者决策 / 操作
7. **核实并处理资质表述**：若持有 ATOL/ABTA/IATA，请在页脚和"关于我们"写明编号与公司全称（Highland Travel Group Ltd？）和注册号；若没有，请立即删除相关表述；
8. **客户证言与专家团队**：换成真实客户（可匿名但需可追溯）与真实团队成员（照片、履历），或暂时下线这两个模块；
9. **统一"起价"口径**：列表页用 `price` 还是最低套餐价，二选一；理顺 `priceLevel`（产品线）与套餐名的关系；
10. **Cloudflare 设置**：给 `www.aurictrip.com` 加 301 到裸域的重定向规则；在 Pages 环境变量填入 `PUBLIC_GA4_ID` 或 `PUBLIC_CF_BEACON_TOKEN`、`PUBLIC_GSC_VERIFICATION`；
11. **提交收录**：Google Search Console、Bing Webmaster（同时影响 ChatGPT 搜索）、百度搜索资源平台提交 `https://aurictrip.com/sitemap.xml`；
12. ~~表单后端~~：已接入集团表单系统 form.highland-travel.com（见修复报告第七节）；
13. **是否建设聚合落地页**：亲子、蜜月、银发、美食、极地等按 `type` 或人群的聚合页（目前入口已临时指向最贴近的单条行程），每页需要原创导语与 FAQ，建议先做 3–5 个最有把握的。

### 第 2–3 个月：增长
14. 图片转 WebP/AVIF + 响应式尺寸（预计可省 30–60% 流量）；
15. 每个核心目的地做"事实卡"内容（最佳季节、推荐天数、各人数人均价、车程表、FAQ），便于 AI 引用；
16. 小红书 / 微信公众号内容与网站互链，积累第三方提及；Google Business Profile（伦敦地址）。

---

## 附录：关键证据位置

- 适配器与配置：`astro.config.ts`（`adapter: cloudflare()`，无 `site`、无 `build.format`）
- Layout：`src/layouts/BaseLayout.astro`（无 canonical / OG / JSON-LD，字体同步加载）
- 列表页 `.md` 死链：`src/pages/journeys/index.astro:34`、`src/pages/journey-types/[type].astro:164`
- 不存在的入口：`src/components/Navigation.astro:4`、`Footer.astro:11-18`、`AudienceEntry.astro`、`IPProductLines.astro`、`EmotionEngine.astro`
- 坏表单：`src/pages/contact/index.astro:48`
- 资质与证言：`TrustBar.astro`、`Footer.astro:27`、`about/index.astro:61`、`why-aurictrip/index.astro:12`、`CustomerStories.astro`、`ExpertTeam.astro`
- 价格口径：`journeys/index.astro`（`data.price`）vs `detail/TitlePrice.astro`（最低套餐价）
- 逐页检查脚本：`scripts/audit-dist.py`
