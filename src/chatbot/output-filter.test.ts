import { describe, expect, it } from "vitest";
import { checkReply, normalizeText, parseDenylist } from "./output-filter";

describe("normalizeText", () => {
  it("folds case, Turkish dotted/dotless i and diacritics", () => {
    expect(normalizeText("YEMLİHA")).toBe("yemliha");
    expect(normalizeText("Yemlíha")).toBe("yemliha");
    expect(normalizeText("ışık")).toBe("isik");
  });
});

describe("parseDenylist", () => {
  it("splits on commas and newlines, trims, normalizes, drops empties", () => {
    expect(parseDenylist(" Yemliha ,Montelle\n\nWoodmark ")).toEqual([
      "yemliha",
      "montelle",
      "woodmark",
    ]);
  });

  it("returns [] for undefined", () => {
    expect(parseDenylist(undefined)).toEqual([]);
  });

  it("drops generic marketplace/brand words and entries under 3 chars", () => {
    expect(parseDenylist("AMAZON,Etsy,walmart,eBay,Shopify,FomaPrint,foma,ab,Velvet Whiskey")).toEqual([
      "velvet whiskey",
    ]);
  });
});

describe("checkReply", () => {
  const deny = parseDenylist("Yemliha,Velvet Whiskey,Montelle");

  it("passes an ordinary answer", () => {
    expect(
      checkReply("We blind-ship from our US print center. Apply at https://www.fomaprint.com/sell or email info@fomaprint.com.", deny),
    ).toEqual({ ok: true });
  });

  it("blocks a denylist term regardless of case and diacritics", () => {
    expect(checkReply("We print for YEMLİHA daily.", deny)).toEqual({ ok: false, rule: "denylist" });
    expect(checkReply("velvet   whiskey is a partner", deny)).toEqual({ ok: false, rule: "denylist" });
  });

  it("does not match a denylist term inside a longer word", () => {
    const d = parseDenylist("Rana");
    expect(checkReply("Our guarantee covers misprints.", d)).toEqual({ ok: true });
    expect(checkReply("Rana is a store.", d)).toEqual({ ok: false, rule: "denylist" });
  });

  it("blocks any email except info@fomaprint.com", () => {
    expect(checkReply("Write to akif@fomaprint.com", deny)).toEqual({ ok: false, rule: "foreign_email" });
    expect(checkReply("Write to ops@gmail.com", deny)).toEqual({ ok: false, rule: "foreign_email" });
    expect(checkReply("Write to INFO@FomaPrint.com", deny)).toEqual({ ok: true });
  });

  it("blocks URLs and bare domains outside fomaprint.com", () => {
    expect(checkReply("Log in at https://app.fomahub.com/login", deny)).toEqual({ ok: false, rule: "foreign_url" });
    expect(checkReply("See fomahub.com for more", deny)).toEqual({ ok: false, rule: "foreign_url" });
    expect(checkReply("See fomaprint.com/guides", deny)).toEqual({ ok: true });
  });

  it("blocks credential-looking content", () => {
    expect(checkReply("key: sk-abcdefghijklmnopqrstuv", deny)).toEqual({ ok: false, rule: "credential" });
    expect(checkReply("password: hunter2", deny)).toEqual({ ok: false, rule: "credential" });
    expect(checkReply("şifre = 1234", deny)).toEqual({ ok: false, rule: "credential" });
    expect(checkReply("a3f9c1d2e4b5a6978877665544332211aabbccdd", deny)).toEqual({ ok: false, rule: "credential" });
  });
});
