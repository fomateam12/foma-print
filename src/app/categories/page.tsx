import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryIcon } from "@/components/category-icon";
import { getCategories, getProductCount } from "@/data/catalog";

export const metadata: Metadata = {
  title: "All Categories",
  description:
    "Browse every category of personalized, laser-engraved gifts from FomaPrint — drinkware, cutting boards, frames, journals, awards and more.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const categories = getCategories();
  const total = getProductCount();

  return (
    <div className="container-px py-10 lg:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

      <header className="mt-6 max-w-2xl">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
          Shop all categories
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          Explore {total.toLocaleString()} personalized products across{" "}
          {categories.length} collections — every one ready for crisp, permanent
          laser engraving.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {categories.map((c) => (
          <section key={c.slug}>
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-muted text-brand-strong">
                  <CategoryIcon icon={c.icon} className="size-5" />
                </span>
                <div>
                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    <Link
                      href={`/category/${c.slug}`}
                      className="hover:text-brand-strong"
                    >
                      {c.name}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {c.productCount.toLocaleString()} products
                  </p>
                </div>
              </div>
              <Link
                href={`/category/${c.slug}`}
                className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-strong hover:underline sm:inline-flex"
              >
                Shop all
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <ul className="mt-5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {c.subcategories.map((sc) => (
                <li key={sc.slug}>
                  <Link
                    href={`/category/${c.slug}/${sc.slug}`}
                    className="group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="text-foreground group-hover:text-brand-strong">
                      {sc.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {sc.productCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
