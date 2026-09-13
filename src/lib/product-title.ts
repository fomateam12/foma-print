import { getAllProducts } from "@/data/catalog";
import { sizeLabel } from "@/lib/catalog-i18n";
import type { Locale } from "@/lib/i18n";
import type { Product } from "@/data/types";

/**
 * SKUs whose product name is shared with at least one other SKU.
 *
 * The supplier feed ships one row per size, all under the same name — 142
 * names cover 340 SKUs ("Bamboo Cutting Board with Handle" alone is 6 rows).
 * Left alone, those become 340 product pages with byte-identical `<title>`
 * and meta description, which Google treats as duplicates and drops from the
 * index ("Crawled — currently not indexed"). Appending the size disambiguates
 * them without touching the catalog data or the SKU contract.
 *
 * Computed once at module load from the built catalog; the set is keyed by
 * SKU so a later feed refresh needs no maintenance here.
 */
const DUPLICATE_NAME_SKUS: ReadonlySet<string> = (() => {
  const byName = new Map<string, string[]>();
  for (const p of getAllProducts()) {
    const key = p.name.trim().toLowerCase();
    const list = byName.get(key);
    if (list) list.push(p.sku);
    else byName.set(key, [p.sku]);
  }
  const dupes = new Set<string>();
  for (const skus of byName.values()) {
    if (skus.length > 1) for (const sku of skus) dupes.add(sku);
  }
  return dupes;
})();

/**
 * SKUs that share BOTH their name and their size with another SKU.
 *
 * The feed carries genuine twins — PTF146 and PTF546 are both "Red Alder
 * Photo Frame" at 4" x 6", in different finishes the name does not record.
 * Adding the size disambiguates the ordinary case but not these, so they get
 * the SKU appended as well. Without this the "fix" would still leave a pile
 * of identical titles behind.
 */
const DUPLICATE_NAME_SIZE_SKUS: ReadonlySet<string> = (() => {
  const byNameSize = new Map<string, string[]>();
  for (const p of getAllProducts()) {
    const key = `${p.name.trim().toLowerCase()}|${(p.size ?? "").trim().toLowerCase()}`;
    const list = byNameSize.get(key);
    if (list) list.push(p.sku);
    else byNameSize.set(key, [p.sku]);
  }
  const dupes = new Set<string>();
  for (const skus of byNameSize.values()) {
    if (skus.length > 1) for (const sku of skus) dupes.add(sku);
  }
  return dupes;
})();

/**
 * Search-result title for a product page.
 *
 * Returns the plain localized name for a SKU whose name is already unique, and
 * `name — size` for one that shares its name with a sibling size. Falls back
 * to the SKU when the feed has no size on a duplicated row, so the title is
 * unique either way.
 */
export function productSeoTitle(
  product: Product,
  localizedName: string,
  locale: Locale,
): string {
  if (!DUPLICATE_NAME_SKUS.has(product.sku)) return localizedName;

  const size = product.size ? sizeLabel(product.size, locale) : "";
  const withSize = size ? `${localizedName} — ${size}` : localizedName;

  // Size alone is not enough for a name+size twin, and a SKU-less title with
  // no size at all is no better than the one we started with.
  if (!size || DUPLICATE_NAME_SIZE_SKUS.has(product.sku)) {
    return `${withSize} (${product.sku})`;
  }
  return withSize;
}

/** True when this SKU shares its name with another size in the feed. */
export function hasSharedName(sku: string): boolean {
  return DUPLICATE_NAME_SKUS.has(sku);
}
