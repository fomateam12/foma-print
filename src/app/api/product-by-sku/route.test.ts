import { describe, expect, it } from "vitest";
import { GET } from "./route";

async function lookup(skus: string) {
  const res = GET(new Request(`https://www.fomaprint.com/api/product-by-sku?sku=${skus}`));
  return res.json() as Promise<{ results: { sku: string; url: string }[]; missing: string[] }>;
}

describe("GET /api/product-by-sku", () => {
  it("resolves supplier SKUs, whose id is the SKU", async () => {
    const body = await lookup("LWB207");
    expect(body.missing).toEqual([]);
    expect(body.results[0].sku).toBe("LWB207");
  });

  it("resolves FOMA's own products by their marketing SKU, not only by slug id", async () => {
    const body = await lookup("TM-FM-LIL,FM-KNIFE-TAC");
    expect(body.missing).toEqual([]);
    expect(body.results.map((r) => r.sku)).toEqual(["TM-FM-LIL", "FM-KNIFE-TAC"]);
    // The link still points at the product page, which is keyed by id.
    expect(body.results[0].url).not.toMatch(/TM-FM-LIL$/);
  });

  it("still reports SKUs we do not carry as missing", async () => {
    const body = await lookup("NOPE-123");
    expect(body.missing).toEqual(["NOPE-123"]);
  });
});
