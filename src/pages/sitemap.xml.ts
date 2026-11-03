import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";
import { absoluteUrl, journeySlug } from "@lib/seo";
import { STATIC_PAGES, JOURNEY_TYPE_SLUGS, getSortedJourneys, gitLastModified } from "@lib/site-pages";

export const prerender = true;

export const GET: APIRoute = async () => {
  const journeys = await getSortedJourneys();
  const entries: { loc: string; lastmod?: string }[] = [
    ...STATIC_PAGES.map((p) => ({ loc: absoluteUrl(p.path) })),
    ...JOURNEY_TYPE_SLUGS.map((t) => ({ loc: absoluteUrl(`/journey-types/${t}`) })),
    ...journeys.map((j: CollectionEntry<"journeys">) => ({
      loc: absoluteUrl(`/journeys/${journeySlug(j.id)}`),
      lastmod: gitLastModified(`src/content/journeys/${j.id.endsWith(".md") ? j.id : `${j.id}.md`}`),
    })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((e) => `  <url><loc>${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`)
  .join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
