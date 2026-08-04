/**
 * Cross-links between storefront categories.
 *
 * When a product family is promoted out of a category it used to live in,
 * the buyers who still browse the old category lose the trail. This map
 * puts a pointer tile at the end of the source category's collection grid
 * so the family stays one click away.
 *
 * Keyed by source category slug -> the category slugs to point at, in
 * display order. Entries pointing at a category that no longer exists are
 * ignored by the caller, so removing a category never breaks a page.
 */
export const CATEGORY_CROSS_LINKS: Record<string, readonly string[]> = {
  // Empty since 3 Aug 2026: the leatherette tumbler line — the only entry —
  // moved back INTO Drinkware as a subcategory, so the trail it patched no
  // longer breaks. Add a row here the next time a family leaves a category.
};
