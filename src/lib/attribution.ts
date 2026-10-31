/**
 * First-touch attribution for lead forms: where a visitor came from the first
 * time they landed on the site (AI assistant, search engine, ad, direct), and
 * which page they landed on. Captured once by `<AttributionCapture />` and
 * sent with the reseller application and the quote request, so a lead in the
 * inbox or the Sheet can be traced back to the page that earned it.
 *
 * Stored in localStorage for 90 days. Storage can throw or come back empty
 * (private windows, blocked site data); every access is guarded and a missing
 * record simply sends nothing — a form must never fail because of this.
 */

export interface Attribution {
  /** Path + query of the first page seen, e.g. `/guides/x?utm_source=chatgpt.com`. */
  landing?: string;
  /** External referrer host + path, empty for direct visits. */
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  /** ISO timestamp of the first visit. */
  firstSeen?: string;
}

const KEY = "fp_attribution_v1";
const TTL_MS = 90 * 24 * 60 * 60 * 1000;
const MAX = 300;

const clip = (v: string | null | undefined) =>
  v ? v.replace(/[\r\n]+/g, " ").slice(0, MAX) : undefined;

export function captureAttribution(): void {
  try {
    const existing = readAttribution();
    if (existing?.firstSeen) {
      const age = Date.now() - Date.parse(existing.firstSeen);
      if (Number.isFinite(age) && age < TTL_MS) return;
    }
    const url = new URL(window.location.href);
    let referrer: string | undefined;
    if (document.referrer) {
      const ref = new URL(document.referrer);
      if (ref.host !== url.host) referrer = clip(ref.host + ref.pathname);
    }
    const record: Attribution = {
      landing: clip(url.pathname + url.search),
      referrer,
      utmSource: clip(url.searchParams.get("utm_source")),
      utmMedium: clip(url.searchParams.get("utm_medium")),
      utmCampaign: clip(url.searchParams.get("utm_campaign")),
      firstSeen: new Date().toISOString(),
    };
    window.localStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable — attribution is best-effort.
  }
}

export function readAttribution(): Attribution | undefined {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Attribution;
    return parsed && typeof parsed === "object" ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/** One readable line for emails and the Sheet: `chatgpt.com · /guides/x`. */
export function describeAttribution(a?: Attribution | null): string {
  if (!a) return "";
  const source =
    [a.utmSource, a.utmMedium, a.utmCampaign].filter(Boolean).join(" / ") ||
    a.referrer ||
    "direct";
  return [source, a.landing].filter(Boolean).join(" · ");
}
