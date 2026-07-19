import { NextRequest, NextResponse } from "next/server";
import {
  CATALOG_COOKIE,
  CATALOG_UNLOCK_PATH,
  expectedCatalogToken,
  passwordMatches,
} from "@/lib/catalog-gate";

/**
 * POST /api/catalog-unlock — shared-password gate for /catalog.
 * Rate-limited in middleware (10 attempts / 15 min / IP).
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const nextRaw = String(form.get("next") ?? "/catalog");
  // Only allow same-site catalog paths as the redirect target.
  const next = nextRaw.startsWith("/catalog") ? nextRaw : "/catalog";

  if (!passwordMatches(password)) {
    const back = new URL(CATALOG_UNLOCK_PATH, request.url);
    back.searchParams.set("next", next);
    back.searchParams.set("err", "1");
    return NextResponse.redirect(back, { status: 303 });
  }

  const response = NextResponse.redirect(new URL(next, request.url), { status: 303 });
  response.cookies.set(CATALOG_COOKIE, await expectedCatalogToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}
