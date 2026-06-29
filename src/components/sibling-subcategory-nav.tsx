import { ChipScroller, FilterChip } from "@/components/filter-chip";

interface Sibling {
  slug: string;
  name: string;
}

/**
 * Sibling-subcategory chip rail. Thin wrapper around the shared
 * ChipScroller + FilterChip so it shares one look (and one scroll/chevron
 * behaviour) with every other filter rail in the app. Data + href targets
 * are unchanged.
 */
export function SiblingSubcategoryNav({
  categoryName,
  categorySlug,
  siblings,
  activeSlug,
}: {
  categoryName: string;
  categorySlug: string;
  siblings: Sibling[];
  activeSlug: string;
}) {
  return (
    <nav aria-label={`More in ${categoryName}`} className="mt-7 space-y-2">
      <p className="overline">Browse by type</p>
      <ChipScroller aria-label={`More in ${categoryName}`}>
        {siblings.map((sc) => (
          <FilterChip
            key={sc.slug}
            href={`/category/${categorySlug}/${sc.slug}`}
            label={sc.name}
            selected={sc.slug === activeSlug}
          />
        ))}
      </ChipScroller>
    </nav>
  );
}
