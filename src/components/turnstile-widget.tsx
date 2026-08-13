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
 *
 * `onUnavailable` exists because the most common real-world failure is
 * silent. An ad blocker, privacy extension, VPN or corporate filter that
 * blocks `challenges.cloudflare.com` stops the script from ever running,
 * so no callback fires at all — not `error-callback`, not `onload`. The
 * visitor sees an ordinary form, fills it in, and only learns something
 * is wrong when the server answers 403. A reseller applicant hit exactly
 * this on 11 Aug 2026 and emailed us instead; everyone who does not write
 * in is simply lost. Hence the deadline: if no token has arrived by
 * RESOLVE_TIMEOUT_MS, the caller is told so it can offer another route.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

/**
 * Is the challenge configured at all? Callers gate their "waiting for
 * verification" UI on this — without a site key no token will ever arrive
 * and a form that waits for one would be permanently unsubmittable in
 * local dev.
 */
export const TURNSTILE_ENABLED = Boolean(SITE_KEY);

/**
 * How long to wait for a token before declaring the challenge unreachable.
 * Generous on purpose: Managed mode can show an interactive challenge, and
 * a slow connection plus a puzzle takes real seconds. This deadline is for
 * "the script never loaded", not for "the visitor is thinking".
 */
const RESOLVE_TIMEOUT_MS = 15_000;

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
  onUnavailable,
  className,
}: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  /** Fired once when no token can be obtained — blocked script, failed
   *  challenge, or the deadline above elapsing with nothing delivered. */
  onUnavailable?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const containerId = useId();

  useEffect(() => {
    if (!SITE_KEY) return;

    // Reported at most once per mount: a flapping challenge should not
    // redraw the caller's fallback notice on every retry.
    let unavailableReported = false;
    const reportUnavailable = () => {
      if (unavailableReported) return;
      unavailableReported = true;
      onUnavailable?.();
    };

    const deadline = window.setTimeout(reportUnavailable, RESOLVE_TIMEOUT_MS);

    const renderWidget = () => {
      if (!window.turnstile || !ref.current) return;
      if (widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        callback: (token: string) => {
          // A token arrived, so the challenge is reachable after all —
          // stand the deadline down before handing the token over.
          window.clearTimeout(deadline);
          unavailableReported = true;
          onVerify(token);
        },
        "expired-callback": () => {
          // Routine: tokens live ~5 minutes and the widget refreshes
          // itself. Drop the stale token, keep the form as it was.
          onExpire?.();
        },
        "error-callback": () => {
          onExpire?.();
          reportUnavailable();
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
      window.clearTimeout(deadline);
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
  }, [onVerify, onExpire, onUnavailable]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script
        src={`${SCRIPT_SRC}?onload=onloadTurnstileCallback`}
        strategy="afterInteractive"
        async
        defer
        // A blocked request rejects here in some browsers and silently
        // does nothing in others; the deadline covers the silent case.
        onError={() => onUnavailable?.()}
      />
      <div id={containerId} ref={ref} className={className} />
    </>
  );
}
