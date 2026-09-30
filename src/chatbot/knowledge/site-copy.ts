import "server-only";
import en from "@/dictionaries/en.json";
import { CATEGORY_COPY } from "@/data/editorial/categories";

/**
 * Public page copy from fomaprint.com, assembled into FomaBot's knowledge so
 * the bot can answer everything the site itself says, and stays in sync when
 * the site copy changes. Everything here is already visible to a logged-out
 * visitor; the runtime check in config.ts still runs the whole prompt through
 * the output filter against the live denylist.
 *
 * English only: it is reference material, and the model answers in the
 * visitor's language.
 */

const SECTIONS: { key: keyof typeof en; title: string }[] = [
  { key: "home", title: "Home page" },
  { key: "howItWorks", title: "How it works" },
  { key: "shipping", title: "Shipping & turnaround" },
  { key: "faq", title: "FAQ" },
  { key: "sell", title: "Become a reseller" },
  { key: "pricing", title: "Wholesale pricing" },
  { key: "about", title: "About" },
  { key: "contact", title: "Contact" },
  { key: "quote", title: "Quote requests" },
];

const PLACEHOLDERS: Record<string, string> = {
  cutoff: "2pm ET",
  count: "1,250+",
  legal: "FOMA FAMILY LLC",
  brand: "FomaPrint",
};

function fill(s: string): string {
  return s.replace(/\{(\w+)\}/g, (m, k: string) => PLACEHOLDERS[k] ?? m);
}

function strings(node: unknown, key = ""): string[] {
  if (typeof node === "string") {
    // Skip SEO duplicates and short UI labels ("Apply to sell", "Learn more").
    if (/^(meta|og)/i.test(key) || node.trim().length < 25) return [];
    return [fill(node.trim())];
  }
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([k, v]) => strings(v, k));
  }
  return [];
}

function pageCopy(): string {
  return SECTIONS.map(({ key, title }) => {
    const lines = [...new Set(strings(en[key]))];
    return lines.length ? `### ${title}\n${lines.map((l) => `- ${l}`).join("\n")}` : "";
  })
    .filter(Boolean)
    .join("\n\n");
}

function categoryCopy(): string {
  return Object.entries(CATEGORY_COPY)
    .map(([slug, entry]) => {
      const c = entry.en;
      const faqs = (c.faqs ?? []).map((f) => `  Q: ${f.q}\n  A: ${f.a}`).join("\n");
      return [
        `### Category: ${slug} (fomaprint.com/category/${slug})`,
        ...(c.intro ?? []).map((p) => `- ${p}`),
        ...(c.highlights?.length ? [`- Popular uses: ${c.highlights.join("; ")}`] : []),
        faqs,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

export const SITE_COPY = `${pageCopy()}\n\n${categoryCopy()}`;
