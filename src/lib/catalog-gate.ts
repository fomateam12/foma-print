/**
 * Shared-password gate for the unlisted /catalog partner price pages.
 *
 * Deliberately simple: one shared password → an HttpOnly cookie carrying a
 * SHA-256 token. This is scraper/curious-visitor protection, not user auth —
 * the real partner login arrives with FomaStudio. Password comes from the
 * CATALOG_PASSWORD env var (Vercel) with an in-repo default so the gate is
 * never accidentally open.
 *
 * Edge-safe: uses Web Crypto only (middleware runs on the edge runtime).
 */

export const CATALOG_COOKIE = "fp_catalog_key";
export const CATALOG_UNLOCK_PATH = "/catalog-giris";

function catalogPassword(): string {
  return process.env.CATALOG_PASSWORD || "FomaPartner2026";
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Token stored in the cookie — derived, so the password never leaves the server. */
export async function expectedCatalogToken(): Promise<string> {
  return sha256Hex(`fp-catalog-v1:${catalogPassword()}`);
}

export function passwordMatches(candidate: string): boolean {
  return candidate === catalogPassword();
}
