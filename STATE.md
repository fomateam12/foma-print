# STATE — fomaprint.com (repo: foma-print)

> **Bu dosya ne?** İnsan + yapay zekâ asistanları (Claude Code, ChatGPT) arasındaki ortak durum dosyası. Bir asistana iş verirken bu dosyayı ver; iş bitince güncellenip commit'lenir. "KİLİTLİ KARARLAR" tartışmaya kapalıdır.

_Son güncelleme: 2026-07-27 (Claude) — son iş: 21 Tem SEO/GSC düzeltmesi_

## Proje kimliği
- Next.js vitrin sitesi, **CANLI**: www.fomaprint.com (Vercel, main → prod auto-deploy; rollback = git revert).
- Yerel klasör: `C:\Users\fomaf\fomaprint`. Ürün görselleri Cloudflare R2 (bucket: foma-design, rclone remote `r2`).
- **ASIL AMAÇ**: Printify print-provider başvurusu için vitrin; site canlı, başvuru engeli kalktı.
- Siparişler FomaFlow'a (app.fomahub.com) düşer; ortak anahtar SKU.

## Canlıda çalışan büyük parçalar
- ~919 sayfalık katalog (JDS 34.913 SKU'luk master CSV kaynaklı) + elle eklenen ürünler (`foma-products.ts`).
- Gizli partner kataloğu: `/catalog` şifreli (kod: FomaPartner2026, Vercel `CATALOG_PASSWORD` ile değişir; giriş `/catalog-giris`). Fiyatlar SADECE kullanıcının xlsx'inden — feed price sahte.
- SEO: canonical düzeltildi (vercel.app → fomaprint.com), GSC property + sitemap kuruldu. `public/googled*.html` SİLİNMEZ.
- Kategori lifestyle bannerları: harita `src/lib/category-banners.ts`, dosyalar `public/banners/`; yeni kategori = 1 görsel + 1 map kaydı.

## KİLİTLİ KARARLAR
1. **SKU altın kural**: ürün eşleşmesi sadece SKU ile; isimle eşleştirme YASAK.
2. Yeni ürün eklerken "her yere ekle": Excel + site kataloğu + R2 — önce mükerrer kontrolü.
3. Deri renk paleti: 12 Leatherette Journals rengi = ana palet; kardeş ürünler ona senkronlanır.
4. Kazıma tonu müşteri seçimi DEĞİL — malzemenin sabit sonucu, 1. üründen alınır.
5. Otonom charter: bu projede işler sorulmadan prod'a gider; emniyet kemeri = verify-green + rollback.

## Ortam notları (bu makine)
- node/gh PATH dışında; npm `--use-system-ca` ister; curl `--ssl-no-revoke` ister.

## Sırada / açık işler
- LZB ürünü Shopify tarafında DRAFT, fiyat onayı bekliyor (dağıtım boru hattı: FomaHub master → fomaprint + Shopify, ItemAsset kanal-özel görsel tablosu kuruldu).

## Çift dillilik (28 Tem 2026 — CANLI)
- Site artık İngilizce + Türkçe. İngilizce varsayılan ve **çıplak URL'lerde kalır** (`/pricing`); Türkçe `/tr` önekiyle (`/tr/pricing`). `/en/...` çağrıları çıplak sürüme 308 ile döner — mevcut Google indeksi bozulmadı.
- Rota ağacı `src/app/[lang]/...`; `src/proxy.ts` (Next 16'da middleware'in yeni adı) çıplak yolları dahili olarak `/en/...`'e rewrite eder.
- Metinler: `src/dictionaries/en.json` + `tr.json`. **Bileşene metin yazılmaz.** `en.json` hem tipi hem çalışma zamanı yedeğini verir (çevrilmemiş anahtar İngilizce basar, boş kalmaz).
- Katalog verisi: `src/data/catalog-tr.json` (7 kategori + 54 alt kategori + 847 ürün adı + blurb'ler). `products.json` İNGİLİZCE KALIR — tedarikçi feed'i ve SKU sözleşmesi.
- Ürün açıklamaları şablondan üretilir; şablon sözlükte (`src/lib/product-copy.ts`), böylece feed değişince çeviri bayatlamaz.
- Dil seçici header'da (globe + EN/TR), gerçek `<a>` linkleri; hreflang + canonical + çift dilli sitemap (1838 URL) kuruldu.
- Bilerek İngilizce: şifreli `/catalog` partner fiyat listesi (Printify/partner başvurusu için İngilizce belge) ve `/styleguide`. Hukuki sayfalar çevrildi ama TR sürümde "uyuşmazlıkta İngilizce geçerlidir" notu var.
- Çeviri boru hattı: `.scrape/i18n/` (gitignore'lu) — `dump-catalog.mts`, `translate.py` (katalog), `translate-dict.py` (sözlük), `UI-GLOSSARY.md`. DERS: Codex alt süreçte TTY olmayınca stdin bekleyip kilitleniyor → `stdin=DEVNULL` şart.
