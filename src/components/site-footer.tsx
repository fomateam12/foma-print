import { Mail, MapPin, ArrowRight } from "lucide-react";
import { Link } from "@/components/locale-link";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { getCategories } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { categoryName } from "@/lib/catalog-i18n";

export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const categories = getCategories();
  const year = new Date().getFullYear();

  const platformLinks = [
    { label: dict.footer.howItWorks, href: "/#how" },
    { label: dict.footer.pricing, href: "/pricing" },
    { label: dict.footer.applyToSell, href: "/sell" },
    { label: dict.footer.requestQuote, href: "/quote" },
    { label: dict.footer.guides, href: "/guides" },
  ];

  const companyLinks = [
    { label: dict.footer.about, href: "/about" },
    { label: dict.footer.contact, href: "/contact" },
    { label: dict.footer.privacyPolicy, href: "/privacy" },
    { label: dict.footer.termsOfService, href: "/terms" },
  ];

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div aria-hidden="true" className="rule-metallic" />
      <div className="container-px py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {dict.site.description}
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-foreground"
                >
                  <Mail className="size-4 text-brand-strong" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 text-brand-strong" />
                {site.address.street}, {site.address.city}, {site.address.state}
              </li>
            </ul>
            {site.social.length > 0 ? (
              <div className="flex items-center gap-2">
                {site.social.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-brand-strong"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Catalog */}
          <div>
            <h2 className="font-heading text-sm font-semibold text-foreground">
              {dict.footer.catalog}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {categoryName(c.name, locale)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="font-medium text-brand-strong hover:underline"
                >
                  {dict.footer.allCategories}
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h2 className="font-heading text-sm font-semibold text-foreground">
              {dict.footer.platform}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {platformLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + CTA */}
          <div>
            <h2 className="font-heading text-sm font-semibold text-foreground">
              {dict.footer.company}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/sell"
              className={cn(buttonVariants({ variant: "brand", size: "sm" }), "mt-5")}
            >
              {dict.footer.applyToSell}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-px flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {site.legalName} · {dict.footer.established}{" "}
            {site.foundedYear} · {site.location} · {dict.site.madeIn}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-foreground">
              {dict.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              {dict.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
