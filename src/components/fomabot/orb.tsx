"use client";

import { motion, useReducedMotion } from "framer-motion";

export type OrbState = "idle" | "thinking" | "replying";
export type OrbVariant = "aurora" | "pulse" | "blob";

/** Chosen by the operator from the /styleguide comparison (Task 7, Step 3). */
export const DEFAULT_ORB_VARIANT: OrbVariant = "aurora";

const GRADIENT =
  "conic-gradient(from 0deg, var(--rust), var(--rust-bright), #f3c9a8, var(--rust), var(--ink), var(--rust))";

const SPEED: Record<OrbState, number> = { idle: 9, thinking: 2.2, replying: 4 };

export function FomaBotOrb({
  state,
  variant = DEFAULT_ORB_VARIANT,
  size = 56,
}: {
  state: OrbState;
  variant?: OrbVariant;
  size?: number;
}) {
  const reduce = useReducedMotion();
  const glow = state === "replying" ? 0.75 : state === "thinking" ? 0.55 : 0.35;

  const shell = (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-full"
      style={{
        boxShadow: `0 0 ${size * 0.45}px color-mix(in oklch, var(--rust) ${Math.round(glow * 100)}%, transparent)`,
      }}
    />
  );

  if (reduce) {
    return (
      <span className="relative inline-block rounded-full" style={{ width: size, height: size, background: GRADIENT }}>
        {shell}
      </span>
    );
  }

  if (variant === "aurora") {
    return (
      <span className="relative inline-block overflow-hidden rounded-full" style={{ width: size, height: size }}>
        <motion.span
          className="absolute -inset-1/4 blur-md"
          style={{ background: GRADIENT }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: SPEED[state] }}
        />
        <motion.span
          className="absolute inset-[18%] rounded-full bg-white/25 blur-sm"
          animate={{ scale: state === "thinking" ? [1, 1.25, 1] : [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: SPEED[state] / 2 }}
        />
        {shell}
      </span>
    );
  }

  if (variant === "pulse") {
    return (
      <motion.span
        className="relative inline-block rounded-full"
        style={{
          width: size,
          height: size,
          background: "radial-gradient(circle at 35% 30%, #f3c9a8, var(--rust-bright) 45%, var(--rust) 70%, var(--ink))",
        }}
        animate={{ scale: state === "thinking" ? [1, 1.12, 0.96, 1] : [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: SPEED[state] / 2.5, ease: "easeInOut" }}
      >
        {shell}
      </motion.span>
    );
  }

  // blob: a morphing organic shape
  return (
    <motion.span
      className="relative inline-block"
      style={{ width: size, height: size, background: GRADIENT }}
      animate={{
        borderRadius: [
          "50% 50% 50% 50%",
          "58% 42% 55% 45%",
          "45% 55% 42% 58%",
          "50% 50% 50% 50%",
        ],
        rotate: [0, 90, 180, 360],
      }}
      transition={{ repeat: Infinity, duration: SPEED[state], ease: "easeInOut" }}
    >
      {shell}
    </motion.span>
  );
}
