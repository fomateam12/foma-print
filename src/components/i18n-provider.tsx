"use client";

import { createContext, useContext } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

/**
 * Makes the active locale and its dictionary available to client components.
 *
 * Server components read the dictionary directly with `getDictionary(lang)`;
 * client components (header, forms, quote drawer) cannot, so the layout drops
 * the resolved dictionary into this context once and they pull from it.
 */
type I18nValue = { locale: Locale; dict: Dictionary };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: I18nValue & { children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ locale, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

/** Full context. Throws outside the provider so a missing wrapper is loud. */
export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return value;
}

export function useDict(): Dictionary {
  return useI18n().dict;
}

/**
 * Active locale. Unlike `useI18n` this tolerates a missing provider and falls
 * back to the default locale, so link-only components keep working in
 * isolated renders (storybook-style previews, tests).
 */
export function useLocale(): Locale {
  return useContext(I18nContext)?.locale ?? DEFAULT_LOCALE;
}
