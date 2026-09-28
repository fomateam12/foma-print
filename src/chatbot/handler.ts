import "server-only";
import { createHash } from "node:crypto";
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
import { chatRequestSchema, toModelMessages } from "./request";
import { issueSessionToken, verifySessionToken } from "./session-token";
import { buildSystemPrompt } from "./system-prompt";

export interface ChatDeps {
  config: ChatConfig;
  model: ChatModel;
  budget: DailyBudget;
  now: () => number;
  verifyTurnstile: (token: string | undefined, o: { ip?: string; traceId?: string }) => Promise<{ ok: boolean }>;
  fallbackReply: (lang: Locale) => Promise<string>;
}

type ErrorCode = "forbidden" | "invalid" | "rate_limited" | "verification_failed" | "unavailable";

const hashIp = (ip: string) => createHash("sha256").update(`fomabot:${ip}`).digest("hex").slice(0, 12);

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
  const ipHash = hashIp(ip);
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

  let completion;
  try {
    completion = await deps.model.complete(buildSystemPrompt(lang), toModelMessages(messages));
  } catch (err) {
    log.error({ traceId, event: "chat.model_error", message: err instanceof Error ? err.message : String(err) });
    return fallback();
  }
  deps.budget.record(completion.usage.input + completion.usage.output, now);

  const reply = parseModelReply(completion.text);
  log.info({
    traceId,
    event: "chat.request",
    ipHash,
    lang,
    turns: messages.length,
    inputTokens: completion.usage.input,
    outputTokens: completion.usage.output,
  });
  if (!reply) {
    log.warn({ traceId, event: "chat.empty_reply" });
    return fallback();
  }

  const verdict = checkReply(reply.reply, deps.config.denylist);
  if (!verdict.ok) {
    log.warn({ traceId, event: "chat.filter_hit", rule: verdict.rule });
    return fallback();
  }
  return respond(reply.reply, reply.action);
}
