import { describe, expect, it } from "vitest";
import { catalogContext, findCatalogMatches } from "./catalog-matches";
import { getAllProducts } from "@/data/catalog";

describe("findCatalogMatches (real catalog)", () => {
  it("finds tumblers with a handle from a natural question", () => {
    const m = findCatalogMatches("Do you sell tumblers with handles?");
    expect(m.length).toBeGreaterThan(0);
    for (const x of m) expect(x.name.toLowerCase()).toMatch(/tumbler/);
    expect(m.some((x) => /handle/i.test(x.name))).toBe(true);
  });

  it("understands a Turkish question", () => {
    expect(findCatalogMatches("Deri cüzdan var mı?").some((x) => /wallet/i.test(x.name))).toBe(true);
    expect(findCatalogMatches("wallet leather").length).toBeGreaterThan(0);
  });

  it("lists colour variants of the same product once", () => {
    const m = findCatalogMatches("40 oz tumbler with handle", 10);
    const keys = m.map((x) => `${x.name}|${x.size}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("returns nothing for a non-product question", () => {
    expect(findCatalogMatches("how do I pay?")).toEqual([]);
  });

  it("never exposes price or SKU", () => {
    const products = getAllProducts();
    const ctx = catalogContext("tumbler") ?? "";
    expect(ctx).not.toMatch(/\$\s?\d/);
    for (const p of products.slice(0, 300)) {
      if (p.sku && p.sku.length >= 5) expect(ctx).not.toContain(p.sku);
    }
    for (const x of findCatalogMatches("tumbler")) {
      expect(Object.keys(x).sort()).toEqual(["category", "engravingArea", "name", "size", "url"]);
      expect(x.url.startsWith("fomaprint.com/product/")).toBe(true);
    }
  });
});
