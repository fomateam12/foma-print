"use client";

import Script from "next/script";
import { useEffect, useId, useRef } from "react";

/**
 * Cloudflare Turnstile widget wrapper.
 *
 * Drops invisible in the page (Managed mode picks an interaction challenge
 * only when the heuristic suspects automation) and pushes the resulting
 * token through `onVerify` whenever the challenge resolves. The token is
 * single-use and expires server-side after ~5 minutes, so we re-render the
 * widget on every form mount and let it auto-refresh while the form is
 * open.
 *
 * Without `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set, the component renders
 * nothing — the form keeps working in local dev without an extra setup
 * step. The server-side verifier is the security boundary; client absence
 * just means the form will fail server validation, which is the right
 * fail-closed posture in production.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          appearance?: "always" | "execute" | "interaction-only";
          size?: "normal" | "compact" | "flexible";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export function TurnstileWidget({
  onVerify,
  onExpire,
  className,
}: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const containerId = useId();

  useEffect(() => {
    if (!SITE_KEY) return;
    const renderWidget = () => {
      if (!window.turnstile || !ref.current) return;
      if (widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        callback: onVerify,
        "expired-callback": () => {
          onExpire?.();
        },
        "error-callback": () => {
          onExpire?.();
        },
        theme: "auto",
        size: "flexible",
        appearance: "always",
      });
    };
    if (window.turnstile) {
      renderWidget();
    } else {
      // The script hasn't run yet — wire the official onload hook.
      window.onloadTurnstileCallback = renderWidget;
    }
    return () => {
      const id = widgetIdRef.current;
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          // ignore — widget was already torn down by the script
        }
        widgetIdRef.current = null;
      }
    };
  }, [onVerify, onExpire]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script
        src={`${SCRIPT_SRC}?onload=onloadTurnstileCallback`}
        strategy="afterInteractive"
        async
        defer
      />
      <div id={containerId} ref={ref} className={className} />
    </>
  );
}
