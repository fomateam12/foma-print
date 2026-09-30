import "server-only";
import { log } from "@/lib/log";
import { checkReply, parseDenylist } from "./output-filter";
import { buildSystemPrompt } from "./system-prompt";

export interface ChatConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
  denylist: string[];
  dailyBudget: number;
  sessionSecret: string;
}

/**
 * Null disables FomaBot. That covers a missing key, a missing session
 * secret, an empty denylist (the filter layer would otherwise be silently
 * off), Turnstile unconfigured in production (verifyTurnstile fails open
 * without a secret, which would hand session tokens to scripts), and a
 * knowledge pack that fails the output filter against the live denylist.
 * The last one is the runtime guard: a secret added to the pack by mistake
 * turns the bot off instead of being served.
 */
export function readChatConfig(env: Record<string, string | undefined>): ChatConfig | null {
  const apiKey = env.CHAT_DEEPSEEK_API_KEY?.trim();
  const sessionSecret = env.CHAT_SESSION_SECRET?.trim() ?? "";
  if (!apiKey || sessionSecret.length < 32) return null;

  const denylist = parseDenylist(env.CHAT_DENYLIST);
  if (denylist.length === 0) {
    log.error({ event: "chat.denylist_missing" });
    return null;
  }

  if (env.NODE_ENV === "production" && !env.TURNSTILE_SECRET_KEY?.trim()) {
    log.error({ event: "chat.turnstile_missing" });
    return null;
  }

  for (const lang of ["en", "tr"] as const) {
    const pack = buildSystemPrompt(lang);
    const result = checkReply(pack, denylist);
    if (!result.ok) {
      log.error({ event: "chat.knowledge_unsafe", lang, rule: result.rule });
      return null;
    }
  }

  const budget = Number(env.CHAT_DAILY_TOKEN_BUDGET);
  return {
    apiKey,
    model: env.CHAT_MODEL?.trim() || "deepseek-v4-pro",
    baseUrl: env.CHAT_DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com",
    denylist,
    dailyBudget: Number.isFinite(budget) && budget > 0 ? budget : 2_000_000,
    sessionSecret,
  };
}

let cached: ChatConfig | null | undefined;
export function getChatConfig(): ChatConfig | null {
  if (cached === undefined) cached = readChatConfig(process.env);
  return cached;
}
