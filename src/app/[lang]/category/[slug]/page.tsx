import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/components/locale-link";
import { ArrowRight, Tags } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGrid } from "@/components/product-grid";
import { ProductImage } from "@/components/product-image";
import { CategoryIcon } from "@/components/category-icon";
import { Reveal } from "@/components/reveal";
import {
  getCategories,
  getCategory,
  getProductsBySubcategory,
  getProductsByCategory,
} from "@/data/catalog";
import { CATEGORY_BANNERS } from "@/lib/category-banners";
import { CATEGORY_CROSS_LINKS } from "@/lib/category-cross-links";
import { getDictionary } from "@/lib/dictionaries";
import { LOCALES, isLocale } from "@/lib/i18n";
import { categoryBlurb, categoryName, subcategoryName } from "@/lib/catalog-i18n";
import {
  alternatesFor,
  breadcrumbJsonLd,
  faqJsonLd,
  itemListJsonLd,
} from "@/lib/seo";
import {
  editorialFor,
  editorialMetaDescription,
} from "@/data/category-editorial";
import { CategoryEditorial } from "@/components/category-editorial";
import { JsonLd } from "@/components/json-ld";

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    getCategories().map((c) => ({ lang, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/category/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const category = getCategory(slug);
  if (!category) return { title: dict.category.notFound };

  const name = categoryName(category.name, lang);
  const blurb = categoryBlurb(category.name, category.blurb, lang);
  // Prefer the hand-written opening over the one-line catalog blurb: it is
  // specific to this category and reads as a snippet rather than a label.
  const editorial = editorialFor(category.slug, lang);
  const description =
    (editorial && editorialMetaDescription(editorial)) ?? blurb;

  return {
    title: name,
    description,
    alternates: alternatesFor(`/category/${category.slug}`, lang),
    openGraph: { title: `${name} · FomaPrint`, description },
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/[lang]/category/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.category;

  const category = getCategory(slug);
  if (!category) notFound();

  const name = categoryName(category.name, lang);
  const all = getProductsByCategory(category.slug);
  const popular = all.slice(0, 8);
  const banner = CATEGORY_BANNERS[category.slug];
  // Hand-written prose for this category, when one has been written. See
  // src/data/editorial/categories.ts — a missing entry renders nothing.
  const editorial = editorialFor(category.slug, lang);
  const crumbJsonLd = breadcrumbJsonLd(
    [
      { name: dict.common.home, path: "/" },
      { name: dict.categories.breadcrumb, path: "/categories" },
      { name },
    ],
    lang,
  );
  const listJsonLd = itemListJsonLd(
    category.subcategories.map((sc) => ({
      name: subcategoryName(sc.name, lang),
      path: `/category/${category.slug}/${sc.slug}`,
    })),
    lang,
  );
  // Families promoted out of this category still get a tile pointing at
  // their new home, so browsing the old category never dead-ends.
  const crossLinks = (CATEGORY_CROSS_LINKS[category.slug] ?? []).flatMap(
    (slug) => {
      const c = getCategory(slug);
      return c && c.productCount > 0 ? [c] : [];
    },
  );

  return (
    <div>
      <JsonLd data={crumbJsonLd} />
      <JsonLd data={listJsonLd} />
      {editorial && editorial.faqs.length > 0 ? (
        <JsonLd data={faqJsonLd(editorial.faqs)} />
      ) : null}

      {/* Header */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-28 right-[-8%] h-[30rem] w-[30rem] rounded-full bg-brand-muted/60 blur-3xl" />
        </div>
        {banner ? (
          // Lifestyle banner panel: fades into the cream header on lg+ so the
          // text column keeps its measure; on smaller screens it renders as a
          // rounded strip below the header copy instead (see bottom of section).
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block [mask-image:linear-gradient(to_right,transparent,black_45%)]"
          >
            <Image
              src={banner.src}
              alt=""
              fill
              priority
              sizes="46vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="container-px py-10 lg:py-14">
          <Breadcrumbs
            items={[
              { label: dict.common.home, href: "/" },
              { label: dict.categories.breadcrumb, href: "/categories" },
              { label: name },
            ]}
          />
          <div className="mt-6 flex items-start gap-4">
            <span className="hidden size-14 shrink-0 place-items-center rounded-2xl bg-brand-muted text-brand-strong sm:grid">
              <CategoryIcon icon={category.icon} className="size-7" />
            </span>
            <div className="max-w-2xl">
              <span className="eyebrow text-brand-strong">{t.eyebrow}</span>
              <h1 className="mt-2 text-h2 text-foreground">{name}</h1>
              <p className="mt-3 text-lead text-muted-foreground">
                {categoryBlurb(category.name, category.blurb, lang)}
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Tags className="size-3.5 text-brand-strong" />
                {category.productCount.toLocaleString(lang)}{" "}
                {dict.categories.statProducts} ·{" "}
                {category.subcategories.length}{" "}
                {dict.categories.statCollections} · {t.wholesaleOnRequest}
              </p>
            </div>
          </div>

          {banner ? (
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-border shadow-card lg:hidden">
              <Image
                src={banner.src}
                alt={banner.alt}
                width={1344}
                height={768}
                sizes="100vw"
                className="aspect-[21/9] w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </section>

      <div className="container-px py-12 lg:py-16">
        {/* Category-level filtering retired: the buyer picks a collection
            first (Water Bottles / Tumblers / Portfolios), then the
            subcategory page surfaces the secondary axis (volume buckets
            for drinkware, S/M/L for dimensional goods). Cross-cutting
            "Water Bottles + 11 oz" filters dead-ended buyers since 11 oz
            never matches a water bottle SKU; the tile flow makes the
            taxonomy explicit instead. */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            {t.browse.replace("{category}", name)}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {category.subcategories.map((sc, i) => {
              const thumb = getProductsBySubcategory(
                category.slug,
                sc.slug,
              )[0];
              const scName = subcategoryName(sc.name, lang);
              return (
                <Reveal key={sc.slug} delay={Math.min(i * 0.04, 0.24)}>
                  <Link
                    href={`/category/${category.slug}/${sc.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <ProductImage
                      src={thumb?.image ?? ""}
                      alt={scName}
                      seed={sc.slug}
                      icon={category.icon}
                      width={400}
                      priority={i < 4}
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="aspect-square border-b border-border"
                      imgClassName="p-3 group-hover:scale-105"
                    />
                    <div className="flex flex-1 flex-col gap-0.5 p-3.5">
                      <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-brand-strong">
                        {scName}
                      </h3>
                      <span className="mt-auto pt-1 text-xs text-muted-foreground">
                        {sc.productCount} {dict.categories.statProducts}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}

            {crossLinks.map((c, i) => {
              const cName = categoryName(c.name, lang);
              const thumb = getProductsByCategory(c.slug)[0];
              return (
                <Reveal
                  key={`x-${c.slug}`}
                  delay={Math.min((category.subcategories.length + i) * 0.04, 0.24)}
                >
                  <Link
                    href={`/category/${c.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-dashed border-brand-strong/40 bg-brand-muted/30 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:border-brand-strong/70 hover:shadow-lg"
                  >
                    <ProductImage
                      src={thumb?.image ?? ""}
                      alt={cName}
                      seed={c.slug}
                      icon={c.icon}
                      width={400}
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="aspect-square border-b border-dashed border-brand-strong/30"
                      imgClassName="p-3 group-hover:scale-105"
                    />
                    <div className="flex flex-1 flex-col gap-0.5 p-3.5">
                      <span className="eyebrow text-brand-strong">
                        {t.alsoIn}
                      </span>
                      <h3 className="mt-1 line-clamp-2 inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:text-brand-strong">
                        {cName}
                        <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </h3>
                      <span className="mt-auto pt-1 text-xs text-muted-foreground">
                        {c.productCount} {dict.categories.statProducts}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {popular.length > 0 ? (
          <section className="mt-16">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                {t.popularIn.replace("{category}", name)}
              </h2>
              <Link
                href={`/category/${category.slug}/${category.subcategories[0]?.slug ?? ""}`}
                className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-strong transition-colors hover:text-rust-bright sm:inline-flex"
              >
                {t.shopCollection}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <ProductGrid locale={lang} products={popular} className="mt-6" />
          </section>
        ) : null}

        {editorial ? (
          <CategoryEditorial copy={editorial} name={name} headings={t} />
        ) : null}
      </div>
    </div>
  );
}
