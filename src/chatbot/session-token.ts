import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Proof that this conversation passed Turnstile. Issued on the first
 * message, required on every later one. Without it a script could send a
 * fabricated 3-message history on its first call and skip the bot check.
 */
export const SESSION_TTL_MS = 2 * 60 * 60 * 1000;

const sign = (secret: string, issuedAt: string) =>
  createHmac("sha256", secret).update(`fomabot:${issuedAt}`).digest("base64url");

export function issueSessionToken(secret: string, now: number): string {
  const issuedAt = String(now);
  return `${issuedAt}.${sign(secret, issuedAt)}`;
}

export function verifySessionToken(token: string | undefined, secret: string, now: number): boolean {
  if (!token) return false;
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature || !/^\d+$/.test(issuedAt)) return false;
  const age = now - Number(issuedAt);
  if (age < 0 || age > SESSION_TTL_MS) return false;
  const expected = Buffer.from(sign(secret, issuedAt));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
