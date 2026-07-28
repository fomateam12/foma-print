import type { MetadataRoute } from "next";
import { getAllProducts, getCategories } from "@/data/catalog";
import { site } from "@/lib/site";
import { LOCALES, LOCALE_HREFLANG, localizedPath } from "@/lib/i18n";

/**
 * Regenerate the sitemap on the same ISR cadence as product pages so a
 * supplier scrape that lands between deploys eventually surfaces the new
 * SKUs to search engines instead of waiting for the next code push.
 *
 * Every page is emitted once per locale, and each entry carries the full
 * `alternates.languages` set so Google sees the English and Turkish URLs as
 * one page in two languages rather than as duplicates.
 */
export const revalidate = 86400;

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const entries: Entry[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/categories", changeFrequency: "weekly", priority: 0.9 },
    { path: "/how-it-works", changeFrequency: "monthly", priority: 0.7 },
    { path: "/shipping", changeFrequency: "monthly", priority: 0.6 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
    { path: "/quote", changeFrequency: "monthly", priority: 0.7 },
    { path: "/sell", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about", changeFrequency: "yearly", priority: 0.5 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  for (const c of getCategories()) {
    entries.push({
      path: `/category/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    for (const sc of c.subcategories) {
      entries.push({
        path: `/category/${c.slug}/${sc.slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  for (const p of getAllProducts()) {
    entries.push({
      path: `/product/${p.id}`,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries.flatMap((entry) =>
    LOCALES.map((locale) => ({
      url: `${base}${localizedPath(entry.path, locale)}`,
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [
            LOCALE_HREFLANG[l],
            `${base}${localizedPath(entry.path, l)}`,
          ]),
        ),
      },
    })),
  );
}
