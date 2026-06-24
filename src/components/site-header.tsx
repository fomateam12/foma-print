import { HeaderNav, type NavCategory } from "@/components/header-nav";
import { getCategories } from "@/data/catalog";

export function SiteHeader() {
  const nav: NavCategory[] = getCategories().map((c) => ({
    name: c.name,
    slug: c.slug,
    blurb: c.blurb,
    icon: c.icon,
    subcategories: c.subcategories.map((sc) => ({
      name: sc.name,
      slug: sc.slug,
    })),
  }));

  return <HeaderNav nav={nav} />;
}
