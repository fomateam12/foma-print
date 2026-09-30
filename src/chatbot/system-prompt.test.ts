import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "./system-prompt";
import { KNOWLEDGE_EN } from "./knowledge/en";
import { KNOWLEDGE_TR } from "./knowledge/tr";

describe("buildSystemPrompt", () => {
  it("is byte-stable across calls (prefix cache)", () => {
    expect(buildSystemPrompt("en")).toBe(buildSystemPrompt("en"));
  });

  it("embeds the right pack and reply language", () => {
    expect(buildSystemPrompt("en")).toContain(KNOWLEDGE_EN);
    expect(buildSystemPrompt("en")).toContain("Reply in English");
    expect(buildSystemPrompt("tr")).toContain(KNOWLEDGE_TR);
    expect(buildSystemPrompt("tr")).toContain("Reply in Turkish");
  });

  it("mentions json and shows the output shape (DeepSeek JSON mode requirement)", () => {
    const p = buildSystemPrompt("en");
    expect(p.toLowerCase()).toContain("json");
    expect(p).toContain('"action"');
  });

  it("contains no date or time (would break the prefix cache)", () => {
    expect(buildSystemPrompt("en")).not.toMatch(/\b20\d\d-\d\d-\d\d\b/);
  });
});
