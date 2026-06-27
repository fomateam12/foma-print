import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Custom loader — see src/lib/cloudinary-loader.ts. Required because the
    // default Vercel optimizer doesn't traverse next.config rewrites when it
    // fetches source images, which broke the curated /products/{SKU}/{file}
    // gallery URLs (they exist only on Cloudinary, not in public/ at deploy
    // time). The loader emits absolute res.cloudinary.com URLs directly so
    // the browser fetches Cloudinary one hop, with q_auto,f_auto applied.
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // covers BOTH the supplier feed (cloud=business-products) and
        // FOMA's own cloud (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
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
};

export default nextConfig;
