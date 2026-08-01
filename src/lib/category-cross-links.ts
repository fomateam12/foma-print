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
  // The leatherette tumbler line was promoted out of Drinkware into its own
  // category; without this, 23 tumblers are invisible to anyone shopping
  // Drinkware for a tumbler.
  drinkware: ["leatherette-tumblers"],
};
