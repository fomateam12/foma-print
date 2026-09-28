import type { ChatMessage } from "./request";

export type ChatAction = "quote" | "reseller" | "contact";
const ACTIONS: readonly ChatAction[] = ["quote", "reseller", "contact"];

export interface ChatCompletion {
  text: string;
  usage: { input: number; output: number };
}

export interface ChatModel {
  complete(system: string, messages: ChatMessage[]): Promise<ChatCompletion>;
}

export class ModelError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "ModelError";
  }
}

interface DeepSeekResponse {
  choices?: Array<{ message?: { content?: string | null } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

/**
 * DeepSeek's OpenAI-compatible endpoint, called with plain fetch (no SDK).
 * Thinking is disabled: order-press measured V4-Pro at 35 s with it on and
 * 1.8 s off, and a visitor waiting on a chat bubble cannot absorb 35 s.
 */
export function createDeepSeekModel(opts: {
  apiKey: string;
  model: string;
  baseUrl?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}): ChatModel {
  const baseUrl = (opts.baseUrl ?? "https://api.deepseek.com").replace(/\/$/, "");
  const timeoutMs = opts.timeoutMs ?? 15_000;
  const doFetch = opts.fetchImpl ?? fetch;

  async function once(system: string, messages: ChatMessage[]): Promise<ChatCompletion> {
    const res = await doFetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { authorization: `Bearer ${opts.apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: opts.model,
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        messages: [{ role: "system", content: system }, ...messages],
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) throw new ModelError(`DeepSeek HTTP ${res.status}`, res.status);
    const data = (await res.json()) as DeepSeekResponse;
    return {
      text: data.choices?.[0]?.message?.content ?? "",
      usage: {
        input: data.usage?.prompt_tokens ?? 0,
        output: data.usage?.completion_tokens ?? 0,
      },
    };
  }

  const retryable = (err: unknown) =>
    !(err instanceof ModelError) || (err.status !== undefined && err.status >= 500);

  return {
    async complete(system, messages) {
      try {
        return await once(system, messages);
      } catch (err) {
        if (!retryable(err)) throw err;
        try {
          return await once(system, messages);
        } catch (second) {
          if (second instanceof ModelError) throw second;
          throw new ModelError(second instanceof Error ? second.message : String(second));
        }
      }
    },
  };
}

/** Null means "unusable"; the caller shows the fallback reply instead. */
export function parseModelReply(text: string): { reply: string; action: ChatAction | null } | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  try {
    const parsed = JSON.parse(trimmed) as { reply?: unknown; action?: unknown };
    const reply = typeof parsed.reply === "string" ? parsed.reply.trim() : "";
    if (!reply) return null;
    const action = ACTIONS.includes(parsed.action as ChatAction) ? (parsed.action as ChatAction) : null;
    return { reply, action };
  } catch {
    return { reply: trimmed, action: null };
  }
}
