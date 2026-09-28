"use client";

import dynamic from "next/dynamic";
import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDict } from "@/components/i18n-provider";
import { chatReducer, initialChatState } from "@/chatbot/client-state";
import { FomaBotOrb, type OrbState } from "./orb";

// The panel (and Turnstile) load only when the visitor opens the chat, so
// the widget costs the page nothing until it is used.
const FomaBotPanel = dynamic(() => import("./panel"), { ssr: false });

/** How long the launcher shows "replying" after a reply arrives. */
const REPLYING_GLOW_MS = 1_500;

export function FomaBot() {
  const dict = useDict().fomabot;
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  // Lifted out of the lazy-loaded panel so closing it (or pressing Esc)
  // never wipes the conversation — this state outlives the panel's mount.
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const [draft, setDraft] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Launcher orb state: "thinking" while a request is in flight, briefly
  // "replying" once the answer arrives, "idle" otherwise.
  const [justReplied, setJustReplied] = useState(false);
  const prevStatusRef = useRef(state.status);
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = state.status;
    if (prevStatus === "sending" && state.status === "idle") {
      setJustReplied(true);
      const timer = window.setTimeout(() => setJustReplied(false), REPLYING_GLOW_MS);
      return () => window.clearTimeout(timer);
    }
  }, [state.status]);
  const launcherOrbState: OrbState = state.status === "sending" ? "thinking" : justReplied ? "replying" : "idle";

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
      <AnimatePresence>
        {open ? (
          <FomaBotPanel
            onClose={() => setOpen(false)}
            state={state}
            dispatch={dispatch}
            draft={draft}
            setDraft={setDraft}
            turnstileToken={turnstileToken}
            setTurnstileToken={setTurnstileToken}
          />
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        data-floating
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? dict.close : dict.open}
        aria-expanded={open}
        className="fixed right-4 bottom-4 z-50 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <FomaBotOrb state={launcherOrbState} size={60} />
      </button>
    </>
  );
}
