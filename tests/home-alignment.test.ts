import { describe, it, expect } from "vitest";

async function fixture(path: string): Promise<string> {
  const fs = await import("node:fs/promises");
  const filePath = new URL(
    `../dist${path === "/" ? "/index" : path}.html`,
    import.meta.url,
  ).pathname.replace(/^\/\w:/, "");
  return fs.readFile(filePath, "utf-8");
}

describe("Home page — aligns with product design strategy", () => {
  // 1. Navigation: transparent at top, white on scroll
  it("has navigation with 4 top-level items", async () => {
    const html = await fixture("/");
    expect(html).toContain("目的地");
    expect(html).toContain("旅行形态");
    expect(html).toContain("灵感");
    expect(html).toContain("关于");
  });

  // 2. Hero: 100vh, deep navy
  it("has hero with brand name and tagline", async () => {
    const html = await fixture("/");
    expect(html).toContain("鎏光旅行");
    expect(html).toContain("鎏光所至，皆为风景");
  });

  // 3. Trust bar: all 5 trust anchors
  it("has all 5 trust anchors", async () => {
    const html = await fixture("/");
    expect(html).toContain("安心行");
    expect(html).toContain("稳心住");
    expect(html).toContain("贴心伴");
    expect(html).toContain("透明价");
    expect(html).toContain("随心改");
  });

  // 4. Audience quick entry
  it("has audience quick-entry section", async () => {
    const html = await fixture("/");
    expect(html).toContain("亲子");
    expect(html).toContain("情侣");
    expect(html).toContain("独行");
    expect(html).toContain("银发");
  });

  // 5. Emotion engine
  it("has emotion engine section", async () => {
    const html = await fixture("/");
    expect(html).toContain("惊叹");
    expect(html).toContain("好奇");
  });

  // 6. Signature IP product lines (6 cards)
  it("has IP product lines", async () => {
    const html = await fixture("/");
    expect(html).toContain("暗夜星辰");
    expect(html).toContain("味觉漫游");
    expect(html).toContain("故事之地");
    expect(html).toContain("秘境迷踪");
    expect(html).toContain("微缩世界");
    expect(html).toContain("岁月回响");
  });

  // 7. Featured journeys — no price on homepage (per strategy)
  it("does NOT show price on homepage", async () => {
    const html = await fixture("/");
    expect(html).not.toMatch(/¥\d+,\d+\s*起/);
  });

  // 8. Expert team
  it("has expert team section", async () => {
    const html = await fixture("/");
    expect(html).toContain("目的地专家");
  });

  // 9. Customization flow (4 steps)
  it("has customization flow section", async () => {
    const html = await fixture("/");
    expect(html).toContain("如何定制你的旅程");
  });

  // 10. Customer stories
  it("has customer stories section", async () => {
    const html = await fixture("/");
    expect(html).toContain("他们这样出发");
  });

  // 11. CTA section — 3-choice format
  it("has CTA with 3 choices", async () => {
    const html = await fixture("/");
    expect(html).toContain("与顾问对话");
    expect(html).toContain("浏览已有行程");
    expect(html).toContain("寻找灵感");
  });

  // 12. Footer with UK company compliance (NOT Chinese ICP)
  it("has footer with UK company compliance", async () => {
    const html = await fixture("/");
    expect(html).toContain("ATOL");
    expect(html).toContain("IATA");
    expect(html).toMatch(/\+44/);
  });

  // Semantic HTML
  it("uses semantic main, nav, footer elements", async () => {
    const html = await fixture("/");
    expect(html).toMatch(/<nav[\s>]/);
    expect(html).toMatch(/<main[\s>]/);
    expect(html).toMatch(/<footer[\s>]/);
  });
});