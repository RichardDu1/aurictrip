import { describe, it, expect } from "vitest";

describe("Home page", () => {
  it("renders the brand name 鎏光旅行", async () => {
    const html = await fixture("/");
    expect(html).toContain("鎏光旅行");
  });

  it("renders the English brand name AURICTRIP", async () => {
    const html = await fixture("/");
    expect(html).toContain("AURICTRIP");
  });

  it("has a title tag", async () => {
    const html = await fixture("/");
    expect(html).toMatch(/<title>.*鎏光旅行.*<\/title>/);
  });

  it("has lang=zh-CN on html element", async () => {
    const html = await fixture("/");
    expect(html).toMatch(/<html[^>]*lang="zh-CN"/);
  });
});

async function fixture(path: string): Promise<string> {
  const fs = await import("node:fs/promises");
  const filePath = new URL(`../dist${path === "/" ? "/index" : path}.html`, import.meta.url);
  return fs.readFile(filePath, "utf-8");
}