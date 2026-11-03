# SEO 技术修复成果报告（第一轮）

> 日期：2026-11-03
> 对应诊断：`docs/网站流量诊断报告_结构功能审美SEO与GEO全面分析.md`
> 分支：`claude/seo-audit-fix-766456`（需合并到 `main` 后才会在 aurictrip.com 生效，**本轮未合并**）

## 一、修复清单

| # | 问题 | 修复 | 涉及文件 |
|---|---|---|---|
| 1 | Cloudflare 适配器的 `_worker.js` 让任何地址（含 robots.txt、sitemap、favicon）200 返回首页 | 去掉 `@astrojs/cloudflare`，改为纯静态输出；新增真正的 `404.astro`（`noindex`） | `astro.config.ts`、`package.json`、`src/pages/404.astro` |
| 2 | 所有内页 308 跳转到带斜杠版本 | `build.format: "file"` + `trailingSlash: "never"`，产物为 `journeys/x.html`，无斜杠地址直接 200 | `astro.config.ts` |
| 3 | 全站没有 canonical / OG / 分享图 | `BaseLayout` 统一输出 canonical（规范化为无斜杠绝对地址）、`og:*`、`twitter:card`、`og:image` | `src/layouts/BaseLayout.astro`、`src/lib/seo.ts` |
| 4 | 没有 sitemap / robots.txt / llms.txt / favicon | 新增 `sitemap.xml`（64 个 URL，53 条行程按 git 最后提交日期给 `lastmod`，浅克隆时自动不输出）、`robots.txt`、`llms.txt`（由行程数据自动生成：天数、类型、指导起价、最佳季节、链接）、`favicon.svg` | `src/pages/sitemap.xml.ts`、`src/pages/llms.txt.ts`、`src/lib/site-pages.ts`、`public/` |
| 5 | 列表页、形态页 53 个行程链接带 `.md` 后缀（死链），卡片图片因同一原因全部空白 | 统一用 `journeySlug()`；新增共用卡片组件 `JourneyListCard`，使用行程本地主图，带 `alt`、`loading="lazy"`、宽高 | `src/components/JourneyListCard.astro`、`journeys/index.astro`、`journey-types/[type].astro` |
| 6 | 导航、页脚、首页共 18 种指向不存在页面的入口 | 指向现有最贴近的页面（如"亲子"→坦桑尼亚亲子行程，"私人定制"→鎏光定制形态页，"旅行形态"→总览页）；旧地址在 `_redirects` 中 301，`.md` 旧链接也 301 到正式地址 | `Navigation`、`Footer`、`AudienceEntry`、`IPProductLines`、`EmotionEngine`、`public/_redirects` |
| 7 | 详情页是孤岛 | 详情页底部新增"你可能也会喜欢"（同类型优先、价格相近的 3 条）；页脚新增"全部旅程"入口 | `src/components/detail/RelatedJourneys.astro`、`Footer.astro` |
| 8 | 首页 title 是"首页"，详情页 title 只有目的地名，description 过短 | 每页独立 title / description：详情页为"肯尼亚10天9晚高端定制旅行 · 旷野呼唤"，描述包含天数、指导起价、最佳季节与行程导语；其余 8 个页面各自重写 | 各页面 |
| 9 | 全站没有结构化数据 | 首页 `TravelAgency` + `WebSite`；关于页 `TravelAgency`；详情页 `TouristTrip`（含逐日 `itinerary`、三档 `Offer`，人民币）+ `BreadcrumbList` + 行程自己的 `FAQPage`（43 条有 FAQ 的行程）；列表页与形态页 `ItemList` + 面包屑。只使用页面上已展示的事实，**未写入评分、评价、资质编号** | `src/lib/seo.ts`、各页面 |
| 10 | Google Fonts 同步加载阻塞渲染（大陆不可达） | 改为脚本异步注入 + `<noscript>` 兜底；字体栈补充苹方 / 微软雅黑 / 宋体系统字体，字体加载失败时不再白屏 | `BaseLayout.astro`、`global.css` |
| 11 | 形态页 hero 图使用 Unsplash 外链 | 改为站内本地图片 | `journey-types/[type].astro` |
| 12 | 联系表单不提交到任何地方 | 输入框补 `name` 与必填校验；提交时把内容整理成邮件，打开访客的邮件应用发送到 service@aurictrip.com（无后端的兜底方案，页面上已说明） | `contact/index.astro` |
| 13 | 无统计、无站长验证 | Layout 支持环境变量 `PUBLIC_GA4_ID`、`PUBLIC_CF_BEACON_TOKEN`（Cloudflare Web Analytics）、`PUBLIC_GSC_VERIFICATION`、`PUBLIC_BAIDU_VERIFICATION`，未配置时不输出任何代码 | `BaseLayout.astro` |
| 14 | `*.pages.dev` 与正式域名内容重复；图片缓存仅 4 小时 | `_headers`：pages.dev 生产与预览地址加 `X-Robots-Tag: noindex`；`/_astro/*` 一年 immutable，`/images/*` 30 天；补 `X-Frame-Options` | `public/_headers` |
| 15 | 平板宽度列表 3 列过窄 | 1024px 以下列表页与形态页改为 2 列 | 两个列表页 |
| 16 | 缺少可重复的检查手段 | 新增 `scripts/audit-dist.py`（`npm run audit:seo`） | `scripts/`、`package.json` |

## 二、验证

### 本地构建
- `npm run build`（含 `astro check`）：**0 errors / 0 warnings / 0 hints**，生成 64 个页面 + 404 + sitemap.xml + llms.txt。
- 产物结构：`dist/journeys/kenya-safari.html`、`dist/journeys.html`、`dist/journey-types/鎏光臻选.html`，无 `_worker.js`。

