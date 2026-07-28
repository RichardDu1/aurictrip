import { describe, it, expect, beforeAll } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const CONTENT_DIR = join(import.meta.dirname!, "..", "src", "content");
const JOURNEYS_DIR = join(CONTENT_DIR, "journeys");

describe("Journey content", () => {
  let files: string[] = [];

  beforeAll(async () => {
    files = await readdir(JOURNEYS_DIR);
  });

  it("has at least 10 journey files", () => {
    const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
    expect(mdxFiles.length).toBeGreaterThanOrEqual(10);
  });

  it("all journeys have required frontmatter fields", async () => {
    const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
    for (const file of mdxFiles) {
      const content = await readFile(join(JOURNEYS_DIR, file), "utf-8");
      expect(content).toMatch(/label:/);
      expect(content).toMatch(/destination:/);
      expect(content).toMatch(/days:/);
      expect(content).toMatch(/price:/);
      expect(content).toMatch(/priceLevel:/);
      expect(content).toMatch(/type:/);
    }
  });

  it("has at least one featured journey", async () => {
    const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
    let hasFeatured = false;
    for (const file of mdxFiles) {
      const content = await readFile(join(JOURNEYS_DIR, file), "utf-8");
      if (content.includes("featured: true")) hasFeatured = true;
    }
    expect(hasFeatured).toBe(true);
  });

  it("all prices are in the 30000-300000 range", async () => {
    const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
    for (const file of mdxFiles) {
      const content = await readFile(join(JOURNEYS_DIR, file), "utf-8");
      const match = content.match(/price:\s*(\d+)/);
      if (match) {
        const price = parseInt(match[1], 10);
        expect(price).toBeGreaterThanOrEqual(30000);
        expect(price).toBeLessThanOrEqual(300000);
      }
    }
  });
});