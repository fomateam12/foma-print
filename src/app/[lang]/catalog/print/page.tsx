import type { Metadata } from "next";
import { CatalogPrintDocument } from "@/components/catalog-print-document";
import { getCategories } from "@/data/catalog";
import { site } from "@/lib/site";

/**
 * Combined print version of the partner catalog — every category in one
 * document, the source for the full downloadable PDF. Per-category PDFs come
 * from /catalog/print/[slug]; both render CatalogPrintDocument.
 */

export const metadata: Metadata = {
  title: "FomaPrint Catalog (print version)",
  robots: { index: false, follow: false },
};

export default function CatalogPrintPage() {
  return (
    <CatalogPrintDocument
      categories={getCategories()}
      title={`${site.name} — Full Product Catalog & Wholesale Price List`}
    />
  );
}
