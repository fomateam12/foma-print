/**
 * Server-side Cloudflare Turnstile verification.
 *
 * Pre-flight check in front of every form-touching POST handler. The
 * client-side widget returns a single-use token; we POST it to
 * Cloudflare's `siteverify` endpoint along with our secret and the
 * client's IP. If verification succeeds, the request proceeds; if it
 * fails (token reused, expired, forged, IP mismatch, hostname mismatch),
 * the handler returns 403 and never reaches dispatch.
 *
 * Behaviour without `TURNSTILE_SECRET_KEY`:
 *
 *   - `verifyTurnstile` returns `{ ok: true, skipped: true }`. Local dev
 *     and CI keep working without an extra config step; the production
 *     env vars are the security boundary. Verify is fail-open by design
 *     only when the secret is missing; any other failure path is closed.
 */

import { log } from "@/lib/log";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileVerifyResult {
  ok: boolean;
  /** True when the secret isn't configured, so verification was a no-op. */
  skipped?: boolean;
  /** Cloudflare's error codes for the failure (audit / log only). */
  errorCodes?: string[];
  /** The hostname the token was issued for, when Cloudflare returns it. */
  hostname?: string;
}

interface CloudflareSiteverifyResponse {
  success: boolean;
  hostname?: string;
  challenge_ts?: string;
  action?: string;
  cdata?: string;
  "error-codes"?: string[];
}

export async function verifyTurnstile(
  token: string | undefined | null,
  options: { ip?: string; traceId?: string },
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const traceId = options.traceId;

  if (!secret) {
    log.warn({
      traceId,
      event: "turnstile.secret_missing",
      note: "verifyTurnstile fail-open — set TURNSTILE_SECRET_KEY in production.",
    });
    return { ok: true, skipped: true };
  }
  if (!token) {
    log.info({ traceId, event: "turnstile.no_token" });
    return { ok: false, errorCodes: ["missing-input-response"] };
  }

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (options.ip) form.set("remoteip", options.ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      log.error({
        traceId,
        event: "turnstile.siteverify_http_error",
        status: res.status,
      });
      return { ok: false, errorCodes: [`http-${res.status}`] };
    }
    const data = (await res.json()) as CloudflareSiteverifyResponse;
    if (!data.success) {
      log.warn({
        traceId,
        event: "turnstile.verification_failed",
        errorCodes: data["error-codes"] ?? [],
      });
      return {
        ok: false,
        errorCodes: data["error-codes"] ?? [],
        hostname: data.hostname,
      };
    }
    return { ok: true, hostname: data.hostname };
  } catch (err) {
    log.error({
      traceId,
      event: "turnstile.siteverify_threw",
      message: err instanceof Error ? err.message : String(err),
    });
    return { ok: false, errorCodes: ["network-error"] };
  }
}
