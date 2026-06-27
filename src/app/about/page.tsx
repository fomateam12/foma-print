import type { Metadata } from "next";
import Link from "next/link";
import { Award, Factory, HeartHandshake, Leaf, Sparkles, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProductCount } from "@/data/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.legalName} — the team behind ${site.name}, creating personalized, laser-engraved gifts and premium drinkware made to order in the USA.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About · ${site.name}`,
    description: `Personalized, laser-engraved gifts made to order in the USA by ${site.legalName}.`,
  },
};

const VALUES = [
  {
    icon: Award,
    title: "Craftsmanship first",
    body: "Every piece is laser-engraved with precision for a crisp, permanent finish that lasts a lifetime.",
  },
  {
    icon: HeartHandshake,
    title: "Made personal",
    body: "Names, dates, monograms and logos — we turn everyday objects into meaningful keepsakes.",
  },
  {
    icon: Factory,
    title: "Made in the USA",
    body: "Produced to order in our American studio, so quality and turnaround stay in our control.",
  },
  {
    icon: Leaf,
    title: "Built to last",
    body: "Premium materials and engraving that never fades, peels or washes away.",
  },
];

const STATS = [
  { label: "Products to personalize", value: "2,000+" },
  { label: "Made to order", value: "In the USA" },
  { label: "Free design proof", value: "Every order" },
];

export default function AboutPage() {
  const productCount = getProductCount();

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-brand-muted/60 to-background">
        <div className="container-px py-12 lg:py-16">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <div className="mt-6 max-w-3xl">
            <span className="eyebrow text-brand-strong">
              <Sparkles className="size-4" />
              Our story
            </span>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Gifts that mean something, made to last
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {site.name} is the personalized gifting brand from {site.legalName}.
              We believe the best gifts feel made for one person — so we
              laser-engrave premium drinkware, cutting boards, frames, journals
              and keepsakes with the names, dates and logos that matter most.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-px py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-6 text-center"
            >
              <div className="font-heading text-3xl font-bold text-foreground">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="container-px pb-4">
        <div className="grid gap-10 rounded-3xl border border-border bg-secondary/30 p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Why we started {site.name}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We started with a simple idea: a personalized gift carries more
              meaning than anything off the shelf. What began as engraving for
              friends and family grew into a full catalog of over{" "}
              {productCount.toLocaleString()} customizable products for weddings,
              birthdays, corporate gifting and everything in between.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Today we help individuals, event planners and businesses create
              one-of-a-kind pieces — backed by free design proofs, fast U.S.
              production and friendly support at every step.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-background p-5"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-brand-muted text-brand-strong">
                  <v.icon className="size-5" />
                </span>
                <h3 className="mt-3 font-heading text-sm font-semibold text-foreground">
                  {v.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-px py-14 lg:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-12 text-primary-foreground sm:px-14">
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-heading text-3xl font-bold tracking-tight">
              Ready to create something personal?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-primary-foreground/80">
              Browse the catalog or start a custom order — we&apos;ll send a free
              proof before anything is engraved.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/categories"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
              >
                Shop all categories
              </Link>
              <Link
                href="/custom-order"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-brand text-brand-foreground hover:bg-brand/90",
                )}
              >
                Start a custom order
              </Link>
            </div>
          </div>
          <Users
            className="absolute -right-6 -top-6 size-48 text-primary-foreground/5"
            aria-hidden="true"
          />
        </div>
      </section>
    </div>
  );
}
