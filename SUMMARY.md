# FomaPrint — B2B Unification & Production Polish — SUMMARY

Branch: `redesign/b2b-unify` (11 commits ahead of `main`). **Not merged, not deployed to production.**
Build: `npm run build` ✓ green — 1621 static pages, TypeScript clean, ESLint 0 errors / 0 warnings.

FomaPrint is positioned as a **B2B white-label print-on-demand / laser-engraving / dropship supplier**:
resellers list our catalog under *their* brand; we personalize, produce and blind-ship from the USA.

## What shipped, by priority

### P1 — Global shell + no-gold design system  (`f3c8571`)
- Pivoted the entire accent system from **brass/gold → a single earthy RUST** (`--rust #a8481e`,
  `--metallic` is now a rust gradient, not gold foil). Warm cream surfaces, deep navy ink.
- Fonts: Hanken Grotesk (headings) + Inter (body).
- Header nav: How it works · Catalog · Shipping · FAQ · Become a Seller. Logo bug fixed.

### P2 — Home rebuilt as B2B + signature live product banner  (`9acb8c1`, `070656a`)
- Hero: "Print under your brand. **We make & ship it.**" → Apply to Sell / View Catalog,
  trust chips (White-label · Next-day production · No MOQ), stat row.
- **§9 ProductBanner**: an auto-scrolling marquee of curated high-margin JDS SKUs under the hero,
  each linking to its product page with a `from $X` wholesale price.
- Per later feedback, the hero's right-side product collage was removed and the hero centered.
- Why-margin / how-it-works / channels copy retuned for resellers.

### P3 — Cleanup  (`a0c33fc`, `dfcabe1`, `fe0b146`)
- Removed the `/custom-order` flow → **308 redirect to `/quote`** (next.config), links repointed,
  sitemap updated, schema + email + API route deleted.
- Removed the per-product "Bestseller/New" pill from cards and PDP (the **Best Sellers category stays**).
- Reconciled product counts through a single `getProductCount()` source.

### P4 — New content pages  (`e48af86`)
- `/how-it-works` (6 numbered steps + manual-entry footnote), `/shipping` (turnaround, white-label
  packaging, tracking, lost/damaged), `/faq` (accordion).

### P5 — Forms, placeholders, production states  (`793d2fd`, `7537ff1`)
- `/quote`: completed the §8 RFQ brief — added **sales channels** (Etsy/Shopify/Amazon/…) and
  **monthly volume**; both flow through validation, the admin email and the lead CSV/log.
- `/login` + `/seller`: polished "FomaFlow · Coming soon" placeholders in the rust palette.
- Production states: existing `error.tsx` / `not-found.tsx` / quote empty+loading screens verified;
  added a reusable `ProductGridSkeleton` + `loading.tsx` for the category, subcategory and
  product-detail routes. Retired the last gold hex (`#caa45a`) in the email template.

## QA
Manual responsive pass at **390 / 768 / 1280 / 1440 px** on home, the product banner, `/quote`
(empty + filled), and `/how-it-works`. No horizontal overflow; hero, banner and quote form all
reflow cleanly. (Captured via the live preview tool — see BLOCKERS for the screenshots-to-disk note.)

## Not done
- **By instruction:** no merge to `main`; no production deploy. `foma-design.vercel.app` is
  untouched. All work stays on `redesign/b2b-unify` (12 commits ahead).
- **Blocked (needs one human step):** the Vercel *preview* deploy couldn't be triggered
  unattended — no Vercel CLI/auth token and no git remote in this environment, and the MCP deploy
  tool is advisory only. One command finishes it: `npx vercel deploy` (preview, **not** `--prod`).
  See BLOCKERS.md for the full hand-off + the git-push alternative.
