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
}: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).terms;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesFor("/terms", lang),
  };
}

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.terms;

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
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
        <p>{t.intro3}</p>

        <LegalSection
          heading={t.s1Heading}
          bullets={[t.s1B1, t.s1B2, t.s1B3, t.s1B4, t.s1B5]}
        />
        <LegalSection
          heading={t.s2Heading}
          paragraphs={[t.s2P1]}
          bullets={[t.s2B1, t.s2B2, t.s2B3]}
        >
          <p className="mt-3">{t.s2P2}</p>
        </LegalSection>
        <LegalSection
          heading={t.s3Heading}
          paragraphs={[t.s3P1]}
          bullets={[t.s3B1, t.s3B2, t.s3B3]}
        >
          <p className="mt-3">{t.s3P2}</p>
        </LegalSection>
        <LegalSection
          heading={t.s4Heading}
          paragraphs={[t.s4P1]}
          bullets={[t.s4B1, t.s4B2, t.s4B3]}
        />
        <LegalSection
          heading={t.s5Heading}
          paragraphs={[t.s5P1]}
          bullets={[t.s5B1, t.s5B2, t.s5B3, t.s5B4]}
        >
          <p className="mt-3">{t.s5P2}</p>
        </LegalSection>
        <LegalSection
          heading={t.s6Heading}
          bullets={[t.s6B1, t.s6B2, t.s6B3, t.s6B4]}
        />
        <LegalSection
          heading={t.s7Heading}
          paragraphs={[t.s7P1]}
          bullets={[t.s7B1, t.s7B2, t.s7B3, t.s7B4, t.s7B5]}
        />
        <LegalSection
          heading={t.s8Heading}
          bullets={[t.s8B1, t.s8B2, t.s8B3, t.s8B4]}
        />
        <LegalSection
          heading={t.s9Heading}
          bullets={[t.s9B1, t.s9B2, t.s9B3]}
        />
        <LegalSection heading={t.s10Heading}>
          <p className="mt-3">
            <span className="font-medium text-foreground">{t.s10Lead1}</span>{" "}
            {t.s10P1}
          </p>
          <p className="mt-3">
            <span className="font-medium text-foreground">{t.s10Lead2}</span>{" "}
            {t.s10P2}
          </p>
          <p className="mt-3">
            <span className="font-medium text-foreground">{t.s10Lead3}</span>{" "}
            {t.s10P3}
          </p>
          <p className="mt-3">
            <span className="font-medium text-foreground">{t.s10Lead4}</span>{" "}
            {t.s10P4}
          </p>
        </LegalSection>
        <LegalSection heading={t.s11Heading} paragraphs={[t.s11P1]} />
        <LegalSection heading={t.s12Heading} paragraphs={[t.s12P1, t.s12P2]} />
        <LegalSection heading={t.s13Heading} paragraphs={[t.s13P1]} />
        <LegalSection heading={t.s14Heading} paragraphs={[t.s14P1]} />
        <LegalSection heading={t.s15Heading} paragraphs={[t.s15P1]} />
        <LegalSection heading={t.s16Heading} paragraphs={[t.s16P1]} />
        <LegalSection heading={t.s17Heading} paragraphs={[t.s17P1]} />
        <LegalSection heading={t.s18Heading} paragraphs={[t.s18P1]} />
        <LegalSection heading={dict.privacy.s6Heading}>
          <p className="mt-3">
            {t.contactP1}{" "}
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
