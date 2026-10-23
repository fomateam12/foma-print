import { describe, expect, it } from "vitest";
// @ts-expect-error — plain .mjs script without type declarations
import { imageUrls, pick, parseSrcset, slotWidth } from "../../scripts/warm-image-cache.mjs";

const GRID = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 20vw";
const widths = [256, 384, 640, 750, 828, 1080, 1200, 1920];
const srcset = widths.map((w) => `/_next/image?url=%2Fa.jpg&w=${w}&q=75 ${w}w`).join(", ");

describe("warm-image-cache", () => {
  it("resolves the first matching sizes entry", () => {
    expect(slotWidth(GRID, 390)).toBe(195);
    expect(slotWidth(GRID, 1440)).toBe(360);
    expect(slotWidth(GRID, 1920)).toBe(384);
    expect(slotWidth("200px", 1920)).toBe(200);
    expect(slotWidth(null, 390)).toBe(390);
  });

  it("picks the smallest candidate that covers slot × DPR", () => {
    const c = parseSrcset(srcset);
    expect(pick(c, GRID, { width: 390, dpr: 3 })).toContain("w=640"); // 585 px
    expect(pick(c, GRID, { width: 1440, dpr: 2 })).toContain("w=750"); // 720 px
    expect(pick(c, GRID, { width: 1920, dpr: 1 })).toContain("w=384");
    expect(pick(c, "100vw", { width: 1440, dpr: 2 })).toContain("w=1920"); // capped at largest
  });

  it("handles density srcsets", () => {
    const c = parseSrcset("/_next/image?url=%2Fb.png&w=256&q=75 1x, /_next/image?url=%2Fb.png&w=640&q=75 2x");
    expect(pick(c, null, { width: 1920, dpr: 1 })).toContain("w=256");
    expect(pick(c, null, { width: 390, dpr: 3 })).toContain("w=640");
  });

  it("extracts deduplicated optimizer URLs from page HTML", () => {
    const html =
      `<img alt="" sizes="${GRID}" srcset="${srcset.replace(/&/g, "&amp;")}" src="/x.jpg">` +
      `<img src="/logo.svg">`;
    expect([...imageUrls(html)].sort()).toEqual([
      "/_next/image?url=%2Fa.jpg&w=384&q=75",
      "/_next/image?url=%2Fa.jpg&w=640&q=75",
      "/_next/image?url=%2Fa.jpg&w=750&q=75",
    ]);
  });
});
