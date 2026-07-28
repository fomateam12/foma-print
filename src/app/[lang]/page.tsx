import Image from "next/image";
import { Link } from "@/components/locale-link";
import {
  ArrowRight,
  BadgeCheck,
  Truck,
  MapPin,
  Boxes,
  Zap,
  TrendingUp,
  Store,
  ShoppingBag,
  PenTool,
  PackageCheck,
  LayoutDashboard,
  Gauge,
  Palette,
  ShieldCheck,
  Clock,
  Layers,
} from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import { CategoryIcon } from "@/components/category-icon";
import { SectionHeader } from "@/components/section-header";
import { BentoGrid, BentoCard } from "@/components/bento";
import { ProductBanner } from "@/components/product-banner";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { StatCounter } from "@/components/stat-counter";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getCategories,
  getFeaturedProducts,
  getProductCount,
} from "@/data/catalog";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { categoryName } from "@/lib/catalog-i18n";


export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.home;
  const cutoff = dict.copy.orderCutoff;

  const steps = [
    { n: "01", icon: Store, title: t.step1Title, body: t.step1Body },
    { n: "02", icon: ShoppingBag, title: t.step2Title, body: t.step2Body },
    { n: "03", icon: PenTool, title: t.step3Title, body: t.step3Body },
    { n: "04", icon: PackageCheck, title: t.step4Title, body: t.step4Body },
  ];

  const toolFeatures = [
    { icon: LayoutDashboard, title: t.tool1Title, body: t.tool1Body },
    { icon: Gauge, title: t.tool2Title, body: t.tool2Body },
    { icon: Palette, title: t.tool3Title, body: t.tool3Body },
    { icon: PackageCheck, title: t.tool4Title, body: t.tool4Body },
  ];

  const categories = getCategories();
  const featured = getFeaturedProducts(8);
  const productCount = getProductCount();

  // Larger pool for the rotating home banner; the client samples a shuffled
  // subset per visit. Only the fields the banner renders are passed.
  const bannerProducts = getFeaturedProducts(30).map((p) => ({
    id: p.id,
    name: p.name,
    image: p.image,
    sku: p.sku,
    categorySlug: p.categorySlug,
  }));

  return (
    <>
      {/* ----------------------------- Hero ----------------------------- */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Sunlit studio-table photograph as the hero banner: engraved tumblers,
            journal, board and keychain sit at the left and right edges. The scene
            keeps its center clear (plaster wall + empty table), so the headline
            sits on quiet image area; a cream veil tops it up for AA contrast,
            heavier at the top and bottom where the chip and stat strip land. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src="/banners/hero-studio-table.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/30 to-background/95" />
          <div className="absolute -top-40 right-[-10%] h-[42rem] w-[42rem] rounded-full bg-brand-muted/40 blur-3xl" />
        </div>

        <div className="container-px flex flex-col items-center py-16 text-center lg:py-24">
          <Stagger className="flex flex-col items-center">
            <StaggerItem>
              <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-brand-strong backdrop-blur-sm">
                <MapPin className="size-3.5" />
                {t.heroEyebrow} · {dict.copy.turnaroundShort}
              </span>
            </StaggerItem>
            <StaggerItem>
              <h1 className="mt-5 max-w-4xl text-display text-foreground">
                {t.heroTitle}{" "}
                <span className="block text-metallic">{t.heroTitleAccent}</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mx-auto mt-5 max-w-2xl text-lead text-muted-foreground">
                {t.heroLead}
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/sell" className={cn(buttonVariants({ variant: "brand", size: "lg" }))}>
                  {t.applyToSell}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/categories"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  {t.viewCatalog}
                </Link>
              </div>
            </StaggerItem>

            <StaggerItem>
              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
                {[t.chipWhiteLabel, dict.copy.turnaroundShort, t.chipNoMoq].map((chip) => (
                  <li key={chip} className="flex items-center gap-1.5">
                    <BadgeCheck className="size-4 text-brand-strong" />
                    {chip}
                  </li>
                ))}
              </ul>
            </StaggerItem>

            <StaggerItem>
              <dl className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4">
                <div>
                  <dt className="sr-only">{t.statProductsLabel}</dt>
                  <dd className="font-heading text-2xl font-bold text-foreground">
                    <StatCounter value={productCount} suffix="+" />
                  </dd>
                  <p className="text-xs text-muted-foreground">{t.statProductsCaption}</p>
                </div>
                <div className="border-l border-border pl-8">
                  <dt className="sr-only">{t.statProductionLabel}</dt>
                  <dd className="font-heading text-2xl font-bold text-foreground">{t.statProductionValue}</dd>
                  <p className="text-xs text-muted-foreground">{t.statProductionCaption}</p>
                </div>
                <div className="border-l border-border pl-8">
                  <dt className="sr-only">{t.statShippingLabel}</dt>
                  <dd className="font-heading text-2xl font-bold text-foreground">{t.statShippingValue}</dd>
                  <p className="text-xs text-muted-foreground">{t.statShippingCaption}</p>
                </div>
              </dl>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* ---------------------- Live product banner --------------------- */}
      <ProductBanner products={bannerProducts} />

      {/* --------------------------- How it works ----------------------- */}
      <section id="how" className="container-px scroll-mt-24 py-20 lg:py-28">
        <SectionHeader
          align="center"
          eyebrow={t.howEyebrow}
          title={t.howTitle}
          description={t.howDescription}
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-muted text-brand-strong">
                    <s.icon className="size-5" />
                  </span>
                  <span className="font-heading text-3xl font-bold text-brand/25">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-strong transition-colors hover:text-rust-bright"
          >
            {t.seeHowItWorks}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* --------------------------- Why FomaPrint ---------------------- */}
      <section className="border-y border-border bg-secondary/30 py-20 lg:py-28">
        <div className="container-px">
          <SectionHeader
            eyebrow={t.whyEyebrow}
            title={t.whyTitle}
            description={t.whyDescription}
            action={
              <Link
                href="/sell"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-strong transition-colors hover:text-rust-bright"
              >
                {t.applyToSell}
                <ArrowRight className="size-4" />
              </Link>
            }
          />

          <BentoGrid className="mt-12">
            <BentoCard
              tone="ink"
              icon={<Truck className="size-5" />}
              eyebrow={t.whiteLabelEyebrow}
              title={t.whiteLabelTitle}
              description={t.whiteLabelBody}
              className="sm:col-span-2 lg:col-span-2"
            />
            <BentoCard
              tone="brand"
              icon={<TrendingUp className="size-5" />}
              title={t.marginTitle}
              description={t.marginBody}
            />
            <BentoCard
              icon={<MapPin className="size-5" />}
              title={t.madeInUsaTitle}
              description={t.madeInUsaBody}
            />
            <BentoCard
              icon={<Zap className="size-5" />}
              title={dict.copy.turnaroundShort}
              description={t.sameDayBody.replace("{cutoff}", cutoff)}
            />
            <BentoCard
              icon={<Boxes className="size-5" />}
              title={t.noMinimumsTitle}
              description={t.noMinimumsBody}
            />
          </BentoGrid>
        </div>
      </section>

      {/* -------------------------- Catalog showcase -------------------- */}
      <section className="container-px py-20 lg:py-28">
        <SectionHeader
          eyebrow={t.catalogEyebrow}
          title={
            <>
              <StatCounter value={productCount} suffix="+" />{" "}
              {t.catalogTitleSuffix}
            </>
          }
          description={t.catalogDescription}
          action={
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-strong transition-colors hover:text-rust-bright"
            >
              {t.allCategories}
              <ArrowRight className="size-4" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link
                href={`/category/${c.slug}`}
                className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-muted text-brand-strong">
                  <CategoryIcon icon={c.icon} className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-base font-semibold text-foreground">
                    {categoryName(c.name, lang)}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {c.productCount.toLocaleString(lang)} {dict.common.products}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-brand-strong transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          ))}
        </div>

        <ProductGrid locale={lang} products={featured} className="mt-10" priorityCount={4} />

        <div className="mt-10 text-center">
          <Link
            href="/categories"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            <Layers className="size-4" />
            {t.browseFullCatalog}
          </Link>
        </div>
      </section>

      {/* ---------------------------- Tools teaser ---------------------- */}
      <section className="border-y border-border bg-secondary/30 py-20 lg:py-28">
        <div className="container-px grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeader
              eyebrow={t.toolsEyebrow}
              title={t.toolsTitle}
              description={t.toolsDescription}
            />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {toolFeatures.map((f) => (
                <li key={f.title} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-background text-brand-strong ring-1 ring-border">
                    <f.icon className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      {f.title}
                    </h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {f.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sell" className={cn(buttonVariants({ size: "lg" }))}>
                {t.applyToSell}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>

          {/* Dashboard mock */}
          <Reveal delay={0.1}>
            <div
              aria-hidden="true"
              className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-destructive/40" />
                  <span className="size-2.5 rounded-full bg-brand/50" />
                  <span className="size-2.5 rounded-full bg-evergreen/50" />
                  <span className="ml-2 font-heading text-sm font-semibold text-foreground">
                    {t.mockPortal}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-evergreen/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-evergreen">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-evergreen opacity-60 motion-reduce:hidden" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-evergreen" />
                  </span>
                  {t.mockLive}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { k: t.mockOrdersToday, v: "24" },
                  { k: t.mockInProduction, v: "11" },
                  { k: t.mockShipped, v: "318" },
                ].map((s) => (
                  <div key={s.k} className="rounded-xl bg-secondary/60 p-3">
                    <div className="font-heading text-xl font-bold text-foreground">
                      {s.v}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{s.k}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2.5">
                {[
                  { id: "#FP-2041", s: t.mockStatusEngraving, tone: "bg-brand/15 text-brand-strong" },
                  { id: "#FP-2040", s: t.mockStatusReplied, tone: "bg-secondary text-muted-foreground" },
                  { id: "#FP-2039", s: t.mockStatusShipped, tone: "bg-evergreen/15 text-evergreen" },
                ].map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-3.5 py-3"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="size-7 rounded-lg bg-brand-muted" />
                      <span className="font-mono text-xs text-foreground">{r.id}</span>
                    </span>
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", r.tone)}>
                      {r.s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------- Social proof ---------------------- */}
      <section className="container-px py-20 lg:py-28">
        <SectionHeader
          align="center"
          eyebrow={t.proofEyebrow}
          title={t.proofTitle}
          description={t.proofDescription}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { counter: true, v: productCount, suffix: "+", display: "", label: t.proofProducts },
            { counter: true, v: categories.length, suffix: "", display: "", label: t.proofCategories },
            { counter: false, v: 0, suffix: "", display: t.statProductionValue, label: t.proofMadeToOrder },
            { counter: false, v: 0, suffix: "", display: t.proofSameDay, label: t.proofPrintingShipping },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
                <div className="font-heading text-3xl font-bold text-foreground">
                  {s.counter ? (
                    <StatCounter value={s.v} suffix={s.suffix} />
                  ) : (
                    s.display
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ----------------------------- CTA band ------------------------- */}
      <section className="container-px pb-24">
        <div className="grain relative overflow-hidden rounded-[2rem] bg-ink px-8 py-16 text-ink-foreground sm:px-16 sm:py-20">
          {/* Workshop photograph under an ink veil — the band's one bold
              visual. Deep-navy source image + 65% ink overlay keeps the
              centered copy comfortably above 4.5:1. */}
          <Image
            src="/banners/cta-workshop.jpg"
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="pointer-events-none object-cover opacity-45"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-ink/65"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-brand/20 blur-3xl"
          />
          <div aria-hidden="true" className="rule-metallic absolute inset-x-0 top-0" />

          <div className="relative mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              {t.ctaEyebrow}
            </span>
            <h2 className="mt-3 text-h2 text-ink-foreground">
              {t.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lead text-ink-muted">
              {t.ctaBody.replace("{cutoff}", cutoff)}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/sell" className={cn(buttonVariants({ variant: "brand", size: "lg" }))}>
                {t.applyToSell}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-medium text-ink-foreground transition-colors hover:bg-white/10"
              >
                {t.requestQuote}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-brand" />
                {t.ctaNoAccount}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-brand" />
                {t.ctaOneDayReply}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-brand" />
                {dict.site.madeIn}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
