import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";
import { absoluteUrl, journeySlug, SITE_NAME, CONTACT_PHONE, CONTACT_EMAIL } from "@lib/seo";
import { STATIC_PAGES, getSortedJourneys } from "@lib/site-pages";

export const prerender = true;

// 给大模型/AI 搜索读取的站点摘要：只陈述站内已公开的事实，行程数据随内容自动更新
export const GET: APIRoute = async () => {
  const journeys = await getSortedJourneys();
  const journeyLines = journeys.map((j: CollectionEntry<"journeys">) => {
    const d = j.data;
    const lowest = d.packages?.length ? Math.min(...d.packages.map((p: { price: number }) => p.price)) : d.price;
    return `- [${d.destination}｜${d.label}](${absoluteUrl(`/journeys/${journeySlug(j.id)}`)})：${d.days}天${d.nights}晚，${d.type}，指导价约 ¥${lowest.toLocaleString()} 起/人，最佳季节 ${d.season}`;
  });

  const body = `# ${SITE_NAME}

> 鎏光旅行（AuricTrip）是面向中国旅行者的全球高端定制旅行品牌，团队位于英国伦敦，全程中文服务。网站提供 ${journeys.length} 条可定制的高端旅程，每条行程列出逐日安排、具名酒店、费用包含/不含、预订须知与常见问题。所有价格为人民币指导价，按出行人数、季节与定制需求调整，以顾问报价为准。

## 主要页面

${STATIC_PAGES.map((p) => `- [${p.name}](${absoluteUrl(p.path)})`).join("\n")}
- [旅行形态](${absoluteUrl("/journey-types/travel-styles")})：鎏光臻选、鎏光定制、鎏光远征三类产品线

## 全部旅程

${journeyLines.join("\n")}

## 联系方式

- 电话 / WhatsApp：${CONTACT_PHONE}
- 邮箱：${CONTACT_EMAIL}
- 微信：PanEuroTrip
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
