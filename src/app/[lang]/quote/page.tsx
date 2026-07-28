import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { QuoteRequest } from "@/components/quote-request";
import { site } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/quote">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.quote;

  return {
    title: t.metaTitle,
    description: t.metaDescription.replace("{cutoff}", dict.copy.orderCutoff),
    alternates: alternatesFor("/quote", lang),
    openGraph: {
      title: `${t.ogTitle} · ${site.name}`,
      description: t.ogDescription,
    },
  };
}

export default async function QuotePage({ params }: PageProps<"/[lang]/quote">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.quote;

  return (
    <div className="container-px py-10 lg:py-14">
      <Breadcrumbs
        items={[
          { label: dict.common.home, href: "/" },
          { label: t.metaTitle },
        ]}
      />

      <div className="mt-6 max-w-2xl">
        <span className="eyebrow text-brand-strong">{t.eyebrow}</span>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {t.heading}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {t.lead.replace("{cutoff}", dict.copy.orderCutoff)}
        </p>
      </div>

      <QuoteRequest />
    </div>
  );
}
