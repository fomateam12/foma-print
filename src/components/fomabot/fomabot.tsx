"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDict } from "@/components/i18n-provider";
import { FomaBotOrb } from "./orb";

// The panel (and Turnstile) load only when the visitor opens the chat, so
// the widget costs the page nothing until it is used.
const FomaBotPanel = dynamic(() => import("./panel"), { ssr: false });

export function FomaBot() {
  const dict = useDict().fomabot;
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const check = () =>
      fetch("/api/chat/status")
        .then((r) => r.json())
        .then((b: { enabled?: boolean }) => setEnabled(Boolean(b.enabled)))
        .catch(() => setEnabled(false));
    const idle = typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback(check)
      : window.setTimeout(check, 1500);
    return () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle as number);
      else window.clearTimeout(idle as number);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <AnimatePresence>{open ? <FomaBotPanel onClose={() => setOpen(false)} /> : null}</AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? dict.close : dict.open}
        aria-expanded={open}
        className="fixed right-4 bottom-4 z-50 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <FomaBotOrb state="idle" size={60} />
      </button>
    </>
  );
}
