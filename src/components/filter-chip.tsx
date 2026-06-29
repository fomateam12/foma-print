"use client";

import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Unified filter-chip system.
 *
 * One chip look + one horizontal scroller, shared by every filter rail
 * in the app (sibling-subcategory nav, the "Browse by size" row, and the
 * refine sidebar). A chip is always a navigation control, so it renders
 * as a Next <Link>; selection is communicated with aria-current="page".
 */

export interface FilterChipProps {
  href: string;
  label: string;
  /** Optional count badge. Omit to render a label-only chip. */
  count?: number;
  selected?: boolean;
  /** Tooltip / full text for long labels that truncate. Defaults to label. */
  title?: string;
}

export function FilterChip({
  href,
  label,
  count,
  selected = false,
  title,
}: FilterChipProps) {
  return (
    <Link
      href={href}
      title={title ?? label}
      aria-current={selected ? "page" : undefined}
      className={cn(
        "inline-flex h-9 shrink-0 snap-start items-center gap-1.5 rounded-control border px-3.5 text-sm font-medium transition-colors",
        selected
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border bg-surface text-muted-foreground hover:border-brand/40 hover:bg-brand-muted/40 hover:text-foreground",
      )}
    >
      <span className="max-w-[14rem] truncate">{label}</span>
      {count != null ? (
        <span
          className={cn(
            "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums",
            selected
              ? "bg-white/20 text-brand-foreground"
              : "bg-brand-muted text-brand-strong",
          )}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}

function ScrollButton({
  direction,
  enabled,
  onClick,
}: {
  direction: "left" | "right";
  enabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      tabIndex={enabled ? 0 : -1}
      aria-hidden={!enabled}
      onClick={onClick}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full border border-border bg-surface text-muted-foreground shadow-soft transition-opacity hover:text-foreground",
        enabled ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}

export interface ChipScrollerProps {
  children: ReactNode;
  /** Show the left/right chevron gutter when the rail overflows. */
  chevrons?: boolean;
  /** Accessible label for the scroll region. */
  "aria-label"?: string;
  className?: string;
}

/**
 * Horizontal overflow rail. Hides the scrollbar, snaps on the x-axis, and
 * fades the edge(s) that can still be scrolled. Chevron buttons live in
 * their own gutter outside the scroll track (so they never overlap a chip)
 * and only appear when there's something to scroll to. Left/Right arrow
 * keys scroll the rail when focus is inside it.
 */
export function ChipScroller({
  children,
  chevrons = true,
  "aria-label": ariaLabel,
  className,
}: ChipScrollerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Recompute can-scroll flags on scroll + resize. The initial read is
  // deferred to an animation frame so we never call setState synchronously
  // inside the effect body (React Compiler / strict rules).
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft < max - 4);
    };
    const raf = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const scrollByDir = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // ~75% of the viewport keeps a couple of chips visible across pages.
    el.scrollBy({
      left: dir * el.clientWidth * 0.75,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByDir(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByDir(1);
    }
  };

  const overflowing = canScrollLeft || canScrollRight;

  // Edge fade — only fade an edge that can still be scrolled. Derived
  // purely from state (no ref reads during render).
  let maskStyle: CSSProperties | undefined;
  if (overflowing) {
    const from = canScrollLeft ? "transparent" : "black";
    const to = canScrollRight ? "transparent" : "black";
    const mask = `linear-gradient(to right, ${from}, black 2.5rem, black calc(100% - 2.5rem), ${to})`;
    maskStyle = { WebkitMaskImage: mask, maskImage: mask };
  }

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      onKeyDown={onKeyDown}
    >
      {chevrons && overflowing ? (
        <ScrollButton
          direction="left"
          enabled={canScrollLeft}
          onClick={() => scrollByDir(-1)}
        />
      ) : null}

      <div
        ref={trackRef}
        role="group"
        aria-label={ariaLabel}
        className="no-scrollbar flex min-w-0 flex-1 snap-x gap-2 overflow-x-auto scroll-smooth py-1"
        style={maskStyle}
      >
        {children}
      </div>

      {chevrons && overflowing ? (
        <ScrollButton
          direction="right"
          enabled={canScrollRight}
          onClick={() => scrollByDir(1)}
        />
      ) : null}
    </div>
  );
}
