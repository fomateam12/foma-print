import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/locale-link";
import {
  ArrowRight,
  Factory,
  Gauge,
  PackageCheck,
  Palette,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { StatCounter } from "@/components/stat-counter";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProductCount } from "@/data/catalog";
import { site } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).about;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesFor("/about", lang),
    openGraph: {
      title: `${t.metaTitle} · ${site.name}`,
      description: t.ogDescription,
    },
  };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.about;

  const productCount = getProductCount();

  const values = [
    { icon: Palette, title: t.value1Title, body: t.value1Body },
    { icon: PackageCheck, title: t.value2Title, body: t.value2Body },
    { icon: Factory, title: t.value3Title, body: t.value3Body },
    { icon: Gauge, title: t.value4Title, body: t.value4Body },
  ];

  const stats = [
    { value: productCount, suffix: "+", label: t.stat1 },
    { value: 100, suffix: "%", label: t.stat2 },
    { value: 5, suffix: t.stat3Suffix, label: t.stat3 },
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
              { label: t.metaTitle },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-brand-strong backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              {t.eyebrow}
            </span>
            <h1 className="mt-5 text-display text-foreground">
              {t.headingBefore}
              <span className="text-metallic">{t.headingAccent}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lead text-muted-foreground">
              {t.lead
                .replace("{brand}", site.name)
                .replace("{legal}", site.legalName)}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="container-px py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={Math.min(i * 0.06, 0.18)}>
              <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
                <div className="font-heading text-3xl font-bold text-foreground">
                  <StatCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="container-px pb-4">
        <div className="grid gap-10 rounded-3xl border border-border bg-secondary/30 p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <SectionHeader
              eyebrow={t.missionEyebrow}
              title={t.missionTitle.replace("{brand}", site.name)}
            />
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {t.missionP1.replace("{legal}", site.legalName)}
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {t.missionP2}
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {t.missionP3
                .replace("{legal}", site.legalName)
                .replace("{count}", productCount.toLocaleString(lang))
                .replace("{cutoff}", dict.copy.orderCutoff)}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={Math.min(i * 0.05, 0.2)}>
                <div className="h-full rounded-2xl border border-border bg-background p-5 shadow-card">
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Seller portal note */}
      <section className="container-px py-12">
        <Reveal className="flex flex-col items-start gap-6 rounded-3xl border border-border bg-card p-8 shadow-card sm:flex-row sm:items-center sm:justify-between lg:p-10">
          <div className="max-w-xl">
            <span className="eyebrow text-brand-strong">{t.portalEyebrow}</span>
            <h2 className="mt-2 text-h3 text-foreground">{t.portalTitle}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {t.portalBody}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/sell"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              {dict.header.applyToSell}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="container-px py-14 lg:py-20">
        <div className="grain relative overflow-hidden rounded-3xl border border-ink-border bg-ink px-8 py-12 text-ink-foreground sm:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-0"
          >
            <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-h2 text-ink-foreground">{t.ctaTitle}</h2>
            <p className="mt-4 text-lead text-ink-muted">
              {t.ctaBody.replace("{cutoff}", dict.copy.orderCutoff)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sell"
                className={cn(buttonVariants({ variant: "brand", size: "lg" }))}
              >
                {dict.header.applyToSell}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/categories"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-ink-border bg-white/5 text-ink-foreground hover:bg-white/10",
                )}
              >
                <Truck className="size-4" />
                {t.ctaBrowse}
              </Link>
            </div>
          </div>
          <ShieldCheck
            className="absolute -right-6 -top-6 size-48 text-white/5"
            aria-hidden="true"
          />
        </div>
      </section>
    </div>
  );
}
