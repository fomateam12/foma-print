import type { Locale } from "@/lib/i18n";
import { CATEGORY_COPY } from "@/data/editorial/categories";
import { COLLECTION_COPY } from "@/data/editorial/collections";

export interface EditorialFaq {
  q: string;
  a: string;
}

export interface EditorialCopy {
  /** Two or three short paragraphs of original prose about the category. */
  intro: string[];
  /** Concrete reseller use cases — rendered as a checked list. */
  highlights: string[];
  /** Questions a buyer actually searches. Answers must stay visible on the
   *  page: Google drops the FAQ rich result when the text is schema-only. */
  faqs: EditorialFaq[];
}

/**
 * Hand-written category copy, per locale.
 *
 * Why this file exists: every category and collection page used to be a
 * one-sentence supplier blurb plus a grid of tiles. Search engines had nothing
 * to rank — no prose about the material, the engraving result, the sizes or
 * the reseller workflow — so the pages sat unindexed while competitors ranked
 * for the same queries. The copy here is written per key, never generated from
 * a template: templated paragraphs are what put the product pages in the
 * duplicate bucket in the first place.
 *
 * Keys: `"drinkware"` for a category, `"drinkware/40-oz-tumblers"` for a
 * collection. A missing key renders nothing — half-written filler is worse
 * than an honest short page, and the component degrades silently.
 */
export type EditorialEntry = Record<Locale, EditorialCopy>;

export const CATEGORY_EDITORIAL: Record<string, EditorialEntry> = {
  ...CATEGORY_COPY,
  ...COLLECTION_COPY,
};

/** Look up copy for a category (`slug`) or a collection (`slug/subSlug`). */
export function editorialFor(
  key: string,
  locale: Locale,
): EditorialCopy | undefined {
  return CATEGORY_EDITORIAL[key]?.[locale];
}
