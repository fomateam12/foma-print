import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/locale-link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { GUIDES } from "@/data/guides";
import { site } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { LOCALES, isLocale } from "@/lib/i18n";
import { alternatesFor, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/guides">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).guides;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesFor("/guides", lang),
    openGraph: {
      title: `${t.metaTitle} · ${site.name}`,
      description: t.metaDescription,
    },
  };
}

export default async function GuidesIndexPage({
  params,
}: PageProps<"/[lang]/guides">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.guides;

  const crumbJsonLd = breadcrumbJsonLd(
    [
      { name: dict.common.home, path: "/" },
      { name: t.eyebrow },
    ],
    lang,
  );
  const listJsonLd = itemListJsonLd(
    GUIDES.map((g) => ({
      name: g.copy[lang].title,
      path: `/guides/${g.slug}`,
    })),
    lang,
  );

  return (
    <div>
      <JsonLd data={crumbJsonLd} />
      <JsonLd data={listJsonLd} />

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
              { label: t.eyebrow },
            ]}
          />
          <div className="mt-6 max-w-2xl">
            <span className="eyebrow text-brand-strong">{t.eyebrow}</span>
            <h1 className="mt-2 text-display text-foreground">{t.heading}</h1>
            <p className="mt-4 text-lead text-muted-foreground">{t.lede}</p>
          </div>
        </div>
      </section>

      <div className="container-px py-12 lg:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {GUIDES.map((guide, i) => {
            const copy = guide.copy[lang];
            return (
              <Reveal key={guide.slug} delay={Math.min(i * 0.05, 0.25)}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="inline-flex size-10 place-items-center justify-center rounded-xl bg-brand-muted text-brand-strong">
                    <BookOpen className="size-5" />
                  </span>
                  <h2 className="mt-4 font-heading text-lg font-semibold text-foreground group-hover:text-brand-strong">
                    {copy.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {copy.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
                    {t.readingTime.replace("{minutes}", String(guide.minutes))}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
