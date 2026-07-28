"use client";

import { Link } from "@/components/locale-link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDict } from "@/components/i18n-provider";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  const dict = useDict();

  return (
    <nav aria-label={dict.common.breadcrumb} className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(last && "font-medium text-foreground")}
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!last ? (
                <ChevronRight className="size-3.5 text-muted-foreground/60" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
