import { getCategories, getProductCount } from "@/data/catalog";
import { GUIDES } from "@/data/guides";
import { site } from "@/lib/site";
import { ORDER_CUTOFF } from "@/lib/site-copy";

/**
 * `/llms.txt` — a plain-Markdown map of the site for AI assistants
 * (https://llmstxt.org). ChatGPT search, Copilot and Perplexity already send
 * resellers here; this file gives them the facts and the canonical pages in
 * one fetch instead of making them infer the business from product pages.
 *
 * Generated from the same data as the sitemap, so new guides and categories
 * appear automatically. Every statement mirrors copy already on the site —
 * nothing here may promise what the site does not.
 *
 * It lives outside `app/[lang]` on purpose: the proxy matcher skips paths
 * with a file extension, so without this static route `/llms.txt` would be
 * read as a locale segment and 404.
 */
export const revalidate = 86400;

export function GET() {
  const base = site.url.replace(/\/$/, "");
  const a = site.address;

  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "Key facts:",
    "",
    `- Business: ${site.name} is operated by ${site.legalName}, ${a.street}, ${a.city}, ${a.state} ${a.zip}, USA (founded ${site.foundedYear}).`,
    "- Model: white-label print-on-demand and laser engraving for online resellers (Etsy, Amazon, Shopify and corporate-gift sellers). The reseller owns the listing and the customer; FomaPrint personalizes, produces and ships each order.",
    "- Blind shipping: parcels ship under the reseller's brand and return address, with no FomaPrint branding or pricing in the box.",
    "- No minimums: a single engraved unit is a normal order; the whole catalogue is made to order from blanks stocked in Alpharetta, Georgia.",
    `- Turnaround: same-day dispatch on orders received before ${ORDER_CUTOFF}; transit time is additional.`,
    "- Payment: a prepaid wallet balance; no subscription or monthly fee. Per-unit wholesale pricing is quote-based and sent after a reseller applies.",
    "- Artwork: high-contrast black vector artwork (SVG or DXF), sized to each product's engraving area. Laser engraving is single-tone; full-colour designs need UV printing.",
    `- Catalogue: ${getProductCount()} products across ${getCategories().length} categories — drinkware, cutting boards, leather and leatherette goods, patches, home décor and more.`,
    `- Contact: ${site.email}, ${site.phoneDisplay} (phone and WhatsApp).`,
    "",
    "## Start here",
    "",
    `- [How it works](${base}/how-it-works): the order flow from listing to blind-shipped parcel.`,
    `- [Become a reseller](${base}/sell): apply for a reseller account and wholesale pricing.`,
    `- [Request a quote](${base}/quote): bulk and corporate orders.`,
    `- [Shipping](${base}/shipping): dispatch cutoff, carriers and transit times.`,
    `- [FAQ](${base}/faq): branding, file requirements, payment and marketplace integrations.`,
    `- [About](${base}/about): who runs FomaPrint and where products are made.`,
    `- [Contact](${base}/contact)`,
    "",
    "## Guides",
    "",
    ...GUIDES.map(
      (g) =>
        `- [${g.copy.en.title}](${base}/guides/${g.slug}): ${g.copy.en.description}`,
    ),
    "",
    "## Product categories",
    "",
  ];

  for (const c of getCategories()) {
    lines.push(`- [${c.name}](${base}/category/${c.slug}): ${c.blurb}`);
    for (const sc of c.subcategories) {
      lines.push(`  - [${sc.name}](${base}/category/${c.slug}/${sc.slug})`);
    }
  }

  lines.push(
    "",
    "## Optional",
    "",
    `- [Turkish version](${base}/tr): the same site in Turkish.`,
    `- [Sitemap](${base}/sitemap.xml): every product page.`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
