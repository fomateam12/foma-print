#!/usr/bin/env node
/**
 * Pre-fill the image optimizer's disk cache so shoppers never pay for a cold
 * thumbnail.
 *
 * Why: self-hosted, a /_next/image request that misses the cache fetches the
 * source from R2 (~0.7–1 s) and encodes WebP on the 2-vCPU box — measured
 * ~2 s per image, up to 2.7 s for a big gallery JPEG, against ~0.2 s once
 * cached. New products and new widths only ever arrive with a deploy, so
 * deploy/hetzner/deploy.sh starts this in the background after the health
 * check passes. Already-cached images answer HIT and cost almost nothing.
 *
 * It walks the sitemap (English pages only — /tr renders the same images),
 * and for every <img> works out the srcset candidate a browser would pick on
 * each VIEWPORTS profile, then requests exactly those URLs. Warming every
 * srcset width would mean thousands of 2048–3840 px encodes nobody views.
 *
 * Usage:  node scripts/warm-image-cache.mjs [--base URL] [--concurrency N] [--limit N] [--dry]
 *   --base         origin to hit (default http://127.0.0.1:3000, i.e. inside the app container)
 *   --concurrency  parallel image requests (default 2: leaves CPU for real visitors)
 *   --limit        only the first N sitemap pages
 *   --dry          collect and count image URLs, request none
 */

// Screens to warm for: wide desktop, retina laptop, phone.
const VIEWPORTS = [
  { width: 1920, dpr: 1 },
  { width: 1440, dpr: 2 },
  { width: 390, dpr: 3 },
];

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};
const BASE = opt("--base", "http://127.0.0.1:3000").replace(/\/$/, "");
const CONCURRENCY = Number(opt("--concurrency", 2));
const LIMIT = Number(opt("--limit", Infinity));
const DRY = args.includes("--dry");

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'");

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
  return m ? decode(m[1]) : null;
};

/** "url 640w, url 750w" or "url 1x, url 2x" → [{ url, w } | { url, x }] */
export function parseSrcset(srcset) {
  return srcset
    .split(/,\s+(?=\S)/)
    .map((part) => {
      const [url, d = "1x"] = part.trim().split(/\s+/);
      const n = parseFloat(d);
      return d.endsWith("w") ? { url, w: n } : { url, x: n };
    })
    .filter((c) => c.url && Number.isFinite(c.w ?? c.x));
}

/** Slot width in CSS px for `sizes` on a viewport; supports (max|min-width: Npx). */
export function slotWidth(sizes, viewport) {
  for (const entry of (sizes || "100vw").split(",")) {
    const m = entry.trim().match(/^(?:\((max|min)-width:\s*(\d+)px\)\s*)?(\d+(?:\.\d+)?)(vw|px)$/);
    if (!m) continue;
    const [, kind, bound, len, unit] = m;
    if (kind === "max" && viewport > Number(bound)) continue;
    if (kind === "min" && viewport < Number(bound)) continue;
    return unit === "vw" ? (Number(len) * viewport) / 100 : Number(len);
  }
  return viewport;
}

/** The candidate a browser fetches: smallest one that covers the slot at this DPR. */
export function pick(candidates, sizes, { width, dpr }) {
  const byW = candidates.filter((c) => c.w).sort((a, b) => a.w - b.w);
  if (byW.length) {
    const need = slotWidth(sizes, width) * dpr;
    return (byW.find((c) => c.w >= need) ?? byW.at(-1)).url;
  }
  const byX = candidates.filter((c) => c.x).sort((a, b) => a.x - b.x);
  return byX.length ? (byX.find((c) => c.x >= dpr) ?? byX.at(-1)).url : null;
}

/** Every optimizer URL a page makes the VIEWPORTS profiles download. */
export function imageUrls(html) {
  const out = new Set();
  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
    const srcset = attr(tag, "srcset");
    const candidates = srcset ? parseSrcset(srcset) : [];
    const sizes = attr(tag, "sizes");
    const picked = candidates.length
      ? VIEWPORTS.map((v) => pick(candidates, sizes, v))
      : [attr(tag, "src")];
    for (const url of picked) if (url?.startsWith("/_next/image")) out.add(url);
  }
  return out;
}

async function pool(items, size, fn) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) await fn(items[next++]);
    }),
  );
}

async function main() {
  const t0 = Date.now();
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(([, loc]) => new URL(loc).pathname)
    .filter((p) => !p.startsWith("/tr/") && p !== "/tr")
    .slice(0, LIMIT);

  const images = new Set();
  let pageErrors = 0;
  await pool(pages, 4, async (path) => {
    try {
      const res = await fetch(BASE + path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      for (const url of imageUrls(await res.text())) images.add(url);
    } catch (err) {
      pageErrors++;
      console.warn(`page ${path}: ${err.message}`);
    }
  });
  console.log(`${pages.length} pages (${pageErrors} failed) → ${images.size} images to warm`);
  if (DRY) return;

  const tally = {};
  let slowest = { ms: 0, url: "" };
  await pool([...images], CONCURRENCY, async (url) => {
    const start = Date.now();
    let key;
    try {
      // The cache is keyed by output format; ask for WebP like real browsers.
      const res = await fetch(BASE + url, { headers: { accept: "image/webp,image/*" } });
      await res.arrayBuffer();
      key = res.ok ? (res.headers.get("x-nextjs-cache") ?? "NONE") : `HTTP ${res.status}`;
      // A non-200 here is a broken image shoppers see too — name it in the log.
      if (!res.ok) console.warn(`image ${key}: ${decodeURIComponent(url)}`);
    } catch (err) {
      key = "ERROR";
      console.warn(`image ${url}: ${err.message}`);
    }
    tally[key] = (tally[key] ?? 0) + 1;
    const ms = Date.now() - start;
    if (ms > slowest.ms) slowest = { ms, url };
  });

  const secs = Math.round((Date.now() - t0) / 1000);
  console.log(`done in ${secs}s:`, JSON.stringify(tally), `slowest ${slowest.ms} ms ${slowest.url}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
