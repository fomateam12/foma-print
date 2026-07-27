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
