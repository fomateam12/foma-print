import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/category-icon";
import type { IconKey } from "@/data/types";

/**
 * Branded placeholder image. We intentionally render a generated, on-brand
 * visual instead of using any supplier photography (which is copyrighted).
 * The tint is derived deterministically from the seed so each product has a
 * stable, distinct look. Swap this component for <Image> once licensed photos
 * are available.
 */

const PRESETS: [string, string][] = [
  ["oklch(0.95 0.032 80)", "oklch(0.89 0.055 68)"], // amber sand
  ["oklch(0.95 0.022 165)", "oklch(0.9 0.04 168)"], // sage
  ["oklch(0.95 0.016 250)", "oklch(0.9 0.03 255)"], // slate blue
  ["oklch(0.96 0.024 42)", "oklch(0.91 0.045 45)"], // terracotta
  ["oklch(0.96 0.018 110)", "oklch(0.9 0.03 120)"], // olive
  ["oklch(0.975 0.006 80)", "oklch(0.915 0.018 60)"], // warm stone
];

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function ProductImage({
  seed,
  icon = "gift",
  label,
  className,
  iconClassName,
}: {
  seed: string;
  icon?: IconKey;
  label?: string;
  className?: string;
  iconClassName?: string;
}) {
  const [from, to] = PRESETS[hash(seed) % PRESETS.length];
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
      style={{
        backgroundImage: `radial-gradient(120% 120% at 15% 10%, ${from} 0%, ${to} 100%)`,
      }}
      role="img"
      aria-label={label ? `${label} — preview` : "Product preview"}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.3 0.02 60 / 0.06) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <CategoryIcon
        icon={icon}
        className={cn(
          "relative size-1/3 max-h-24 max-w-24 text-foreground/25",
          iconClassName,
        )}
      />
      <span className="absolute bottom-2.5 right-3 font-heading text-[10px] font-semibold tracking-[0.16em] text-foreground/35 uppercase">
        FomaPrint
      </span>
    </div>
  );
}
