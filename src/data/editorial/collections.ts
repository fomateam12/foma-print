import type { EditorialEntry } from "@/data/category-editorial";

/**
 * Collection (subcategory) copy, keyed `"<categorySlug>/<subSlug>"`.
 *
 * Collections carry the commercial search intent — a buyer searches "40 oz
 * tumblers wholesale" or "blank leatherette journals", not "drinkware" — so
 * these pages get the specific numbers: capacities, dimensions, press
 * settings, what the engraving actually looks like on that blank.
 *
 * Coverage is deliberately partial. A collection with no entry renders no
 * editorial block at all; filler prose would put the page straight back in
 * the duplicate bucket these entries exist to get it out of.
 */
export const COLLECTION_COPY: Record<string, EditorialEntry> = {
  "drinkware/20-oz-tumblers-all": {
    en: {
      intro: [
        "The 20 oz tumbler is the default size of the personalized-drinkware market — big enough to be a daily driver, small enough to fit a car cup holder, and light enough that shipping does not eat the margin. It is the size most sellers start with and the one that keeps selling once the seasonal spikes are over.",
        "All 20 oz bodies here are double-wall vacuum-insulated stainless steel with a powder-coated exterior. The laser cuts through the coating to the steel, so the engraving reads bright silver against the body colour and stays that way through dishwashers and daily use.",
      ],
      highlights: [
        "Bridesmaid and wedding-party sets",
        "Everyday name and monogram listings",
        "Corporate team gifts in a single brand colour",
      ],
      faqs: [
        {
          q: "Does a 20 oz tumbler fit in a car cup holder?",
          a: "Yes — the tapered base on the standard 20 oz body is designed for a normal vehicle cup holder, which is a large part of why this size outsells the bigger ones for daily use.",
        },
        {
          q: "How much engraving area does a 20 oz tumbler have?",
          a: "The usable wrap area is listed on each product page. In practice a name plus a date, or a monogram with a short line beneath it, sits comfortably without wrapping around to the seam.",
        },
      ],
    },
    tr: {
      intro: [
        "20 oz bardak, kişiselleştirilmiş içecek ürünü pazarının varsayılan ölçüsüdür — günlük kullanıma yetecek kadar büyük, araç bardaklığına girecek kadar küçük ve kargonun marjı yemeyeceği kadar hafif. Satıcıların çoğunun başladığı ölçü budur ve sezon zirveleri geçtikten sonra da satmaya devam eder.",
        "Buradaki tüm 20 oz gövdeler çift cidarlı, vakumlu, toz boyalı paslanmaz çeliktir. Lazer kaplamayı kesip çeliğe iner; kazıma gövde renginin üzerinde parlak gümüş okunur ve bulaşık makinesiyle günlük kullanım boyunca öyle kalır.",
      ],
      highlights: [
        "Nedime ve düğün setleri",
        "Günlük isim ve monogram ilanları",
        "Tek marka renginde kurumsal ekip hediyeleri",
      ],
      faqs: [
        {
          q: "20 oz bardak araç bardaklığına sığar mı?",
          a: "Evet — standart 20 oz gövdenin daralan tabanı normal araç bardaklığı için tasarlanmıştır. Bu ölçünün günlük kullanımda daha büyüklerden fazla satmasının önemli bir sebebi budur.",
        },
        {
          q: "20 oz bardakta ne kadar kazıma alanı var?",
          a: "Kullanılabilir sarma alanı her ürün sayfasında yazılıdır. Pratikte bir isim artı tarih ya da altında kısa bir satır olan bir monogram, dikiş yerine dolanmadan rahatça oturur.",
        },
      ],
    },
  },

  "drinkware/30-oz-tumblers": {
    en: {
      intro: [
        "The 30 oz tumbler is the upsell size: the same body style and the same engraving result as the 20 oz, at a price point buyers accept as the premium option. Listing both sizes from one design is the single easiest way to lift average order value in a drinkware shop.",
        "Double-wall vacuum insulation keeps iced drinks cold through a working day, and the wider wrap area gives a monogram or a longer name more room to breathe than the 20 oz body does.",
      ],
      highlights: [
        "Premium tier alongside a 20 oz listing",
        "Larger monograms and multi-line personalization",
        "Gift sets where the tumbler is the centrepiece",
      ],
      faqs: [
        {
          q: "Is 30 oz better than 20 oz for engraving?",
          a: "It gives you more usable wrap area, so longer names, multi-line text and larger monograms sit better. The engraving result itself — bright steel through the powder coat — is identical.",
        },
        {
          q: "Can I list 20 oz and 30 oz as one product with a size option?",
          a: "Yes, and most sellers do. They are separate SKUs on our side, so send the correct SKU per order and the right body ships.",
        },
      ],
    },
    tr: {
      intro: [
        "30 oz bardak üst satış ölçüsüdür: 20 oz ile aynı gövde tarzı ve aynı kazıma sonucu, alıcının premium seçenek olarak kabul ettiği bir fiyat noktasında. Tek tasarımdan iki ölçüyü birden ilanlamak, bir içecek ürünü mağazasında ortalama sepeti yükseltmenin en kolay yoludur.",
        "Çift cidarlı vakum yalıtımı buzlu içeceği bir iş günü boyunca soğuk tutar; daha geniş sarma alanı ise monograma ya da uzun bir isme 20 oz gövdeden fazla nefes payı verir.",
      ],
      highlights: [
        "20 oz ilanının yanında premium kademe",
        "Büyük monogramlar ve çok satırlı kişiselleştirme",
        "Bardağın merkezde olduğu hediye setleri",
      ],
      faqs: [
        {
          q: "Kazıma için 30 oz, 20 oz'dan daha mı iyi?",
          a: "Daha fazla kullanılabilir sarma alanı verir; uzun isimler, çok satırlı yazı ve büyük monogramlar daha iyi oturur. Kazımanın kendisi — toz boyanın altından çıkan parlak çelik — birebir aynıdır.",
        },
        {
          q: "20 oz ve 30 oz'u tek ilanda ölçü seçenekli satabilir miyim?",
          a: "Evet, satıcıların çoğu böyle yapar. Bizim tarafımızda ayrı SKU'lardır; her siparişte doğru SKU'yu gönder, doğru gövde çıksın.",
        },
      ],
    },
  },

  "drinkware/40-oz-tumblers": {
    en: {
      intro: [
        "The 40 oz handled tumbler is the format that redefined the category. It is bought as a lifestyle object rather than a drink container, which means the personalization is not a nice extra — it is the reason the buyer chose your listing over the one next to it.",
        "The large flat wrap panel is the most forgiving engraving surface in the whole drinkware range: full names, multi-line quotes and wide monograms all fit without crowding, and the handle keeps the design panel facing forward on a desk.",
      ],
      highlights: [
        "Trend-driven listings with names and quotes",
        "Bridesmaid proposals and bachelorette sets",
        "Sports team, school and spirit-wear personalization",
      ],
      faqs: [
        {
          q: "Why do 40 oz tumblers sell at a higher price than 30 oz?",
          a: "Buyers treat the 40 oz handled body as a category of its own, not as a bigger cup, and it carries the retail price to match. For a reseller it is the strongest margin in the drinkware range.",
        },
        {
          q: "How much text fits on a 40 oz tumbler?",
          a: "The flat panel takes a full name plus two or three additional lines comfortably. Exact engraving dimensions are on each product page.",
        },
      ],
    },
    tr: {
      intro: [
        "Kulplu 40 oz bardak, kategoriyi yeniden tanımlayan biçimdir. Bir içecek kabı olarak değil, bir yaşam tarzı nesnesi olarak alınır; yani kişiselleştirme hoş bir ek değildir — alıcının yandaki ilan yerine seninkini seçme sebebidir.",
        "Geniş düz sarma paneli, tüm içecek ürünü yelpazesindeki en affedici kazıma yüzeyidir: tam isimler, çok satırlı sözler ve geniş monogramlar sıkışmadan sığar; kulp da tasarım panelini masada öne bakar hâlde tutar.",
      ],
      highlights: [
        "İsim ve sözlerle trend ilanlar",
        "Nedime teklifi ve bekârlığa veda setleri",
        "Spor takımı, okul ve taraftar ürünü kişiselleştirmesi",
      ],
      faqs: [
        {
          q: "40 oz bardaklar neden 30 oz'dan yüksek fiyata satılıyor?",
          a: "Alıcılar kulplu 40 oz gövdeyi büyük bir bardak olarak değil, kendi başına bir kategori olarak görüyor ve perakende fiyatı buna göre oluşuyor. Satıcı için içecek ürünleri içindeki en güçlü marj burada.",
        },
        {
          q: "40 oz bardağa ne kadar yazı sığar?",
          a: "Düz panel bir tam isim artı iki üç satır daha rahatça alır. Tam kazıma ölçüleri her ürün sayfasında yazılıdır.",
        },
      ],
    },
  },

  "drinkware/skinny-tumblers": {
    en: {
      intro: [
        "Skinny tumblers are the narrow-body 20 oz format built for a standard cup holder and a slimmer hand. They photograph well in pairs, which makes them a natural fit for couple, bridesmaid and family-set listings.",
        "The narrower wrap changes how you lay out a design: vertical monograms, stacked names and tall script sit better here than a wide horizontal wordmark.",
      ],
      highlights: [
        "Couple and his-and-hers pairs",
        "Vertical monogram and stacked-name designs",
        "Cup-holder-first everyday listings",
      ],
      faqs: [
        {
          q: "What is the difference between a skinny tumbler and a standard 20 oz?",
          a: "Same capacity, narrower body and a taller profile. The engraving area is narrower and taller, so designs are laid out vertically rather than wide.",
        },
      ],
    },
    tr: {
      intro: [
        "Skinny bardaklar, standart bardaklık ve daha ince bir el için tasarlanmış dar gövdeli 20 oz biçimidir. İkili çekimlerde çok iyi görünürler; bu da onları çift, nedime ve aile seti ilanları için doğal bir seçim yapar.",
        "Dar sarma alanı tasarım düzenini değiştirir: dikey monogramlar, alt alta isimler ve uzun el yazısı burada geniş yatay bir kelime logosundan daha iyi oturur.",
      ],
      highlights: [
        "Çift ve ikili setler",
        "Dikey monogram ve alt alta isim tasarımları",
        "Bardaklık önceliğli günlük ilanlar",
      ],
      faqs: [
        {
          q: "Skinny bardakla standart 20 oz arasındaki fark ne?",
          a: "Hacim aynı, gövde daha dar ve profil daha uzun. Kazıma alanı daha dar ve daha yüksektir; tasarımlar geniş değil dikey kurgulanır.",
        },
      ],
    },
  },

  "drinkware/water-bottles": {
    en: {
      intro: [
        "Insulated water bottles sell year-round rather than seasonally, and they are the drinkware item most often bought in bulk: gyms, schools, race events and company wellness programmes all order the same bottle with one mark on it.",
        "The tall cylindrical body takes a vertical or wrapped engraving well, and the powder-coated finishes give the same bright-steel contrast as the tumblers.",
      ],
      highlights: [
        "Gym, studio and race-event bulk runs",
        "School, team and club bottles",
        "Corporate wellness and onboarding kits",
      ],
      faqs: [
        {
          q: "Can you engrave a logo on a batch of water bottles?",
          a: "Yes — a single-colour vector logo engraves identically across the run. Send the artwork once and every unit in the order matches.",
        },
        {
          q: "Are engraved bottles dishwasher safe?",
          a: "The engraving is, since it is cut into the steel. Follow the manufacturer's care guidance for the bottle body itself; most insulated bottles are hand-wash recommended to protect the vacuum seal.",
        },
      ],
    },
    tr: {
      intro: [
        "Yalıtımlı mataralar mevsimsel değil yıl boyu satar ve toplu alınan içecek ürünü kaleminin başında gelir: spor salonları, okullar, koşu etkinlikleri ve şirket sağlık programları hepsi aynı matarayı tek bir izle sipariş eder.",
        "Uzun silindirik gövde dikey ya da sarmal kazımayı iyi taşır; toz boyalı kaplamalar bardaklardaki aynı parlak çelik kontrastını verir.",
      ],
      highlights: [
        "Spor salonu, stüdyo ve koşu etkinliği toplu işleri",
        "Okul, takım ve kulüp mataraları",
        "Kurumsal sağlık ve işe başlama kitleri",
      ],
      faqs: [
        {
          q: "Bir parti mataraya logo kazıyabiliyor musunuz?",
          a: "Evet — tek renk vektör logo tüm parti boyunca birebir aynı kazınır. Tasarımı bir kez gönder, siparişteki her ürün birbirini tutsun.",
        },
        {
          q: "Kazınmış mataralar bulaşık makinesine dayanır mı?",
          a: "Kazıma dayanır, çünkü çeliğin içine işlenmiştir. Matara gövdesi için üreticinin bakım talimatını izle; yalıtımlı mataraların çoğunda vakum contasını korumak için elde yıkama önerilir.",
        },
      ],
    },
  },

  "drinkware/mugs-travel-mugs": {
    en: {
      intro: [
        "Travel mugs and insulated coffee mugs are the office and commuter end of the drinkware catalogue. They are bought as a practical daily object, so the personalization tends to be a name, initials or a company mark rather than a decorative design.",
        "Stainless bodies engrave to bright steel; the ceramic mugs in this collection etch to a soft frosted tone instead, which is the look most buyers expect on a mug.",
      ],
      highlights: [
        "Office and commuter gifting",
        "Company-mark runs for teams",
        "Name and initial listings that sell year-round",
      ],
      faqs: [
        {
          q: "What is the difference between engraving a ceramic mug and a stainless mug?",
          a: "Ceramic etches to a frosted, slightly lighter tone within the glaze; stainless cuts through the coating to bright metal. Ceramic suits script and soft designs, stainless suits sharp logos and text.",
        },
      ],
    },
    tr: {
      intro: [
        "Termos kupalar ve yalıtımlı kahve kupaları katalogun ofis ve yol ucudur. Pratik bir günlük nesne olarak alınırlar; bu yüzden kişiselleştirme genelde dekoratif bir tasarım değil, isim, baş harfler ya da şirket işaretidir.",
        "Paslanmaz gövdeler parlak çeliğe kazınır; bu koleksiyondaki seramik kupalar ise yumuşak buzlu bir ton alır — alıcıların bir kupada beklediği görünüm de budur.",
      ],
      highlights: [
        "Ofis ve yol hediyeleri",
        "Ekipler için şirket işareti partileri",
        "Yıl boyu satan isim ve baş harf ilanları",
      ],
      faqs: [
        {
          q: "Seramik kupa kazımayla paslanmaz kupa kazıma arasındaki fark ne?",
          a: "Seramik, sırın içinde buzlu ve biraz daha açık bir tona kazınır; paslanmaz ise kaplamayı kesip parlak metale iner. Seramik el yazısına ve yumuşak tasarımlara, paslanmaz keskin logo ve yazıya yakışır.",
        },
      ],
    },
  },

  "kitchen-and-bar/cutting-boards-cake-pans-kitchen": {
    en: {
      intro: [
        "Engraved cutting and charcuterie boards are the single best-selling wedding gift in the personalized market, and the reason is that the blank already looks expensive before anything is added to it. A bamboo or walnut board with a family name and a date reads as an heirloom, not as merchandise.",
        "Boards are stocked in several woods and sizes, from small serving paddles to large charcuterie surfaces with handles. That range lets one design cover a $30 listing and a $95 listing without any change to the artwork.",
      ],
      highlights: [
        "Wedding, anniversary and family-name boards",
        "Realtor and housewarming closing gifts",
        "Restaurant and catering branding",
      ],
      faqs: [
        {
          q: "How should a customer care for an engraved wooden board?",
          a: "Hand wash, dry upright and oil it periodically with food-grade mineral oil. The engraving needs no special care — it is a burn in the wood, not a coating that can lift.",
        },
        {
          q: "Which board size sells best?",
          a: "The mid-size handled boards move fastest as gifts, while the large charcuterie surfaces carry the highest margin. Listing both from one design is the usual play.",
        },
      ],
    },
    tr: {
      intro: [
        "Kazınmış kesme ve sunum tahtaları kişiselleştirilmiş pazarın en çok satan düğün hediyesidir; sebebi de boş ürünün üzerine hiçbir şey eklenmeden zaten pahalı görünmesidir. Aile adı ve tarih kazınmış bir bambu ya da ceviz tahta, ticari bir ürün gibi değil, bir yadigâr gibi okunur.",
        "Tahtalar birkaç ahşap türünde ve ölçüde stoklanır; küçük servis küreklerinden kulplu büyük sunum yüzeylerine kadar. Bu aralık, tek bir tasarımın hem 30 dolarlık hem 95 dolarlık ilanı, çizimde hiçbir değişiklik olmadan karşılamasını sağlar.",
      ],
      highlights: [
        "Düğün, yıl dönümü ve aile adı tahtaları",
        "Emlakçı ve yeni ev kapanış hediyeleri",
        "Restoran ve catering markalaması",
      ],
      faqs: [
        {
          q: "Müşteri kazınmış ahşap tahtayı nasıl korumalı?",
          a: "Elde yıkanmalı, dik kurutulmalı ve düzenli olarak gıdaya uygun mineral yağla yağlanmalı. Kazıma özel bakım istemez — kalkabilecek bir kaplama değil, ahşabın içindeki bir yanıktır.",
        },
        {
          q: "Hangi tahta ölçüsü daha çok satar?",
          a: "Hediye olarak en hızlı hareket eden orta boy kulplu tahtalardır; en yüksek marjı ise büyük sunum yüzeyleri taşır. Alışılmış hamle, tek tasarımdan ikisini birden ilanlamaktır.",
        },
      ],
    },
  },

  "kitchen-and-bar/flasks-flask-sets-and-accessories": {
    en: {
      intro: [
        "Stainless hip flasks are one of the few gift items where the engraving is expected rather than optional — a plain flask is a commodity, an engraved one is a keepsake. Sets that pair a flask with funnels and shot cups in a case sell at a considerably higher price for the same production time.",
        "The flat face of a flask is an easy, forgiving engraving surface: initials, a date, a short toast or a full monogram all sit well.",
      ],
      highlights: [
        "Groomsmen and wedding-party gifts",
        "Birthday and retirement keepsakes",
        "Higher-value cased sets for gifting",
      ],
      faqs: [
        {
          q: "How much can you engrave on a hip flask?",
          a: "The standard 6 oz flask face comfortably takes three to five short lines, or a monogram with a name beneath it. Exact area is listed per product.",
        },
      ],
    },
    tr: {
      intro: [
        "Paslanmaz cep matarası, kazımanın isteğe bağlı değil beklenen olduğu birkaç hediye ürününden biridir — düz bir matara sıradan bir üründür, kazınmış olan bir yadigârdır. Matarayı huni ve shot bardaklarıyla çantada birleştiren setler, aynı üretim süresiyle belirgin şekilde yüksek fiyattan satar.",
        "Mataranın düz yüzü kolay ve affedici bir kazıma yüzeyidir: baş harfler, bir tarih, kısa bir kadeh sözü ya da tam bir monogram hepsi iyi oturur.",
      ],
      highlights: [
        "Sağdıç ve düğün hediyeleri",
        "Doğum günü ve emeklilik hatıraları",
        "Hediyelik yüksek değerli çantalı setler",
      ],
      faqs: [
        {
          q: "Cep matarasına ne kadar kazıma yapılabilir?",
          a: "Standart 6 oz matara yüzü rahatça üç ila beş kısa satır ya da altında isim olan bir monogram alır. Tam alan her üründe yazılıdır.",
        },
      ],
    },
  },

  "office-tech/leatherette-journals": {
    en: {
      intro: [
        "Leatherette journals are the highest-turnover corporate gift in the catalogue: cheap enough to hand out at scale, substantial enough to feel like a real gift, and fast enough to engrave that a hundred-unit order is a same-day job.",
        "The colour range is the point. Because we stock the full leatherette palette blank, you can match a client's brand colour instead of talking them into the one you happen to have — and the engraved mark is identical across every colour in the range.",
      ],
      highlights: [
        "New-hire and onboarding kits",
        "Conference and event giveaways",
        "Graduation, mentor and teacher gifts",
      ],
      faqs: [
        {
          q: "How many journals can you engrave in a day?",
          a: "Engraving a journal takes seconds, so throughput is limited by handling rather than by the laser. Bulk runs placed before 2pm ET typically dispatch the same day; very large orders are quoted with a firm production date.",
        },
        {
          q: "Can each journal in an order have a different name?",
          a: "Yes. Per-unit personalization is the normal case here, not an exception — send the name list with the order and each book is engraved individually.",
        },
      ],
    },
    tr: {
      intro: [
        "Suni deri defterler katalogun en hızlı dönen kurumsal hediyesidir: toplu dağıtılacak kadar ucuz, gerçek bir hediye gibi duracak kadar sağlam ve yüz adetlik bir siparişin aynı gün çıkacağı kadar hızlı kazınır.",
        "Asıl mesele renk skalası. Tüm suni deri paletini boş olarak stokladığımız için müşteriyi elindekine ikna etmek yerine marka rengini tutturabilirsin — ve kazıma izi skalanın her renginde birebir aynıdır.",
      ],
      highlights: [
        "Yeni çalışan ve işe başlama kitleri",
        "Konferans ve etkinlik hediyeleri",
        "Mezuniyet, mentor ve öğretmen hediyeleri",
      ],
      faqs: [
        {
          q: "Günde kaç defter kazıyabiliyorsunuz?",
          a: "Bir defterin kazınması saniyeler sürer; kapasiteyi lazer değil elleçleme belirler. ET 14:00'ten önce verilen toplu işler tipik olarak aynı gün sevk edilir; çok büyük siparişler kesin üretim tarihiyle teklif edilir.",
        },
        {
          q: "Siparişteki her defterde farklı isim olabilir mi?",
          a: "Evet. Burada ürün başına kişiselleştirme istisna değil, normaldir — isim listesini siparişle gönder, her defter tek tek kazınsın.",
        },
      ],
    },
  },

  "office-tech/leatherette-portfolio-with-notepad": {
    en: {
      intro: [
        "A portfolio with a notepad is the gift a company gives when a journal is not enough: it carries a logo at meeting-table scale, it holds documents, and it stays on a desk for years rather than being used up.",
        "The large front panel is the most generous engraving surface in the office range, which makes it the right product for a full logo lockup rather than a small mark.",
      ],
      highlights: [
        "Executive and client gifting",
        "Full logo lockups at readable size",
        "Sales-team and conference kits",
      ],
      faqs: [
        {
          q: "How large a logo can you engrave on a portfolio?",
          a: "Large enough to be read across a table. The front panel takes a full horizontal logo lockup with a tagline; exact engraving dimensions are on the product page.",
        },
      ],
    },
    tr: {
      intro: [
        "Not bloklu portföy, bir şirketin defterin yetmediği yerde verdiği hediyedir: logoyu toplantı masası ölçeğinde taşır, evrak tutar ve tükenip gitmek yerine yıllarca masada kalır.",
        "Geniş ön panel ofis yelpazesindeki en cömert kazıma yüzeyidir; bu da onu küçük bir işaret için değil, tam bir logo kurgusu için doğru ürün yapar.",
      ],
      highlights: [
        "Yönetici ve müşteri hediyeleri",
        "Okunur ölçüde tam logo kurguları",
        "Satış ekibi ve konferans kitleri",
      ],
      faqs: [
        {
          q: "Portföye ne kadar büyük logo kazıyabiliyorsunuz?",
          a: "Masanın karşısından okunacak kadar büyük. Ön panel, sloganıyla birlikte tam yatay bir logo kurgusunu alır; tam kazıma ölçüleri ürün sayfasındadır.",
        },
      ],
    },
  },

  "office-tech/mouse-pads": {
    en: {
      intro: [
        "Leatherette desk mats and mouse pads are a low-cost, high-perceived-value corporate item: the engraved logo sits in the user's eyeline all day, which is exactly what a marketing budget is buying.",
        "They are flat, light and rectangular, which makes them one of the cheapest items in the catalogue to ship in volume.",
      ],
      highlights: [
        "Desk-setup and remote-team kits",
        "Trade-show giveaways with a logo",
        "Add-on product for an office gift bundle",
      ],
      faqs: [
        {
          q: "Does the engraving affect how the mouse tracks?",
          a: "No — the mark is engraved at the edge or corner by default, away from the tracking surface.",
        },
      ],
    },
    tr: {
      intro: [
        "Suni deri masa altlıkları ve mouse pad'ler düşük maliyetli, algılanan değeri yüksek kurumsal ürünlerdir: kazınmış logo gün boyu kullanıcının göz hizasında durur ki bir pazarlama bütçesinin satın aldığı şey tam olarak budur.",
        "Düz, hafif ve dikdörtgen olduklarından katalogda hacimli kargolanması en ucuz kalemlerden biridir.",
      ],
      highlights: [
        "Masa kurulumu ve uzaktan ekip kitleri",
        "Logolu fuar hediyeleri",
        "Ofis hediye paketine ek ürün",
      ],
      faqs: [
        {
          q: "Kazıma farenin izlemesini etkiler mi?",
          a: "Hayır — iz varsayılan olarak izleme yüzeyinden uzakta, kenara ya da köşeye kazınır.",
        },
      ],
    },
  },

  "personal-accessories/wallets-bifold": {
    en: {
      intro: [
        "The engraved bifold wallet is the classic message-inside gift: the personalization is hidden until the wallet is opened, which is why it outperforms externally branded wallets for Father's Day, Valentine's and milestone birthdays.",
        "Interior engraving takes four to six short lines depending on the font, so a handwritten note, a date or a short message all fit without crowding the card slots.",
      ],
      highlights: [
        "Father's Day and Valentine's message wallets",
        "Groomsmen bundles with a knife or money clip",
        "Milestone birthday and graduation gifts",
      ],
      faqs: [
        {
          q: "Is the engraving on the inside or the outside?",
          a: "Either, but the inside panel is what sells — the message is private and only revealed when the wallet is opened. Specify the placement on the order.",
        },
      ],
    },
    tr: {
      intro: [
        "Kazınmış ikiye katlanır cüzdan, klasik içine mesajlı hediyedir: kişiselleştirme cüzdan açılana kadar gizlidir; Babalar Günü, Sevgililer Günü ve önemli yaş günlerinde dışı markalı cüzdanları geçmesinin sebebi budur.",
        "İç kazıma fonta göre dört ila altı kısa satır alır; el yazısı bir not, bir tarih ya da kısa bir mesaj kart yuvalarını sıkıştırmadan sığar.",
      ],
      highlights: [
        "Babalar Günü ve Sevgililer Günü mesajlı cüzdanları",
        "Çakı ya da para tokasıyla sağdıç paketleri",
        "Önemli yaş günü ve mezuniyet hediyeleri",
      ],
      faqs: [
        {
          q: "Kazıma içe mi dışa mı yapılıyor?",
          a: "İkisi de olur ama satan iç paneldir — mesaj özeldir ve yalnızca cüzdan açıldığında görünür. Konumu siparişte belirt.",
        },
      ],
    },
  },

  "patches/rectangle-patches": {
    en: {
      intro: [
        "The rectangle patch is the default hat patch — it matches the flat front panel of a trucker cap, and it is the shape most custom-hat listings on Etsy and Amazon are built around.",
        "Rectangles give the most usable area per patch, so a wordmark with a tagline beneath it fits at a readable size where a round patch would force you to shrink it.",
      ],
      highlights: [
        "Trucker and structured cap fronts",
        "Wordmarks with a second line",
        "Workwear and jacket branding",
      ],
      faqs: [
        {
          q: "What size rectangle patch fits a trucker cap?",
          a: "The smaller of the two stocked sizes is the standard cap-front patch; the larger is meant for bags, jacket backs and workwear. Exact dimensions are on each product page.",
        },
        {
          q: "What heat press settings should I use?",
          a: "Around 285°F for roughly 20 seconds at medium pressure on an adhesive-backed patch, then let it cool before handling. Test one first — press behaviour varies by machine and cap structure.",
        },
      ],
    },
    tr: {
      intro: [
        "Dikdörtgen patch varsayılan şapka patch'idir — trucker şapkanın düz ön paneline oturur ve Etsy ile Amazon'daki özel şapka ilanlarının çoğu bu şekil etrafında kurulur.",
        "Dikdörtgen, patch başına en fazla kullanılabilir alanı verir; altında slogan olan bir kelime logosu, yuvarlak patch'in küçültmeye zorlayacağı yerde okunur ölçüde sığar.",
      ],
      highlights: [
        "Trucker ve yapılandırılmış şapka önü",
        "İkinci satırlı kelime logoları",
        "İş kıyafeti ve ceket markalaması",
      ],
      faqs: [
        {
          q: "Trucker şapkaya hangi ölçü dikdörtgen patch uyar?",
          a: "Stoktaki iki ölçüden küçük olanı standart şapka önü patch'idir; büyük olan çanta, ceket sırtı ve iş kıyafeti içindir. Tam ölçüler her ürün sayfasında yazılıdır.",
        },
        {
          q: "Isı presi ayarları ne olmalı?",
          a: "Yapışkanlı patch'te yaklaşık 140°C'de (285°F), orta basınçla 20 saniye; sonra ele almadan önce soğumaya bırak. Önce bir tane dene — pres davranışı makineye ve şapka yapısına göre değişir.",
        },
      ],
    },
  },

  "patches/round-patches": {
    en: {
      intro: [
        "Round patches read as a badge or a seal, which suits crest-style logos, farm and ranch marks, coffee-shop branding and anything with a circular lockup already in the brand kit.",
        "A circle has less usable area than a rectangle of the same width, so designs work best with a short centred mark rather than a long wordmark.",
      ],
      highlights: [
        "Crest, seal and badge-style logos",
        "Farm, ranch and outdoor brands",
        "Cap fronts and bag branding",
      ],
      faqs: [
        {
          q: "Should I choose a round or rectangle patch for a hat?",
          a: "Rectangle if your logo is horizontal text; round if it is a circular badge or emblem. The shape should match the artwork rather than the other way round.",
        },
      ],
    },
    tr: {
      intro: [
        "Yuvarlak patch bir rozet ya da mühür gibi okunur; arma tarzı logolara, çiftlik markalarına, kahveci markalamasına ve marka kitinde zaten dairesel bir kurgusu olan her şeye yakışır.",
        "Daire, aynı genişlikteki dikdörtgenden daha az kullanılabilir alan verir; bu yüzden tasarımlar uzun bir kelime logosuyla değil, kısa ve ortalanmış bir işaretle daha iyi çalışır.",
      ],
      highlights: [
        "Arma, mühür ve rozet tarzı logolar",
        "Çiftlik ve outdoor markaları",
        "Şapka önü ve çanta markalaması",
      ],
      faqs: [
        {
          q: "Şapka için yuvarlak mı dikdörtgen patch mi seçmeliyim?",
          a: "Logon yatay yazıysa dikdörtgen, dairesel bir rozet ya da amblemse yuvarlak. Şekil tasarıma uymalı, tasarım şekle değil.",
        },
      ],
    },
  },

  "frames-and-decor/slate-decor": {
    en: {
      intro: [
        "Slate gives the highest engraving contrast of any material in the catalogue: the laser drives the surface to a near-white chalk tone, so bold text and family names read from across a room.",
        "It is the natural material for house signs, established-date pieces, memorials and anything that needs to look permanent rather than decorative.",
      ],
      highlights: [
        "House and family-name signs",
        "Established-date and address pieces",
        "Memorial and commemorative plaques",
      ],
      faqs: [
        {
          q: "Why does slate engrave whiter than wood?",
          a: "The laser fractures and lightens the stone surface rather than burning it, so the mark is a pale chalk tone instead of a brown burn. That is what gives slate its hard, high-contrast look.",
        },
      ],
    },
    tr: {
      intro: [
        "Arduvaz, katalogdaki tüm malzemeler içinde en yüksek kazıma kontrastını verir: lazer yüzeyi neredeyse beyaz bir tebeşir tonuna çıkarır, kalın yazı ve aile adları odanın öbür ucundan okunur.",
        "Ev tabelaları, kuruluş tarihi ürünleri, anma parçaları ve dekoratif değil kalıcı görünmesi gereken her şey için doğal malzeme budur.",
      ],
      highlights: [
        "Ev ve aile adı tabelaları",
        "Kuruluş tarihi ve adres ürünleri",
        "Anma ve hatıra plaketleri",
      ],
      faqs: [
        {
          q: "Arduvaz neden ahşaptan daha beyaz kazınıyor?",
          a: "Lazer taşı yakmak yerine yüzeyini çatlatıp açar; iz kahverengi bir yanık değil, soluk bir tebeşir tonu olur. Arduvaza o sert, yüksek kontrastlı görünümü veren şey budur.",
        },
      ],
    },
  },

  "travel-accessories/passport-holders": {
    en: {
      intro: [
        "Passport holders are a small, cheap-to-ship item with an outsized gift value: initials or a name on the cover turn a commodity sleeve into a honeymoon or graduation present.",
        "The flat leatherette cover engraves cleanly and the mark will not lift in a bag, which matters for an item that spends its life being pushed in and out of pockets.",
      ],
      highlights: [
        "Honeymoon and couple pairs",
        "Graduation and study-abroad gifts",
        "Add-on to a luggage-tag listing",
      ],
      faqs: [
        {
          q: "What personalization works best on a passport holder?",
          a: "Initials, a full name, or a short line such as a wedding date. The cover area is small, so fewer words at a readable size beat a long message.",
        },
      ],
    },
    tr: {
      intro: [
        "Pasaportluklar küçük, kargosu ucuz ama hediye değeri orantısız yüksek ürünlerdir: kapağa baş harf ya da isim, sıradan bir kılıfı balayı veya mezuniyet hediyesine çevirir.",
        "Düz suni deri kapak temiz kazınır ve iz çantada kalkmaz; ömrünü ceplere girip çıkarak geçiren bir ürün için bu önemlidir.",
      ],
      highlights: [
        "Balayı ve çift setleri",
        "Mezuniyet ve yurt dışı eğitim hediyeleri",
        "Bagaj etiketi ilanına ek ürün",
      ],
      faqs: [
        {
          q: "Pasaportlukta hangi kişiselleştirme daha iyi çalışır?",
          a: "Baş harfler, tam isim ya da düğün tarihi gibi kısa bir satır. Kapak alanı küçüktür; okunur ölçüde az kelime, uzun bir mesajdan iyidir.",
        },
      ],
    },
  },
};
