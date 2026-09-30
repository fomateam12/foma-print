"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type OrbState = "idle" | "thinking" | "replying";

type Frame = "idle" | "blink" | "talk";

const FRAMES: Frame[] = ["idle", "blink", "talk"];

/**
 * FomaBot's mascot: a plush character holding our 40 oz tumbler, rendered
 * once (Magnific, Seedream 5 Pro) and cut into three frames that share one
 * alpha mask, so swapping frames never shifts an edge:
 *   idle  - smiling, eyes open
 *   blink - eyes closed, used for a short blink
 *   talk  - mouth open, alternated with idle while replying
 * Everything else (breathing, hop, head tilt, thought dots) is motion on top.
 */
function src(frame: Frame, px: 160 | 320) {
  return `/fomabot/fomabot-${frame}-${px}.webp`;
}

const BLINK_MS = 140;
const TALK_FLAP_MS = 170;

function useFrame(state: OrbState, reduce: boolean): Frame {
  const [frame, setFrame] = useState<Frame>("idle");

  useEffect(() => {
    if (reduce) return;

    const timers: number[] = [];
    let alive = true;

    if (state === "replying") {
      const flap = window.setInterval(() => {
        setFrame((f) => (f === "talk" ? "idle" : "talk"));
      }, TALK_FLAP_MS);
      return () => window.clearInterval(flap);
    }

    // Blink at a slightly irregular rhythm so it reads as alive, not looped.
    const scheduleBlink = () => {
      const wait = 2800 + Math.random() * 2600;
      timers.push(
        window.setTimeout(() => {
          if (!alive) return;
          setFrame("blink");
          timers.push(
            window.setTimeout(() => {
              if (!alive) return;
              setFrame("idle");
              scheduleBlink();
            }, BLINK_MS),
          );
        }, wait),
      );
    };
    scheduleBlink();

    return () => {
      alive = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [state, reduce]);

  // Derived rather than reset inside the effect: a leftover "talk" or "blink"
  // from the previous state never shows in a state that does not use it.
  if (reduce) return "idle";
  if (state === "replying") return frame === "talk" ? "talk" : "idle";
  return frame === "blink" ? "blink" : "idle";
}

export function FomaBotOrb({ state, size = 56 }: { state: OrbState; size?: number }) {
  const reduce = useReducedMotion() ?? false;
  const frame = useFrame(state, reduce);

  const body = reduce
    ? {}
    : state === "replying"
      ? { y: [0, -size * 0.08, 0], scaleY: [1, 1.03, 1] }
      : state === "thinking"
        ? { rotate: -6, scaleY: [1, 1.015, 1] }
        : { rotate: 0, scaleY: [1, 1.02, 1] };

  const transition = reduce
    ? undefined
    : {
        rotate: { type: "spring" as const, stiffness: 120, damping: 14 },
        y: { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const },
        scaleY: {
          duration: state === "replying" ? 0.5 : 3.2,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    <span
      aria-hidden
      className="relative inline-block select-none"
      style={{ width: size, height: size }}
    >
      <motion.span
        className="absolute inset-0 block"
        style={{
          transformOrigin: "50% 90%",
          filter: "drop-shadow(0 6px 10px rgba(120, 80, 40, 0.22))",
        }}
        animate={body}
        transition={transition}
      >
        {FRAMES.map((f) => (
          // Plain <img>: tiny static files from /public; next/image would
          // route them through the catalog's R2 loader, which is for products.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={f}
            src={src(f, 160)}
            srcSet={`${src(f, 160)} 1x, ${src(f, 320)} 2x`}
            width={size}
            height={size}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full"
            style={{ opacity: f === frame ? 1 : 0 }}
          />
        ))}
      </motion.span>
      {state === "thinking" && !reduce ? (
        <span className="absolute -top-1 -right-1 flex gap-0.5" style={{ fontSize: 0 }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block rounded-full bg-white shadow"
              style={{ width: size * 0.09, height: size * 0.09 }}
              animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </span>
      ) : null}
    </span>
  );
}
