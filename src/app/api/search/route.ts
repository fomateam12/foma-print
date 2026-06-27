import { NextResponse } from "next/server";
import { searchProducts } from "@/data/catalog";
import type { SearchResult } from "@/data/types";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") ?? 6) || 6, 1),
    24,
  );

  const results: SearchResult[] = searchProducts(q, limit).map((p) => ({
    id: p.id,
    name: p.name,
    categoryName: p.categoryName,
    subcategoryName: p.subcategoryName,
    categorySlug: p.categorySlug,
    subcategorySlug: p.subcategorySlug,
    basePrice: p.basePrice,
    image: p.image,
  }));

  return NextResponse.json(
    { results },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
