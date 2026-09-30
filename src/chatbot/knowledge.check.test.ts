import { describe, expect, it } from "vitest";
import { checkReply, parseDenylist } from "./output-filter";
import { KNOWLEDGE_EN } from "./knowledge/en";
import { KNOWLEDGE_TR } from "./knowledge/tr";

/**
 * `npm run chat:check`: run before committing a knowledge edit, with
 * CHAT_DENYLIST exported (see docs/fomabot-operations.md). Without it only
 * the email/URL/credential rules run, and the test says so.
 */
const denylist = parseDenylist(process.env.CHAT_DENYLIST);

describe("knowledge pack", () => {
  it("has a denylist to check against", () => {
    expect(
      denylist.length > 0,
      "CHAT_DENYLIST is empty. Export CHAT_DENYLIST before running chat:check (see docs/fomabot-operations.md)."
    ).toBe(true);
  });

  it.each([
    ["en", KNOWLEDGE_EN],
    ["tr", KNOWLEDGE_TR],
  ])("%s pack passes the output filter", (_lang, pack) => {
    expect(checkReply(pack, denylist)).toEqual({ ok: true });
  });
});
