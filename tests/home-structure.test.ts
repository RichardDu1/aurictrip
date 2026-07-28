import { describe, it, expect } from "vitest";

async function fixture(path: string): Promise<string> {
  const fs = await import("node:fs/promises");
  const filePath = new URL(
    `../dist${path === "/" ? "/index" : path}.html`,
    import.meta.url,
  ).pathname.replace(/^\/\w:/, "");
  return fs.readFile(filePath, "utf-8");
}

describe("Home page structure", () => {
  it("has hero section with brand tagline", async () => {
    const html = await fixture("/");
    expect(html).toContain("鎏光旅行");
  });

  it("has navigation with 4 top-level items", async () => {
    const html = await fixture("/");
    // Navigation: 目的地 | 旅行形态 | 灵感 | 关于
    expect(html).toContain("目的地");
    expect(html).toContain("旅行形态");
    expect(html).toContain("灵感");
    expect(html).toContain("关于");
  });

  it("has a trust bar with key guarantees", async () => {
    const html = await fixture("/");
    expect(html).toContain("安心行");
    expect(html).toContain("贴心伴");
    expect(html).toContain("透明价");
  });

  it("has journey cards section", async () => {
    const html = await fixture("/");
    expect(html).toContain("精选旅程");
  });

  it("has CTA section with contact prompt", async () => {
    const html = await fixture("/");
    expect(html).toContain("与顾问对话");
  });

  it("has footer with ICP and license info", async () => {
    const html = await fixture("/");
    expect(html).toContain("ATOL");
    expect(html).toContain("IATA");
  });

  it("has semantic main element", async () => {
    const html = await fixture("/");
    expect(html).toMatch(/<main[\s>]/);
  });

  it("has semantic nav element", async () => {
    const html = await fixture("/");
    expect(html).toMatch(/<nav[\s>]/);
  });

  it("has semantic footer element", async () => {
    const html = await fixture("/");
    expect(html).toMatch(/<footer[\s>]/);
  });
});