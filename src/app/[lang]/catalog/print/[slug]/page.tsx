import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPrintDocument } from "@/components/catalog-print-document";
import { getCategories, getCategory } from "@/data/catalog";
import { site } from "@/lib/site";

/**
 * Print version of ONE category's partner price list — the source for the
 * per-category PDFs (user request, 3 Aug 2026: a partner who only sells
 * drinkware should not have to carry the 78-page combined catalog).
 * Same document component as /catalog/print, one category deep.
 */

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name} — ${site.name} price list (print version)`,
    robots: { index: false, follow: false },
  };
}

export default async function CatalogCategoryPrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  return (
    <CatalogPrintDocument
      categories={[category]}
      title={`${site.name} — ${category.name} Wholesale Price List`}
    />
  );
}
