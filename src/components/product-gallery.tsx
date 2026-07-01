"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

/**
 * Multi-view product gallery: large hero on top, scrollable thumbnail row below.
 * Thumbnails swap the hero on click; arrow keys cycle while hover/focus is in
 * the gallery. Falls back gracefully to a single hero when `images.length === 1`.
 *
 * `images` is the ordered URL list from the catalog (primary first, BLANK
 * variants last). When NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set, the
 * `/products/{SKU}/{file}` paths are rewritten to Cloudinary by next.config.ts
 * — this component is unaware of the host and just renders whatever it's
 * handed.
 */
export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const count = images.length;

  // Clamp during render instead of correcting via an effect: if the prop ever
  // shrinks (e.g. variant swap) `active` may point past the new end, so derive
  // a safe index for this render. `setActive` self-corrects on the next click
  // or `cycle` (which is modulo-bounded). Avoids the cascading-render that a
  // setState-in-effect would trigger.
  const activeIndex = active < count ? active : 0;

  const cycle = useCallback(
    (delta: number) => {
      if (count <= 1) return;
      setActive((i) => (i + delta + count) % count);
    },
    [count],
  );

  const onKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        cycle(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        cycle(-1);
      }
    },
    [cycle],
  );

  if (count === 0) return null;

  return (
    <div
      onKeyDown={onKey}
      // The container needs tabIndex so keyboard nav works without clicking a
      // thumbnail first.
      tabIndex={0}
      role="region"
      aria-roledescription="image gallery"
      aria-label={`${alt} — image gallery`}
      className="focus:outline-none"
    >
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-white">
        <Image
          key={images[activeIndex]}
          src={images[activeIndex]}
          alt={
            count > 1 ? `${alt} — view ${activeIndex + 1} of ${count}` : alt
          }
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          // The detail-page hero is the closest look a buyer gets — bump
          // to 95 so the AVIF conversion preserves fine engraving detail
          // on the 4 MB source PNGs. Thumbnails below stay at the default 75.
          quality={95}
          className="object-contain p-8 transition-opacity duration-200"
        />
      </div>

      {count > 1 && (
        <div
          className="mt-3 grid gap-2"
          style={{
            // Up to 6 thumbnails per row; extras (e.g. spec/feature diagrams
            // appended to a full product gallery) wrap to the next row instead
            // of being clipped.
            gridTemplateColumns: `repeat(${Math.min(count, 6)}, minmax(0, 1fr))`,
          }}
        >
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-pressed={i === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border bg-white transition",
                i === active
                  ? "border-brand-strong ring-2 ring-brand-strong/30"
                  : "border-border hover:border-brand-strong/60",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="20vw"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
