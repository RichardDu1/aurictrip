// 全站 SEO 工具：规范 URL、站点实体与结构化数据。
// 注意：这里只使用站内已公开展示的事实（品牌名、电话、邮箱、行程数据），
// 不写入评价、评分、资质编号等需要所有者核实的信息。

export const SITE_URL = "https://aurictrip.com";
export const SITE_NAME = "鎏光旅行 AuricTrip";
export const DEFAULT_OG_IMAGE = "/images/journeys/antarctica-expedition/antarctica-expedition-1.jpg";
export const CONTACT_PHONE = "+44 7396 800888";
export const CONTACT_EMAIL = "service@aurictrip.com";

/** 行程内容 id（可能带 .md 后缀）→ URL slug */
export function journeySlug(id: string): string {
  return id.replace(/\.md$/, "");
}

/** 把构建时的路径规范化为线上地址：去掉 .html、/index 与尾斜杠 */
export function canonicalPath(pathname: string): string {
  let p = decodeURI(pathname).replace(/\.html$/, "").replace(/\/index$/, "");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return encodeURI(SITE_URL + (path.startsWith("/") ? path : `/${path}`));
}

export const organizationId = `${SITE_URL}/#organization`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": organizationId,
  name: SITE_NAME,
  alternateName: ["鎏光旅行", "AuricTrip"],
  url: SITE_URL,
  logo: absoluteUrl("/favicon.svg"),
  description: "面向中国旅行者的全球高端定制旅行品牌，团队位于伦敦，提供私人定制、臻选小团与极地远征行程，全程中文服务。",
  telephone: CONTACT_PHONE,
  email: CONTACT_EMAIL,
  areaServed: "CN",
  knowsLanguage: ["zh-CN", "en"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    contactType: "customer service",
    availableLanguage: ["Chinese", "English"],
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "zh-CN",
  publisher: { "@id": organizationId },
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function itemListSchema(name: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** 截断到指定字数，保证 description 不被搜索结果截断得太难看 */
export function clip(text: string, max = 120): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}
