import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/locale-link";
import { Search as SearchIcon } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGrid } from "@/components/product-grid";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategories, searchProducts } from "@/data/catalog";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";
import { categoryName } from "@/lib/catalog-i18n";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/search">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).search;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesFor("/search", lang),
    robots: { index: false },
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: PageProps<"/[lang]/search">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.search;

  const { q } = await searchParams;
  const query = (typeof q === "string" ? q : "").trim();
  const results = query ? searchProducts(query, 60) : [];
  const categories = getCategories();

  return (
    <div className="container-px py-10 lg:py-14">
      <Breadcrumbs
        items={[
          { label: dict.common.home, href: "/" },
          { label: t.metaTitle },
        ]}
      />

      <header className="mt-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t.heading}
        </h1>
        {/* Plain GET form so search works without JS; the action carries the
            locale prefix so a Turkish search stays Turkish. */}
        <form action={localizedPath("/search", lang)} method="get" className="mt-5">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              autoFocus
              placeholder={t.placeholder}
              aria-label={t.ariaLabel}
              className="h-13 w-full rounded-xl border border-input bg-background pl-12 pr-28 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <button
              type="submit"
              className={cn(
                buttonVariants({ size: "sm" }),
                "absolute right-2 top-1/2 -translate-y-1/2",
              )}
            >
              {t.submit}
            </button>
          </div>
        </form>
      </header>

      {query ? (
        results.length > 0 ? (
          <section className="mt-10">
            <p className="text-sm text-muted-foreground">
              {(results.length === 1 ? t.resultCountOne : t.resultCount).replace(
                "{count}",
                results.length === 60 ? "60+" : String(results.length),
              )}{" "}
              <span className="font-medium text-foreground">
                &ldquo;{query}&rdquo;
              </span>
            </p>
            <ProductGrid locale={lang} products={results} className="mt-6" priorityCount={4} />
          </section>
        ) : (
          <section className="mt-12 rounded-3xl border border-border bg-secondary/30 px-6 py-16 text-center">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {t.noMatches} &ldquo;{query}&rdquo;
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t.noMatchesBody}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/categories" className={cn(buttonVariants())}>
                {t.browseCategories}
              </Link>
              <Link
                href="/quote"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                {dict.quote.metaTitle}
              </Link>
            </div>
          </section>
        )
      ) : (
        <section className="mt-12">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            {t.browseByCategory}
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:text-brand-strong"
              >
                {categoryName(c.name, lang)}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
