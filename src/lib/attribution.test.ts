import { describe, expect, it } from "vitest";
import { describeAttribution } from "./attribution";
import { attributionSchema, resellerApplicationSchema } from "./validation";

describe("describeAttribution", () => {
  it("prefers utm parameters, then referrer, then direct", () => {
    expect(
      describeAttribution({
        utmSource: "chatgpt.com",
        referrer: "chatgpt.com/",
        landing: "/guides/x?utm_source=chatgpt.com",
      }),
    ).toBe("chatgpt.com · /guides/x?utm_source=chatgpt.com");
    expect(
      describeAttribution({ referrer: "www.google.com/", landing: "/" }),
    ).toBe("www.google.com/ · /");
    expect(describeAttribution({ landing: "/sell" })).toBe("direct · /sell");
    expect(describeAttribution(undefined)).toBe("");
  });
});

describe("attributionSchema", () => {
  it("drops a malformed record instead of failing the lead", () => {
    expect(attributionSchema.parse({ landing: "a\nb" })).toBeUndefined();
    expect(attributionSchema.parse("nonsense")).toBeUndefined();
    expect(attributionSchema.parse({ utmSource: "chatgpt.com" })).toEqual({
      utmSource: "chatgpt.com",
    });
  });

  it("keeps a reseller application valid when attribution is bad", () => {
    const base = {
      name: "Ana Lee",
      businessName: "Lee Gifts",
      email: "ana@example.com",
      phone: "+1 4045550100",
      businessType: resellerApplicationSchema.shape.businessType.options[0],
      monthlyVolume: resellerApplicationSchema.shape.monthlyVolume.options[0],
      currentStatus: resellerApplicationSchema.shape.currentStatus.options[0],
      salesChannels: [
        resellerApplicationSchema.shape.salesChannels.element.options[0],
      ],
      products: "Tumblers",
      consent: true,
    };
    const parsed = resellerApplicationSchema.safeParse({
      ...base,
      attribution: { landing: "x".repeat(1000) },
    });
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.attribution).toBeUndefined();
  });
});
