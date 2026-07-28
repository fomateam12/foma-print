import { NextRequest, NextResponse } from "next/server";
import { consume, ipFromRequest, type RateLimitOptions } from "@/lib/rate-limit";
import { CATALOG_COOKIE, CATALOG_UNLOCK_PATH, expectedCatalogToken } from "@/lib/catalog-gate";
import { DEFAULT_LOCALE, isLocale, stripLocale } from "@/lib/i18n";

/**
 * Edge / Node proxy (Next 16's rename of `middleware`). Three jobs:
 *
 *   0. Locale routing. The app tree lives under `app/[lang]`, but English —
 *      the default locale — keeps the bare URLs the site has always had, so
 *      no indexed link breaks. A bare path is *rewritten* (not redirected)
 *      to `/en/...`; an explicit `/en/...` request is redirected back to the
 *      bare form so the two never compete as duplicate content. `/tr/...`
 *      passes straight through.
 *   1. Per-route, per-IP rate limiting for the public API surface. The caps
 *      are loose enough not to bother real users (a few quote requests an
 *      hour is fine) but tight enough to kill volumetric abuse.
 *   2. Surface the trace ID — either Vercel's `x-vercel-id` or one we mint —
 *      back to the client as `x-trace-id` so support tickets can quote it.
 *
 * The rate-limit storage is in-memory (see src/lib/rate-limit.ts for the
 * tradeoff vs Upstash Redis). When traffic justifies it, swap in
 * `@upstash/ratelimit` without changing this file's structure.
 */

const ROUTE_LIMITS: Record<string, RateLimitOptions> = {
  // Quote + reseller application: low cap, long window — these endpoints
  // trigger emails, so abuse is expensive. 5 per hour per IP keeps a busy
  // operator inside the cap and stops a bot dead.
  "POST /api/quote": { limit: 5, windowMs: 60 * 60 * 1000 },
  "POST /api/reseller-application": { limit: 5, windowMs: 60 * 60 * 1000 },
  // Search: read-only, but a scraper can enumerate the catalog. 60/minute
  // per IP is generous for humans and unfriendly to scrapers.
  "GET /api/search": { limit: 60, windowMs: 60 * 1000 },
  // Catalog unlock: brute-force cap on the shared partner password.
  "POST /api/catalog-unlock": { limit: 10, windowMs: 15 * 60 * 1000 },
};

function pickLimit(req: NextRequest): RateLimitOptions | null {
  const key = `${req.method} ${req.nextUrl.pathname}`;
  return ROUTE_LIMITS[key] ?? null;
}

/** Vercel's request ID when present, otherwise one we mint for this request. */
function traceIdFor(req: NextRequest): string {
  return (
    req.headers.get("x-vercel-id") ??
    req.headers.get("x-trace-id") ??
    crypto.randomUUID()
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");
  const firstSegment = pathname.split("/")[1] ?? "";
  const hasLocalePrefix = isLocale(firstSegment);
  // App path with any locale prefix removed — what the gate and the rewrite
  // both reason about, so `/catalog` and `/tr/catalog` behave identically.
  const appPath = hasLocalePrefix ? stripLocale(pathname) : pathname;

  // 3. Shared-password gate for the unlisted /catalog partner price pages
  //    (wholesale prices — see src/lib/catalog-gate.ts).
  if (!isApi && (appPath === "/catalog" || appPath.startsWith("/catalog/"))) {
    const token = request.cookies.get(CATALOG_COOKIE)?.value;
    if (token !== (await expectedCatalogToken())) {
      const localePrefix = hasLocalePrefix ? `/${firstSegment}` : "";
      const unlock = new URL(
        `${localePrefix}${CATALOG_UNLOCK_PATH}`,
        request.url,
      );
      unlock.searchParams.set("next", pathname);
      return NextResponse.redirect(unlock);
    }
  }

  // 0. Locale routing (never for /api — those paths are locale-agnostic).
  if (!isApi) {
    if (firstSegment === DEFAULT_LOCALE) {
      // `/en/pricing` → `/pricing`: one canonical URL per page.
      const bare = request.nextUrl.clone();
      bare.pathname = appPath;
      return NextResponse.redirect(bare, 308);
    }
    if (!hasLocalePrefix) {
      const rewritten = request.nextUrl.clone();
      rewritten.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
      const response = NextResponse.rewrite(rewritten);
      response.headers.set("x-trace-id", traceIdFor(request));
      return response;
    }
  }

  const limit = pickLimit(request);
  const traceId = traceIdFor(request);

  if (limit) {
    const ip = ipFromRequest(request);
    const route = `${request.method} ${request.nextUrl.pathname}`;
    const result = consume(`${route}:${ip}`, limit);
    if (!result.ok) {
      const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
      return new NextResponse(
        JSON.stringify({
          ok: false,
          error: "Too many requests. Please slow down and try again shortly.",
        }),
        {
          status: 429,
          headers: {
            "content-type": "application/json",
            "retry-after": String(retryAfter),
            "x-ratelimit-limit": String(limit.limit),
            "x-ratelimit-remaining": "0",
            "x-ratelimit-reset": String(Math.floor(result.resetAt / 1000)),
            "x-trace-id": traceId,
          },
        },
      );
    }
    // Pass the trace ID + remaining budget downstream via request headers
    // so route handlers can include them on the response without re-deriving.
    const headers = new Headers(request.headers);
    headers.set("x-trace-id", traceId);
    headers.set("x-ratelimit-limit", String(limit.limit));
    headers.set("x-ratelimit-remaining", String(result.remaining));
    headers.set("x-ratelimit-reset", String(Math.floor(result.resetAt / 1000)));

    const response = NextResponse.next({ request: { headers } });
    response.headers.set("x-trace-id", traceId);
    response.headers.set("x-ratelimit-limit", String(limit.limit));
    response.headers.set("x-ratelimit-remaining", String(result.remaining));
    response.headers.set("x-ratelimit-reset", String(Math.floor(result.resetAt / 1000)));
    return response;
  }

  // No rate limit on this path — still propagate the trace ID.
  const headers = new Headers(request.headers);
  headers.set("x-trace-id", traceId);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("x-trace-id", traceId);
  return response;
}

export const config = {
  // Everything the visitor can navigate to, because locale rewriting has to
  // see every page request — plus /api for throttling. Excluded: Next's own
  // assets, and any path with a file extension (robots.txt, sitemap.xml,
  // /banners/*.jpg, icons), which are served as-is and have no locale.
  matcher: ["/((?!_next/|.*\\.[a-zA-Z0-9]+$).*)"],
};
