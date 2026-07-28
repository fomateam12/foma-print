import type { Dictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { subcategoryName } from "@/lib/catalog-i18n";
import type { Product } from "@/data/types";

/**
 * Product descriptions and personalization labels, per locale.
 *
 * `src/data/catalog.ts` builds the English copy from a template at module load
 * (it is the same sentence for every SKU with the name, collection and size
 * swapped in). Rather than translating 847 generated paragraphs, the template
 * itself lives in the dictionary and is filled here with the already-translated
 * name and collection — so Turkish reads naturally and stays in sync when the
 * supplier feed changes.
 */
export function productCopy(
  product: Product,
  localizedName: string,
  dict: Dictionary,
  locale: Locale,
) {
  if (locale === DEFAULT_LOCALE) {
    return {
      description: product.description,
      longDescription: product.longDescription,
      personalization: product.personalization,
    };
  }

  const t = dict.product;
  const size = product.size ?? "";
  const collection = subcategoryName(product.subcategoryName, locale);

  const description = t.descriptionTemplate
    .replace("{name}", localizedName)
    .replace("{size}", size ? t.sizeParenthetical.replace("{size}", size) : "");

  const longDescription = t.longDescriptionTemplate
    .replace("{name}", localizedName)
    .replace("{collection}", collection)
    .replace("{size}", size ? t.sizeSentence.replace("{size}", size) : "");

  // Only the font option exists today (see buildPersonalization in catalog.ts);
  // its label and choices are translated, its id is the stable key.
  const personalization = product.personalization.map((opt) =>
    opt.id === "font"
      ? { ...opt, label: t.fontStyle, options: [...t.fontOptions] }
      : opt,
  );

  return { description, longDescription, personalization };
}
