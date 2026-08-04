/**
 * Subcategories that render their products as labelled blocks instead of one
 * flat grid.
 *
 * A merged subcategory (one URL, several product lines that each keep their
 * own `subcategoryName`) already gets "Browse by type" chips. For a page like
 * Leatherette Tumblers the three lines — Standard Lid, Slider Lid, Sport —
 * are what a buyer is actually choosing between, so the unfiltered page shows
 * all three at once under their own headings rather than making the buyer
 * click a chip to discover them. This is the substitute for a third URL level
 * the /category/[slug]/[subSlug] route cannot express.
 *
 * Opt-in per subcategory slug: every other merged page keeps the flat grid it
 * ships today.
 */
export const GROUPED_SUBCATEGORIES: ReadonlySet<string> = new Set([
  "leatherette-tumblers",
]);
