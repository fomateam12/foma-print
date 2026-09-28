import { describe, expect, it } from "vitest";
import { createDailyBudget } from "./budget";

const day = (iso: string) => Date.parse(iso);

describe("createDailyBudget", () => {
  it("allows spending until the limit is reached", () => {
    const b = createDailyBudget(1000);
    const t = day("2026-10-01T10:00:00Z");
    expect(b.canSpend(t)).toBe(true);
    b.record(999, t);
    expect(b.canSpend(t)).toBe(true);
    b.record(1, t);
    expect(b.canSpend(t)).toBe(false);
  });

  it("resets at UTC midnight", () => {
    const b = createDailyBudget(10);
    b.record(10, day("2026-10-01T23:59:00Z"));
    expect(b.canSpend(day("2026-10-01T23:59:30Z"))).toBe(false);
    expect(b.canSpend(day("2026-10-02T00:00:01Z"))).toBe(true);
  });
});
