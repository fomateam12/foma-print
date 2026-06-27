import type { Metadata } from "next";
import { DollarSign, Headset, PackageCheck, Rocket, Tags, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SellerApplicationForm } from "@/components/seller-application-form";
import { getProductCount } from "@/data/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Become a Reseller",
  description:
    "Apply to become a FomaPrint reseller. Get wholesale pricing on thousands of personalized, laser-engraved gifts with fast U.S. production and dedicated support.",
  alternates: { canonical: "/sell" },
  openGraph: {
    title: "Become a reseller · FomaPrint",
    description:
      "Wholesale pricing on thousands of personalized gifts with fast U.S. production and dedicated support.",
  },
};

const BENEFITS = [
  {
    icon: Tags,
    title: "Wholesale pricing",
    body: "Tiered reseller discounts that scale with your volume — protect your margins.",
  },
  {
    icon: PackageCheck,
    title: "Thousands of SKUs",
    body: "A full catalog of engravable drinkware, gifts, frames and office goods.",
  },
  {
    icon: Rocket,
    title: "Fast production",
    body: "Made-to-order in the USA with quick turnaround, even on bulk runs.",
  },
  {
    icon: Truck,
    title: "Blind & drop shipping",
    body: "We can ship directly to your customers under your brand.",
  },
  {
    icon: Headset,
    title: "Dedicated support",
    body: "A real person to help with proofs, rush orders and large projects.",
  },
  {
    icon: DollarSign,
    title: "No minimums to start",
    body: "Test the catalog with small orders before you scale up.",
  },
];

export default function SellPage() {
  const productCount = getProductCount();

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-brand-muted/60 to-background">
        <div className="container-px py-12 lg:py-16">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Become a Reseller" }]}
          />
          <div className="mt-6 max-w-2xl">
            <span className="eyebrow text-brand-strong">Wholesale & resellers</span>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Sell personalized gifts your customers will love
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Partner with {site.legalName} and offer over{" "}
              {productCount.toLocaleString()} laser-engravable products — from
              Polar Camel drinkware to custom frames — with wholesale pricing and
              made-to-order U.S. production. Whether you run a boutique, an online
              shop or handle corporate gifting, we make it easy to add
              personalization to your lineup.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container-px py-14 lg:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-card)]"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-brand-muted text-brand-strong">
                <b.icon className="size-5" />
              </span>
              <h2 className="mt-4 font-heading text-base font-semibold text-foreground">
                {b.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Application form */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container-px grid gap-12 py-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              Apply for a reseller account
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Tell us a little about your business and we&apos;ll review your
              application and follow up within two business days with pricing and
              next steps.
            </p>
            <div className="mt-6 rounded-2xl border border-border bg-background p-5 text-sm leading-relaxed text-muted-foreground">
              Questions before applying? Email{" "}
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

          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <SellerApplicationForm />
          </div>
        </div>
      </section>
    </div>
  );
}
