import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/locale-link";
import { Gauge, MapPin, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/shipping">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).shipping;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesFor("/shipping", lang),
    openGraph: {
      title: `${t.metaTitle} · ${site.name}`,
      description: t.ogDescription,
    },
  };
}

export default async function ShippingPage({
  params,
}: PageProps<"/[lang]/shipping">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.shipping;

  const cards = [
    {
      icon: Gauge,
      title: t.turnaroundTitle,
      body: t.turnaroundBody.replace("{cutoff}", dict.copy.orderCutoff),
    },
    { icon: PackageCheck, title: t.packagingTitle, body: t.packagingBody },
    { icon: MapPin, title: t.trackingTitle, body: t.trackingBody },
    {
      icon: ShieldCheck,
      title: t.faultTitle,
      // Split around the Terms link so the sentence reads naturally in either
      // language instead of forcing the link to the end.
      body: (
        <>
          {t.faultBodyBefore}
          <Link href="/terms">{dict.footer.terms}</Link>
          {t.faultBodyAfter}
        </>
      ),
    },
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
              { label: dict.header.shipping },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-brand-strong backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              {dict.header.shipping}
            </span>
            <h1 className="mt-5 text-display text-foreground">
              {t.headingBefore}
              <span className="text-metallic">{t.headingAccent}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lead text-muted-foreground">
              {t.lead}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Cards */}
      <section className="container-px py-12 lg:py-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={Math.min(i * 0.06, 0.18)}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="grid size-11 place-items-center rounded-lg bg-brand-muted text-brand-strong">
                  <card.icon className="size-5" />
                </span>
                <h2 className="mt-4 font-heading text-base font-semibold text-foreground">
                  {card.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-brand-strong [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-rust-bright">
                  {card.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
