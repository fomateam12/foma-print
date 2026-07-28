import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LegalDocument, LegalSection } from "@/components/legal-document";
import { site } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).privacy;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesFor("/privacy", lang),
  };
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.privacy;

  return (
    <div className="container-px py-10 lg:py-14">
      <Breadcrumbs
        items={[
          { label: dict.common.home, href: "/" },
          { label: t.metaTitle },
        ]}
      />

      <LegalDocument
        title={t.metaTitle}
        updatedLabel={`${dict.legal.lastUpdated} ${t.updated}`}
        notice={lang === DEFAULT_LOCALE ? undefined : dict.legal.notice}
      >
        <p>
          {t.intro
            .replace("{legal}", site.legalName)
            .replace(/\{brand\}/g, site.name)}
        </p>

        <LegalSection
          heading={t.s1Heading}
          bullets={[t.s1B1, t.s1B2, t.s1B3]}
        />
        <LegalSection
          heading={t.s2Heading}
          bullets={[t.s2B1, t.s2B2, t.s2B3, t.s2B4]}
        />
        <LegalSection heading={t.s3Heading} paragraphs={[t.s3P1]} />
        <LegalSection heading={t.s4Heading} paragraphs={[t.s4P1]} />
        <LegalSection heading={t.s5Heading} paragraphs={[t.s5P1]} />
        <LegalSection heading={t.s6Heading}>
          <p className="mt-3">
            {t.s6P1}{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-brand-strong hover:underline"
            >
              {site.email}
            </a>
            .
          </p>
        </LegalSection>
      </LegalDocument>
    </div>
  );
}
