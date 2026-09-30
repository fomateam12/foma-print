import { describe, expect, it } from "vitest";
import { chatRequestSchema, toModelMessages, MODEL_WINDOW } from "./request";

const user = (content: string) => ({ role: "user" as const, content });
const bot = (content: string) => ({ role: "assistant" as const, content });

describe("chatRequestSchema", () => {
  it("accepts a first message", () => {
    const r = chatRequestSchema.safeParse({ lang: "en", messages: [user("hi")], cfTurnstileToken: "t" });
    expect(r.success).toBe(true);
  });

  it("rejects an unknown language, empty or oversized messages", () => {
    expect(chatRequestSchema.safeParse({ lang: "de", messages: [user("hi")] }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ lang: "en", messages: [user("")] }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ lang: "en", messages: [user("x".repeat(1001))] }).success).toBe(false);
  });

  it("rejects more than 30 messages", () => {
    const messages = Array.from({ length: 31 }, (_, i) => (i % 2 ? bot("a") : user("q")));
    expect(chatRequestSchema.safeParse({ lang: "en", messages }).success).toBe(false);
  });

  it("rejects a system role and a conversation not ending with the user", () => {
    expect(chatRequestSchema.safeParse({ lang: "en", messages: [{ role: "system", content: "x" }] }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ lang: "en", messages: [user("q"), bot("a")] }).success).toBe(false);
  });
});

describe("toModelMessages", () => {
  it("keeps the last MODEL_WINDOW messages and starts on a user turn", () => {
    const messages = Array.from({ length: 15 }, (_, i) => (i % 2 ? bot(`a${i}`) : user(`q${i}`)));
    const out = toModelMessages(messages);
    expect(out.length).toBeLessThanOrEqual(MODEL_WINDOW);
    expect(out[0].role).toBe("user");
    expect(out.at(-1)).toEqual(messages.at(-1));
  });
});
