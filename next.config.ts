import type { NextConfig } from "next";

/**
 * Content-Security-Policy — now ENFORCING. The report-only window ran clean
 * (site healthy, all 200s, no console violations) and the built client bundle
 * contains no eval/new Function, so enforcing this allowlist won't break
 * hydration. Sources mirror next.config images (R2 / Cloudinary) + next/font
 * (self-hosted) + same-origin API/fetch. `'unsafe-inline'` on script/style
 * remains the one weak spot — the next hardening step is nonce/hash-based
 * scripts (needs middleware), which can drop `'unsafe-inline'` from script-src.
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  // Turnstile loads its widget JS from challenges.cloudflare.com.
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.r2.dev https://res.cloudinary.com https://fomafamilyllc.com",
  "font-src 'self'",
  // Turnstile siteverify happens server-side, but the widget itself
  // sends telemetry/challenge POSTs from the browser to its own host.
  "connect-src 'self' https://challenges.cloudflare.com",
  // The Turnstile widget renders inside an iframe sourced from
  // challenges.cloudflare.com; allow it.
  "frame-src 'self' https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

/** Static security headers applied to every response. */
const SECURITY_HEADERS = [
  // Enforcing — validated safe (clean report-only window + no eval in bundle).
  { key: "Content-Security-Policy", value: CSP },
  // HSTS: 30 days (the recommended minimum). Still no preload (irreversible) and
  // no includeSubDomains until every subdomain is confirmed HTTPS.
  { key: "Strict-Transport-Security", value: "max-age=2592000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), usb=(), payment=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework.
  poweredByHeader: false,
  images: {
    // Custom loader — see src/lib/cloudinary-loader.ts. Required because
    // the default Vercel optimizer doesn't traverse next.config rewrites
    // when it fetches source images, which broke the curated
    // /products/{SKU}/{file} gallery URLs (they exist only on R2 /
    // Cloudinary, not in public/ at deploy time). The loader emits the
    // absolute origin URL directly; the Vercel optimizer at /_next/image
    // then re-encodes to AVIF / WebP and resizes per device — the
    // combination of `formats`, `qualities`, and the loader together
    // reproduce Cloudinary's `q_auto, f_auto` behavior.
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",

    // AVIF preferred (smaller for the same visual quality), WebP as the
    // fallback for browsers without AVIF support. Anything older falls
    // back to the original format the loader returned.
    formats: ["image/avif", "image/webp"],

    // Required in Next.js 16 — the allowlist of `quality` values the
    // optimizer will honor. 75 is the default for thumbnails / grids,
    // 85 for standard hero / gallery imagery, 95 for the product detail
    // gallery hero where extra AVIF fidelity buys visible engraving
    // detail on 4 MB source PNGs.
    qualities: [75, 85, 95],

    remotePatterns: [
      // R2 default subdomain (post-migration target). `pub-<hash>.r2.dev`
      // is the URL Cloudflare hands out when you enable public access
      // on an R2 bucket. If we later attach a custom domain
      // (e.g. cdn.foma-design.com) add it as a second entry.
      {
        protocol: "https",
        hostname: "*.r2.dev",
        pathname: "/**",
      },
      // Cloudinary — kept during cutover as a safety net while the loader
      // gracefully falls back to it whenever NEXT_PUBLIC_R2_BASE_URL is
      // unset. Drop this entry once R2 traffic has been clean for a few
      // days.
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fomafamilyllc.com",
        pathname: "/image/**",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  async redirects() {
    return [
      { source: "/custom-order", destination: "/quote", permanent: true },
      // FomaFlow seller auth is not launching yet. The login page and the
      // dashboard preview were removed; their entry point is now the reseller
      // application. 308 = permanent, method-preserving.
      { source: "/login", destination: "/sell", permanent: true },
      { source: "/seller", destination: "/sell", permanent: true },
    ];
  },
};

export default nextConfig;
