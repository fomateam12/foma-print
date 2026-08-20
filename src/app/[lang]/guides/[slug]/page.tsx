import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/locale-link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GUIDES, getGuide } from "@/data/guides";
import { site } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { LOCALES, isLocale } from "@/lib/i18n";
import {
  absoluteUrl,
  alternatesFor,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    GUIDES.map((g) => ({ lang, slug: g.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/guides/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const guide = getGuide(slug);
  if (!guide) return { title: dict.guides.notFound };
  const copy = guide.copy[lang];

  return {
    title: copy.title,
    description: copy.description,
    alternates: alternatesFor(`/guides/${guide.slug}`, lang),
    openGraph: {
      type: "article",
      title: `${copy.title} · ${site.name}`,
      description: copy.description,
      publishedTime: guide.published,
    },
  };
}

export default async function GuidePage({
  params,
}: PageProps<"/[lang]/guides/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.guides;

  const guide = getGuide(slug);
  if (!guide) notFound();
  const copy = guide.copy[lang];
  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.title,
    description: copy.description,
    inLanguage: lang,
    datePublished: guide.published,
    dateModified: guide.published,
    mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`, lang),
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      url: site.url,
    },
  };

  const crumbJsonLd = breadcrumbJsonLd(
    [
      { name: dict.common.home, path: "/" },
      { name: t.eyebrow, path: "/guides" },
      { name: copy.title },
    ],
    lang,
  );

  return (
    <div className="container-px py-10 lg:py-14">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={crumbJsonLd} />
      {copy.faqs && copy.faqs.length > 0 ? (
        <JsonLd data={faqJsonLd(copy.faqs)} />
      ) : null}

      <Breadcrumbs
        items={[
          { label: dict.common.home, href: "/" },
          { label: t.eyebrow, href: "/guides" },
          { label: copy.title },
        ]}
      />

      <article className="mt-6 max-w-3xl">
        <header>
          <span className="eyebrow text-brand-strong">
            {t.readingTime.replace("{minutes}", String(guide.minutes))}
          </span>
          <h1 className="mt-2 text-h1 text-foreground">{copy.title}</h1>
          <p className="mt-4 text-lead text-muted-foreground">{copy.lede}</p>
        </header>

        <div className="mt-10 space-y-10">
          {copy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-h3 text-foreground">{section.heading}</h2>
              <div className="mt-3 space-y-4 text-muted-foreground">
                {section.paragraphs.map((para, i) => (
                  <p key={i} className="leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
              {section.bullets ? (
                <ul className="mt-5 space-y-2.5">
                  {section.bullets.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-muted-foreground"
                    >
                      <Check className="mt-1 size-4 shrink-0 text-brand-strong" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {copy.faqs && copy.faqs.length > 0 ? (
          <section className="mt-12 border-t border-border pt-10">
            <h2 className="text-h3 text-foreground">{t.faqHeading}</h2>
            <dl className="mt-6 space-y-6">
              {copy.faqs.map((faq) => (
                <div key={faq.q}>
                  <dt className="font-heading text-base font-semibold text-foreground">
                    {faq.q}
                  </dt>
                  <dd className="mt-1.5 leading-relaxed text-muted-foreground">
                    {faq.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            {t.ctaHeading}
          </h2>
          <p className="mt-2 text-muted-foreground">{t.ctaBody}</p>
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "default" }), "mt-5")}
          >
            {t.ctaButton}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </article>

      {others.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {t.moreGuides}
            </h2>
            <Link
              href="/guides"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-strong transition-colors hover:text-rust-bright"
            >
              <ArrowLeft className="size-4" />
              {t.backToGuides}
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {others.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-lg"
              >
                <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-brand-strong">
                  {g.copy[lang].title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {g.copy[lang].description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
