import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/locale-link";
import {
  ArrowRight,
  Tags,
  PackageCheck,
  Rocket,
  Truck,
  Headset,
  DollarSign,
  Send,
  Store,
  ShieldCheck,
  Clock,
  MapPin,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { StatCounter } from "@/components/stat-counter";
import { SellerApplicationForm } from "@/components/seller-application-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategories, getProductCount } from "@/data/catalog";
import { site } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/sell">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).sell;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesFor("/sell", lang),
    openGraph: {
      title: `${t.metaTitle} · ${site.name}`,
      description: t.ogDescription,
    },
  };
}

export default async function SellPage({ params }: PageProps<"/[lang]/sell">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.sell;

  const productCount = getProductCount();
  const categoryCount = getCategories().length;

  const benefits = [
    { icon: Tags, title: t.benefit1Title, body: t.benefit1Body },
    { icon: PackageCheck, title: t.benefit2Title, body: t.benefit2Body },
    {
      icon: Rocket,
      title: dict.copy.turnaroundShort,
      body: t.benefit3Body.replace("{cutoff}", dict.copy.orderCutoff),
    },
    { icon: Truck, title: t.benefit4Title, body: t.benefit4Body },
    { icon: Headset, title: t.benefit5Title, body: t.benefit5Body },
    { icon: DollarSign, title: t.benefit6Title, body: t.benefit6Body },
  ];

  const applySteps = [
    { n: "01", icon: Send, title: t.applyStep1Title, body: t.applyStep1Body },
    { n: "02", icon: Tags, title: t.applyStep2Title, body: t.applyStep2Body },
    { n: "03", icon: Store, title: t.applyStep3Title, body: t.applyStep3Body },
  ];

  return (
    <div>
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-40 right-[-10%] h-[40rem] w-[40rem] rounded-full bg-brand-muted/70 blur-3xl" />
          <div className="absolute left-[-15%] top-40 h-[28rem] w-[28rem] rounded-full bg-secondary blur-3xl" />
        </div>

        <div className="container-px py-12 lg:py-20">
          <Breadcrumbs
            items={[
              { label: dict.common.home, href: "/" },
              { label: t.metaTitle },
            ]}
          />

          <Reveal className="mt-8 max-w-3xl">
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-brand-strong backdrop-blur-sm">
              <Store className="size-3.5" />
              {t.eyebrow}
            </span>
            <h1 className="mt-5 text-display text-foreground">
              {t.headingBefore}
              <span className="text-metallic">{t.headingAccent}</span>
              {t.headingAfter}
            </h1>
            <p className="mt-5 max-w-2xl text-lead text-muted-foreground">
              {t.lead
                .replace("{legal}", site.legalName)
                .replace("{count}", productCount.toLocaleString(lang))}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#apply"
                className={cn(buttonVariants({ variant: "brand", size: "lg" }))}
              >
                {dict.header.applyToSell}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/quote"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                {dict.quote.metaTitle}
              </Link>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              <div>
                <dt className="sr-only">{t.statProducts}</dt>
                <dd className="font-heading text-2xl font-bold text-foreground">
                  <StatCounter value={productCount} suffix="+" />
                </dd>
                <p className="text-xs text-muted-foreground">{t.statProducts}</p>
              </div>
              <div className="border-l border-border pl-8">
                <dt className="sr-only">{t.statCategories}</dt>
                <dd className="font-heading text-2xl font-bold text-foreground">
                  <StatCounter value={categoryCount} />
                </dd>
                <p className="text-xs text-muted-foreground">
                  {t.statCategories}
                </p>
              </div>
              <div className="border-l border-border pl-8">
                <dt className="sr-only">{dict.home.statProductionLabel}</dt>
                <dd className="font-heading text-2xl font-bold text-foreground">
                  {dict.home.statProductionValue}
                </dd>
                <p className="text-xs text-muted-foreground">
                  {dict.home.statProductionCaption}
                </p>
              </div>
              <div className="border-l border-border pl-8">
                <dt className="sr-only">{t.statPricingReply}</dt>
                <dd className="font-heading text-2xl font-bold text-foreground">
                  {dict.home.proofSameDay}
                </dd>
                <p className="text-xs text-muted-foreground">
                  {t.statPricingReply}
                </p>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------- Benefits --------------------------- */}
      <section className="container-px py-16 lg:py-24">
        <SectionHeader
          eyebrow={t.benefitsEyebrow}
          title={t.benefitsTitle}
          description={t.benefitsDescription}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-lg">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-muted text-brand-strong">
                  <b.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                  {b.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {b.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------- How to start ------------------------- */}
      <section className="border-y border-border bg-secondary/30 py-16 lg:py-24">
        <div className="container-px">
          <SectionHeader
            align="center"
            eyebrow={t.startEyebrow}
            title={t.startTitle}
            description={t.startDescription}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {applySteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-brand-muted text-brand-strong">
                      <s.icon className="size-5" />
                    </span>
                    <span className="font-heading text-3xl font-bold text-brand/25">
                      {s.n}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------ Application form ------------------------ */}
      <section id="apply" className="scroll-mt-24 border-b border-border">
        <div className="container-px grid gap-12 py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-24">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="eyebrow text-brand-strong">{t.applyEyebrow}</span>
            <h2 className="mt-3 text-h2 text-foreground">{t.applyTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {t.applyBody}
            </p>

            <ul className="mt-7 space-y-3">
              {[
                { icon: Clock, label: t.assurance1 },
                { icon: Truck, label: t.assurance2 },
                { icon: ShieldCheck, label: t.assurance3 },
                { icon: MapPin, label: t.assurance4 },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 text-sm text-foreground"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-muted text-brand-strong">
                    <item.icon className="size-4" />
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>

            <div className="mt-7 rounded-2xl border border-border bg-secondary/40 p-5 text-sm leading-relaxed text-muted-foreground">
              {t.questionsBefore}
              <a
                href={`mailto:${site.email}`}
                className="font-medium text-brand-strong hover:underline"
              >
                {site.email}
              </a>
              {t.questionsAfter}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <SellerApplicationForm />
          </div>
        </div>
      </section>
    </div>
  );
}
