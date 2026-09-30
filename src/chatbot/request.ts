import { z } from "zod";
import { LOCALES } from "@/lib/i18n";

export const MAX_MESSAGE_CHARS = 1000;
export const MAX_CONVERSATION = 30;
export const MODEL_WINDOW = 10;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
});

export type ChatMessage = z.infer<typeof messageSchema>;

export const chatRequestSchema = z
  .object({
    lang: z.enum(LOCALES),
    messages: z.array(messageSchema).min(1).max(MAX_CONVERSATION),
    cfTurnstileToken: z.string().max(4096).optional(),
    sessionToken: z.string().max(512).optional(),
  })
  .refine((r) => r.messages.at(-1)?.role === "user", {
    message: "The last message must be from the user.",
    path: ["messages"],
  });

export type ChatRequest = z.infer<typeof chatRequestSchema>;

/**
 * The model sees only the tail of the conversation. Client-sent history is
 * untrusted (a forged assistant turn can steer the model); that is
 * acceptable only because the model holds nothing worth stealing.
 */
export function toModelMessages(messages: ChatMessage[]): ChatMessage[] {
  const tail = messages.slice(-MODEL_WINDOW);
  const firstUser = tail.findIndex((m) => m.role === "user");
  return firstUser <= 0 ? tail : tail.slice(firstUser);
}
