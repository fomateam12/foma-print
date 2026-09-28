/**
 * Server-side output filter for FomaBot. It runs on every model reply before
 * the visitor sees it, and on the knowledge pack at startup. It is the layer
 * that does not depend on the model behaving: whatever the prompt said, a
 * reply naming a store, an internal address or a credential never leaves.
 */

export type FilterRule = "denylist" | "foreign_email" | "foreign_url" | "credential";
export type FilterResult = { ok: true } | { ok: false; rule: FilterRule };

/**
 * Words that appear in shop names but also in every honest answer
 * ("resellers sell on Amazon and Etsy"). Blocking them would silence the
 * bot, so they never enter the denylist even if an operator pastes them.
 */
const GENERIC_TERMS = new Set([
  "amazon", "etsy", "walmart", "ebay", "shopify", "tiktok",
  "foma", "fomaprint", "print", "gift", "gifts", "store", "shop",
]);

const ALLOWED_EMAIL = "info@fomaprint.com";
const ALLOWED_DOMAIN = /^(www\.)?fomaprint\.com$/;

/** Lowercase, fold Turkish ı/İ and strip diacritics, collapse whitespace. */
export function normalizeText(s: string): string {
  return s
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .replace(/ı/g, "i")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function parseDenylist(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,\n]/)
    .map((entry) => normalizeText(entry).trim())
    .filter((entry) => entry.length >= 3 && !GENERIC_TERMS.has(entry));
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)+/gi;
const URL_RE = /\bhttps?:\/\/([^\s/?#)]+)/gi;
const BARE_DOMAIN_RE = /\b((?:[a-z0-9-]+\.)+(?:com|net|org|io|co|app|dev|ai|us|tr|xyz|info|biz))\b/gi;
const CREDENTIAL_RES = [
  /\bsk-[a-z0-9_-]{16,}/i,
  /\b(password|passwd|pwd|sifre|api[ _-]?key|secret|token)\s*[:=]/i,
  /\b[a-f0-9]{32,}\b/i,
  /\b[a-z0-9+/]{40,}={0,2}(?![a-z0-9+/])/i,
];

export function checkReply(text: string, denylist: readonly string[]): FilterResult {
  const normalized = normalizeText(text);

  for (const term of denylist) {
    const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(term)}($|[^\\p{L}\\p{N}])`, "u");
    if (re.test(normalized)) return { ok: false, rule: "denylist" };
  }

  for (const match of text.matchAll(EMAIL_RE)) {
    if (match[0].toLowerCase() !== ALLOWED_EMAIL) return { ok: false, rule: "foreign_email" };
  }

  // Emails were checked above; strip them so their domains are not re-read as URLs.
  const withoutEmails = text.replace(EMAIL_RE, " ");
  for (const match of withoutEmails.matchAll(URL_RE)) {
    if (!ALLOWED_DOMAIN.test(match[1].toLowerCase())) return { ok: false, rule: "foreign_url" };
  }
  for (const match of withoutEmails.matchAll(BARE_DOMAIN_RE)) {
    if (!ALLOWED_DOMAIN.test(match[1].toLowerCase())) return { ok: false, rule: "foreign_url" };
  }

  for (const re of CREDENTIAL_RES) {
    if (re.test(normalized)) return { ok: false, rule: "credential" };
  }

  return { ok: true };
}
