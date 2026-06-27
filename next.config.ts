import type { NextConfig } from "next";

// The curated gallery is served from FOMA's Cloudinary cloud. The supplier
// feed already uses res.cloudinary.com (different cloud name); this just
// adds a second namespace. Vercel Blob was attempted earlier but hit the
// Hobby 1 GB cap at 728/4609 files — Cloudinary's 25 GB free tier fits.
const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // covers BOTH the supplier feed (cloud=business-products) and
        // FOMA's own cloud (whatever NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is)
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fomafamilyllc.com",
        pathname: "/image/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/custom-order", destination: "/quote", permanent: true },
    ];
  },
  async rewrites() {
    // Curated gallery URLs in src/data/product-images.json use the stable
    // shape /products/{SKU}/{file}. When NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    // is set we proxy those to Cloudinary with q_auto,f_auto so the browser
    // gets format-and-quality-optimized delivery without per-image config.
    // When unset (local dev) requests fall through to ./public/products/
    // so the same code runs without the upload.
    if (!CLOUDINARY_CLOUD) return [];
    return [
      {
        source: "/products/:path*",
        destination:
          `https://res.cloudinary.com/${CLOUDINARY_CLOUD}` +
          `/image/upload/q_auto,f_auto/products/:path*`,
      },
    ];
  },
};

export default nextConfig;