### 逐页脚本检查（`python3 scripts/audit-dist.py dist`）

| 检查项 | 修复前 | 修复后 |
|---|---|---|
| 每页恰好 1 个 title / canonical / description | canonical 64 页全部缺失 | ✅ 64/64 |
| canonical 等于自身 URL | — | ✅ 0 例外 |
| title、description 全站唯一 | — | ✅ 0 重复 |
| 每页 1 个 h1 | ✅ | ✅ |
| 内部死链（含图片） | **558 处 / 71 个地址** | ✅ 0 |
| JSON-LD 可解析 | 无 JSON-LD | ✅ 全部可解析 |
| sitemap URL 都有对应页面 | 无 sitemap | ✅ 64/64 |

### 浏览器实测
- 1440px：列表页三列卡片均有配图；详情页底部相关行程正常。
- 900px / 780px（平板）：导航单行显示，未折行；无横向滚动；列表 2 列。
- 375px（手机）：详情页无横向溢出（仅行程标签栏按设计横向滚动），相关行程单列。

## 三、Cloudflare 预览站实测

预览地址：https://657f471c.aurictrip.pages.dev （分支别名 https://claude-seo-audit-fix-766456.aurictrip.pages.dev），2026-11-03 用 curl 实测：

| 请求 | 线上现状（aurictrip.com） | 预览站 |
|---|---|---|
| `/journeys/kenya-safari`（无斜杠） | 308 → 带斜杠 | **200** ✅ |
| `/journeys/kenya-safari/`、`.html` | — | 308 → 无斜杠正式地址 ✅ |
| `/journeys/kenya-safari.md`（旧死链） | 200 返回首页 | 301 → 正式地址 ✅ |
| `/family`、`/bespoke`、`/journey-types`、`/inspiration/awe` | 200 返回首页 | 301 → 对应现有页面（目标页 200）✅ |
| `/robots.txt` | 200，内容是首页 HTML | 200 `text/plain` ✅ |
| `/sitemap.xml` | 200，内容是首页 HTML | 200 `application/xml`，64 个 URL **全部直接 200** ✅ |
| `/llms.txt` | 200，内容是首页 HTML | 200 `text/plain`，11.7 KB ✅ |
| `/nonexistent-xyz` | 200 返回首页 | **404** ✅ |
| 详情页 canonical / title | 无 canonical；"肯尼亚 \| 鎏光旅行 AuricTrip" | `https://aurictrip.com/journeys/kenya-safari`；"肯尼亚10天9晚高端定制旅行 · 旷野呼唤" ✅ |
| pages.dev 响应头 | 无 | `X-Robots-Tag: noindex` ✅（正式域名不受影响） |
| 图片缓存 | `max-age=14400` | `max-age=2592000` ✅ |
| 中文形态页 `/journey-types/鎏光臻选` | — | 200 ✅ |

## 四、上线后需要你完成的操作

1. 审阅并合并 PR 到 `main`，Cloudflare Pages 自动部署。部署后验证：
   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' https://aurictrip.com/journeys/kenya-safari
   ```
   应为 `200`；`https://aurictrip.com/robots.txt` 应返回纯文本；不存在的地址应返回 `404`。
2. **Cloudflare Pages 构建设置**：确认 Build output directory 仍为 `dist`（去掉适配器后不再需要 Workers 兼容配置；若项目设置里开了 `nodejs_compat` 等也不影响）。
3. Cloudflare 后台为 `www.aurictrip.com` 添加 301 → `https://aurictrip.com` 的重定向规则（Pages 的 `_redirects` 不支持跨域名跳转）。
4. 在 Pages → Settings → Environment variables 配置 `PUBLIC_GA4_ID`（或 `PUBLIC_CF_BEACON_TOKEN`）、`PUBLIC_GSC_VERIFICATION`，重新部署。
5. 在 Google Search Console、Bing Webmaster、百度搜索资源平台提交 `https://aurictrip.com/sitemap.xml`，对首页、`/journeys` 与几条重点行程"请求编入索引"。

## 五、需要你决策的事项（本轮未改动）

1. **资质表述**：首页信任条、每页页脚、关于页、"为什么选择鎏光"页都宣称 ATOL / ABTA / IATA，但站内没有任何编号和公司全称。请确认：持有的话补上编号、公司全称与注册号（会同步写进结构化数据）；没有的话需要尽快删除（英国无证宣称 ATOL 保护违法）。
2. **客户证言与专家团队**：首页三条带日期的客户证言、四位"目的地专家"是否真实？不真实请下线或换成真实内容。
3. **起价口径**：列表/形态/目的地页显示 `price`（如肯尼亚 ¥72,800），详情页显示最低套餐价（¥65,500）。请确定以哪个为"起价"，我们再统一代码。
4. **联系表单后端**：当前为邮件兜底，建议接入 Formspree、Cloudflare Worker + 邮件，或企业微信机器人。
5. **聚合落地页**：亲子 / 蜜月 / 独行 / 银发 / 星空 / 美食 / 故事 / 秘境等入口目前指向最贴近的单条行程或总览页；是否要做独立聚合页（需要原创导语与 FAQ），请确定优先做哪几个。
6. **形态页中文 URL**（`/journey-types/鎏光臻选`）：可用，若希望改为英文 slug 可再做一次 301 迁移。

## 六、本轮未处理的技术项（建议下一轮）

- 图片：318 张 JPG 共 82 MB。抽样测试用 mozjpeg q80 重新压缩可省约 33%，转 WebP/AVIF + 响应式尺寸可省更多；因会在仓库中产生大量二进制改动，本轮未做。
- `npm test`：24 个用例在修改前就已失败（测试仍查找 `.mdx`，内容已改为 `.md`），需要按现有结构重写测试。
