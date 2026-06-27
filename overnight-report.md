# Overnight Session — 2026-06-26 → 2026-06-27

> **Latest preview:** (will be appended after first green build + deploy)
>
> **Branch:** `gece/20260626`
>
> Session started by overnight prompt at 21:26 EDT. Operating principles
> per the prompt: preserve brand, verify after every change, bounded
> retries (3), commit often, no production deploys, no `git push`.

---

## Phase 0 — Discovery

### Stack & framework
- **Next.js 16.2.9** (App Router, Turbopack). Local Next docs available
  under `node_modules/next/dist/docs/{01-app,02-pages,03-architecture}`
  — consulted when touching App Router specifics, per AGENTS.md rule.
- **Tailwind CSS v4** with `@theme inline` token block in
  `src/app/globals.css` (357 lines).
- **shadcn/ui** atop `@base-ui/react` primitives. `lucide-react` icons,
  `sonner` toasts, `framer-motion` for transitions, `next-themes` for
  light/dark.
- React **19.2.4**. TypeScript **^5** strict. Node 24 LTS at build.

### Design tokens (in `globals.css`)
- Brand: `--brand`, `--brand-strong`, `--brand-muted`,
  `--brand-foreground` (terracotta/rust family).
- Surfaces: `--cream`, `--cream-soft`, `--surface`, `--tile`.
- Neutrals: `--ink`, `--ink-deep`, `--ink-muted`, `--ink-border`.
- Accents: `--rust`, `--rust-bright`, `--metallic`.
- Typography: `--font-sans`, `--font-heading`, `--font-serif`,
  `--font-mono`.
- All consumed via Tailwind utilities (`text-brand-strong`,
  `bg-cream-soft`, etc.). No magic hex values inline — keep that way.

### Routing
- App Router under `src/app/`. Key pages:
  - `/` (home, hero copy lives here at `src/app/page.tsx:142`).
  - `/category/[slug]`, `/category/[slug]/[subSlug]` — current
    1-and-2-level catalog (149 lines for category page).
  - `/categories` (the index).
  - `/product/[id]` (detail w/ gallery — committed earlier).
  - `/search`, `/cart-equivalent` (`/quote`), `/seller`, plus marketing
    pages (about, faq, how-it-works, pricing, shipping, terms, privacy).
- Header nav at `src/components/header-nav.tsx` (325 lines). The
  Catalog mega-menu is rendered between the "How it works" link and
  trailing nav items; the dropdown is a `NavigationMenuTrigger` with a
  760px-wide grid that lists categories.

### Product data
- `src/data/products.json` (23 327 lines, **1438 raw products**).
- `src/data/catalog.ts` (602 lines) curates: drops `REMOVED_SKUS`,
  appends `ADDED_PRODUCTS`, merges the legacy "Polar Camel" category
  into `drinkware`, joins `src/data/foma-products.ts` (FOMA's own
  inventory), merges curated multi-view images from
  `src/data/product-images.json`.
- Catalog `Product` type now includes `images?: string[]` (curated
  gallery, optional).

### Current taxonomy + size data
- Existing levels: `category` (Drinkware, Gifts & Promotions, Polar
  Camel, Frames & Decor, Office/Tech, Best Sellers) → `subcategory`
  (118 distinct subcategories like "12oz Water Bottles", "Polar Camel
  20 oz. Tumblers", "Bottle Openers", "Cutting Boards, Cake Pans,
  Kitchen"). Many subcategories already embed size in their name.
- `size` field is dimension-based, not category-size. The values
  describe each individual SKU's physical measurements:
  - Volumes (`"20 oz."`, `"12 oz."`, `"4 oz"`, `"40 oz."`) — mostly
    Polar Camel + drinkware.
  - Linear (`"7 3/4""`, `"5 1/4""`, `"4 1/4""`) — pens, openers, small
    gifts.
  - Rectangles (`"5" x 7""`, `"8" x 10""`, `"5 1/4" x 8 1/4""`) —
    frames, journals, portfolios.
  - Squares + diameters (`"4" x 4""`, `"4" diameter"`).
- 4 products have null `size`. 1434 / 1438 have *some* size string.
- The user's "category / subcategory / size" model maps cleanest to
  drinkware (where size = volume). For non-drinkware the "size" is
  more usefully a per-listing filter than a 3rd nav level — putting
  e.g. "4 1/4"" or "5 1/4" x 8 1/4"" in the mega-menu would be
  unwieldy.

### UI inventory (initial pass)
- `header-nav.tsx`: 325 lines, contains mobile sheet + desktop
  navigation menu + the Catalog mega-menu. Mega-menu currently lists
  **only top-level categories** — no subcategory exposure yet.
- `product-card.tsx`: client component (since the hover-cycle +
  quick-view work earlier); single hero image with hover swap to the
  alternate angle, Quick view modal, Add-to-quote overlay.
- `product-grid.tsx`, `product-banner.tsx`, `product-image.tsx`,
  `product-gallery.tsx`, `product-quick-view.tsx` — gallery work
  committed already.
- Hero on `src/app/page.tsx`: line 142 reads
  `<span className="font-serif text-metallic">We make &amp; ship it.</span>`
  — the styled ampersand glyph is the Phase 1 target.

### Obvious inconsistencies (Phase 3 candidates, NOT changes yet)
- Catalog mega-menu only goes to category-level — opportunity to
  surface popular subcategories.
- `metallic` text color used in one place (hero) — should validate
  the rest of the token system stays consistent.
- Mobile sheet menu is solid; desktop nav has some breakpoint quirks
  around the `1024px` cutover (will verify on responsive sweep).
- Several pages use ad-hoc spacing (`mt-3.5`, `py-1.5`) — will
  inventory and consolidate against a scale during Phase 3 typography
  + spacing pass.

---

## Phase 1 — Quick corrections

(populated as commits land)

## Phase 2 — Size-based sub-categorization

(populated when work begins)

## Phase 3 — Enterprise UI/UX polish

(populated when work begins)

## Phase 4 — Continuous loop + preview deploys

(populated after each green commit; each line is `change — preview: url`)

## Phase 5 — Wrap-up

(populated at session end)

## Needs human review

(populated as items surface)
