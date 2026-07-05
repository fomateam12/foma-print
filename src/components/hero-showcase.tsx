"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Decorative laser-engraving process videos flanking the hero copy on wide
 * screens: real-feeling macro shots of the laser at work (wood + tumbler)
 * drifting gently, so the text-only hero shows the craft itself. Purely
 * visual: aria-hidden, pointer-events-none, hidden below xl. Videos are
 * muted/looped/inline; under prefers-reduced-motion they stay paused on
 * their first frame and the drift/entrance animations are dropped.
 */

const R2_BASE = "https://pub-7dbfe9f161d34085b011aea74e8f75ac.r2.dev/site/hero";

const CLIPS = [
  {
    src: `${R2_BASE}/laser-wood.mp4`,
    label: "Laser engraving · wood",
    pos: "left-[2%] top-1/2 -translate-y-1/2 w-52 2xl:left-[5%] 2xl:w-64",
    rotate: -5,
    drift: 10,
    duration: 8,
    delay: 0.25,
  },
  {
    src: `${R2_BASE}/laser-tumbler.mp4`,
    label: "Laser engraving · drinkware",
    pos: "right-[2%] top-1/2 -translate-y-1/2 w-52 2xl:right-[5%] 2xl:w-64",
    rotate: 5,
    drift: 11,
    duration: 9,
    delay: 0.45,
  },
];

function ClipCard({
  clip,
  autoplay,
}: {
  clip: (typeof CLIPS)[number];
  autoplay: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-ink shadow-card">
      <video
        src={clip.src}
        muted
        loop
        playsInline
        autoPlay={autoplay}
        preload="metadata"
        className="aspect-square w-full object-cover"
      />
      <div className="flex items-center gap-1.5 px-3 py-2">
        <span className="relative flex size-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
        </span>
        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          {clip.label}
        </span>
      </div>
    </div>
  );
}

export function HeroShowcase() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden select-none xl:block"
    >
      {CLIPS.map((clip) => (
        <div key={clip.src} className={`absolute ${clip.pos}`}>
          {reduce ? (
            <div style={{ rotate: `${clip.rotate}deg` }}>
              <ClipCard clip={clip} autoplay={false} />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: clip.rotate }}
              animate={{ opacity: 1, scale: 1, rotate: clip.rotate }}
              transition={{ duration: 0.7, delay: clip.delay, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={{ y: [0, -clip.drift, 0] }}
                transition={{
                  duration: clip.duration,
                  delay: clip.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ClipCard clip={clip} autoplay />
              </motion.div>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
