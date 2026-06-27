# Production Cutover Checklist — Overnight 2026-06-26 → 2026-06-27

> **Latest preview (branch alias, always tracks the latest deploy on
> the overnight branch):**
> https://foma-design-git-gece-20260626-foma1.vercel.app
>
> **Branch to merge:** `gece/20260626`
>
> **Author:** Overnight Claude run; commits are local to your machine
> until you `git push` (see commands below).

---

## What changed this overnight (summary by phase)

### Phase 1 — Quick corrections
- Hero subline "We make and ship it." — the styled `font-serif
  text-metallic` ampersand glyph was rendering close enough to "@" to
  look unprofessional. Replaced with the word "and" in both spots
  (`src/app/page.tsx`, `src/app/sell/page.tsx`).

### Phase 2 — Size sub-categorization (the structural feature)
- New derived size + bucket from each product's raw `size` field —
  `src/lib/product-taxonomy.ts`. Strict-by-default: products with an
  unrecognized shape are flagged `bucket: "other"`, never imputed.
- New chip filter sidebar — `src/components/catalog-filters.tsx`.
  Server-rendered, no JS, toggles via repeating `?size=&sub=` query
  params. Bucket headings ("Volume", "Dimensions", "Length",
  "Diameter") group chips by size shape so each category reads
  naturally.
- `/category/[slug]` switches to a 2-pane layout when any filter is
  active; falls back to the original tiles + Popular grid when no
  filter is set — every existing URL still resolves.
- `/category/[slug]/[subSlug]` adds an inline size filter when the
  subcategory has 2+ distinct sizes; the sibling-collection pill row
  gains `aria-current="page"` for screen readers.
- Catalog mega-menu in the header now lists up to 4 subcategories
  under each top-level category (data was already there, just unused).

### Phase 3 — Enterprise polish
- Filter rail height capped at viewport on `lg+` with scroll, so
  Drinkware / Polar Camel no longer push the grid off-screen.
- Multiple small a11y polishes called out in `overnight-report.md`.

Full commit list (most recent first):
```
0624753 a11y(subcategory): aria-current="page" on active sibling-pill
962f5f9 polish(filters): bound rail height on lg so long facet lists scroll
cdaf42c feat(subcategory): inline size filter when 2+ distinct sizes
53480a1 feat(nav): show top subcategories under each category in mega-menu
4b74064 feat(catalog): size + collection filters on category page
e11a4c8 fix: hero copy — replace styled ampersand with "and"
```

Earlier overnight work (Cloudinary + gallery, already deployed on
preview) sits underneath these. See `overnight-report.md` for the
complete change log.

---

## Reviewer's punch list (before merging to `main`)

Open the branch-alias preview and walk these flows:

- [ ] `/` (home) — hero subline reads "We make and ship it." cleanly.
- [ ] `/category/drinkware` — no filters → tiles + Popular grid (same
      layout as before). Tap a "Volume" chip (e.g. `20 oz`) → grid
      narrows; URL is `?size=20+oz`. Tap a second size → multi-select.
- [ ] `/category/drinkware?size=20+oz` (paste directly) — server
      renders into the filtered state without a flash of unfiltered.
- [ ] `/category/drinkware/polar-camel-20-oz-tumblers` — size filter
      hidden because all SKUs are 20 oz (one distinct size). Layout
      reverts to single-grid.
- [ ] `/category/frames-and-decor` — "Dimensions" facet shows
      `4" x 6"`, `5" x 7"`, `8" x 10"` etc.
- [ ] Header mega-menu shows up to 4 subcategories under each
      category. Mobile sheet menu already had the full list.
- [ ] Tab through the catalog: skip-link visible, focus rings on
      every interactive element, sibling pills announce
      "Current page" when active.
- [ ] Smoke-test the gallery (carries over from earlier overnight
      work): `/product/bpn101` (6 views), `/product/ds10` (1 view),
      `/product/foma-tumbler-40oz` (FOMA fallback).

If anything looks off, the offending commit is small enough to revert
in isolation — see "Rollback" below.

---

## Commands to ship (the human runs these)

Production is intentionally **not** deployed by the agent. Run these
in order from this checkout:

```bash
# 1. Push the overnight branch to GitHub (agent can't — git push is denied).
git push origin gece/20260626

# 2. Open the diff on GitHub and review.
gh pr create --base main --head gece/20260626 \
  --title "Overnight: size taxonomy + filters + hero polish" \
  --body "$(cat DEPLOY-CHECKLIST.md)"

# 3. After review, merge the PR (squash or merge-commit — your call).

# 4. Vercel auto-deploys main → production (foma-design.vercel.app
#    + custom domain when wired). Watch the deployment from:
#      https://vercel.com/foma1/foma-design/deployments
#
#    Alternatively (manual prod deploy from CLI):
vercel deploy --prod
```

---

## Anything needing a human decision

Carried forward from earlier overnight work — none of these block
shipping the taxonomy/UI work, but the human should sign off:

- **290 SKUs have <3 images.** The supplier dump simply doesn't have
  more views for those products. Decision: live with it, request
  views from supplier, or remove from the public catalog.
  See `overnight-image-report.md`.
- **`other` size bucket (~50 items per large category)** —
  supplier-side typos in the `size` strings. Worth a one-time data
  fix or a future extension of `normalizeSize()`. Not blocking.

---

## Rollback

If a problem is spotted post-merge:

```bash
# Revert a single commit (most recent first):
git revert 0624753   # aria-current
git revert 962f5f9   # filter scroll cap
git revert cdaf42c   # subcategory filter
git revert 53480a1   # mega-menu subcategories
git revert 4b74064   # catalog filters
git revert e11a4c8   # hero copy

# Or revert the entire overnight session in one shot by resetting
# main back to the commit BEFORE the overnight work (last commit
# before `e11a4c8`):
git reset --hard <pre-overnight-sha>     # destructive — only on a fresh checkout
```

Reverting `4b74064` (catalog filters) also makes `cdaf42c`
(subcategory filter) and `962f5f9` (scroll cap) effectively dead code
— they reference `CatalogFilters`. Revert them as a group if you
revert the catalog filter.

---

_Generated by the overnight Claude run. See `overnight-report.md` for
the live development log + the full phase-by-phase notes._
