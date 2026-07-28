import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, Hanken_Grotesk } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QuoteProvider } from "@/components/quote-provider";
import { I18nProvider } from "@/components/i18n-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { LOCALES, LOCALE_OG, isLocale, localizedPath } from "@/lib/i18n";
import { alternatesFor } from "@/lib/seo";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const title = `${site.name} — ${dict.site.tagline}`;

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s · ${site.name}` },
    description: dict.site.description,
    applicationName: site.name,
    authors: [{ name: site.legalName }],
    creator: site.legalName,
    publisher: site.legalName,
    keywords: [...dict.site.keywords],
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description: dict.site.description,
      url: localizedPath("/", lang),
      locale: LOCALE_OG[lang],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dict.site.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: alternatesFor("/", lang),
    category: "business",
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  // Site-wide Organization schema: gives crawlers and partnership evaluators a
  // machine-readable identity (legal entity, founding year, location, contact).
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    foundingDate: String(site.foundedYear),
    url: site.url,
    email: site.email,
    telephone: "+1-404-934-8917",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      addressCountry: site.address.country,
    },
    sameAs: site.social.map((s) => s.href),
    description: dict.site.description,
  };

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${hankenGrotesk.variable} h-full`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
        >
          {dict.common.skipToContent}
        </a>
        <I18nProvider locale={lang} dict={dict}>
          <QuoteProvider>
            <SiteHeader />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter locale={lang} dict={dict} />
          </QuoteProvider>
        </I18nProvider>
        <Toaster position="top-center" theme="light" richColors closeButton />
      </body>
    </html>
  );
}
