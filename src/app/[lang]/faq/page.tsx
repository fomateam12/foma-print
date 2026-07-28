import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/locale-link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/reveal";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).faq;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesFor("/faq", lang),
    openGraph: {
      title: `${t.metaTitle} · ${site.name}`,
      description: t.ogDescription,
    },
  };
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.faq;

  const faqs = [
    { q: t.q1, a: t.a1 },
    { q: t.q2, a: t.a2 },
    { q: t.q3, a: t.a3 },
    { q: t.q4, a: t.a4 },
    { q: t.q5, a: t.a5 },
    { q: t.q6, a: t.a6 },
    { q: t.q7, a: t.a7 },
  ];

  // FAQPage structured data: the accordion renders answers client-side only,
  // so this is what crawlers and rich results read.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
              { label: dict.header.faq },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-brand-strong backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              {t.eyebrow}
            </span>
            <h1 className="mt-5 text-display text-foreground">
              <span className="text-metallic">{dict.header.faq}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lead text-muted-foreground">
              {t.lead}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Accordion */}
      <section className="container-px py-12 lg:py-16">
        <Reveal className="mx-auto max-w-3xl">
          <Accordion className="gap-3">
            {faqs.map((item) => (
              <AccordionItem
                key={item.q}
                value={item.q}
                className="rounded-2xl border border-border bg-card px-5 shadow-soft"
              >
                <AccordionTrigger className="py-4 text-base font-semibold text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 flex justify-center">
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
