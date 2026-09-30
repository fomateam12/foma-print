import { describe, expect, it } from "vitest";
import { chatReducer, initialChatState } from "./client-state";

describe("chatReducer", () => {
  it("appends the user message and enters sending", () => {
    const s = chatReducer(initialChatState, { type: "send", content: "hi" });
    expect(s.messages).toEqual([{ role: "user", content: "hi" }]);
    expect(s.status).toBe("sending");
  });

  it("appends the reply, keeps the first session token", () => {
    let s = chatReducer(initialChatState, { type: "send", content: "hi" });
    s = chatReducer(s, { type: "reply", reply: "hello", action: "quote", sessionToken: "tok" });
    expect(s.messages.at(-1)).toEqual({ role: "assistant", content: "hello", action: "quote" });
    expect(s.status).toBe("idle");
    expect(s.sessionToken).toBe("tok");
    s = chatReducer(s, { type: "send", content: "more" });
    s = chatReducer(s, { type: "reply", reply: "ok", action: null });
    expect(s.sessionToken).toBe("tok");
  });

  it("on error drops the unanswered user message so it can be resent", () => {
    let s = chatReducer(initialChatState, { type: "send", content: "hi" });
    s = chatReducer(s, { type: "error", error: "rate_limited" });
    expect(s.status).toBe("error");
    expect(s.error).toBe("rate_limited");
    expect(s.messages).toEqual([]);
  });

  it("verification_failed resets the conversation", () => {
    let s = chatReducer(initialChatState, { type: "send", content: "hi" });
    s = chatReducer(s, { type: "reply", reply: "hello", action: null, sessionToken: "tok" });
    s = chatReducer(s, { type: "send", content: "again" });
    s = chatReducer(s, { type: "error", error: "verification_failed" });
    expect(s.messages).toEqual([]);
    expect(s.sessionToken).toBeUndefined();
  });

  it("stops accepting messages at 30", () => {
    let s = initialChatState;
    for (let i = 0; i < 15; i++) {
      s = chatReducer(s, { type: "send", content: `q${i}` });
      s = chatReducer(s, { type: "reply", reply: `a${i}`, action: null });
    }
    expect(chatReducer(s, { type: "send", content: "one more" })).toBe(s);
  });
});
