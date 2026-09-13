import type { Locale } from "@/lib/i18n";
import { CATEGORY_COPY } from "@/data/editorial/categories";
import { COLLECTION_COPY } from "@/data/editorial/collections";
import { DRINKWARE_COLLECTION_COPY } from "@/data/editorial/collections-drinkware";
import { OFFICE_PERSONAL_COLLECTION_COPY } from "@/data/editorial/collections-office-personal";
import { HOME_GIFT_COLLECTION_COPY } from "@/data/editorial/collections-home-gift";

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
  ...DRINKWARE_COLLECTION_COPY,
  ...OFFICE_PERSONAL_COLLECTION_COPY,
  ...HOME_GIFT_COLLECTION_COPY,
};

/** Look up copy for a category (`slug`) or a collection (`slug/subSlug`). */
export function editorialFor(
  key: string,
  locale: Locale,
): EditorialCopy | undefined {
  return CATEGORY_EDITORIAL[key]?.[locale];
}

/**
 * Meta description for a page that has editorial copy.
 *
 * The collection pages all shared one generated sentence ("Shop N
 * personalized X — laser-engraved to order …"), which differed only by a
 * count and a noun across 118 pages. Where hand-written copy exists, its
 * opening sentences are a far better snippet: they are specific, they read
 * as prose, and they are already about the thing the searcher asked for.
 *
 * Prefers whole sentences under `limit`; when the opening sentence alone is
 * longer than that (common — these are written as prose, not as snippets) it
 * cuts on a word boundary rather than giving up and letting the generated
 * line win.
 */
export function editorialMetaDescription(
  copy: EditorialCopy,
  limit = 165,
): string | undefined {
  const text = copy.intro[0]?.trim();
  if (!text) return undefined;
  if (text.length <= limit) return text;

  // Whole sentences first — a snippet that ends on a full stop reads best.
  const sentences = text.split(/(?<=[.!?])\s+/);
  let out = "";
  for (const sentence of sentences) {
    const next = out ? `${out} ${sentence}` : sentence;
    if (next.length > limit) break;
    out = next;
  }
  if (out) return out;

  // A single opening sentence longer than the limit (common — these are
  // written as prose, not as snippets). Cut on a word boundary rather than
  // returning nothing and falling back to the generated line.
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : limit).replace(/[,;:—-]$/, "")}…`;
}
