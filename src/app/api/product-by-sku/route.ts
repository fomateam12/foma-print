import { NextResponse } from "next/server";
import { getProduct } from "@/data/catalog";
import { catalogImageAbsoluteUrl } from "@/lib/catalog-image";
import { getTraceId, TRACE_HEADER } from "@/lib/trace";

/**
 * SKU → catalogue record, for the other FOMA systems.
 *
 * FomaFlow's Studio builds marketplace listings and needs what this site
 * already curates per SKU: the image gallery, the written copy, and the
 * physical specs. It asks here rather than re-scraping the supplier, so both
 * systems describe a product the same way — and the shared key is the SKU,
 * never the name.
 *
 * What this deliberately does NOT return is price. `basePrice` is the
 * wholesale reference and stays behind the gated partner catalogue; every
 * other field below is already public on /product/<sku>.
 */

/** One request, many SKUs — Studio asks for a whole colour family at once. */
const MAX_SKUS = 40;

export function GET(request: Request) {
  const traceId = getTraceId(request);
  const { searchParams } = new URL(request.url);

  const requested = (searchParams.get("sku") ?? "")
    .split(",")
    .map((sku) => sku.trim())
    .filter((sku) => sku !== "");

  if (requested.length === 0) {
    return NextResponse.json(
      { error: "Pass at least one SKU: ?sku=LTM7002 or ?sku=LTM7002,LTM7003" },
      { status: 400, headers: { [TRACE_HEADER]: traceId } },
    );
  }

  const skus = Array.from(new Set(requested)).slice(0, MAX_SKUS);
  const results = [];
  const missing = [];

  for (const sku of skus) {
    const product = getProduct(sku);
    if (!product) {
      // A SKU we don't carry is an answer, not an error — Studio shows it as
      // "no catalogue record" next to the ones that resolved.
      missing.push(sku);
      continue;
    }

    // `images` is the curated gallery when one has been bound; otherwise the
    // single primary image is still a gallery of one.
    const gallery = product.images?.length ? product.images : [product.imageFull];

    results.push({
      sku: product.sku,
      name: product.name,
      size: product.size,
      categoryName: product.categoryName,
      subcategoryName: product.subcategoryName,
      description: product.description,
      longDescription: product.longDescription,
      weightLb: product.weightLb ?? null,
      shippingWeightLb: product.shippingWeightLb ?? null,
      dimensions: product.dimensions ?? null,
      engravingArea: product.engravingArea ?? null,
      shippingType: product.shippingType ?? null,
      leadTimeDays: product.leadTimeDays,
      badges: product.badges,
      images: gallery.map(catalogImageAbsoluteUrl),
      url: `https://www.fomaprint.com/product/${product.id}`,
    });
  }

  return NextResponse.json(
    { results, missing, truncated: requested.length > MAX_SKUS },
    {
      headers: {
        "content-type": "application/json",
        // Same window as /api/search: the catalogue rarely moves inside it.
        "cache-control": "public, max-age=300, stale-while-revalidate=600",
        // Public catalogue data, no prices — readable from any FOMA tool.
        "access-control-allow-origin": "*",
        [TRACE_HEADER]: traceId,
      },
    },
  );
}
