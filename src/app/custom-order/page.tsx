import type { Metadata } from "next";
import { BadgeCheck, MessageSquare, Palette, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CustomOrderForm } from "@/components/custom-order-form";
import { getCategories } from "@/data/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Custom Order",
  description:
    "Start a custom personalized order with FomaPrint. Tell us what to engrave and we'll send a free design proof and quote within one business day.",
  alternates: { canonical: "/custom-order" },
  openGraph: {
    title: "Start a custom order · FomaPrint",
    description:
      "Tell us what to engrave and we'll send a free design proof and quote within one business day.",
  },
};

const STEPS = [
  {
    icon: MessageSquare,
    title: "Tell us your idea",
    body: "Share the product, quantity and what you'd like engraved.",
  },
  {
    icon: Palette,
    title: "We design a proof",
    body: "Get a free digital proof to review — no charge, no commitment.",
  },
  {
    icon: BadgeCheck,
    title: "You approve it",
    body: "We only engrave once you're 100% happy with the design.",
  },
  {
    icon: Truck,
    title: "Made & shipped",
    body: "Your personalized order is produced in the USA and shipped fast.",
  },
];

export default async function CustomOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const categories = getCategories().map((c) => c.name);

  return (
    <div className="container-px py-10 lg:py-14">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Custom Order" }]}
      />

      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* Intro / value props */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="eyebrow text-brand-strong">Custom orders</span>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Let&apos;s make something unforgettable
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Whether it&apos;s one heartfelt gift or hundreds of corporate
            keepsakes, tell us what you have in mind. We&apos;ll reply within one
            business day with a free design proof and a quote.
          </p>

          <ul className="mt-8 space-y-5">
            {STEPS.map((s) => (
              <li key={s.title} className="flex items-start gap-3.5">
                <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-lg bg-brand-muted text-brand-strong">
                  <s.icon className="size-5" />
                </span>
                <div>
                  <h2 className="font-heading text-sm font-semibold text-foreground">
                    {s.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-5 text-sm leading-relaxed text-muted-foreground">
            Prefer to talk it through? Email{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-brand-strong hover:underline"
            >
              {site.email}
            </a>{" "}
            or call{" "}
            <a
              href={site.phoneHref}
              className="font-medium text-brand-strong hover:underline"
            >
              {site.phoneDisplay}
            </a>
            .
          </div>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Tell us about your order
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Fields marked * are required. We&apos;ll never share your details.
          </p>
          <div className="mt-6">
            <CustomOrderForm
              defaultProduct={product ?? ""}
              categories={categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
