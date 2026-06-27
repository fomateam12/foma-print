"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  ChevronRight,
  ArrowRight,
  Phone,
  Sparkles,
  PenTool,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { SearchBox } from "@/components/search-box";
import { Logo } from "@/components/logo";
import { CategoryIcon } from "@/components/category-icon";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import type { IconKey } from "@/data/types";

export interface NavCategory {
  name: string;
  slug: string;
  blurb: string;
  icon: IconKey;
  subcategories: { name: string; slug: string }[];
}

const UTILITY_LINKS = [
  { label: "Resellers", href: "/sell" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function HeaderNav({ nav }: { nav: NavCategory[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Announcement bar (scrolls away) */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-px flex h-9 items-center justify-center gap-2 text-center text-[0.78rem] font-medium">
          <Sparkles className="size-3.5 text-brand" aria-hidden="true" />
          <span>
            Free design proof on every custom order · Made to order in the USA
          </span>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-200",
          scrolled
            ? "border-border bg-background/85 shadow-sm backdrop-blur-md"
            : "border-transparent bg-background",
        )}
      >
        <div className="container-px flex h-16 items-center gap-3 lg:h-20 lg:gap-5">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="lg:hidden"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm gap-0 p-0">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle className="sr-only">Site navigation</SheetTitle>
                <Logo onClick={() => setMobileOpen(false)} />
              </SheetHeader>

              <div className="p-4">
                <SearchBox onNavigate={() => setMobileOpen(false)} />
              </div>

              <nav className="flex-1 overflow-y-auto px-2 pb-4">
                {nav.map((cat) => (
                  <details key={cat.slug} className="group border-b border-border/60">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-md px-3 py-3 outline-none hover:bg-muted focus-visible:bg-muted">
                      <span className="flex items-center gap-2.5 font-medium text-foreground">
                        <CategoryIcon
                          icon={cat.icon}
                          className="size-4 text-brand-strong"
                        />
                        {cat.name}
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="pb-2">
                      <Link
                        href={`/category/${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-md py-2 pl-10 pr-3 text-sm font-medium text-brand-strong hover:bg-muted"
                      >
                        Shop all {cat.name}
                      </Link>
                      {cat.subcategories.map((sc) => (
                        <Link
                          key={sc.slug}
                          href={`/category/${cat.slug}/${sc.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-md py-2 pl-10 pr-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {sc.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                ))}

                <div className="mt-3 flex flex-col gap-1 px-1">
                  <Link
                    href="/custom-order"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    Custom Orders
                  </Link>
                  {UTILITY_LINKS.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </nav>

              <SheetFooter className="border-t border-border">
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <Phone className="size-4 text-brand-strong" />
                  {site.phoneDisplay}
                </a>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Logo />

          {/* Desktop mega menu */}
          <NavigationMenu className="hidden lg:flex" align="start">
            <NavigationMenuList>
              {nav.map((cat) => (
                <NavigationMenuItem key={cat.slug}>
                  <NavigationMenuTrigger>{cat.name}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[680px] max-w-[88vw] grid-cols-[1.05fr_2fr] gap-4 p-4">
                      <Link
                        href={`/category/${cat.slug}`}
                        className="group/promo relative flex flex-col justify-between gap-6 overflow-hidden rounded-xl bg-gradient-to-br from-brand-muted to-secondary p-5 outline-none ring-1 ring-border focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div className="space-y-2">
                          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-background/70 text-brand-strong shadow-sm">
                            <CategoryIcon icon={cat.icon} className="size-5" />
                          </span>
                          <h3 className="font-heading text-base font-semibold text-foreground">
                            {cat.name}
                          </h3>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {cat.blurb}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-strong">
                          Browse all
                          <ArrowRight className="size-4 transition-transform group-hover/promo:translate-x-0.5" />
                        </span>
                      </Link>

                      <ul className="grid grid-cols-2 content-start gap-0.5">
                        {cat.subcategories.map((sc) => (
                          <li key={sc.slug}>
                            <NavigationMenuLink
                              render={
                                <Link
                                  href={`/category/${cat.slug}/${sc.slug}`}
                                />
                              }
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {sc.name}
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}

              {UTILITY_LINKS.map((l) => (
                <NavigationMenuItem key={l.href}>
                  <NavigationMenuLink
                    render={<Link href={l.href} />}
                    className="h-9 px-2.5 font-medium"
                  >
                    {l.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right utilities */}
          <div className="ml-auto flex items-center gap-2">
            <SearchBox className="hidden w-48 md:block lg:w-64 xl:w-72" />
            <Link
              href="/custom-order"
              className={cn(
                buttonVariants({ size: "default" }),
                "hidden sm:inline-flex",
              )}
            >
              <PenTool className="size-4" />
              Custom order
            </Link>
            <Link
              href="/custom-order"
              aria-label="Request a custom order"
              className={cn(buttonVariants({ size: "icon" }), "sm:hidden")}
            >
              <PenTool className="size-4" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
