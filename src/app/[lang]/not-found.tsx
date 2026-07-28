"use client";

import { Link } from "@/components/locale-link";
import { useDict } from "@/components/i18n-provider";
import { Compass, Home, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const dict = useDict();
  const t = dict.notFound;

  return (
    <div className="container-px flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-brand-muted text-brand-strong">
        <Compass className="size-8" />
      </span>
      <p className="mt-6 font-heading text-5xl font-bold tracking-tight text-foreground">
        404
      </p>
      <h1 className="mt-3 font-heading text-2xl font-semibold text-foreground">
        {t.title}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        {t.body}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={cn(buttonVariants({ variant: "brand", size: "lg" }))}>
          <Home className="size-4" />
          {t.backHome}
        </Link>
        <Link
          href="/categories"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          <Compass className="size-4" />
          {dict.about.ctaBrowse}
        </Link>
        <Link
          href="/search"
          className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
        >
          <Search className="size-4" />
          {dict.search.ariaLabel}
        </Link>
      </div>
    </div>
  );
}
