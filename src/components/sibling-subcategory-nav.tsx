"use client";

import { ChipScroller, FilterChip } from "@/components/filter-chip";
import { useDict } from "@/components/i18n-provider";

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
  const dict = useDict();
  const label = dict.subcategory.moreIn.replace("{category}", categoryName);

  return (
    <nav aria-label={label} className="mt-7 space-y-2">
      <p className="overline">{dict.subcategory.browseByType}</p>
      <ChipScroller aria-label={label}>
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
