import type { Metadata } from "next";
import { site } from "@/lib/site";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_HREFLANG,
  localizedPath,
  type Locale,
} from "@/lib/i18n";

/**
 * Canonical + hreflang block for one app path, in one locale.
 *
 * Each locale's page is canonical to *itself* (`/tr/pricing` must not point at
 * `/pricing`, or Google drops the Turkish page), and every page lists the full
 * language set plus `x-default` → English.
 */
export function alternatesFor(
  path: string,
  locale: Locale,
): Metadata["alternates"] {
  return {
    canonical: localizedPath(path, locale),
    languages: {
      ...Object.fromEntries(
        LOCALES.map((l) => [LOCALE_HREFLANG[l], localizedPath(path, l)]),
      ),
      "x-default": localizedPath(path, DEFAULT_LOCALE),
    },
  };
}

/** Absolute URL for an app path in `locale` — schema.org requires absolute. */
export function absoluteUrl(path: string, locale: Locale): string {
  return new URL(localizedPath(path, locale), site.url).toString();
}

/**
 * `BreadcrumbList` structured data for one page's crumb trail.
 *
 * Google needs the trail as JSON-LD to render the breadcrumb line in place of
 * the raw URL in the result snippet; the visual `<Breadcrumbs>` component is a
 * client component and carries no schema of its own. Crumbs without an `href`
 * (the current page) still get a position but no `item`.
 */
export function breadcrumbJsonLd(
  crumbs: { name: string; path?: string }[],
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: absoluteUrl(c.path, locale) } : {}),
    })),
  };
}

/**
 * `FAQPage` structured data from a question/answer list. Used by the category
 * and guide pages; the answers must also be visible on the page itself or
 * Google drops the rich result.
 */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * `ItemList` structured data for a category or collection listing, so the
 * crawler sees the page as a product listing rather than a wall of links.
 */
export function itemListJsonLd(
  items: { name: string; path: string }[],
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path, locale),
    })),
  };
}
