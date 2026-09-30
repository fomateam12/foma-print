import { describe, expect, it } from "vitest";
import { issueSessionToken, SESSION_TTL_MS, verifySessionToken } from "./session-token";

const SECRET = "test-secret-at-least-32-characters-long";

describe("session token", () => {
  it("verifies a fresh token", () => {
    const now = 1_700_000_000_000;
    expect(verifySessionToken(issueSessionToken(SECRET, now), SECRET, now + 1000)).toBe(true);
  });

  it("rejects an expired, tampered, foreign or missing token", () => {
    const now = 1_700_000_000_000;
    const token = issueSessionToken(SECRET, now);
    expect(verifySessionToken(token, SECRET, now + SESSION_TTL_MS + 1)).toBe(false);
    expect(verifySessionToken(token.replace(/.$/, (c) => (c === "A" ? "B" : "A")), SECRET, now)).toBe(false);
    expect(verifySessionToken(issueSessionToken("other-secret-other-secret-other-12", now), SECRET, now)).toBe(false);
    expect(verifySessionToken(undefined, SECRET, now)).toBe(false);
    expect(verifySessionToken("garbage", SECRET, now)).toBe(false);
  });

  it("rejects a token issued in the future", () => {
    const now = 1_700_000_000_000;
    expect(verifySessionToken(issueSessionToken(SECRET, now + 60_000), SECRET, now)).toBe(false);
  });
});
