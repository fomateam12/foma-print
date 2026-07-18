---
name: add-product
description: FOMA katalogundaki "her yere ürün ekle" prosedürü — yeni ürün Excel + site katalogu + R2 görselleri olmak üzere üç yere birden eklenir; önce mükerrer kontrolü yapılır.
---

# Skill: Add Product (her yere birden)

## Tetikleyici
Kullanıcı yeni ürün eklemek istediğinde ("şu ürünü ekle", "add this product",
bir JDS SKU'su veya Etsy/tedarikçi linki paylaştığında).

## Altın kurallar
- Ürün eşleştirme HER ZAMAN SKU ile yapılır (JDS SKU veya FOMA kendi SKU'su).
  İsimle eşleştirme YASAK.
- Renkli ürün ailelerinde renk-başına FOMA SKU şeması: `TM-FOMA-{COLOR}`.
- Kazıma rengi müşteri seçimi DEĞİLDİR; ürün malzemesinin sabit sonucudur —
  ürünün 1. resminden alınır.
- 12 Leatherette Journals rengi ana deri paletidir; deri ürün kardeşleri bu
  palete renk-senkronize edilir.

## Adımlar
1. **Mükerrer kontrolü** — SKU'yu `src/data/products.json`, `src/data/catalog.ts`
   (ADDED_PRODUCTS / REMOVED_SKUS) ve manuel ürün dosyasında ara. Varsa dur,
   kullanıcıya bildir.
2. **SKU verisini bul** — JDS ürünü ise önce `products.json`'a bak; yoksa
   JDS master CSV'de ara (34.913 SKU; Downloads'ta ve R2 `_data/` altında).
3. **Excel'e ekle** — `fomaprint liste (N).xlsx` fiyat listesine satır ekle
   (fiyatlar SADECE kullanıcının xlsx'inden gelir; feed price'a güvenme).
4. **Site kataloguna ekle** — JDS-dışı manuel ürünler `foma-products.ts`
   üzerinden; JDS ürünleri catalog.ts curation katmanından. Mevcut ürünlerin
   alan yapısını birebir kopyala.
5. **Görselleri R2'ye yükle** — bucket `foma-design`, rclone remote `r2`.
   Görseller self-host edilir (`public/` veya R2), hotlink yok.
   - Düşük çözünürlüklü görsel → 4K upscale → R2'ye `{SKU}_hd.jpg` →
     `product-images.json`'a yeniden bağla.
   - JDS palet PNG'lerinde yeşil mat sorunu varsa: beyaza bindir → R2 →
     catalog rebind.
6. **Doğrula** — `npm run build` yeşil; eklenen SKU'nun sayfası render oluyor;
   görsel URL'lerine `curl -sI` ile 200 + doğru content-type kontrolü.

## Çıktı
Kısa özet: SKU | Excel satırı | katalog dosyası | R2 yolu | build durumu.
