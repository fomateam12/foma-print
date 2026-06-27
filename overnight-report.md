# Overnight Session — 2026-06-26 → 2026-06-27

> **Latest preview (branch alias — always tracks the latest deploy on
> `gece/20260626`):** https://foma-design-git-gece-20260626-foma1.vercel.app
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

- **`e11a4c8` fix: hero copy — replace styled ampersand with "and".**
  Both spots that used `font-serif text-metallic` for the swash
  ampersand glyph (homepage hero subline; sell-page hero subline)
  rendered close enough to "@" to look unprofessional. Replaced with
  "and" — layout, color, typography preserved. Other `&amp;`
  occurrences (terms / privacy / opengraph / nav eyebrow) kept as-is
  because they use default sans where the glyph reads correctly.

## Phase 2 — Size-based sub-categorization

- **`4b74064` feat(catalog): size + collection filters on category page.**
  New `src/lib/product-taxonomy.ts` derives a canonical size + bucket
  (oz / rect / inch / diam / other) from each product's raw `size`
  field — `normalizeSize()` is conservative: products with an
  unrecognized format are flagged `bucket: "other"` and never imputed.
  New `src/components/catalog-filters.tsx` renders a server-rendered
  chip sidebar; toggling a chip rewrites the URL with repeating
  `?size=…&sub=…` params (no JS / no URL break — old links still work).
  `/category/[slug]` switches to a 2-pane layout when filters apply
  and falls back to the original subcategory tiles + Popular grid
  when no filters are active.
- **`53480a1` feat(nav): show top subcategories under each category in
  mega-menu.** The Catalog mega-menu had only top-level categories.
  Now renders up to 4 subcategories per category (data was already
  flowing through the `NavCategory.subcategories` prop, just unused),
  indented under the category card, with muted typography so the
  parent stays the visual anchor.

### Size-derivation outcome (per category)

| Category | Recognized formats | "Other" bucket |
|---|---|---|
| Polar Camel | 163 oz volumes (16 distinct), 236 inches (14 distinct), 6 diameter | 19 items + 3 with no size |
| Drinkware | 78 inches, 95 rect, 30 diameter | 15 items (mostly `2 oz. 2 3/8"` combo strings) |
| Frames & Decor | 110 rect, 2 inches, 2 diameter | 0 |
| Office/Tech | 21 inches, 224 rect | 16 items (typos like `9 1/2" x 12` missing close-quote) |
| Gifts & Promotions | mixed (inches + rect dominant) | small tail |

The 50-odd items in the "other" bucket per category surface in the
filter UI as their own facet group; they are not lost and not guessed.

## Phase 3 — Enterprise UI/UX polish

- **`cdaf42c` feat(subcategory): inline size filter when 2+ distinct
  sizes.** Subcategory pages mirror the category-page filter rail
  pattern: when the collection has at least two normalized sizes the
  page switches to the 2-pane layout. Collections with only one size
  (or none — e.g. "Bottle Openers") keep the original single-grid
  layout, no empty filter rail.
- **`962f5f9` polish(filters): bound rail height on lg so long facet
  lists scroll.** Big categories (Drinkware, Polar Camel) produced a
  filter sidebar taller than the viewport, which pushed the grid
  scroll-target off-screen. Cap at `calc(100vh - 7rem)` with
  overflow-y-auto on lg+; sticky positioning still holds it in view
  as the grid scrolls.
- **`0624753` a11y(subcategory): `aria-current="page"` on the active
  sibling-pill.** Visual treatment was already correct; screen readers
  now get the same signal.

Polish items I evaluated but **did not** ship — each was either
duplication of existing system or speculative-without-clear-value:

- A separate `.text-h4` / `.text-body` utility — the Hanken Grotesk +
  Inter pairing already reads consistently at default Tailwind sizes;
  adding more utility names would invite drift.
- Replacing ad-hoc `mt-3.5` / `py-1.5` paddings with strict 4/8 scale —
  the existing spacing is intentional in several places (eyebrows
  vs. body text rhythm) and a global sweep would be high-risk churn.
- Adding a "Sort by" dropdown on category grids — categories are
  curated to be browseable; B2B buyers don't typically sort by price
  on a wholesale catalog and the existing taxonomy + filter is enough.

## Phase 4 — Continuous loop + preview deploys

Each line: `commit — change — preview URL`. The branch-alias URL at
the top of this file always points at the most recent green deploy.

- `e11a4c8` hero copy fix — preview: https://foma-design-git-gece-20260626-foma1.vercel.app
- `4b74064` catalog filters — preview: https://foma-design-git-gece-20260626-foma1.vercel.app
- `53480a1` mega-menu subcategories — preview: https://foma-design-git-gece-20260626-foma1.vercel.app
- `cdaf42c` subcategory size filter — preview: https://foma-design-git-gece-20260626-foma1.vercel.app
- `962f5f9` filter rail scroll cap — preview: https://foma-design-git-gece-20260626-foma1.vercel.app
- `0624753` aria-current on sibling pill — preview: https://foma-design-git-gece-20260626-foma1.vercel.app

## Phase 5 — Wrap-up

Final state on `gece/20260626`:

| File | Touched | Purpose |
|---|---|---|
| `src/app/page.tsx` | edited | Phase 1 hero text |
| `src/app/sell/page.tsx` | edited | Phase 1 hero text |
| `src/lib/product-taxonomy.ts` | new | Size derivation + facet helpers |
| `src/components/catalog-filters.tsx` | new | Server-rendered chip filter rail |
| `src/app/category/[slug]/page.tsx` | rewrote | 2-pane filterable layout |
| `src/app/category/[slug]/[subSlug]/page.tsx` | extended | Inline size filter + a11y |
| `src/components/header-nav.tsx` | edited | Subcategory links in mega-menu |
| `overnight-report.md` | this file | Living briefing |
| `DEPLOY-CHECKLIST.md` | new | Production cutover guide |
| `AGENTS.md` | small note | Overnight pointer line |

Build state: `npm run build` green, 1352 static pages, no TS errors,
no lint output (`npm run lint` would run eslint but isn't called by
the build pipeline here).

## Needs human review

- **290 SKUs still ship with <3 images.** Data gap from the supplier
  dump — flagged in `overnight-image-report.md`. Decision required
  (live with it, source from supplier, scrape FOMA's own bank).
- **Size derivation for the `other` bucket (~50 items per large
  category).** Strings like `"2 oz. 2 3/8""` or `"9 1/2" x 12"`
  (missing close-quote) are real supplier typos. Worth a one-time
  pass to either fix in source data or extend `normalizeSize()` —
  the strict-by-default behavior is the right starting point.
- **Production deploy is intentionally NOT done.** See
  `DEPLOY-CHECKLIST.md` for the exact commands; my permissions block
  prod and `git push` regardless.

## Needs human review

(populated as items surface)
