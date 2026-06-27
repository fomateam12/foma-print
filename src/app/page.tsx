import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  PenTool,
  BadgeCheck,
  Truck,
  Sparkles,
  Package,
  Star,
} from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import { CategoryIcon } from "@/components/category-icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cloudinary } from "@/lib/format";
import {
  getCategories,
  getFeaturedProducts,
  getProductCount,
} from "@/data/catalog";
import { site } from "@/lib/site";

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Free design proof",
    body: "We send a digital proof on every custom order before we engrave.",
  },
  {
    icon: Truck,
    title: "Fast U.S. turnaround",
    body: "Made to order and shipped quickly from our American studio.",
  },
  {
    icon: Package,
    title: "Bulk & corporate pricing",
    body: "Volume discounts for weddings, events and company gifting.",
  },
  {
    icon: Sparkles,
    title: "Permanent laser engraving",
    body: "Crisp, lasting marks that never fade, peel or wash off.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Pick your product",
    body: "Browse thousands of engravable gifts, drinkware, frames and more.",
  },
  {
    n: "02",
    title: "Add your personalization",
    body: "Tell us the names, dates, monogram or logo you want engraved.",
  },
  {
    n: "03",
    title: "Approve your proof",
    body: "We email a free digital proof so it's perfect before we engrave.",
  },
  {
    n: "04",
    title: "We make & ship it",
    body: "Your one-of-a-kind gift is laser-engraved and on its way.",
  },
];

export default function HomePage() {
  const categories = getCategories();
  const featured = getFeaturedProducts(8);
  const collage = getFeaturedProducts(20).slice(8, 12);
  const productCount = getProductCount();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-brand-muted/60 to-background">
        <div className="container-px grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="max-w-xl">
            <span className="eyebrow inline-flex items-center gap-2 text-brand-strong">
              <Sparkles className="size-4" />
              Personalized &amp; laser-engraved
            </span>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Gifts worth keeping, engraved just for them
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {site.name} turns premium drinkware, cutting boards, frames and
              keepsakes into one-of-a-kind gifts — personalized with the names,
              dates and logos that matter. Made to order in the USA.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/categories"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Shop all categories
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/custom-order"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                )}
              >
                <PenTool className="size-4" />
                Start a custom order
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-brand text-brand" />
                Trusted by gift-givers nationwide
              </span>
              <span className="hidden sm:inline">
                {productCount.toLocaleString()}+ products
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {collage.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-card)]",
                    i % 2 === 1 && "translate-y-6",
                  )}
                >
                  <Image
                    src={cloudinary(p.image, { width: 500 })}
                    alt={p.name}
                    fill
                    priority={i < 2}
                    sizes="(max-width: 1024px) 40vw, 25vw"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-b border-border bg-background">
        <div className="container-px grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-lg bg-brand-muted text-brand-strong">
                <f.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-px py-16 lg:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow text-brand-strong">Shop by category</span>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground">
              Find the perfect canvas
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-strong hover:underline sm:inline-flex"
          >
            All categories
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group relative flex flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary to-brand-muted/40 p-6 transition-shadow hover:shadow-[var(--shadow-card)]"
            >
              <div>
                <span className="grid size-12 place-items-center rounded-xl bg-background/80 text-brand-strong shadow-sm ring-1 ring-border">
                  <CategoryIcon icon={c.icon} className="size-6" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                  {c.name}
                </h3>
                <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {c.blurb}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-strong">
                Shop {c.productCount.toLocaleString()} products
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container-px py-16 lg:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-brand-strong">
                Customer favorites
              </span>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground">
                Bestselling engraved gifts
              </h2>
            </div>
          </div>
          <ProductGrid products={featured} className="mt-8" priorityCount={4} />
        </div>
      </section>

      {/* How it works */}
      <section className="container-px py-16 lg:py-20">
        <div className="text-center">
          <span className="eyebrow text-brand-strong">How it works</span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground">
            Personalized in four easy steps
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="relative rounded-2xl border border-border bg-background p-6"
            >
              <span className="font-heading text-3xl font-bold text-brand/40">
                {s.n}
              </span>
              <h3 className="mt-3 font-heading text-base font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Reseller CTA */}
      <section className="container-px pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-primary-foreground sm:px-14">
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Bulk orders & reseller pricing
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-primary-foreground/80">
              Planning a wedding, corporate event or stocking your own shop? Get
              wholesale pricing, dedicated support and fast production on large
              orders from {site.legalName}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sell"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                )}
              >
                Become a reseller
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/custom-order"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-brand text-brand-foreground hover:bg-brand/90",
                )}
              >
                Request a quote
              </Link>
            </div>
          </div>
          <Sparkles
            className="absolute -right-6 -top-6 size-48 text-primary-foreground/5"
            aria-hidden="true"
          />
        </div>
      </section>
    </>
  );
}
