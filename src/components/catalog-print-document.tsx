import {
  getProductsBySubcategory,
  type Category,
  type Product,
} from "@/data/catalog";
// Absolute origin URLs, NOT catalogImageUrl: that one routes R2-hosted
// images through /_next/image, an endpoint this site does not serve (custom
// loader) — the printer would embed 23 broken images per page.
import { catalogImageAbsoluteUrl } from "@/lib/catalog-image";
import { formatPrice, formatWeight } from "@/lib/format";
import {
  ENGRAVING_FEES,
  inPartnerCatalog,
  partnerPriceFor,
} from "@/lib/partner-prices";
import { site } from "@/lib/site";

/**
 * Print-optimized partner catalog document — the source Chrome's
 * print-to-pdf renders. Shared by two routes:
 *
 *   /catalog/print          → every category, one combined PDF
 *   /catalog/print/[slug]   → a single category, one PDF per category
 *
 * A single-category document folds the cover into the header (no standalone
 * divider page); the combined document keeps a divider page per category so
 * a reader can find the section by flicking through.
 *
 * Images load eagerly so offscreen products still appear in the printed
 * document. Both routes are unlisted/noindex like the rest of /catalog.
 */

/** Total engraving surcharge on a one-sided engraved unit. */
const FRONT_ENGRAVING_TOTAL = ENGRAVING_FEES.front + ENGRAVING_FEES.handling;

function PrintCard({ p }: { p: Product }) {
  const price = partnerPriceFor(p.sku);
  return (
    <div
      className="rounded-lg border border-border p-2 text-[10px] leading-tight"
      style={{ breakInside: "avoid" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={catalogImageAbsoluteUrl(p.image)}
        alt={p.name}
        width={200}
        height={200}
        className="aspect-square w-full rounded-md border border-border/60 bg-white object-contain"
      />
      <p className="mt-1.5 font-medium text-foreground">{p.name}</p>
      <p className="text-muted-foreground">
        SKU {p.sku}
        {p.size ? ` · ${p.size}` : ""}
      </p>
      <p className="text-muted-foreground">
        {p.weightLb ? formatWeight(p.weightLb) : ""}
        {p.dimensions ? ` · box ${p.dimensions}` : ""}
      </p>
      {price ? (
        <>
          {/* Product price and engraving stated separately (user request) so
              a partner can price blanks and decoration independently; the
              engraved total is the sum, not a third rate. */}
          <p className="mt-0.5 text-muted-foreground">
            Blank {formatPrice(price.blank)} · Engraving +
            {formatPrice(FRONT_ENGRAVING_TOTAL)}
          </p>
          <p className="font-semibold text-foreground">
            Engraved {formatPrice(price.total)}
          </p>
        </>
      ) : (
        <p className="mt-0.5 font-semibold text-foreground">
          Priced per order (quote)
        </p>
      )}
    </div>
  );
}

function sectionsFor(c: Category) {
  const sections = c.subcategories
    .map((sc) => ({
      sc,
      items: getProductsBySubcategory(c.slug, sc.slug).filter(inPartnerCatalog),
    }))
    .filter(({ items }) => items.length > 0);
  return {
    sections,
    total: sections.reduce((n, s) => n + s.items.length, 0),
  };
}

export function CatalogPrintDocument({
  categories,
  title,
}: {
  categories: Category[];
  title: string;
}) {
  const single = categories.length === 1;
  const singleStats = single ? sectionsFor(categories[0]) : null;

  return (
    <div className="container-px py-8">
      {/* The site chrome (sticky nav, footer, floating quote button) would
          repeat or overlay pages in Chrome's print rendering — hide it. */}
      <style>{`@media print { body > header, body > footer, nav, [data-floating] { display: none !important } }`}</style>
      <header style={{ breakInside: "avoid" }}>
        <h1 className="text-h2 text-foreground">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Personalized, laser-engraved products, blind drop-shipped from
          Alpharetta, Georgia (USA). Prices are wholesale per unit:
          &quot;Blank&quot; is the undecorated unit price; &quot;Engraving&quot;
          is the decoration surcharge (${ENGRAVING_FEES.front.toFixed(2)} front
          engraving + ${ENGRAVING_FEES.handling.toFixed(2)}{" "}handling) and
          &quot;Engraved&quot; is the two added together — the all-in price per
          personalized unit. Back-side engraving adds $
          {ENGRAVING_FEES.back.toFixed(2)}. Weights are pounds. Live version
          with photos: {site.url.replace(/\/$/, "")}/catalog · Contact:{" "}
          {site.email}
        </p>
        {singleStats ? (
          <p className="mt-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {categories[0].name}
            </span>{" "}
            — {singleStats.total.toLocaleString()} products ·{" "}
            {singleStats.sections.length}{" "}
            {singleStats.sections.length === 1 ? "collection" : "collections"}:{" "}
            {singleStats.sections
              .map(({ sc, items }) => `${sc.name} (${items.length})`)
              .join(", ")}
          </p>
        ) : null}
      </header>
      {categories.map((c) => {
        const { sections, total } = single ? singleStats! : sectionsFor(c);
        return (
          <section key={c.slug} style={single ? undefined : { breakBefore: "page" }}>
            {/* Category divider page: the title stands alone, and every
                subcategory opens on a fresh page — no two sections ever
                share a page. A single-category document has said all this
                in its header already, so it skips the divider. */}
            {single ? null : (
              <div className="flex min-h-[80vh] flex-col justify-center">
                <p className="eyebrow text-brand-strong">Category</p>
                <h2 className="mt-3 text-h1 text-foreground">{c.name}</h2>
                <p className="mt-4 text-lead text-muted-foreground">
                  {total.toLocaleString()} products · {sections.length}{" "}
                  collections
                </p>
                <ul className="mt-6 max-w-md text-sm text-muted-foreground">
                  {sections.map(({ sc, items }) => (
                    <li key={sc.slug}>
                      {sc.name} ({items.length.toLocaleString()})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {sections.map(({ sc, items }, i) => {
              // A subcategory with less than a full grid row would waste a
              // page alone (e.g. Lighters) — let it flow after the previous
              // section; break-inside keeps its header and row together.
              // In a single-category document the first section follows the
              // header on page 1 instead of opening a near-empty page.
              const ownPage = items.length > 4 && !(single && i === 0);
              return (
                <div
                  key={sc.slug}
                  className={ownPage ? undefined : "mt-8"}
                  style={
                    ownPage ? { breakBefore: "page" } : { breakInside: "avoid" }
                  }
                >
                  <h3
                    className="border-b border-border pb-2 text-lg font-semibold text-foreground"
                    style={{ breakAfter: "avoid" }}
                  >
                    {c.name}{" "}
                    <span className="font-normal text-muted-foreground">›</span>{" "}
                    {sc.name}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({items.length} products)
                    </span>
                  </h3>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {items.map((p) => (
                      <PrintCard key={p.id} p={p} />
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
