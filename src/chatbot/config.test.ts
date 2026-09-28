import { describe, expect, it } from "vitest";
import { readChatConfig } from "./config";

const base = {
  CHAT_DEEPSEEK_API_KEY: "k",
  CHAT_SESSION_SECRET: "s".repeat(32),
  CHAT_DENYLIST: "Yemliha,Montelle",
};

describe("readChatConfig", () => {
  it("is null without an API key or session secret", () => {
    expect(readChatConfig({ ...base, CHAT_DEEPSEEK_API_KEY: undefined })).toBeNull();
    expect(readChatConfig({ ...base, CHAT_SESSION_SECRET: "short" })).toBeNull();
  });

  it("applies defaults", () => {
    expect(readChatConfig(base)).toMatchObject({
      model: "deepseek-v4-pro",
      baseUrl: "https://api.deepseek.com",
      dailyBudget: 2_000_000,
      denylist: ["yemliha", "montelle"],
    });
  });

  it("fails closed when the knowledge pack contains a denylist term", () => {
    expect(readChatConfig({ ...base, CHAT_DENYLIST: "Yemliha,blind" })).toBeNull();
  });

  it("is null when the denylist is empty", () => {
    expect(readChatConfig({ ...base, CHAT_DENYLIST: undefined })).toBeNull();
  });

  it("is null in production without a Turnstile secret", () => {
    expect(readChatConfig({ ...base, NODE_ENV: "production", TURNSTILE_SECRET_KEY: undefined })).toBeNull();
  });

  it("applies in production with a Turnstile secret", () => {
    expect(readChatConfig({ ...base, NODE_ENV: "production", TURNSTILE_SECRET_KEY: "ts-secret" })).not.toBeNull();
  });

  it("applies outside production without a Turnstile secret", () => {
    expect(readChatConfig({ ...base, NODE_ENV: "test", TURNSTILE_SECRET_KEY: undefined })).not.toBeNull();
    expect(readChatConfig({ ...base, NODE_ENV: undefined, TURNSTILE_SECRET_KEY: undefined })).not.toBeNull();
  });
});
