/**
 * In-memory daily token budget. fomaprint runs as one container, so this
 * counter is exact. A restart resets it; the prepaid DeepSeek balance is
 * the hard backstop.
 */
export interface DailyBudget {
  canSpend(now: number): boolean;
  record(tokens: number, now: number): void;
}

const utcDay = (now: number) => new Date(now).toISOString().slice(0, 10);

export function createDailyBudget(limit: number): DailyBudget {
  let day = "";
  let used = 0;
  const roll = (now: number) => {
    const today = utcDay(now);
    if (today !== day) {
      day = today;
      used = 0;
    }
  };
  return {
    canSpend(now) {
      roll(now);
      return used < limit;
    },
    record(tokens, now) {
      roll(now);
      used += Math.max(0, tokens);
    },
  };
}
