import { getCategories } from "@/data/catalog";

/**
 * Downloadable partner-catalog PDFs.
 *
 * Rendered from /catalog/print (combined) and /catalog/print/[slug] (one per
 * category) with headless Chrome — see `.scrape/print-catalog-pdfs.mjs` — then
 * uploaded to `catalog/` in the PRIVATE `fomaprint-catalog` R2 bucket:
 *
 *   npx wrangler r2 object put fomaprint-catalog/catalog/<file> \
 *     --file=<path> --content-type=application/pdf --remote
 *
 * They must NOT go in the image bucket (`foma-design`): that one is published
 * whole through its pub-*.r2.dev origin, so anything stored there is readable
 * by anyone who can guess the name — and these files list every wholesale
 * price. Downloads are served through /catalog/pdf/[slug], behind the same
 * shared-password gate as the rest of /catalog.
 *
 * Re-run the generator and re-upload whenever products or prices change, or
 * the links serve a stale price list.
 */

/** Download path for a category slug, or "full" for the combined catalog. */
export function catalogPdfPath(slug: string): string {
  return `/catalog/pdf/${slug}`;
}

export const FULL_CATALOG_PDF_PATH = catalogPdfPath("full");

/**
 * slug -> object name, built from the categories this build actually has.
 * The route resolves downloads through this map only, so a request can never
 * name its own object key.
 */
export const CATALOG_PDF_FILES: Record<string, string> = {
  full: "FomaPrint-Catalog.pdf",
  ...Object.fromEntries(
    getCategories().map((c) => [c.slug, `FomaPrint-Catalog-${c.slug}.pdf`]),
  ),
};
