import { NextResponse } from "next/server";
import { getChatConfig } from "@/chatbot/config";
import { handleChat } from "@/chatbot/handler";
import { createDeepSeekModel, type ChatModel } from "@/chatbot/model";
import { createDailyBudget, type DailyBudget } from "@/chatbot/budget";
import { verifyTurnstile } from "@/lib/turnstile";
import { getDictionary } from "@/lib/dictionaries";
import { catalogContext } from "@/chatbot/catalog-matches";

export const runtime = "nodejs";

// Module-level so the budget and model persist across requests in the one
// long-lived container.
let model: ChatModel | undefined;
let budget: DailyBudget | undefined;

export async function POST(request: Request) {
  const config = getChatConfig();
  if (!config) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  model ??= createDeepSeekModel({ apiKey: config.apiKey, model: config.model, baseUrl: config.baseUrl });
  budget ??= createDailyBudget(config.dailyBudget);

  return handleChat(request, {
    config,
    model,
    budget,
    now: Date.now,
    verifyTurnstile,
    fallbackReply: async (lang) => (await getDictionary(lang)).fomabot.fallback,
    catalogContext,
  });
}
