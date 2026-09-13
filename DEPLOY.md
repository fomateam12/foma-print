# FomaPrint — Deploy & Cross-Machine Setup

Production (www.fomaprint.com) runs on a Hetzner server since 2026-09-01.
Pushing or merging to `main` deploys it automatically through
`.github/workflows/deploy-hetzner.yml` — from any machine, no server access
needed. Vercel still builds every push (`foma-design.vercel.app` plus branch
previews), but the domain no longer points there.

## Production — Hetzner

| | |
|---|---|
| Host | Hetzner CPX11 `5.161.100.234` — Docker + Caddy (automatic Let's Encrypt) |
| App dir | `/opt/fomaprint` — a git checkout of `main` plus the server-only `.env` |
| Stack | `docker-compose.yml`: `app` (Next.js, `Dockerfile`) behind `caddy` (`Caddyfile`) |
| Deploy script | `deploy/hetzner/deploy.sh`, installed as `/usr/local/bin/fomaprint-deploy` |
| Logs | the Actions run, and `/var/log/fomaprint-deploy.log` on the host |
| Secrets | `DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_KNOWN_HOSTS` (repo → Settings → Secrets → Actions) |

What a push to `main` does:

1. The **Deploy to Hetzner** workflow opens an SSH session with `DEPLOY_SSH_KEY`.
   On the host that key is pinned as
   `restrict,command="/usr/local/bin/fomaprint-deploy"`, so it can run the deploy
   script and nothing else — no shell, no forwarding, no choice of branch.
2. The script fetches `origin/main`, keeps the serving image as
   `fomaprint-app:previous`, builds, and swaps the container.
3. Health check through Caddy on the host: `/`, `/quote`, `/sitemap.xml`, the
   first product page in the sitemap, and one `/_next/image` URL from that page.
4. Any failed check puts the previous image back and turns the run red. A failed
   build never swaps anything.

Day-to-day:

- **Redeploy without a commit:** Actions → Deploy to Hetzner → Run workflow.
- **Undo a bad change:** `git revert` it on `main` and push; the revert deploys like any change.
- **New env var:** add it to `/opt/fomaprint/.env` on the host *before* merging the
  code that reads it (`NEXT_PUBLIC_*` are inlined at build time), and document it in `ENV.md`.
- **Changed `deploy/hetzner/deploy.sh`?** Deploys do not update the host copy — reinstall:
  `scp deploy/hetzner/deploy.sh fomaprint:/usr/local/bin/fomaprint-deploy`.
- **Rotate the deploy key:** new ed25519 pair → replace the pinned line in
  `/root/.ssh/authorized_keys` → update the `DEPLOY_SSH_KEY` secret.

## Branches at a glance

| Branch | Purpose | Deploys to |
|---|---|---|
| `main` | Production | www.fomaprint.com (Hetzner, via Actions) + `foma-design.vercel.app` |
| `redesign/b2b-unify` | B2B unification work | Preview URL per push |
| `gece/20260626` | Overnight image gallery + Cloudinary wiring | Preview URL per push |
| `claude/*` | Experimental / archive | Preview URL per push |

## First-time setup on a new machine

```bash
# 1. Clone
git clone git@github.com:eymen160/foma-design.git
cd foma-design

# 2. Install deps (Node 20+; the deployed env uses Node 24 LTS by default)
npm install

# 3. Local env — copy the values from Vercel project Settings → Environment
#    Variables. .env.local is gitignored.
cat > .env.local <<'EOF'
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=mxepungb
EOF

# 4. Run dev
npm run dev
# → http://localhost:3000

# 5. Build sanity check
npm run build
```

Vercel CLI is optional for local work, useful for one-off preview deploys:

```bash
npm i -g vercel
vercel login
vercel link        # one-time; reuses .vercel/project.json that's already in repo
vercel deploy      # preview
vercel deploy --prod
```

## Environment variables

These live on the Vercel project (Settings → Environment Variables) and are
injected at build time. Set them with the same value in Production + Preview
(+ Development if you want them locally without `.env.local`).

| Key | Purpose | Where set |
|---|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud that hosts the curated product gallery (`/products/{SKU}/{file}` URLs in `src/data/product-images.json` are rewritten through `src/lib/cloudinary-loader.ts` to `res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto/...`). | Vercel project |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Required ONLY to (re)run `.scrape/overnight/upload_to_cloudinary.mjs`. Local shell only — never committed, never in Vercel project. | Local shell |
| `RESEND_API_KEY` / SMTP creds (if any) | Email transport for `seller-application` + quote intake. | Vercel project |

If you add new envs, also add a one-line description to this table so the
next developer doesn't have to spelunk the codebase to figure out what
they're for.

## Deploy flow

```
local commit → git push origin <branch>
                          ↓
                  GitHub webhook
                          ↓
              Vercel build pipeline
                          ↓
       ┌──────────────────────────────────────┐
       ↓                                      ↓
 non-main push → preview URL          main push → production URL
 (foma-design-xxx.vercel.app)         (foma-design.vercel.app)
```

This Vercel flow still runs, but since the domain moved it only feeds
`foma-design.vercel.app` and previews — production is the Hetzner workflow
above. If you ever need cross-PR checks (typecheck, lint) outside of the
deploy, add `.github/workflows/check.yml` and gate it there.

## Image library — the big idea

The supplier ships a single image per SKU (existing `product.image` /
`product.imageFull` Cloudinary URLs in the `business-products` cloud).
Overnight on 2026-06-26 we bound 4 609 additional curated views to 1 279
catalog SKUs:

- Source: bulk supplier dump unpacked under `~/foma-design/.scrape/incoming/`
  (gitignored — never commit).
- Matching: `python3 .scrape/overnight/build_image_report.py` writes
  `src/data/product-images.json` (the canonical SKU → URL list) and
  `overnight-image-report.md` (auditable report). Re-run any time the dump
  changes.
- Local clone: `python3 .scrape/overnight/place_images.py` APFS-clones the
  bound files into `public/products/{SKU}/{file}` for dev. The `/public/products/`
  tree is **gitignored** because it would be 8.3 GB on Vercel.
- Hosting: `node .scrape/overnight/upload_to_cloudinary.mjs` uploads the
  bound files to Cloudinary with deterministic `products/{SKU}/{file}`
  public_ids (no random suffix, overwrite-safe). Idempotent — re-running
  skips files already present in the store.
- Render: `<Image src="/products/{SKU}/{file}.png">` everywhere; the
  custom loader in `src/lib/cloudinary-loader.ts` turns those into
  absolute Cloudinary URLs at build time, gated on
  `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`. When the env is unset (a fresh
  machine without `.env.local`), the loader passes the path through and
  Next serves from `./public/products/` — local-only fallback that works
  iff `place_images.py` has been run.

If you need to re-bind images after a fresh scrape:

```bash
# (assuming a new supplier dump dropped under .scrape/incoming/)
python3 .scrape/overnight/build_image_report.py
python3 .scrape/overnight/place_images.py
# Verify build is green:
npm run build
# Push to Cloudinary:
CLOUDINARY_CLOUD_NAME=mxepungb \
CLOUDINARY_API_KEY=xxx \
CLOUDINARY_API_SECRET=xxx \
  node .scrape/overnight/upload_to_cloudinary.mjs
git add src/data/product-images.json overnight-image-report.md
git commit -m "Re-bind product images"
git push
```

## Production cutover checklist

When `gece/20260626` is ready to ship:

1. Local: `npm run build` clean.
2. Open a PR from `gece/20260626` to `main`, review the diff (especially
   `next.config.ts`, `src/lib/cloudinary-loader.ts`, `src/data/types.ts`,
   `src/components/product-gallery.tsx`, `src/components/product-card.tsx`,
   `src/components/product-quick-view.tsx`).
3. Confirm Vercel project has `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=mxepungb`
   on **Production**.
4. Merge → Vercel auto-deploys main to production.
5. Smoke test: `/product/bpn101` (multi-view), `/product/ds10` (single view),
   `/product/foma-tumbler-40oz` (FOMA fallback), `/category/drinkware` grid
   (hover swap), Quick view modal on any card.

## Safety rails

- `.gitignore` excludes `/.scrape/`, `/public/products/`, `.env*`, `.vercel/`,
  `node_modules`, `.next` — none of those ever ship to GitHub.
- `.vercelignore` re-asserts the heavy excludes so the deploy bundle stays
  under the 15 000-file Vercel CLI limit.
- `.claude/settings.json` denies the destructive commands the agent can run
  unsupervised (`rm -rf *`, `git reset --hard *`, `curl * | *`). `git push *`
  was lifted temporarily for the initial GitHub push and should be restored
  after this commit lands.
