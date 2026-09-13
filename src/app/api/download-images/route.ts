import { NextResponse } from "next/server";
import { Zip, ZipPassThrough } from "fflate";
import { getProduct } from "@/data/catalog";
import { catalogImageAbsoluteUrl } from "@/lib/catalog-image";
import { getTraceId, TRACE_HEADER } from "@/lib/trace";

/**
 * High-resolution image download for resellers.
 *
 * The product pages render every image through the Vercel optimizer, which
 * resizes and re-encodes for the viewport — right-click-save hands the buyer
 * a compressed WebP derivative, not the file they should be listing with.
 * This route serves the ORIGINAL objects instead, with a
 * `Content-Disposition: attachment` so the browser opens a save dialog:
 *
 *   /api/download-images?sku=LWB207        → ZIP of the SKU's full gallery
 *   /api/download-images?sku=LWB207&i=2    → single image (gallery index 2)
 *
 * Sources mirror the gallery binding exactly (curated `product.images`
 * first, supplier feed image as the gallery-of-one fallback), so `i` on the
 * detail page and `i` here always name the same picture. Only images already
 * public on the product page are reachable — the SKU must resolve and the
 * index must be inside its gallery, so this can't be used as an open proxy.
 */

/** Best-quality copy of a gallery reference, no optimizer in front. */
function originalUrl(src: string): string {
  if (src.startsWith("/products/")) return catalogImageAbsoluteUrl(src);
  // Supplier Cloudinary URL — the feed bakes a small transform into the
  // path; swap it for quality-only so Cloudinary serves full resolution
  // in the original format (same rewrite trick as `cloudinary()` in
  // format.ts, which every feed URL is known to survive).
  return src.replace(/\/upload\/[^/]+\//, "/upload/q_100/");
}

/** Safe on-disk filename for a gallery entry. */
function downloadName(src: string, sku: string, index: number): string {
  const base = src.split("?")[0].split("/").pop() ?? "";
  const clean = base.replace(/[^\w.\-]/g, "_");
  if (/\.(jpe?g|png|webp|gif|avif)$/i.test(clean)) return clean;
  // Cloudinary fallback names look like `SKU--hash.png`-less blobs — give
  // the buyer something recognizable instead.
  return `${sku}${index > 0 ? `_${index + 1}` : ""}.jpg`;
}

/**
 * Stream a ZIP of the given files without buffering it in memory. Entries
 * are stored, not deflated — JPEG/PNG don't compress further and store
 * keeps the function fast. Files that fail to fetch are skipped so one
 * missing variant doesn't sink the whole archive.
 */
function zipStream(
  files: { name: string; url: string }[],
): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const zip = new Zip((err, chunk, final) => {
        if (err) {
          controller.error(err);
          return;
        }
        controller.enqueue(chunk);
        if (final) controller.close();
      });
      try {
        for (const file of files) {
          const res = await fetch(file.url);
          if (!res.ok || !res.body) continue;
          const entry = new ZipPassThrough(file.name);
          zip.add(entry);
          const reader = res.body.getReader();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            entry.push(value);
          }
          entry.push(new Uint8Array(0), true);
        }
        zip.end();
      } catch (e) {
        controller.error(e);
      }
    },
  });
}

const COMMON_HEADERS = {
  // Originals are immutable-in-practice (replacements get new filenames to
  // bust caches — see the `_hd` convention), so let the CDN hold them.
  "cache-control": "public, max-age=3600, s-maxage=86400",
  // Download endpoints have no business in a search index.
  "x-robots-tag": "noindex",
};

export async function GET(request: Request) {
  const traceId = getTraceId(request);
  const { searchParams } = new URL(request.url);

  const sku = (searchParams.get("sku") ?? "").trim();
  const product = sku ? getProduct(sku) : undefined;
  if (!product) {
    return NextResponse.json(
      { error: "Unknown SKU. Pass ?sku=<catalog sku>." },
      { status: 404, headers: { [TRACE_HEADER]: traceId } },
    );
  }

  // Same gallery the detail page renders: curated multi-view binding when
  // one exists, otherwise the single supplier image.
  const gallery = product.images?.length
    ? product.images
    : product.imageFull
      ? [product.imageFull]
      : [];
  if (gallery.length === 0) {
    return NextResponse.json(
      { error: "No images bound to this SKU." },
      { status: 404, headers: { [TRACE_HEADER]: traceId } },
    );
  }

  const rawIndex = searchParams.get("i");
  if (rawIndex !== null) {
    const index = Number(rawIndex);
    if (!Number.isInteger(index) || index < 0 || index >= gallery.length) {
      return NextResponse.json(
        { error: `Index out of range (gallery has ${gallery.length} images).` },
        { status: 400, headers: { [TRACE_HEADER]: traceId } },
      );
    }
    const upstream = await fetch(originalUrl(gallery[index]));
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: "Source image is unavailable right now." },
        { status: 502, headers: { [TRACE_HEADER]: traceId } },
      );
    }
    return new Response(upstream.body, {
      headers: {
        ...COMMON_HEADERS,
        "content-type":
          upstream.headers.get("content-type") ?? "application/octet-stream",
        "content-disposition": `attachment; filename="${downloadName(gallery[index], product.sku, index)}"`,
        [TRACE_HEADER]: traceId,
      },
    });
  }

  const files = gallery.map((src, i) => ({
    name: downloadName(src, product.sku, i),
    url: originalUrl(src),
  }));
  return new Response(zipStream(files), {
    headers: {
      ...COMMON_HEADERS,
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${product.sku}-images.zip"`,
      [TRACE_HEADER]: traceId,
    },
  });
}
