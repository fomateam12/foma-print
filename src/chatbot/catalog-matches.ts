import "server-only";
import { getAllProducts } from "@/data/catalog";
import type { Product } from "@/data/types";
import { normalizeText } from "./output-filter";

/**
 * Finds public catalog products that match a visitor's question, so FomaBot
 * can name real products and link them instead of saying "check the catalog".
 *
 * Only public fields leave this module: name, size, category and the product
 * URL. `basePrice` is the internal wholesale reference and never does, and
 * neither does the SKU.
 */

export interface CatalogMatch {
  name: string;
  size: string | null;
  category: string;
  url: string;
}

// Words that carry no product meaning in a question (EN + TR).
const STOPWORDS = new Set(
  (
    "a an and are as at be but by can could do does for from have how i in is it me my of on or our " +
    "please sell selling show so that the there this to what which with you your yours we any " +
    "engrave engraved engraving laser custom personalized personalised product products item items " +
    "var mi mı mu mü ve ile bir bu su şu icin için ne nasil nasıl hangi satiyor satıyor musunuz " +
    "misiniz urun ürün urunler ürünler kazima kazıma ozel özel"
  ).split(/\s+/),
);

/**
 * The catalog is English; Turkish visitors ask in Turkish. A small, explicit
 * map for the product words people actually use (diacritics already folded).
 */
const TR_TO_EN: Record<string, string> = {
  deri: "leather", cuzdan: "wallet", bardak: "tumbler", termos: "tumbler", sise: "bottle",
  matara: "bottle", kupa: "mug", fincan: "mug", cerceve: "frame", tahta: "board", kesme: "cutting",
  anahtarlik: "keychain", kalem: "pen", defter: "journal", ajanda: "journal", cakmak: "lighter",
  bicak: "knife", saat: "clock", bardakaltı: "coaster", bardakalti: "coaster", kutu: "box",
  canta: "bag", kolye: "necklace", bileklik: "bracelet", sus: "ornament", yilbasi: "ornament",
  mum: "candle", ahsap: "wood", cam: "glass", kadeh: "glass", sarap: "wine", bira: "beer",
  pasaport: "passport", kartlik: "card", tepsi: "tray", kase: "bowl", kulp: "handle", kulplu: "handle",
  pipet: "straw", evcil: "pet", kopek: "dog", kedi: "cat", bebek: "baby", dugun: "wedding",
};

/** Turkish and English plural endings, so "tumblers" and "bardaklar" still match. */
function stem(term: string): string {
  return term.replace(/(ler|lar|es|s)$/u, "");
}

function termsOf(question: string): string[] {
  return normalizeText(question)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => (t.length >= 3 || /^\d{2,}$/.test(t)) && !STOPWORDS.has(t))
    .map((t) => (/^\d+$/.test(t) ? t : stem(t)))
    .map((t) => TR_TO_EN[t] ?? t)
    .filter((t) => t.length >= 3 || /^\d{2,}$/.test(t));
}

function haystackOf(p: Product): string {
  return normalizeText(`${p.name} ${p.size ?? ""} ${p.categoryName} ${p.subcategoryName}`);
}

export function findCatalogMatches(
  question: string,
  limit = 5,
  products: Product[] = getAllProducts(),
): CatalogMatch[] {
  const terms = termsOf(question);
  if (terms.length === 0) return [];

  const scored: { p: Product; score: number }[] = [];
  for (const p of products) {
    const hay = haystackOf(p);
    let score = 0;
    for (const t of terms) if (hay.includes(t)) score++;
    if (score > 0) scored.push({ p, score });
  }

  // Require most of the question's product words when several were given,
  // so "tumbler with handle" does not list every tumbler and every handle.
  const best = Math.max(0, ...scored.map((s) => s.score));
  const floor = best >= 2 ? best : 1;

  // Colour variants are separate products whose names differ only after a
  // dash ("40 oz. Tumbler with Handle & Straw – Rose"); list the model once.
  const baseName = (p: Product) => p.name.split(/\s[–-]\s/)[0].trim();
  const variantCount = new Map<string, number>();
  for (const { p } of scored) {
    const k = normalizeText(`${baseName(p)}|${p.subcategoryName}`);
    variantCount.set(k, (variantCount.get(k) ?? 0) + 1);
  }

  const seen = new Set<string>();
  const matches: CatalogMatch[] = [];
  for (const { p } of scored
    .filter((s) => s.score >= floor)
    .sort((a, b) => b.score - a.score || a.p.name.length - b.p.name.length)) {
    const k = normalizeText(`${baseName(p)}|${p.subcategoryName}`);
    if (seen.has(k)) continue;
    seen.add(k);
    const variants = variantCount.get(k) ?? 1;
    matches.push({
      name: variants > 1 ? `${baseName(p)} (${variants} colour/size options)` : p.name,
      size: variants > 1 ? null : p.size,
      category: `${p.categoryName} › ${p.subcategoryName}`,
      url: `fomaprint.com/product/${p.id}`,
    });
    if (matches.length >= limit) break;
  }
  return matches;
}

/** The context block handed to the model; null when nothing matched. */
export function catalogContext(question: string): string | null {
  const matches = findCatalogMatches(question);
  if (matches.length === 0) return null;
  const lines = matches.map(
    (m) => `- ${m.name}${m.size ? ` (${m.size})` : ""} | ${m.category} | ${m.url}`,
  );
  return (
    "CATALOG MATCHES (added by the website from the public catalog for the visitor's last message; " +
    "mention the relevant ones by name and link, never invent others, never state prices):\n" +
    lines.join("\n")
  );
}
