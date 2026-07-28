/**
 * Locale model for the site.
 *
 * English is the **hidden default**: it lives at the bare paths the site has
 * always used (`/pricing`, `/category/drinkware`) so every indexed URL and
 * inbound link keeps working. Turkish is served under a `/tr` prefix.
 *
 * The proxy (src/middleware.ts) rewrites a bare path to `/en/...` internally,
 * so the app tree can be a single `app/[lang]/...` while the browser only ever
 * sees the bare English URL or the `/tr` one.
 */
export const LOCALES = ["en", "tr"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE = "en" satisfies Locale;

export type PrefixedLocale = Exclude<Locale, typeof DEFAULT_LOCALE>;

/** Locales that carry a URL prefix. The default locale stays bare. */
export const PREFIXED_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Human label for the language switcher, in the language itself. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
};

/** Short label for the compact switcher trigger. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  tr: "TR",
};

/** `hreflang` value per locale. */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  en: "en-US",
  tr: "tr-TR",
};

/** OpenGraph `locale` value per locale. */
export const LOCALE_OG: Record<Locale, string> = {
  en: "en_US",
  tr: "tr_TR",
};

/**
 * Turn an app-internal href into the public path for `locale`.
 *
 * `localizedPath("/pricing", "tr") === "/tr/pricing"`
 * `localizedPath("/pricing", "en") === "/pricing"`
 *
 * External links, anchors, mailto/tel and already-prefixed paths pass through
 * untouched so callers can hand it any href without branching.
 */
export function localizedPath(href: string, locale: Locale): string {
  if (!href.startsWith("/")) return href;
  const bare = stripLocale(href);
  if (locale === DEFAULT_LOCALE) return bare;
  return bare === "/" ? `/${locale}` : `/${locale}${bare}`;
}

/** Remove a leading locale segment, returning the bare app path. */
export function stripLocale(pathname: string): string {
  const match = /^\/([^/]+)(\/.*)?$/.exec(pathname);
  if (!match) return pathname;
  if (!isLocale(match[1])) return pathname;
  return match[2] ?? "/";
}

/** Read the locale out of a public pathname (bare path ⇒ default locale). */
export function localeFromPath(pathname: string): Locale {
  const match = /^\/([^/]+)/.exec(pathname);
  if (match && isLocale(match[1])) return match[1];
  return DEFAULT_LOCALE;
}
