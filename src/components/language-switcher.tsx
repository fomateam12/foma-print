"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { Globe } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT, localizedPath, stripLocale } from "@/lib/i18n";

/**
 * Language chooser. Renders real `<a>` links to the same page in the other
 * locale (not a client-side toggle) so the choice is shareable, bookmarkable
 * and visible to crawlers — the hreflang pair in the head points at exactly
 * these URLs.
 *
 * Uses `next/link` directly rather than the locale-aware wrapper: the whole
 * job here is to leave the current locale, so the automatic prefixing would
 * fight it.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  // The query-preserving variant reads useSearchParams, which opts its subtree
  // out of static prerendering. The header sits on every page, so it is
  // wrapped here instead of at each call site: pages still prerender, and the
  // filter-preserving links swap in on hydration.
  return (
    <Suspense fallback={<Switcher className={className} suffix="" />}>
      <SwitcherWithQuery className={className} />
    </Suspense>
  );
}

function SwitcherWithQuery({ className }: { className?: string }) {
  const query = useSearchParams()?.toString();
  return <Switcher className={className} suffix={query ? `?${query}` : ""} />;
}

function Switcher({
  className,
  suffix,
}: {
  className?: string;
  suffix: string;
}) {
  const { locale, dict } = useI18n();
  const pathname = usePathname() ?? "/";
  const basePath = stripLocale(pathname);

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="group"
      aria-label={dict.common.changeLanguage}
    >
      <Globe
        className="mr-1 size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <NextLink
            key={l}
            href={`${localizedPath(basePath, l)}${suffix}`}
            hrefLang={l}
            aria-current={active ? "true" : undefined}
            title={LOCALE_LABELS[l]}
            className={cn(
              "rounded-md px-1.5 py-1 text-xs font-semibold transition-colors",
              active
                ? "bg-brand-muted text-brand-strong"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span aria-hidden="true">{LOCALE_SHORT[l]}</span>
            <span className="sr-only">{LOCALE_LABELS[l]}</span>
          </NextLink>
        );
      })}
    </div>
  );
}
