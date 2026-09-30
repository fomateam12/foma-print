"use client";

import { MessageCircle } from "lucide-react";
import { useDict } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import { openFomaBot } from "./events";
import { FomaBotOrb } from "./orb";

/**
 * In-page entry points to FomaBot. A corner launcher alone gets about 1% of
 * visitors to engage; the same assistant placed where people are already
 * reading (header, product page, FAQ) is what moves that number.
 *
 * Hidden until the widget reports the bot is enabled (it sets
 * `data-fomabot="on"` on <html>), so nothing points at a switched-off bot.
 */
const SHOW_WHEN_ON = "hidden [html[data-fomabot=on]_&]:flex";

export function AskFomaBotNav({ className }: { className?: string }) {
  const dict = useDict().fomabot;
  return (
    <button
      type="button"
      onClick={() => openFomaBot()}
      className={cn(
        SHOW_WHEN_ON,
        "items-center gap-1.5 rounded-full border border-border bg-card py-1 pr-3 pl-1 text-sm font-medium text-foreground shadow-soft transition hover:border-brand/40 hover:bg-brand-muted/60",
        className,
      )}
    >
      <FomaBotOrb state="idle" size={30} />
      <span className="hidden lg:inline">{dict.askNav}</span>
      <MessageCircle className="size-4 text-brand-strong lg:hidden" aria-hidden />
      <span className="sr-only lg:hidden">{dict.askNav}</span>
    </button>
  );
}

export function AskFomaBotCard({
  title,
  body,
  question,
  className,
}: {
  title: string;
  body: string;
  /** Sent straight away when the chat opens. */
  question?: string;
  className?: string;
}) {
  const dict = useDict().fomabot;
  return (
    <div
      className={cn(
        SHOW_WHEN_ON,
        "items-center gap-4 rounded-2xl border border-brand/25 bg-brand-muted/40 p-4",
        className,
      )}
    >
      <FomaBotOrb state="idle" size={64} />
      <div className="min-w-0 flex-1">
        <p className="font-heading font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{body}</p>
      </div>
      <button
        type="button"
        onClick={() => openFomaBot({ question })}
        className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft transition hover:opacity-90"
      >
        {dict.askButton}
      </button>
    </div>
  );
}
