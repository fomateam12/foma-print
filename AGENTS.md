<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:foma-overnight (manuel — sync tooling buraya dokunmaz) -->
# FomaPrint — Gece Geliştirme Yönü

## Bağlam
Next.js (proje-içi sürüm — yukarıdaki nextjs-agent-rules'a UY: kod
yazmadan önce node_modules/next/dist/docs/ oku) + Tailwind.
Üç giriş noktası: self-service retail, B2B POD/blind-ship, lokal toplu baskı.
Şu an redesign/b2b-unify dalındayız.

## Kurallar
- Tüm müşteriye dönük metin İNGİLİZCE.
- Mevcut tasarım dilini/komponent yapısını bozma.
- Küçük commit'lerle ilerle; her tamamlanan maddeden sonra commit at.
- Emin olmadığın mimari kararı YAPMA — AGENTS.md'ye not düş, sabaha bırak.
- node_modules, .env, secret'lara dokunma.

## Bu haftanın gece görevi
- [ ] (madde 1)
- [ ] (madde 2)

## Gece durumu — 2026-06-26 (image gallery binding)
- Şube: `gece/20260626` (commits `5d2842f` → `84971b5`); GitHub'a push edildi
  (`github.com/eymen160/foma-design`).
- Eşleşme: 1279/1279 katalog SKU'su (REMOVED_SKUS sonrası), 4609 görsel URL'si
  (tire-separator extension dahil). Eşleme stratejisi: filename'in **leading
  alnum run**'ını adaya çevirir, SKU set'ine case-insensitive **exact** match —
  fuzzy / prefix-strip yok. Letter-ending SKU testleri (GFT254A) regresyon
  vermiyor. Detay: `overnight-image-report.md` (kök).
- Hosting: **Vercel Blob denedik, Hobby tier 1 GB cap'i aştı → Cloudinary'e
  pivot ettik.** Cloudinary cloud `mxepungb`, 4609 dosya yüklendi
  (8.24 GB, ~25 dk). Vercel project env'da `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=mxepungb`
  Production + Preview için set. `src/lib/cloudinary-loader.ts` (custom next/image
  loader) build-time'da `/products/...` paths → `res.cloudinary.com/mxepungb/.../q_auto,f_auto/...`
  URL'lerine çevirir. `next.config.ts` rewrite YOK — loader doğrudan halleder
  (next/image optimizer rewrite'ları follow etmiyordu, ilk preview'da broken'dı).
- UI: detail page'de `ProductGallery` (hero + thumbnail strip, arrow nav),
  listing card'da hover-cycle (PNG/JPG dupe atlanır, ilk DIFFERENT-stem URL'i
  swap için seçilir), her kartta "Quick view" pill → modal'da aynı galeri +
  add-to-quote.
- Deploy: GitHub'a bağlı, `main` → production (`foma-design.vercel.app`),
  her branch push → preview URL. CI yaml yok — Vercel pipeline yeter.
- Cross-machine handoff: `DEPLOY.md` (kök) — clone-to-deploy walkthrough, env
  var tablosu, image library lifecycle, prod cutover checklist.
- Yardımcı script'ler `.scrape/overnight/`'ta (gitignore'lu):
  `build_image_report.py` (matching + sidecar), `place_images.py` (APFS clone),
  `upload_to_cloudinary.mjs` (idempotent, deterministic public_id).
- Bekleyen karar: 290 SKU hâlâ <3 görselli — supplier dump'ta yok. Çözüm
  yolları için raporun "Next steps" kısmı.
<!-- END:foma-overnight -->

## Gece durumu — 2026-06-26 23:00 (UI/UX polish + size taxonomy)
- Şube: `gece/20260626` üzerine 6 yeni commit (`e11a4c8` → `0624753`).
  Push edilmedi (`git push *` deny aktif). Detay: `overnight-report.md`
  (kök, living log) + `DEPLOY-CHECKLIST.md` (kök, prod cutover guide).
- **Phase 1:** Hero subline glyph fix — `font-serif text-metallic`
  swash ampersand'i `@`'ye benziyordu, "and"a çevrildi (homepage +
  sell page).
- **Phase 2:** Size derivation + filtering.
  - `src/lib/product-taxonomy.ts` — `normalizeSize()` raw `size`
    field'ı 5 bucket'a böler (oz/rect/inch/diam/other). Strict-by-default,
    bilinmeyen format `other` bucket'a düşer, asla guess yok.
  - `src/components/catalog-filters.tsx` — server-rendered chip
    filter rail, repeating `?size=&sub=` query params, no JS.
  - `/category/[slug]` ve `/category/[slug]/[subSlug]` filter'a kavuştu;
    no-filter case'inde mevcut layout korunur — hiçbir URL kırılmadı.
  - Catalog mega-menu'ye kategori altında 4 subcategory link'i eklendi
    (data zaten geliyordu, gösterilmiyordu).
- **Phase 3:** Filter rail viewport-bounded scroll, `aria-current="page"`
  active sibling-pill'de. Daha geniş bir typography/spacing sweep
  yapmadım — mevcut sistem zaten tutarlı, sweep churn olur (gerekçe
  raporda).
- Preview branch alias: `foma-design-git-gece-20260626-foma1.vercel.app`
  (her green commit sonrası `vercel --yes` ile preview deploy).
- Prod'a giden yol: `DEPLOY-CHECKLIST.md` "Commands to ship" bloğu —
  human çalıştırır, agent değil (`vercel --prod` + `git push *`
  ikisi de deny rule'da).
