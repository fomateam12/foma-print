"use client";

import dynamic from "next/dynamic";
import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useDict } from "@/components/i18n-provider";
import { chatReducer, initialChatState } from "@/chatbot/client-state";
import { FomaBotOrb, type OrbState } from "./orb";

// The panel (and Turnstile) load only when the visitor opens the chat, so
// the widget costs the page nothing until it is used.
const FomaBotPanel = dynamic(() => import("./panel"), { ssr: false });

/** How long the launcher shows "replying" after a reply arrives. */
const REPLYING_GLOW_MS = 1_500;

/** The greeting bubble appears this long after the page settles. */
const BUBBLE_DELAY_MS = 2_500;
const BUBBLE_DISMISSED_KEY = "fomabot.bubble.dismissed";

function bubbleDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(BUBBLE_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberBubbleDismissed() {
  try {
    window.sessionStorage.setItem(BUBBLE_DISMISSED_KEY, "1");
  } catch {
    // Storage blocked (private mode): the bubble simply returns next page.
  }
}

export function FomaBot() {
  const dict = useDict().fomabot;
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  // A mascot alone does not say "chat with me"; a speech bubble does.
  const [bubble, setBubble] = useState(false);
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

  useEffect(() => {
    if (!enabled || bubbleDismissed()) return;
    const timer = window.setTimeout(() => setBubble(true), BUBBLE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [enabled]);

  const openChat = () => {
    setBubble(false);
    rememberBubbleDismissed();
    setOpen(true);
  };

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
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={open ? dict.close : dict.open}
        aria-expanded={open}
        className="fixed right-4 bottom-4 z-50 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <FomaBotOrb state={launcherOrbState} size={88} />
      </button>
      <AnimatePresence>
        {bubble && !open ? (
          <motion.div
            data-floating
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            style={{ transformOrigin: "85% 100%" }}
            className="fixed right-4 bottom-[108px] z-50 w-[min(260px,calc(100vw-2rem))]"
          >
            <div className="relative rounded-2xl rounded-br-md border border-border bg-card px-4 py-3 pr-9 shadow-xl">
              <button
                type="button"
                onClick={openChat}
                className="block text-left focus-visible:outline-none"
              >
                <span className="block font-heading text-[15px] font-semibold text-foreground">
                  {dict.bubbleTitle}
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
                  {dict.bubbleBody}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBubble(false);
                  rememberBubbleDismissed();
                }}
                aria-label={dict.bubbleClose}
                className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-3.5" />
              </button>
              <span
                aria-hidden
                className="absolute -bottom-[7px] right-9 size-3.5 rotate-45 border-r border-b border-border bg-card"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
