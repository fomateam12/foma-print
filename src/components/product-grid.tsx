import { ProductCard } from "@/components/product-card";
import { AddToQuoteButton } from "@/components/add-to-quote-button";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/types";
import { localizeProduct } from "@/lib/catalog-i18n";
import { productCopy } from "@/lib/product-copy";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

export async function ProductGrid({
  products,
  locale,
  className,
  priorityCount = 0,
  withQuoteAction = true,
}: {
  products: Product[];
  /** Names are translated here, on the server, so the catalog translation
   *  table never ships to the browser. */
  locale: Locale;
  className?: string;
  priorityCount?: number;
  /** Render the hover "Add to quote" affordance on each card. */
  withQuoteAction?: boolean;
}) {
  const dict = await getDictionary(locale);

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5",
        className,
      )}
    >
      {products.map((raw, i) => {
        const named = localizeProduct(raw, locale);
        // Quick view renders the description, so localize it here too rather
        // than shipping the English paragraph into a Turkish page.
        const { description, longDescription, personalization } = productCopy(
          raw,
          named.name,
          dict,
          locale,
        );
        const p = { ...named, description, longDescription, personalization };
        return (
        <ProductCard
          key={p.id}
          product={p}
          priority={i < priorityCount}
          action={
            withQuoteAction ? (
              <AddToQuoteButton
                variant="icon"
                item={{ id: p.id, sku: p.sku, name: p.name, image: p.image }}
              />
            ) : undefined
          }
        />
        );
      })}
    </div>
  );
}
