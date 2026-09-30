"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useDict } from "@/components/i18n-provider";
import { stripLocale } from "@/lib/i18n";
import { FOMABOT_OPEN_EVENT, type FomaBotOpenDetail } from "./events";
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
const OPENED_KEY = "fomabot.opened";

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

type Dict = ReturnType<typeof useDict>["fomabot"];

/**
 * One contextual nudge per page type beats a generic "How can I help?":
 * the bubble speaks to what the visitor is looking at.
 */
function nudgeFor(pathname: string, dict: Dict): string {
  const path = stripLocale(pathname);
  if (path.startsWith("/product/")) return dict.nudgeProduct;
  if (/^\/(category|categories|search)(\/|$)/.test(path)) return dict.nudgeCatalog;
  if (path.startsWith("/sell")) return dict.nudgeSell;
  if (path.startsWith("/faq")) return dict.nudgeFaq;
  if (/^\/(pricing|quote)(\/|$)/.test(path)) return dict.nudgePricing;
  return dict.bubbleBody;
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
  // A question from an in-page button or a suggestion chip, sent by the panel
  // as soon as it can (after Turnstile on a first message).
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  // Unread badge + pulse until the visitor opens the chat once per session.
  // Read once on mount. Safe despite SSR: nothing renders until the status
  // check enables the bot, so server and first client render match.
  const [everOpened, setEverOpened] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return window.sessionStorage.getItem(OPENED_KEY) === "1";
    } catch {
      return false;
    }
  });
  const pathname = usePathname();

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

  // Reveal the in-page entry points (see ask-fomabot.tsx) only when the bot
  // is actually on, and read whether this session already opened the chat.
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.dataset.fomabot = "on";
    return () => {
      delete document.documentElement.dataset.fomabot;
    };
  }, [enabled]);

  const openChat = useCallback((question?: string) => {
    setBubble(false);
    rememberBubbleDismissed();
    setEverOpened(true);
    try {
      window.sessionStorage.setItem(OPENED_KEY, "1");
    } catch {
      // Private mode: the badge just comes back on the next page.
    }
    if (question) setPendingQuestion(question);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => openChat((e as CustomEvent<FomaBotOpenDetail>).detail?.question);
    window.addEventListener(FOMABOT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(FOMABOT_OPEN_EVENT, onOpen);
  }, [openChat]);

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
            pendingQuestion={pendingQuestion}
            setPendingQuestion={setPendingQuestion}
          />
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        data-floating
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={open ? dict.close : everOpened ? dict.open : `${dict.open} (${dict.unreadLabel})`}
        aria-expanded={open}
        // Full-screen panel on phones covers the corner; its own close button
        // takes over there, so the launcher steps aside.
        className={`fixed right-4 bottom-4 z-50 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${open ? "max-sm:hidden" : ""}`}
      >
        {!everOpened && !open ? (
          <span
            aria-hidden
            className="absolute inset-2 rounded-full bg-brand/25 motion-safe:animate-ping"
          />
        ) : null}
        <FomaBotOrb state={launcherOrbState} size={88} />
        {!everOpened && !open ? (
          <span
            aria-hidden
            className="absolute top-1 left-1 grid size-6 place-items-center rounded-full bg-brand text-xs font-bold text-white shadow ring-2 ring-background"
          >
            1
          </span>
        ) : null}
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
            className="fixed right-4 bottom-[108px] z-50 w-[min(280px,calc(100vw-2rem))]"
          >
            <div className="relative rounded-2xl rounded-br-md border border-border bg-card px-4 py-3 pr-9 shadow-xl">
              <button
                type="button"
                onClick={() => openChat()}
                className="block text-left focus-visible:outline-none"
              >
                <span className="block font-heading text-[15px] font-semibold text-foreground">
                  {dict.bubbleTitle}
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
                  {nudgeFor(pathname, dict)}
                </span>
              </button>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {dict.suggestions.slice(0, 2).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => openChat(q)}
                    className="rounded-full border border-brand/30 bg-brand-muted/50 px-2.5 py-1 text-xs font-medium text-brand-strong hover:bg-brand-muted"
                  >
                    {q}
                  </button>
                ))}
              </div>
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
