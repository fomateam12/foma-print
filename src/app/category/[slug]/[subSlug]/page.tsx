import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGrid } from "@/components/product-grid";
import { cn } from "@/lib/utils";
import {
  getCategories,
  getSubcategory,
  getProductsBySubcategory,
} from "@/data/catalog";

export function generateStaticParams() {
  const params: { slug: string; subSlug: string }[] = [];
  for (const c of getCategories()) {
    for (const sc of c.subcategories) {
      params.push({ slug: c.slug, subSlug: sc.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}): Promise<Metadata> {
  const { slug, subSlug } = await params;
  const found = getSubcategory(slug, subSlug);
  if (!found) return { title: "Not found" };
  const { category, subcategory } = found;
  const description = `Shop ${subcategory.productCount} personalized ${subcategory.name.toLowerCase()} — laser-engraved to order by FomaPrint.`;
  return {
    title: `${subcategory.name} — ${category.name}`,
    description,
    alternates: { canonical: `/category/${category.slug}/${subcategory.slug}` },
    openGraph: { title: `${subcategory.name} · FomaPrint`, description },
  };
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const { slug, subSlug } = await params;
  const found = getSubcategory(slug, subSlug);
  if (!found) notFound();
  const { category, subcategory } = found;
  const products = getProductsBySubcategory(category.slug, subcategory.slug);

  return (
    <div className="container-px py-10 lg:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name, href: `/category/${category.slug}` },
          { label: subcategory.name },
        ]}
      />

      <header className="mt-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {subcategory.name}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {subcategory.blurb}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {products.length.toLocaleString()} products
        </p>
      </header>

      {/* Sibling subcategories */}
      <nav
        aria-label={`More in ${category.name}`}
        className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1"
      >
        {category.subcategories.map((sc) => {
          const active = sc.slug === subcategory.slug;
          return (
            <Link
              key={sc.slug}
              href={`/category/${category.slug}/${sc.slug}`}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                active
                  ? "border-brand bg-brand-muted font-medium text-brand-strong"
                  : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground",
              )}
            >
              {sc.name}
            </Link>
          );
        })}
      </nav>

      {products.length > 0 ? (
        <ProductGrid products={products} className="mt-8" priorityCount={4} />
      ) : (
        <p className="mt-10 text-muted-foreground">
          No products in this collection yet.
        </p>
      )}
    </div>
  );
}
