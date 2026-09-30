"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch } from "react";
import { motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { useDict, useLocale } from "@/components/i18n-provider";
import { TurnstileWidget, TURNSTILE_ENABLED } from "@/components/turnstile-widget";
import { localizedPath } from "@/lib/i18n";
import { site } from "@/lib/site";
import type { ChatEvent, ChatState } from "@/chatbot/client-state";
import type { ChatAction } from "@/chatbot/model";
import { MAX_CONVERSATION, MAX_MESSAGE_CHARS } from "@/chatbot/request";
import { FomaBotOrb } from "./orb";

export default function FomaBotPanel({
  onClose,
  state,
  dispatch,
  draft,
  setDraft,
  turnstileToken,
  setTurnstileToken,
}: {
  onClose: () => void;
  // Lifted into FomaBot so closing (unmounting this lazy-loaded panel) or
  // pressing Esc never wipes the conversation.
  state: ChatState;
  dispatch: Dispatch<ChatEvent>;
  draft: string;
  setDraft: (draft: string) => void;
  turnstileToken: string | null;
  setTurnstileToken: (token: string | null) => void;
}) {
  const dict = useDict().fomabot;
  const lang = useLocale();
  const [turnstileUnavailable, setTurnstileUnavailable] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [state.messages.length, state.status]);

  // A stable identity per callback: the effect in TurnstileWidget depends on
  // these and tears the widget down + re-challenges on every change, so an
  // inline arrow function here caused a re-render loop (findings #1, #3).
  const onTurnstileVerify = useCallback(
    (token: string) => {
      setTurnstileToken(token);
      // A late token overrides an earlier "unavailable": the challenge came
      // through after all, so put the normal path back.
      setTurnstileUnavailable(false);
    },
    [setTurnstileToken],
  );
  const onTurnstileExpire = useCallback(() => setTurnstileToken(null), [setTurnstileToken]);
  const onTurnstileUnavailable = useCallback(() => setTurnstileUnavailable(true), []);

  const needsTurnstile = state.messages.length === 0 && TURNSTILE_ENABLED;
  const canSend =
    draft.trim().length > 0 &&
    state.status !== "sending" &&
    state.messages.length < MAX_CONVERSATION &&
    (!needsTurnstile || turnstileToken !== null);

  async function send() {
    if (!canSend) return;
    const content = draft.trim();
    setDraft("");
    const messages = [...state.messages.map(({ role, content }) => ({ role, content })), { role: "user" as const, content }];
    const isFirstMessage = messages.length === 1;
    dispatch({ type: "send", content });
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lang,
          messages,
          cfTurnstileToken: isFirstMessage ? turnstileToken ?? undefined : undefined,
          sessionToken: state.sessionToken,
        }),
      });
      // The token is single-use. Whatever the server did with it — accepted,
      // rejected, or something else went wrong — resending it on a retry
      // cannot work, so clear it after any response to the request that
      // carried it, not only on a 403.
      if (isFirstMessage) setTurnstileToken(null);
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        if (typeof body.reply === "string") {
          dispatch({ type: "reply", reply: body.reply, action: body.action ?? null, sessionToken: body.sessionToken });
        } else {
          dispatch({ type: "error", error: "network" });
        }
      } else {
        const map: Record<number, NonNullable<ChatState["error"]>> = { 429: "rate_limited", 403: "verification_failed", 503: "unavailable" };
        dispatch({ type: "error", error: map[res.status] ?? "network" });
      }
    } catch {
      dispatch({ type: "error", error: "network" });
    }
  }

  const errorText: Record<NonNullable<ChatState["error"]>, string> = {
    rate_limited: dict.rateLimited,
    verification_failed: dict.verificationFailed,
    unavailable: dict.unavailable,
    network: dict.network,
  };

  const actionLink = (action: ChatAction) => {
    const map = {
      quote: { href: localizedPath("/quote", lang), label: dict.actionQuote },
      reseller: { href: localizedPath("/sell", lang), label: dict.actionReseller },
      contact: { href: `mailto:${site.email}`, label: dict.actionContact },
    } as const;
    const { href, label } = map[action];
    return (
      <a href={href} className="mt-2 inline-flex rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
        {label}
      </a>
    );
  };

  return (
    <motion.div
      // Non-modal on purpose: the page stays usable behind the chat, so no
      // focus trap and no aria-modal (the spec's "focus-trapped" was dropped).
      role="dialog"
      aria-label={dict.name}
      // Scoped to the dialog, not `window`: Esc anywhere on the page used to
      // close (and, with state previously local to this component, wipe)
      // the chat. Only close when focus is already inside the panel.
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-floating
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="fixed right-4 bottom-24 z-50 flex h-[min(620px,calc(100dvh-8rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
    >
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <FomaBotOrb state={state.status === "sending" ? "thinking" : "idle"} size={40} />
        <span className="font-heading font-semibold">{dict.name}</span>
        <button type="button" onClick={onClose} aria-label={dict.close} className="ml-auto rounded-full p-1.5 hover:bg-muted">
          <X className="size-4" />
        </button>
      </header>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
        <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm">{dict.greeting}</p>
        {state.messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                  : "max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm"
              }
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
              {m.role === "assistant" && m.action ? actionLink(m.action) : null}
            </div>
          </div>
        ))}
        {state.status === "sending" ? <p className="text-xs text-muted-foreground">{dict.thinking}</p> : null}
        {state.status === "error" && state.error ? (
          <p role="alert" className="text-xs text-destructive">{errorText[state.error]}</p>
        ) : null}
        {state.messages.length >= MAX_CONVERSATION ? <p className="text-xs text-muted-foreground">{dict.limitReached}</p> : null}
      </div>

      {needsTurnstile ? (
        <>
          <TurnstileWidget
            className="px-4"
            onVerify={onTurnstileVerify}
            onExpire={onTurnstileExpire}
            onUnavailable={onTurnstileUnavailable}
          />
          {turnstileUnavailable ? (
            <p role="alert" className="px-4 text-xs text-destructive">
              {dict.turnstileUnavailable}
            </p>
          ) : null}
        </>
      ) : null}

      <form
        className="border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={draft}
            maxLength={MAX_MESSAGE_CHARS}
            rows={1}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder={dict.placeholder}
            className="max-h-32 flex-1 resize-none rounded-2xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label={dict.send}
            className="rounded-full bg-primary p-2.5 text-primary-foreground disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-muted-foreground">{dict.privacyNote}</p>
      </form>
    </motion.div>
  );
}
