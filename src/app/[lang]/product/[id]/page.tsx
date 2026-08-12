import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/locale-link";
import {
  Check,
  ArrowRight,
  FileText,
  Mail,
  Truck,
  ShieldCheck,
  Tags,
  Ruler,
  Package,
  Box,
  Scan,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGrid } from "@/components/product-grid";
import { ProductGallery } from "@/components/product-gallery";
import { AddToQuoteButton } from "@/components/add-to-quote-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cloudinary, formatWeight } from "@/lib/format";
import {
  getAllProducts,
  getProduct,
  getRelatedProducts,
} from "@/data/catalog";
import { site } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { LOCALES, isLocale } from "@/lib/i18n";
import {
  categoryName,
  productName,
  sizeLabel,
  subcategoryName,
} from "@/lib/catalog-i18n";
import { productCopy } from "@/lib/product-copy";
import { alternatesFor } from "@/lib/seo";

/**
 * ISR window. Catalog data is updated occasionally (supplier scrape, manual
 * curation), so a static page can serve from the edge cache for a day before
 * the optimizer regenerates it. New product pages skipped by
 * `generateStaticParams` fall through to on-demand SSG on first visit and
 * land in the edge cache there.
 */
export const revalidate = 86400;

/**
 * Pre-render only the first slice of product pages at build time — the rest
 * are generated on demand via ISR. This shaves a couple of minutes off CI
 * (805 pages × prerender ≈ 3 minutes cold-build cost) and lets new SKUs go
 * live without a full rebuild. The slice is deterministic (catalog order),
 * so consecutive deploys hit the same prebuilt set + edge cache. The slice is
 * per locale, so both languages get the same prebuilt SKUs.
 */
const PREBUILT_PRODUCT_COUNT = 120;

export function generateStaticParams() {
  const ids = getAllProducts().slice(0, PREBUILT_PRODUCT_COUNT);
  return LOCALES.flatMap((lang) => ids.map((p) => ({ lang, id: p.id })));
}

