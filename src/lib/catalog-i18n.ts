import { DEFAULT_LOCALE, type Locale, type PrefixedLocale } from "@/lib/i18n";
import tr from "@/data/catalog-tr.json";

/**
 * Translations for catalog *data* — the strings that come from the supplier
 * feed rather than from our own copy.
 *
 * `src/data/products.json` stays untouched English: it is the supplier's
 * truth and the SKU contract the rest of the FOMA stack (FomaFlow, JDS)
 * matches on. Turkish lives beside it in `catalog-tr.json`, keyed by the
 * exact English string (categories, subcategories, sizes) or by SKU
 * (product names).
 *
 * Every lookup falls back to English, so when the feed adds a product we
 * have not translated yet the page renders the English name instead of a
 * blank — degraded, never broken.
 */
const TABLES: Record<
  PrefixedLocale,
  {
    categories: Record<string, string>;
    subcategories: Record<string, string>;
    sizes: Record<string, string>;
    products: Record<string, string>;
    blurbs: Record<string, string>;
  }
> = { tr };

function table(locale: Locale) {
  return locale === DEFAULT_LOCALE ? null : TABLES[locale];
}

export function categoryName(englishName: string, locale: Locale): string {
  return table(locale)?.categories[englishName] ?? englishName;
}

export function subcategoryName(englishName: string, locale: Locale): string {
  return table(locale)?.subcategories[englishName] ?? englishName;
}

/** Category blurbs are keyed by the category's English name. */
export function categoryBlurb(
  englishCategoryName: string,
  englishBlurb: string,
  locale: Locale,
): string {
  return table(locale)?.blurbs[englishCategoryName] ?? englishBlurb;
}

export function sizeLabel(englishSize: string, locale: Locale): string {
  if (!englishSize) return englishSize;
  return table(locale)?.sizes[englishSize] ?? englishSize;
}

/** Product names are keyed by SKU — the stable identifier across the stack. */
export function productName(
  sku: string,
  englishName: string,
  locale: Locale,
): string {
  return table(locale)?.products[sku.toUpperCase()] ?? englishName;
}

/**
 * Localized copy of a product for rendering.
 *
 * Called on the server so `catalog-tr.json` (847 names) never reaches the
 * client bundle; the card components receive already-translated products.
 * The SKU and every id/slug are untouched — those are the contract the rest
 * of the FOMA stack matches on.
 */
export function localizeProduct<
  T extends {
    sku: string;
    name: string;
    subcategoryName?: string;
    size?: string | null;
  },
>(product: T, locale: Locale): T {
  if (locale === DEFAULT_LOCALE) return product;
  return {
    ...product,
    name: productName(product.sku, product.name, locale),
    ...(product.subcategoryName
      ? { subcategoryName: subcategoryName(product.subcategoryName, locale) }
      : {}),
    ...(product.size ? { size: sizeLabel(product.size, locale) } : {}),
  };
}
