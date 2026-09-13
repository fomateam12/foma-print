import { AwsClient } from "aws4fetch";
import { cookies } from "next/headers";
import { CATALOG_COOKIE, expectedCatalogToken } from "@/lib/catalog-gate";
import { CATALOG_PDF_FILES } from "@/lib/catalog-pdf";
import { log } from "@/lib/log";

/**
 * Gated download for the partner catalog PDFs.
 *
 * The PDFs carry every wholesale price, so they live in a PRIVATE R2 bucket
 * (`fomaprint-catalog`) with no public r2.dev origin — unlike the image
 * bucket, where anything stored is world-readable by design. This route is
 * the only way out: it sits under /catalog/, which the proxy already gates on
 * the shared-password cookie, and re-checks that cookie here so the file can
 * never be served by a request that skipped the proxy.
 *
 * Fail-shut: with the R2 credentials unset the route 404s rather than falling
 * back to anything public.
 *
 * Env (Vercel): R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 * optional R2_CATALOG_BUCKET (defaults to `fomaprint-catalog`).
 */

const BUCKET = process.env.R2_CATALOG_BUCKET || "fomaprint-catalog";

function r2Client(): AwsClient | null {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey || !process.env.R2_ACCOUNT_ID) return null;
  return new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: "s3",
    region: "auto",
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // Only the names this build actually publishes — no caller-supplied path
  // ever reaches the bucket.
  const file = CATALOG_PDF_FILES[slug];
  if (!file) return new Response("Not found", { status: 404 });

  const jar = await cookies();
  if (jar.get(CATALOG_COOKIE)?.value !== (await expectedCatalogToken())) {
    return new Response("Not found", { status: 404 });
  }

  const client = r2Client();
  if (!client) {
    log.warn({ event: "catalog_pdf.unconfigured", slug });
    return new Response("Not found", { status: 404 });
  }

  const res = await client.fetch(
    `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET}/catalog/${file}`,
  );
  if (!res.ok || !res.body) {
    log.warn({ event: "catalog_pdf.fetch_failed", slug, status: res.status });
    return new Response("Not found", { status: 404 });
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${file}"`,
      ...(res.headers.get("content-length")
        ? { "Content-Length": res.headers.get("content-length")! }
        : {}),
      // Priced content behind a shared password: never cached by a CDN or
      // proxy, only by the browser that authenticated.
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
