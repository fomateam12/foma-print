"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Marquee } from "@/components/marquee";
import { ProductImage } from "@/components/product-image";
import type { IconKey } from "@/data/types";

/**
 * Signature home banner: an auto-scrolling row of curated, high-margin catalog
 * products a reseller would dropship. The server passes a larger pool; we show
 * a capped, shuffled subset that rotates per visit so it isn't the same items
 * every load. Pricing is quote-based, so cards say "Request pricing" instead of
 * a retail tag (consistent with the catalog grid and PDPs). The Marquee is pure
 * CSS, so it pauses under prefers-reduced-motion.
 */
export interface BannerProduct {
  id: string;
  name: string;
  image: string;
  sku: string;
  categorySlug: string;
}

const SLUG_ICON: Record<string, IconKey> = {
  "gifts-and-promotions": "gift",
  "kitchen-and-bar": "utensils",
  "travel-accessories": "luggage",
  "personal-accessories": "wallet",
  drinkware: "coffee",
  "frames-and-decor": "frame",
  "office-tech": "notebook",
};

/** Cards shown at once — capped for performance (each is mounted twice by the
 *  seamless marquee loop). */
const VISIBLE = 12;

export function ProductBanner({ products }: { products: BannerProduct[] }) {
  // First paint uses a deterministic slice so SSR and the initial client render
  // match (no hydration mismatch); after mount we shuffle the full pool and take
  // a fresh subset, which rotates the lineup per visit.
  const [items, setItems] = useState<BannerProduct[]>(() =>
    products.slice(0, VISIBLE),
  );

  useEffect(() => {
    // Shuffle after first paint (in a deferred callback, not synchronously) so
    // SSR/hydration stay matched and we don't trigger a cascading render.
    const id = requestAnimationFrame(() => {
      const pool = [...products];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      setItems(pool.slice(0, VISIBLE));
    });
    return () => cancelAnimationFrame(id);
  }, [products]);

  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="banner-heading"
      className="border-b border-border bg-secondary/30 py-10 lg:py-14"
    >
      <div className="container-px flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow text-brand-strong">Products to sell</span>
          <h2
            id="banner-heading"
            className="mt-1.5 font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            High-margin inventory, ready to dropship
          </h2>
        </div>
        <Link
          href="/categories"
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-strong transition-colors hover:text-rust-bright sm:inline-flex"
        >
          All products
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <Marquee className="mt-7">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="group/card block w-44 shrink-0 outline-none sm:w-48"
          >
            <ProductImage
              src={p.image}
              alt={p.name}
              seed={p.sku}
              icon={SLUG_ICON[p.categorySlug] ?? "gift"}
              width={400}
              sizes="200px"
              className="aspect-square rounded-2xl border border-border shadow-soft transition-all duration-300 ease-premium group-hover/card:-translate-y-1 group-hover/card:shadow-lg group-focus-visible/card:ring-2 group-focus-visible/card:ring-ring"
              imgClassName="p-4 transition-transform duration-500 group-hover/card:scale-[1.04]"
            />
            <p className="mt-3 line-clamp-2 text-sm font-medium leading-snug text-foreground">
              {p.name}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-brand-strong">
              Request pricing
            </p>
          </Link>
        ))}
      </Marquee>
    </section>
  );
}
