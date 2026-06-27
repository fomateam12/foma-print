import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/logo";
import {
  InstagramIcon,
  FacebookIcon,
  PinterestIcon,
} from "@/components/social-icons";
import { getCategories } from "@/data/catalog";
import { site } from "@/lib/site";

const COMPANY_LINKS = [
  { label: "About FomaPrint", href: "/about" },
  { label: "Custom Orders", href: "/custom-order" },
  { label: "Become a Reseller", href: "/sell" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  const categories = getCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="container-px py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.description}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid size-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-brand-strong"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid size-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-brand-strong"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href={site.social.pinterest}
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="grid size-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-brand-strong"
              >
                <PinterestIcon className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Shop
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="font-medium text-brand-strong hover:underline"
                >
                  All categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Company
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {COMPANY_LINKS.map((l) => (
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

          <div>
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Get in touch
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-foreground"
                >
                  <Mail className="size-4 text-brand-strong" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-2.5 transition-colors hover:text-foreground"
                >
                  <Phone className="size-4 text-brand-strong" />
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 text-brand-strong" />
                Made to order in the USA
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-px flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
