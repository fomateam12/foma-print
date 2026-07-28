import type { Metadata } from "next";
import { Link } from "@/components/locale-link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Check,
  Clock,
  MessageCircle,
  Package,
  Palette,
  ShieldCheck,
  Tag,
  TrendingUp,
  Truck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProductCount } from "@/data/catalog";
import { site } from "@/lib/site";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/pricing">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.pricing;

  return {
    title: t.metaTitle,
    description: t.metaDescription.replace("{cutoff}", dict.copy.orderCutoff),
    alternates: alternatesFor("/pricing", lang),
    openGraph: {
      title: `${t.metaTitle} · ${site.name}`,
      description: t.ogDescription,
    },
  };
}

export default async function PricingPage({
  params,
}: PageProps<"/[lang]/pricing">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.pricing;
  const cutoff = dict.copy.orderCutoff;
  const productCount = getProductCount();

  const included = [
    { icon: Palette, title: t.inc1Title, body: t.inc1Body },
    { icon: Truck, title: t.inc2Title, body: t.inc2Body },
    {
      icon: Clock,
      title: dict.copy.turnaroundShort,
      body: t.inc3Body.replace("{cutoff}", cutoff),
    },
    { icon: Boxes, title: t.inc4Title, body: t.inc4Body },
    { icon: ShieldCheck, title: t.inc5Title, body: t.inc5Body },
    { icon: TrendingUp, title: t.inc6Title, body: t.inc6Body },
  ];

  const steps = [
    { n: "01", icon: MessageCircle, title: t.step1Title, body: t.step1Body },
    { n: "02", icon: Tag, title: t.step2Title, body: t.step2Body },
    { n: "03", icon: Package, title: t.step3Title, body: t.step3Body },
  ];

  const tiers = [
    {
      name: t.tier1Name,
      tagline: t.tier1Tagline,
      points: [
        t.tier1Point1,
        t.tier1Point2,
        t.tier1Point3.replace("{cutoff}", cutoff),
        t.tier1Point4,
      ],
      cta: { label: dict.quote.metaTitle, href: "/quote" },
      featured: false,
    },
    {
      name: t.tier2Name,
      tagline: t.tier2Tagline,
      points: [t.tier2Point1, t.tier2Point2, t.tier2Point3, t.tier2Point4],
      cta: { label: dict.header.applyToSell, href: "/sell" },
      featured: true,
    },
    {
      name: t.tier3Name,
      tagline: t.tier3Tagline,
      points: [t.tier3Point1, t.tier3Point2, t.tier3Point3, t.tier3Point4],
      cta: { label: t.talkToUs, href: "/contact" },
      featured: false,
    },
  ];

  const faq = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A.replace("{email}", site.email) },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-32 right-[-8%] h-[34rem] w-[34rem] rounded-full bg-brand-muted/60 blur-3xl" />
        </div>
        <div className="container-px py-12 lg:py-16">
          <Breadcrumbs
            items={[
              { label: dict.common.home, href: "/" },
              { label: dict.footer.pricing },
            ]}
          />
          <Reveal className="mt-8 max-w-2xl">
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-brand-strong backdrop-blur-sm">
              <Tag className="size-3.5" />
              {t.eyebrow}
            </span>
            <h1 className="mt-5 text-display text-foreground">
              {t.headingBefore}
              <span className="text-metallic">{t.headingAccent}</span>
            </h1>
            <p className="mt-4 max-w-xl text-lead text-muted-foreground">
              {t.lead
                .replace("{count}", productCount.toLocaleString(lang))
                .replace("{cutoff}", cutoff)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/quote"
                className={cn(buttonVariants({ variant: "brand", size: "lg" }))}
              >
                {dict.quote.metaTitle}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/sell"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                {dict.header.applyToSell}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What's included */}
      <section className="container-px py-16 lg:py-20">
        <SectionHeader
          eyebrow={t.includedEyebrow}
          title={t.includedTitle}
          description={t.includedDescription}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {included.map((item, i) => (
            <Reveal key={item.title} delay={Math.min(i * 0.05, 0.3)}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-lg">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-muted text-brand-strong">
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How pricing works */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container-px py-16 lg:py-20">
          <SectionHeader
            align="center"
            eyebrow={dict.home.howEyebrow}
            title={t.howTitle}
            className="mx-auto"
          />
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.n} delay={Math.min(i * 0.08, 0.24)}>
                <div className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card">
                  <span className="font-heading text-3xl font-bold text-brand/25">
                    {step.n}
                  </span>
                  <span className="mt-3 grid size-11 place-items-center rounded-xl bg-brand-muted text-brand-strong">
                    <step.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="container-px py-16 lg:py-20">
        <SectionHeader
          eyebrow={t.tiersEyebrow}
          title={t.tiersTitle}
          description={t.tiersDescription}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={Math.min(i * 0.06, 0.18)}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-3xl border p-7 shadow-card",
                  tier.featured
                    ? "grain relative overflow-hidden border-ink-border bg-ink text-ink-foreground"
                    : "border-border bg-card",
                )}
              >
                {tier.featured ? (
                  <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-foreground">
                    {t.mostPopular}
                  </span>
                ) : null}
                <h3
                  className={cn(
                    "font-heading text-xl font-bold",
                    tier.featured ? "text-ink-foreground" : "text-foreground",
                  )}
                >
                  {tier.name}
                </h3>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    tier.featured ? "text-ink-muted" : "text-muted-foreground",
                  )}
                >
                  {tier.tagline}
                </p>
                <div
                  className={cn(
                    "mt-5 border-t pt-5",
                    tier.featured ? "border-ink-border" : "border-border",
                  )}
                >
                  <p
                    className={cn(
                      "font-heading text-2xl font-bold",
                      tier.featured ? "text-ink-foreground" : "text-foreground",
                    )}
                  >
                    {t.customQuote}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-xs",
                      tier.featured ? "text-ink-muted" : "text-muted-foreground",
                    )}
                  >
                    {t.pricedToVolume}
                  </p>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          tier.featured ? "text-brand" : "text-brand-strong",
                        )}
                      />
                      <span
                        className={cn(
                          tier.featured
                            ? "text-ink-foreground/90"
                            : "text-muted-foreground",
                        )}
                      >
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.cta.href}
                  className={cn(
                    buttonVariants({
                      variant: tier.featured ? "brand" : "outline",
                      size: "lg",
                    }),
                    "mt-7 w-full",
                  )}
                >
                  {tier.cta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container-px py-16 lg:py-20">
          <SectionHeader eyebrow={t.faqEyebrow} title={t.faqTitle} />
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {faq.map((item, i) => (
              <Reveal key={item.q} delay={Math.min(i * 0.05, 0.2)}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-px py-16 lg:py-20">
        <div className="grain relative overflow-hidden rounded-3xl border border-ink-border bg-ink px-8 py-12 text-ink-foreground sm:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-0"
          >
            <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-h2 text-ink-foreground">
              {t.ctaTitle}
            </h2>
            <p className="mt-4 text-lead text-ink-muted">
              {t.ctaBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/quote"
                className={cn(buttonVariants({ variant: "brand", size: "lg" }))}
              >
                {dict.quote.metaTitle}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-ink-border bg-white/5 text-ink-foreground hover:bg-white/10",
                )}
              >
                {t.contactTeam}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
