/**
 * Downloadable partner-catalog PDFs, hosted on the public R2 bucket.
 *
 * Rendered from /catalog/print (combined) and /catalog/print/[slug] (one per
 * category) with headless Chrome, then uploaded to `catalog/` in the bucket —
 * see `.scrape/print-catalog-pdfs.mjs`. The bucket URL is the same public
 * r2.dev origin the product images use; it is hardcoded rather than read from
 * NEXT_PUBLIC_R2_BASE_URL because these links must keep working in a build
 * where that variable is unset (which is the case in production today).
 *
 * Re-run the generator whenever products or prices change, or the links will
 * serve a stale price list.
 */
const R2_PUBLIC_BASE = "https://pub-7dbfe9f161d34085b011aea74e8f75ac.r2.dev";

export const FULL_CATALOG_PDF_URL = `${R2_PUBLIC_BASE}/catalog/FomaPrint-Catalog.pdf`;

/** Per-category PDF for a storefront category slug. */
export function categoryCatalogPdfUrl(slug: string): string {
  return `${R2_PUBLIC_BASE}/catalog/FomaPrint-Catalog-${slug}.pdf`;
}
