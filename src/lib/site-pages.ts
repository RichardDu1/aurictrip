// sitemap.xml 与 llms.txt 共用的页面清单（全部为无尾斜杠的规范路径）
import { execFileSync } from "node:child_process";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { journeySlug } from "@lib/seo";

export const JOURNEY_TYPE_SLUGS = ["travel-styles", "鎏光臻选", "鎏光定制", "鎏光远征"] as const;

export const STATIC_PAGES = [
  { path: "/", name: "首页" },
  { path: "/journeys", name: "全部旅程" },
  { path: "/destinations", name: "目的地" },
  { path: "/inspiration", name: "旅行灵感" },
  { path: "/why-aurictrip", name: "为什么选择鎏光" },
  { path: "/about", name: "关于我们" },
  { path: "/contact", name: "联系我们" },
];

export async function getSortedJourneys(): Promise<CollectionEntry<"journeys">[]> {
  const journeys = await getCollection("journeys");
  return journeys.sort((a: CollectionEntry<"journeys">, b: CollectionEntry<"journeys">) => journeySlug(a.id).localeCompare(journeySlug(b.id)));
}

// 浅克隆时 git 日期不可信，直接放弃 lastmod，避免把构建时间当成内容更新时间
let gitUsable: boolean | undefined;
function canUseGit(): boolean {
  if (gitUsable === undefined) {
    try {
      gitUsable = execFileSync("git", ["rev-parse", "--is-shallow-repository"], { encoding: "utf8" }).trim() === "false";
    } catch {
      gitUsable = false;
    }
  }
  return gitUsable;
}

/** 文件最后一次 git 提交日期（YYYY-MM-DD），拿不到时返回 undefined */
export function gitLastModified(file: string): string | undefined {
  if (!canUseGit()) return undefined;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], { encoding: "utf8" }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}
