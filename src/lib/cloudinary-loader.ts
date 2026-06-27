import type { ImageLoaderProps } from "next/image";

/**
 * Custom next/image loader. Reasons we can't use the default Vercel
 * optimizer for the curated gallery:
 *
 *   - Sidecar URLs in src/data/product-images.json use the stable shape
 *     `/products/{SKU}/{file}`. There's no matching file on disk in
 *     production (public/products/ is gitignored — too large to ship).
 *   - We previously tried a next.config rewrite to proxy /products/... to
 *     Cloudinary at the edge. The optimizer fetches the source URL with
 *     its OWN HTTP client and does NOT walk next.config rewrites, so it
 *     hits the deployment root, gets SSO-redirected on preview / 404'd
 *     on prod, and the resulting image is blank.
 *
 * This loader sidesteps the optimizer entirely for /products/... paths:
 * the browser fetches the Cloudinary URL directly, with q_auto,f_auto so
 * each device gets the right format and quality. Other src values
 * (supplier res.cloudinary.com URLs, fomafamilyllc.com URLs, etc.) are
 * passed through untouched — they are already absolute and already
 * optimized by their own pipelines.
 */
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (src.startsWith("/products/")) {
    if (!CLOUD) {
      // Local dev or unconfigured preview: fall through to public/products/
      // which exists on the developer's machine after running place_images.py.
      return src;
    }
    const path = src.replace(/^\//, "");
    const q = quality ?? 75;
    return `https://res.cloudinary.com/${CLOUD}/image/upload/q_${q},f_auto,w_${width}/${path}`;
  }
  return src;
}
