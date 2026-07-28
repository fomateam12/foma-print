import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/locale-link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/how-it-works">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).howItWorks;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesFor("/how-it-works", lang),
    openGraph: {
      title: `${t.metaTitle} · ${site.name}`,
      description: t.ogDescription,
    },
  };
}

export default async function HowItWorksPage({
  params,
}: PageProps<"/[lang]/how-it-works">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.howItWorks;

  const steps = [
    { title: t.step1Title, body: t.step1Body },
    { title: t.step2Title, body: t.step2Body },
    { title: t.step3Title, body: t.step3Body },
    { title: t.step4Title, body: t.step4Body },
    { title: t.step5Title, body: t.step5Body },
    { title: t.step6Title, body: t.step6Body },
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
              {t.metaTitle}
            </span>
            <h1 className="mt-5 text-display text-foreground">
              {t.headingBefore}
              <span className="text-metallic">FomaPrint</span>
              {t.headingAfter}
            </h1>
            <p className="mt-5 max-w-2xl text-lead text-muted-foreground">
              {t.lead}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Steps */}
      <section className="container-px py-12 lg:py-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={Math.min(i * 0.05, 0.2)}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="font-heading text-3xl font-bold tabular-nums text-brand-strong">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  aria-hidden="true"
                  className="mt-3 h-px w-10 rounded-full"
                  style={{ background: "var(--metallic)" }}
                />
                <h2 className="mt-4 font-heading text-base font-semibold text-foreground">
                  {step.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {t.portalNote}
          </p>
          <div className="mt-6">
            <Link
              href="/sell"
              className={cn(buttonVariants({ variant: "brand", size: "lg" }))}
            >
              {dict.header.applyToSell}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
