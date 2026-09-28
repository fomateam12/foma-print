import { NextResponse } from "next/server";
import { getChatConfig } from "@/chatbot/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The layout is statically generated at build time, but the server's .env
 * is only read at runtime, so the widget asks here whether it should show.
 */
export function GET() {
  return NextResponse.json(
    { enabled: getChatConfig() !== null },
    { headers: { "cache-control": "no-store" } },
  );
}
