import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGrid } from "@/components/product-grid";
import { cloudinary } from "@/lib/format";
import {
  getCategories,
  getCategory,
  getProductsBySubcategory,
  getProductsByCategory,
} from "@/data/catalog";

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
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: category.blurb,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: { title: `${category.name} · FomaPrint`, description: category.blurb },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const popular = getProductsByCategory(category.slug)
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  return (
    <div className="container-px py-10 lg:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />

      <header className="mt-6 max-w-2xl">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
          {category.name}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          {category.blurb}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {category.productCount.toLocaleString()} products ·{" "}
          {category.subcategories.length} collections
        </p>
      </header>

      {/* Subcategory tiles */}
      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Browse {category.name}
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {category.subcategories.map((sc) => {
            const thumb = getProductsBySubcategory(category.slug, sc.slug)[0];
            return (
              <Link
                key={sc.slug}
                href={`/category/${category.slug}/${sc.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-shadow hover:shadow-[var(--shadow-card)]"
              >
                <div className="relative aspect-square bg-white">
                  {thumb ? (
                    <Image
                      src={cloudinary(thumb.image, { width: 400 })}
                      alt={sc.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-0.5 p-3">
                  <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-brand-strong">
                    {sc.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {sc.productCount} products
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular products */}
      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Popular in {category.name}
          </h2>
        </div>
        <ProductGrid products={popular} className="mt-6" priorityCount={4} />
      </section>
    </div>
  );
}
