/** Pure formatting helpers — safe to import from client components. */

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

/**
 * Rewrites a supplier Cloudinary URL's transformation segment so we can request
 * the exact size/quality we need. Source URLs look like:
 *   https://res.cloudinary.com/business-products/image/upload/<transform>/v123/products/images/large/SKU--hash.png
 */
export function cloudinary(
  url: string,
  { width = 600, pad = true }: { width?: number; pad?: number | boolean } = {},
): string {
  const t = [
    "f_auto",
    "q_auto",
    `w_${width}`,
    `h_${width}`,
    "c_pad",
    "b_transparent",
  ];
  if (!pad) {
    t.splice(4, 2, "c_fit");
  }
  return url.replace(/\/upload\/[^/]+\//, `/upload/${t.join(",")}/`);
}
