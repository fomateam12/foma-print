import type { Metadata } from "next";
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
