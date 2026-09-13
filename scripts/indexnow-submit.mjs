#!/usr/bin/env node
/**
 * Push the sitemap's URLs to IndexNow.
 *
 * Why: Bing (and therefore ChatGPT search and Microsoft Copilot, which answer
 * from Bing's index) discovers new pages by crawling on its own schedule. A
 * fresh site with no backlinks waits weeks in that queue. IndexNow skips the
 * queue — the URLs are handed over directly and are eligible for crawl within
 * hours instead.
 *
 * Ownership is proven by a key file served from the site root
 * (`public/<key>.txt`, containing the key and nothing else). Delete that file
 * and every future submission is rejected.
 *
 * Usage:  node scripts/indexnow-submit.mjs [--limit N] [--dry]
 *
 * On a machine whose HTTPS traffic is intercepted (Avast Web Shield on the
 * operator's box) node's fetch dies with ECONNRESET before it reaches the
 * endpoint. Either point node at the system trust store
 * (`NODE_EXTRA_CA_CERTS=<ca-bundle.pem>`) or POST the same JSON with curl,
 * which uses the OS store:
 *
 *   curl --ssl-no-revoke -X POST https://api.indexnow.org/indexnow  *     -H "Content-Type: application/json; charset=utf-8" --data-binary @payload.json
 *
 * A fresh key file takes a few minutes to validate — until then the endpoint
 * answers 403 `SiteVerificationNotCompleted`. That is a wait, not a failure.
 *
 * Run it after a deploy that adds or meaningfully changes pages. Submitting
 * unchanged URLs repeatedly is pointless and the endpoint may rate-limit, so
 * this is a deliberate manual step rather than a build hook.
 */

const KEY = "ce405bb903b43bd00bf791a416674a25";
const HOST = "www.fomaprint.com";
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

/** IndexNow accepts at most 10,000 URLs per request. */
const BATCH_SIZE = 10000;

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const limitArg = args.indexOf("--limit");
const limit = limitArg !== -1 ? Number(args[limitArg + 1]) : Infinity;

async function main() {
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`sitemap ${res.status}`);
  const xml = await res.text();

  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim())
    // Guard against submitting a host we do not own the key for — IndexNow
    // rejects the whole batch if one URL is off-host.
    .filter((u) => u.startsWith(`https://${HOST}/`) || u === `https://${HOST}`)
    .slice(0, limit);

  console.log(`sitemap: ${urls.length} URL`);
  if (dry) {
    console.log(urls.slice(0, 5).join("\n"));
    console.log("--dry: gonderilmedi");
    return;
  }

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const body = {
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: batch,
    };
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    // 200 = accepted, 202 = accepted but key still being validated.
    console.log(
      `batch ${i / BATCH_SIZE + 1}: ${batch.length} URL -> HTTP ${r.status} ${r.statusText}`,
    );
    if (!r.ok && r.status !== 202) {
      console.log(await r.text());
      process.exitCode = 1;
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