/** Allow on-demand rendering of product IDs that weren't pre-built. */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/product/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const product = getProduct(id);
  if (!product) return { title: dict.product.notFound };

  const name = productName(product.sku, product.name, lang);
  const { description } = productCopy(product, name, dict, lang);
  const ogImage = cloudinary(product.image, { width: 1200 });

  return {
    title: name,
    description,
    alternates: alternatesFor(`/product/${product.id}`, lang),
    openGraph: {
      title: `${name} · FomaPrint`,
      description,
      images: [{ url: ogImage, width: 1200, height: 1200, alt: name }],
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/[lang]/product/[id]">) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.product;

  const product = getProduct(id);
  if (!product) notFound();
  const related = getRelatedProducts(product, 8);

  const name = productName(product.sku, product.name, lang);
  const subName = subcategoryName(product.subcategoryName, lang);
  const size = sizeLabel(product.size ?? "", lang);
  // Per-SKU master weight first; the packaging sheet's per-unit weight is the
  // fallback for SKUs FOMA has never weighed individually.
  const weightLb = product.weightLb ?? product.shippingWeightLb;
  const { description, longDescription, personalization } = productCopy(
    product,
    name,
    dict,
    lang,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image: cloudinary(product.imageFull, { width: 1200 }),
    description,
    sku: product.sku,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.basePrice.toFixed(2),
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: site.legalName },
    },
  };

  return (
    <div className="container-px py-10 lg:py-14">
      <script
        type="application/ld+json"
        // Escape `<` so catalog text can never break out of the script tag.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Breadcrumbs
        items={[
          { label: dict.common.home, href: "/" },
          { label: dict.categories.breadcrumb, href: "/categories" },
          {
            label: categoryName(product.categoryName, lang),
            href: `/category/${product.categorySlug}`,
          },
          {
            label: subName,
            href: `/category/${product.categorySlug}/${product.subcategorySlug}`,
          },
          { label: name },
        ]}
        className="mb-6"
      />

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery — when the SKU has a curated multi-view binding the gallery
            shows up to 6 thumbnails; otherwise it falls back to the single
            supplier image, sized + transformed through Cloudinary. */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery
            images={
              product.images && product.images.length > 0
                ? product.images
                : [cloudinary(product.imageFull, { width: 900 })]
            }
            alt={name}
          />
        </div>

        {/* Details */}
        <div>
          <Link
            href={`/category/${product.categorySlug}/${product.subcategorySlug}`}
            className="text-sm font-medium text-brand-strong hover:underline"
          >
            {subName}
          </Link>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wide">
              SKU: {product.sku}
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-secondary/40 p-4">
            <p className="font-heading text-lg font-semibold text-foreground">
              {dict.category.wholesaleOnRequest}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.pricingNote}
            </p>
          </div>

          <p className="mt-5 leading-relaxed text-muted-foreground">
            {longDescription}
          </p>

          {/* Specifications — surfaced as a compact chip grid so wholesale
              buyers can scan the size, weight, carton dimensions and
              engraving area without scrolling. Dimensions and engraving
              area come from the supplier's shipping master keyed by
              product type; `Weight` is the per-SKU item weight from the
              FOMA master list — when FOMA has never weighed that SKU we
              fall back to the per-unit weight on the packaging sheet
              (`shippingWeightLb`) so the chip is filled rather than blank. */}
          {product.size ||
          weightLb ||
          product.dimensions ||
          product.engravingArea ? (
            <dl className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {product.size ? (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm">
                  <Ruler className="size-4 shrink-0 text-brand-strong" />
                  <dt className="font-medium text-foreground">{t.size}</dt>
                  <dd className="text-muted-foreground">{size}</dd>
                </div>
              ) : null}
              {weightLb ? (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm">
                  <Package className="size-4 shrink-0 text-brand-strong" />
                  <dt className="font-medium text-foreground">{t.weight}</dt>
                  <dd className="text-muted-foreground">
                    {formatWeight(weightLb)}
                  </dd>
                </div>
              ) : null}
              {product.dimensions ? (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm">
                  <Box className="size-4 shrink-0 text-brand-strong" />
                  <dt className="font-medium text-foreground">
                    {t.dimensions}
                  </dt>
                  <dd className="text-muted-foreground">{product.dimensions}</dd>
                </div>
              ) : null}
              {product.engravingArea ? (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm">
                  <Scan className="size-4 shrink-0 text-brand-strong" />
                  <dt className="font-medium text-foreground">
                    {t.engravingArea}
                  </dt>
                  <dd className="text-muted-foreground">
                    {product.engravingArea}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          {/* Personalization */}
          <div className="mt-7 rounded-2xl border border-border bg-secondary/40 p-5">
            <h2 className="font-heading text-sm font-semibold text-foreground">
              {t.personalizationTitle}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {personalization.map((opt) => (
                <li key={opt.id} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-evergreen" />
                  <span>
                    <span className="font-medium text-foreground">
                      {opt.label}
                    </span>
                    {opt.options ? ` — ${opt.options.join(", ")}` : ""}
                    {opt.helpText ? (
                      <span className="block text-xs text-muted-foreground/80">
                        {opt.helpText}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="mt-6 space-y-3">
            <AddToQuoteButton
              item={{
                id: product.id,
                sku: product.sku,
                name,
                image: product.image,
              }}
              variant="full"
              className="w-full"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "flex-1",
                )}
              >
                <FileText className="size-4" />
                {dict.quote.metaTitle}
              </Link>
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(
                  t.mailSubject
                    .replace("{name}", name)
                    .replace("{sku}", product.sku),
                )}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "flex-1",
                )}
              >
                <Mail className="size-4" />
                {t.askQuestion}
              </a>
            </div>
          </div>

          {/* Trust */}
          <div className="mt-7 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 size-5 text-brand-strong" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t.trustReply}
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Truck className="mt-0.5 size-5 text-brand-strong" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t.trustMadeToOrder} ·{" "}
                {dict.copy.dispatchNote.replace(
                  "{cutoff}",
                  dict.copy.orderCutoff,
                )}
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Tags className="mt-0.5 size-5 text-brand-strong" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t.trustBulk}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 ? (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              {t.related}
            </h2>
            <Link
              href={`/category/${product.categorySlug}/${product.subcategorySlug}`}
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-strong transition-colors hover:text-rust-bright sm:inline-flex"
            >
              {t.moreIn.replace("{collection}", subName)}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <ProductGrid locale={lang} products={related} className="mt-6" />
        </section>
      ) : null}
    </div>
  );
}
