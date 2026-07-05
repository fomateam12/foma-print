"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ProductImage } from "@/components/product-image";

/**
 * Decorative floating product cards flanking the hero copy on wide screens.
 * Real catalog items (passed from the server) drift gently up and down so the
 * text-only hero gets tangible product context without competing with the CTA.
 * Purely visual: aria-hidden, pointer-events-none, hidden below xl, static
 * under prefers-reduced-motion.
 */
export interface ShowcaseProduct {
  id: string;
  name: string;
  image: string;
  sku: string;
}

const SLOTS = [
  { pos: "left-[2%] top-14 w-36 2xl:left-[6%] 2xl:w-44", rotate: -6, drift: 10, duration: 7, delay: 0.2 },
  { pos: "bottom-10 left-[5%] w-28 2xl:left-[9%] 2xl:w-32", rotate: 4, drift: 8, duration: 9, delay: 0.5 },
  { pos: "right-[2%] top-16 w-32 2xl:right-[6%] 2xl:w-40", rotate: 6, drift: 9, duration: 8, delay: 0.35 },
  { pos: "bottom-12 right-[5%] w-36 2xl:right-[9%] 2xl:w-44", rotate: -4, drift: 11, duration: 10, delay: 0.65 },
];

export function HeroShowcase({ products }: { products: ShowcaseProduct[] }) {
  const reduce = useReducedMotion();
  const items = products.slice(0, SLOTS.length);

  if (items.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden select-none xl:block"
    >
      {items.map((p, i) => {
        const slot = SLOTS[i];
        const card = (
          <ProductImage
            src={p.image}
            alt=""
            seed={p.sku}
            width={300}
            sizes="180px"
            className="aspect-square rounded-2xl border border-border bg-white shadow-card"
            imgClassName="p-3"
          />
        );

        if (reduce) {
          return (
            <div
              key={p.id}
              className={`absolute ${slot.pos}`}
              style={{ transform: `rotate(${slot.rotate}deg)` }}
            >
              {card}
            </div>
          );
        }

        return (
          <motion.div
            key={p.id}
            className={`absolute ${slot.pos}`}
            initial={{ opacity: 0, scale: 0.92, rotate: slot.rotate }}
            animate={{ opacity: 1, scale: 1, rotate: slot.rotate }}
            transition={{ duration: 0.7, delay: slot.delay, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{ y: [0, -slot.drift, 0] }}
              transition={{
                duration: slot.duration,
                delay: slot.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {card}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
