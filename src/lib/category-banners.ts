/**
 * Lifestyle banner art for the seven top-level category pages, generated
 * to the brand's warm cream/terracotta palette (engraved products in real
 * settings, golden-hour light, no text). Files live in public/banners and
 * are served as-is — the custom image loader passes non-/products paths
 * through untouched. A category without an entry simply renders the
 * text-only header, so adding art stays optional per category.
 */
export const CATEGORY_BANNERS: Record<string, { src: string; alt: string }> = {
  drinkware: {
    src: "/banners/drinkware.jpg",
    alt: "Laser-engraved matte black tumblers steaming on a sunlit café table",
  },
  "kitchen-and-bar": {
    src: "/banners/kitchen-and-bar.jpg",
    alt: "Engraved walnut and bamboo cutting boards in a warm artisan kitchen",
  },
  "travel-accessories": {
    src: "/banners/travel-accessories.jpg",
    alt: "Engraved leatherette passport holder, luggage tag and toiletry bag beside a vintage suitcase",
  },
  "personal-accessories": {
    src: "/banners/personal-accessories.jpg",
    alt: "Engraved leatherette wallet and keychain on a wooden dresser in warm light",
  },
  "frames-and-decor": {
    src: "/banners/frames-and-decor.jpg",
    alt: "Engraved wooden photo frame on a cozy shelf with candles and dried flowers",
  },
  "office-tech": {
    src: "/banners/office-tech.jpg",
    alt: "Engraved leatherette portfolio and wooden desk organizer on a home-office desk",
  },
  "gift-sets": {
    src: "/banners/gift-sets.jpg",
    alt: "Engraved whiskey-glass gift set with wooden box and leatherette coasters",
  },
};
