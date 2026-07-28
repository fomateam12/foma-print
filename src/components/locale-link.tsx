"use client";

import NextLink from "next/link";
import { forwardRef } from "react";
import { useLocale } from "@/components/i18n-provider";
import { localizedPath } from "@/lib/i18n";

type NextLinkProps = React.ComponentPropsWithoutRef<typeof NextLink>;

/**
 * Drop-in replacement for `next/link` that prefixes internal hrefs with the
 * active locale (`/pricing` → `/tr/pricing` when Turkish is on, unchanged in
 * English). External URLs, anchors and `mailto:`/`tel:` pass through.
 *
 * Every internal link in the app imports this instead of `next/link` so a
 * visitor reading Turkish never falls back into English by clicking around.
 */
const Link = forwardRef<HTMLAnchorElement, NextLinkProps>(function Link(
  { href, ...props },
  ref,
) {
  const locale = useLocale();
  const localized =
    typeof href === "string"
      ? localizedPath(href, locale)
      : href.pathname
        ? { ...href, pathname: localizedPath(href.pathname, locale) }
        : href;

  return <NextLink ref={ref} href={localized} {...props} />;
});

export { Link };
export default Link;
