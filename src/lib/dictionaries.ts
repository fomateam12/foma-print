import "server-only";
import type { Locale } from "@/lib/i18n";
import en from "@/dictionaries/en.json";

/**
 * Translation dictionaries, loaded on the server only.
 *
 * `en.json` is the source of truth for the shape: `Dictionary` is derived from
 * it, so a key added to English but missing from Turkish is a type error at
 * build time rather than an empty string in production.
 */
const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  tr: () => import("@/dictionaries/tr.json").then((m) => m.default),
} satisfies Record<Locale, () => Promise<unknown>>;

export type Dictionary = typeof en;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]() as Promise<Dictionary>;
