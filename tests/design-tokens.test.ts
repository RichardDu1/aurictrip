import { describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";

async function getSourceCSS(): Promise<string> {
  return readFile(
    new URL("../src/styles/global.css", import.meta.url),
    "utf-8",
  );
}

describe("Design tokens", () => {
  it("defines color-cream as #FAFAFA (bg-page alias)", async () => {
    const css = await getSourceCSS();
    expect(css).toMatch(/--color-cream\s*:\s*#[Ff][Aa][Ff][Aa][Ff][Aa]/);
  });

  it("defines color-white as #FFFFFF (bg-card alias)", async () => {
    const css = await getSourceCSS();
    expect(css).toMatch(/--color-white\s*:\s*#[Ff]{6}/);
  });

  it("defines color-navy as #0A1628 (bg-hero alias)", async () => {
    const css = await getSourceCSS();
    expect(css).toMatch(/--color-navy\s*:\s*#0[Aa]1628/);
  });

  it("defines color-brand as Auric Gold via CSS variable", async () => {
    const css = await getSourceCSS();
    expect(css).toMatch(/--color-brand\s*:\s*var\(--color-gold\)/);
  });

  it("defines color-gold as #C9A96E", async () => {
    const css = await getSourceCSS();
    expect(css).toMatch(/--color-gold\s*:\s*#[Cc]9[Aa]96[Ee]/);
  });

  it("defines text-primary as #1A1A1A", async () => {
    const css = await getSourceCSS();
    expect(css).toMatch(/--color-text-primary\s*:\s*#1a1a1a/);
  });

  it("defines font families for display and body", async () => {
    const css = await getSourceCSS();
    expect(css).toMatch(/--font-display\s*:.*Cormorant Garamond/);
    expect(css).toMatch(/--font-body\s*:.*Inter/);
  });

  it("defines section spacing tokens", async () => {
    const css = await getSourceCSS();
    expect(css).toMatch(/--spacing-section\s*:\s*6rem/);
    expect(css).toMatch(/--spacing-content-max\s*:\s*680px/);
  });
});