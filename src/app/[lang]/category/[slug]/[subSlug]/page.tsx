import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/locale-link";
import { ArrowRight, Tags } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGrid } from "@/components/product-grid";
import { SiblingSubcategoryNav } from "@/components/sibling-subcategory-nav";
import { ChipScroller, FilterChip } from "@/components/filter-chip";
import {
  getCategories,
  getSubcategory,
  getProductsBySubcategory,
} from "@/data/catalog";
import {
  buildSizeTierFacets,
  buildTypeFacets,
  buildVolumeFacets,
  filterBySizeTier,
  filterByType,
  filterByVolume,
  groupByType,
} from "@/lib/product-taxonomy";
import { GROUPED_SUBCATEGORIES } from "@/lib/subcategory-groups";
import { getDictionary } from "@/lib/dictionaries";
import { LOCALES, isLocale } from "@/lib/i18n";
import { categoryName, subcategoryName } from "@/lib/catalog-i18n";
import { alternatesFor, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import {
  editorialFor,
  editorialMetaDescription,
} from "@/data/category-editorial";
import { CategoryEditorial } from "@/components/category-editorial";
import { JsonLd } from "@/components/json-ld";

function asArray(v: string | string[] | undefined): string[] {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") return v ? [v] : [];
  return [];
}

export function generateStaticParams() {
  const params: { lang: string; slug: string; subSlug: string }[] = [];
  for (const lang of LOCALES) {
    for (const c of getCategories()) {
      for (const sc of c.subcategories) {
        params.push({ lang, slug: c.slug, subSlug: sc.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/category/[slug]/[subSlug]">): Promise<Metadata> {
  const { lang, slug, subSlug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const found = getSubcategory(slug, subSlug);
  if (!found) return { title: dict.subcategory.notFound };
  const { category, subcategory } = found;

  const subName = subcategoryName(subcategory.name, lang);
  // The generated "Shop N personalized X …" line was one sentence shared by
  // every collection page. Where hand-written copy exists, its opening is the
  // better snippet; the generated line stays as the fallback.
  const editorial = editorialFor(`${category.slug}/${subcategory.slug}`, lang);
  const description =
    (editorial && editorialMetaDescription(editorial)) ??
    dict.subcategory.metaDescription
      .replace("{count}", String(subcategory.productCount))
      .replace("{collection}", subName.toLocaleLowerCase(lang));

  return {
    title: `${subName} — ${categoryName(category.name, lang)}`,
    description,
    alternates: alternatesFor(
      `/category/${category.slug}/${subcategory.slug}`,
      lang,
    ),
    openGraph: { title: `${subName} · FomaPrint`, description },
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: PageProps<"/[lang]/category/[slug]/[subSlug]">) {
  const { lang, slug, subSlug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.subcategory;

  const sp = await searchParams;
  const found = getSubcategory(slug, subSlug);
  if (!found) notFound();
  const { category, subcategory } = found;
  const all = getProductsBySubcategory(category.slug, subcategory.slug);

  const catName = categoryName(category.name, lang);
  const subName = subcategoryName(subcategory.name, lang);

  const activeSizes = asArray(sp.size);
  const activeTypes = asArray(sp.type);
  const typeFacets = buildTypeFacets(all);

  // Pick the secondary axis automatically:
  //   - Drinkware-style subcategories with ≥2 volumes → oz chips.
  //   - Dimensional goods (frames, portfolios, boards) without a
  //     volume → Small / Medium / Large tiers from the rect / linear
  //     / diameter normalization.
  //   - Single-size collections (one volume or no usable size data) →
  //     no secondary nav, just the grid.
  const volumeFacets = buildVolumeFacets(all);
  // A single detected volume (e.g. this collection is uniformly "20 oz")
  // still means the products carry usable size data — tier chips are only
  // for products with NO oz/volume info at all (frames, portfolios, boards).
  const sizeTierFacets = volumeFacets.length === 0 ? buildSizeTierFacets(all) : [];
  const sizeAxis: "volume" | "tier" | "none" =
    volumeFacets.length >= 2
      ? "volume"
      : sizeTierFacets.length >= 2
        ? "tier"
        : "none";
  const sizeFacets = sizeAxis === "volume" ? volumeFacets : sizeTierFacets;

  const sizeFiltered =
    sizeAxis === "tier"
      ? filterBySizeTier(all, activeSizes)
      : filterByVolume(all, activeSizes);
  const filtered = filterByType(sizeFiltered, activeTypes);

  // Opted-in merged subcategories render one labelled block per product line
  // while no type chip is selected; everything else keeps the flat grid.
  const grouped =
    GROUPED_SUBCATEGORIES.has(subcategory.slug) && activeTypes.length === 0
      ? groupByType(filtered)
      : null;
  const typeGroups = grouped && grouped.groups.length >= 2 ? grouped : null;

  const basePath = `/category/${category.slug}/${subcategory.slug}`;
  // Hand-written prose for this collection, when one has been written.
  // See src/data/editorial/collections.ts — a missing entry renders nothing.
  const editorial = editorialFor(`${category.slug}/${subcategory.slug}`, lang);
  const crumbJsonLd = breadcrumbJsonLd(
    [
      { name: dict.common.home, path: "/" },
      { name: dict.categories.breadcrumb, path: "/categories" },
      { name: catName, path: `/category/${category.slug}` },
      { name: subName },
    ],
    lang,
  );
  // Build a query string carrying over the OTHER axis's current selection
  // (sizes when constructing a type-chip link, types when constructing a
  // size-chip link) so the two filters compose instead of clobbering
  // each other.
  const carrySizes = () => {
    const params = new URLSearchParams();
    for (const s of activeSizes) params.append("size", s);
    return params;
  };
  const carryTypes = () => {
    const params = new URLSearchParams();
    for (const t of activeTypes) params.append("type", t);
    return params;
  };

  return (
    <div className="container-px py-10 lg:py-14">
      <JsonLd data={crumbJsonLd} />
      {editorial && editorial.faqs.length > 0 ? (
        <JsonLd data={faqJsonLd(editorial.faqs)} />
      ) : null}

      <Breadcrumbs
        items={[
          { label: dict.common.home, href: "/" },
          { label: dict.categories.breadcrumb, href: "/categories" },
          { label: catName, href: `/category/${category.slug}` },
          { label: subName },
        ]}
      />

      <header className="mt-6 max-w-2xl">
        <Link
          href={`/category/${category.slug}`}
          className="eyebrow text-brand-strong hover:underline"
        >
          {catName}
        </Link>
        <h1 className="mt-2 text-h2 text-foreground">{subName}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {subcategory.blurb}
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Tags className="size-3.5 text-brand-strong" />
          {all.length.toLocaleString(lang)} {dict.categories.statProducts} ·{" "}
          {dict.category.wholesaleOnRequest}
        </p>
      </header>

      {/* Sibling subcategories — chip rail with scroll arrows */}
      <SiblingSubcategoryNav
        categoryName={catName}
        categorySlug={category.slug}
        siblings={category.subcategories.map((sc) => ({
          slug: sc.slug,
          name: subcategoryName(sc.name, lang),
        }))}
        activeSlug={subcategory.slug}
      />

      {/* Size sub-navigation. For drinkware-style collections the chips
          are oz volumes (12 oz Water Bottles, 20 oz …). For dimensional
          goods (frames, portfolios, cutting boards) the data is bucketed
          into Small / Medium / Large via area / linear thresholds. The
          axis is picked automatically based on what the subcategory's
          products actually carry. */}
      {sizeAxis !== "none" ? (
        <nav
          aria-label={t.bySize.replace("{collection}", subName)}
          className="mt-6 space-y-2"
        >
          <p className="overline">{t.browseBySize}</p>
          <ChipScroller aria-label={t.bySize.replace("{collection}", subName)}>
            <FilterChip
              href={activeTypes.length ? `${basePath}?${carryTypes().toString()}` : basePath}
              label={t.allSizes}
              count={filterByType(all, activeTypes).length}
              selected={activeSizes.length === 0}
            />
            {sizeFacets.map((f) => {
              const isActive = activeSizes.includes(f.canonical);
              const params = carryTypes();
              params.append("size", f.canonical);
              const labelSuffix =
                sizeAxis === "volume"
                  ? ` ${subName.replace(/^\d+\s*oz\.?\s*/i, "")}`
                  : "";
              return (
                <FilterChip
                  key={f.canonical}
                  href={`${basePath}?${params.toString()}`}
                  label={`${f.canonical}${labelSuffix}`}
                  count={f.count}
                  selected={isActive}
                />
              );
            })}
          </ChipScroller>
        </nav>
      ) : null}

      {/* Type sub-navigation — only appears when a merged subcategory's
          products carry ≥2 distinct finer-grained subcategoryName values
          (e.g. a single "20 oz. Tumblers" page grouping Clear Lid / Slider
          Lid / ION-Plated / Gold ION / Golf variants under one URL). */}
      {typeFacets.length >= 2 ? (
        <nav
          aria-label={t.byType.replace("{collection}", subName)}
          className="mt-6 space-y-2"
        >
          <p className="overline">{t.browseByType}</p>
          <ChipScroller aria-label={t.byType.replace("{collection}", subName)}>
            <FilterChip
              href={activeSizes.length ? `${basePath}?${carrySizes().toString()}` : basePath}
              label={t.allTypes}
              count={sizeFiltered.length}
              selected={activeTypes.length === 0}
            />
            {typeFacets.map((f) => {
              const isActive = activeTypes.includes(f.slug);
              const params = carrySizes();
              params.append("type", f.slug);
              return (
                <FilterChip
                  key={f.slug}
                  href={`${basePath}?${params.toString()}`}
                  label={subcategoryName(f.name, lang)}
                  count={f.count}
                  selected={isActive}
                />
              );
            })}
          </ChipScroller>
        </nav>
      ) : null}

      {filtered.length > 0 ? (
        <>
          {activeSizes.length > 0 || activeTypes.length > 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              {(filtered.length === 1 ? t.matchCountOne : t.matchCount).replace(
                "{count}",
                filtered.length.toLocaleString(lang),
              )}{" "}
              <span className="font-medium text-foreground">
                {[...activeSizes, ...activeTypes].join(", ")}
              </span>
            </p>
          ) : null}
          {/* Grouped layout: a merged subcategory that stands in for a level
              of URL we do not have (Leatherette Tumblers → Standard Lid /
              Slider Lid / Sport) shows every line at once under its own
              heading. Picking a type chip narrows to one line, so the flat
              grid takes over from there. */}
          {typeGroups ? (
            <div className="mt-8 space-y-12">
              {typeGroups.groups.map((g) => (
                <section key={g.slug}>
                  <h2 className="border-b border-border pb-2 text-h4 text-foreground">
                    {subcategoryName(g.name, lang)}{" "}
                    <span className="text-base font-normal text-muted-foreground">
                      ({g.items.length.toLocaleString(lang)})
                    </span>
                  </h2>
                  <ProductGrid locale={lang} products={g.items} className="mt-6" />
                </section>
              ))}
              {typeGroups.rest.length > 0 ? (
                <ProductGrid locale={lang} products={typeGroups.rest} />
              ) : null}
            </div>
          ) : (
            <ProductGrid locale={lang} products={filtered} className="mt-8" priorityCount={4} />
          )}
        </>
      ) : all.length > 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {t.noMatchBefore}
            <strong>{subName}</strong>
            {t.noMatchMiddle}
            <span className="font-medium text-foreground">
              {[...activeSizes, ...activeTypes].join(", ")}
            </span>
            {t.noMatchAfter}
          </p>
          <Link
            href={basePath}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-strong transition-colors hover:text-rust-bright"
          >
            {t.seeAll}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <p className="mt-10 text-muted-foreground">{t.empty}</p>
      )}

      {editorial ? (
        <CategoryEditorial copy={editorial} name={subName} headings={t} />
      ) : null}
    </div>
  );
}
