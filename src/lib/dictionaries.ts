import "server-only";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import en from "@/dictionaries/en.json";

/**
 * Translation dictionaries, loaded on the server only.
 *
 * `en.json` is the source of truth for the shape — `Dictionary` is derived from
 * it — and it is also the runtime fallback: a non-default locale is deep-merged
 * over English, so a key that has not been translated yet renders the English
 * string instead of `undefined`. Copy added to en.json therefore ships safely
 * before its translation lands.
 */
const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  tr: () => import("@/dictionaries/tr.json").then((m) => m.default),
} satisfies Record<Locale, () => Promise<unknown>>;

export type Dictionary = typeof en;

type Plain = Record<string, unknown>;

function isPlainObject(value: unknown): value is Plain {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** English base with `override`'s defined leaves applied on top. */
function mergeOver(base: Plain, override: Plain): Plain {
  const out: Plain = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined || value === null) continue;
    const current = out[key];
    out[key] =
      isPlainObject(current) && isPlainObject(value)
        ? mergeOver(current, value)
        : value;
  }
  return out;
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  if (locale === DEFAULT_LOCALE) return en;
  const translated = (await dictionaries[locale]()) as Plain;
  return mergeOver(en as unknown as Plain, translated) as unknown as Dictionary;
};
