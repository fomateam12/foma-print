import "server-only";
import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import type { Locale } from "@/lib/i18n";
import { isSameOrigin } from "@/lib/security";
import { consume, ipFromRequest } from "@/lib/rate-limit";
import { log } from "@/lib/log";
import { getTraceId, TRACE_HEADER } from "@/lib/trace";
import type { ChatConfig } from "./config";
import type { DailyBudget } from "./budget";
import { type ChatAction, type ChatModel, parseModelReply } from "./model";
import { checkReply } from "./output-filter";
import { chatRequestSchema, toModelMessages, MAX_MESSAGE_CHARS } from "./request";
import { issueSessionToken, verifySessionToken } from "./session-token";
import { buildSystemPrompt } from "./system-prompt";

export interface ChatDeps {
  config: ChatConfig;
  model: ChatModel;
  budget: DailyBudget;
  now: () => number;
  verifyTurnstile: (token: string | undefined, o: { ip?: string; traceId?: string }) => Promise<{ ok: boolean }>;
  fallbackReply: (lang: Locale) => Promise<string>;
  /** Public catalog matches for the visitor's last message, or null. */
  catalogContext: (question: string) => string | null;
}

type ErrorCode = "forbidden" | "invalid" | "rate_limited" | "verification_failed" | "unavailable";

// Keyed with the session secret so the hash cannot be reversed by brute-forcing
// the IPv4 space (an unkeyed sha256 over ~4 billion addresses is a lookup table).
const hashIp = (secret: string, ip: string) =>
  createHmac("sha256", secret).update(`fomabot:${ip}`).digest("hex").slice(0, 12);

export async function handleChat(request: Request, deps: ChatDeps): Promise<Response> {
  const traceId = getTraceId(request);
  const headers = { [TRACE_HEADER]: traceId };
  const fail = (error: ErrorCode, status: number, extra: Record<string, string> = {}) =>
    NextResponse.json({ error }, { status, headers: { ...headers, ...extra } });

  if (!isSameOrigin(request)) {
    log.warn({ traceId, event: "chat.csrf_rejected" });
    return fail("forbidden", 403);
  }

  const ip = ipFromRequest(request);
  const ipHash = hashIp(deps.config.sessionSecret, ip);
  const now = deps.now();
  for (const [key, limit, windowMs] of [
    [`chat:min:${ip}`, 10, 60_000],
    [`chat:hour:${ip}`, 60, 3_600_000],
  ] as const) {
    const rl = consume(key, { limit, windowMs }, now);
    if (!rl.ok) {
      log.info({ traceId, event: "chat.rate_limited", ipHash });
      return fail("rate_limited", 429, { "retry-after": String(Math.ceil((rl.resetAt - now) / 1000)) });
    }
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return fail("invalid", 422);
  }
  const parsed = chatRequestSchema.safeParse(raw);
  if (!parsed.success) return fail("invalid", 422);
  const { lang, messages, cfTurnstileToken, sessionToken } = parsed.data;

  // First message: Turnstile. Later messages: the token we issued after it.
  let issued: string | undefined;
  if (messages.length === 1) {
    const turnstile = await deps.verifyTurnstile(cfTurnstileToken, { ip, traceId });
    if (!turnstile.ok) return fail("verification_failed", 403);
    issued = issueSessionToken(deps.config.sessionSecret, now);
  } else if (!verifySessionToken(sessionToken, deps.config.sessionSecret, now)) {
    log.info({ traceId, event: "chat.session_invalid", ipHash });
    return fail("verification_failed", 403);
  }

  if (!deps.budget.canSpend(now)) {
    log.warn({ traceId, event: "chat.budget_exceeded" });
    return fail("unavailable", 503);
  }

  const respond = (reply: string, action: ChatAction | null, fallback?: true) =>
    NextResponse.json(
      { reply, action, ...(issued ? { sessionToken: issued } : {}), ...(fallback ? { fallback } : {}) },
      { headers },
    );
  const fallback = async () => respond(await deps.fallbackReply(lang), "contact", true);

  const system = buildSystemPrompt(lang);
  const history = toModelMessages(messages);
  const context = deps.catalogContext(messages[messages.length - 1].content) ?? undefined;

  // DeepSeek's JSON mode occasionally returns whitespace-only content (its
  // docs say so). One quiet retry before the visitor sees the fallback.
  let reply: ReturnType<typeof parseModelReply> = null;
  for (let attempt = 1; attempt <= 2 && !reply; attempt++) {
    let completion;
    try {
      completion = await deps.model.complete(system, history, context);
    } catch (err) {
      log.error({ traceId, event: "chat.model_error", message: err instanceof Error ? err.message : String(err) });
      return fallback();
    }
    deps.budget.record(completion.usage.input + completion.usage.output, now);
    reply = parseModelReply(completion.text);
    log.info({
      traceId,
      event: "chat.request",
      ipHash,
      lang,
      turns: messages.length,
      attempt,
      catalogMatches: context ? context.split("\n").length - 1 : 0,
      inputTokens: completion.usage.input,
      outputTokens: completion.usage.output,
    });
    if (!reply) log.warn({ traceId, event: "chat.empty_reply", attempt });
  }
  if (!reply) return fallback();

  // The client re-sends the full history on every turn and request.ts caps
  // every message at MAX_MESSAGE_CHARS, so an over-length reply would be
  // accepted here but rejected as a "message" on the next turn — a 422 the
  // visitor can never recover from. Cap before the filter runs.
  const cappedReply = reply.reply.slice(0, MAX_MESSAGE_CHARS);

  const verdict = checkReply(cappedReply, deps.config.denylist);
  if (!verdict.ok) {
    log.warn({ traceId, event: "chat.filter_hit", rule: verdict.rule });
    return fallback();
  }
  return respond(cappedReply, reply.action);
}
