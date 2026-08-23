import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/locale-link";
import {
  Clock,
  Factory,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Store,
} from "lucide-react";
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
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).contact;

  return {
    title: t.metaTitle,
    description: t.metaDescription.replace("{email}", site.email),
    alternates: alternatesFor("/contact", lang),
    openGraph: {
      title: `${t.metaTitle} · ${site.name}`,
      description: t.ogDescription,
    },
  };
}

export default async function ContactPage({
  params,
}: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.contact;

  const channels = [
    {
      icon: Mail,
      title: t.emailTitle,
      body: t.emailBody,
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: MessageCircle,
      title: t.whatsappTitle,
      body: t.whatsappBody,
      value: site.whatsappDisplay,
      href: site.whatsappHref,
      external: true,
    },
  ];

  const quickLinks = [
    {
      icon: FileText,
      title: dict.quote.metaTitle,
      body: t.quoteLinkBody,
      href: "/quote",
    },
    {
      icon: Store,
      title: t.resellerLinkTitle,
      body: t.resellerLinkBody,
      href: "/sell",
    },
  ];

  return (
    <div className="container-px py-10 lg:py-14">
      <Breadcrumbs
        items={[
          { label: dict.common.home, href: "/" },
          { label: t.metaTitle },
        ]}
      />

      <Reveal className="mt-6 max-w-2xl">
        <span className="eyebrow text-brand-strong">{t.eyebrow}</span>
        <h1 className="mt-3 text-h2 text-foreground">{t.heading}</h1>
        <p className="mt-4 text-lead text-muted-foreground">
          {t.lead.replace("{brand}", site.name)}
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {channels.map((c, i) => (
          <Reveal key={c.title} delay={Math.min(i * 0.06, 0.18)}>
            <a
              href={c.href}
              {...(c.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-brand-muted text-brand-strong">
                <c.icon className="size-5" />
              </span>
              <h2 className="mt-4 font-heading text-base font-semibold text-foreground">
                {c.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              <p className="mt-3 font-medium text-brand-strong group-hover:underline">
                {c.value}
              </p>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-2">
          {quickLinks.map((q) => (
            <Link
              key={q.title}
              href={q.href}
              className="group flex flex-col rounded-2xl border border-border bg-secondary/40 p-6 transition-colors hover:border-brand/40"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-background text-brand-strong ring-1 ring-border">
                <q.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                {q.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {q.body}
              </p>
              <span className="mt-3 text-sm font-semibold text-brand-strong group-hover:underline">
                {t.learnMore}
              </span>
            </Link>
          ))}
        </div>

        {/* Business details */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-heading text-base font-semibold text-foreground">
            {t.businessDetails}
          </h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Store className="mt-0.5 size-4 shrink-0 text-brand-strong" />
              <div>
                <dt className="text-muted-foreground">{t.company}</dt>
                <dd className="font-medium text-foreground">{site.legalName}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-brand-strong" />
              <div>
                <dt className="text-muted-foreground">{t.hours}</dt>
                <dd className="font-medium text-foreground">{t.hoursValue}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-strong" />
              <div>
                <dt className="text-muted-foreground">{t.address}</dt>
                <dd className="font-medium text-foreground">
                  {site.address.street}, {site.address.city},{" "}
                  {site.address.state} {site.address.zip}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Factory className="mt-0.5 size-4 shrink-0 text-brand-strong" />
              <div>
                <dt className="text-muted-foreground">{t.production}</dt>
                <dd className="font-medium text-foreground">
                  {dict.site.madeIn}
                </dd>
              </div>
            </div>
          </dl>
          <Link
            href="/quote"
            className={cn(buttonVariants({ variant: "brand", size: "sm" }), "mt-6 w-full")}
          >
            {dict.quote.metaTitle}
          </Link>
        </div>
      </div>
    </div>
  );
}
