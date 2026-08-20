import type { EditorialEntry } from "@/data/category-editorial";

/**
 * Top-level category copy. One hand-written entry per catalog category — see
 * the note in `category-editorial.ts` for why none of this is templated.
 */
export const CATEGORY_COPY: Record<string, EditorialEntry> = {
  drinkware: {
    en: {
      intro: [
        "Drinkware is the volume category for almost every personalized-gift shop, and it is the one where finish quality shows immediately. Powder-coated stainless tumblers, water bottles and travel mugs engrave down to the raw steel, so a name, date or monogram lands as a permanent bright-silver mark that will not peel, fade in a dishwasher, or wear off the way vinyl and sublimation transfers do. Ceramic mugs and glassware take a softer frosted etch instead, which suits script fonts and full wrap designs.",
        "Everything in this category is stocked blank in Alpharetta, Georgia and engraved to order, one unit at a time. There is no minimum, no pre-buy and no colour commitment: you list the sizes and finishes you want, send the order with the SKU and the personalization text, and the finished item ships in your packaging with your branding. That is what lets a small shop carry thirty tumbler colourways without owning any of them.",
      ],
      highlights: [
        "Wedding-party and bridesmaid tumbler sets with names and dates",
        "Corporate onboarding gifts and branded team drinkware runs",
        "Etsy and Amazon listings with per-order custom text",
        "Teacher, nurse and coach appreciation gifts at seasonal peaks",
      ],
      faqs: [
        {
          q: "What does laser engraving look like on a powder-coated tumbler?",
          a: "The laser removes the powder coat and exposes the stainless steel underneath, so the mark reads as a clean silver-white contrast against the body colour. It is cut into the surface rather than printed on top, which means it survives dishwashers, ice baths and years of daily handling.",
        },
        {
          q: "Can you engrave a photo or a full-colour logo on drinkware?",
          a: "Engraving is single-tone, so a full-colour logo is converted to one-colour vector artwork before it goes to the laser. Line art, wordmarks and monograms reproduce beautifully; photographs and gradients do not, and we say so before production rather than ship a muddy result. UV printing is the right option when the design genuinely needs colour.",
        },
        {
          q: "Do you ship drinkware blind, under my brand?",
          a: "Yes. Orders leave with your return address and your inserts, with nothing from FomaPrint in the box. Your customer only ever sees your brand.",
        },
        {
          q: "Is there a minimum order for tumblers?",
          a: "No. A single engraved unit is a normal order here — the whole catalogue is made to order. Volume pricing exists, but it is a discount, not a gate.",
        },
      ],
    },
    tr: {
      intro: [
        "İçecek ürünleri, kişiselleştirilmiş hediye satan hemen her mağazanın hacim kategorisidir ve işçilik kalitesinin en çabuk belli olduğu yerdir. Toz boyalı paslanmaz çelik bardaklar, matara ve termoslar boyanın altındaki çeliğe kadar kazınır; isim, tarih ya da monogram kalıcı parlak gümüş bir iz olarak kalır. Bulaşık makinesinde solmaz, kenardan kalkmaz — vinil ya da süblimasyon transferin aksine. Seramik kupalar ve cam ürünler ise buzlu bir doku alır; bu da el yazısı fontlara ve tam sarma tasarımlara yakışır.",
        "Bu kategorideki her ürün Alpharetta, Georgia'daki depoda boş olarak durur ve sipariş geldikçe tek tek kazınır. Alt sipariş limiti, peşin stok alımı ya da renk taahhüdü yok: istediğin ölçü ve rengi listeler, siparişi SKU ve kişiselleştirme metniyle gönderirsin; ürün senin ambalajın ve markanla çıkar. Küçük bir mağazanın hiçbirine sahip olmadan otuz farklı bardak rengi taşıyabilmesinin sebebi budur.",
      ],
      highlights: [
        "İsim ve tarihli düğün / nedime bardak setleri",
        "Kurumsal işe başlama hediyeleri ve markalı ekip bardakları",
        "Her siparişte farklı metin alan Etsy ve Amazon ilanları",
        "Sezon zirvelerinde öğretmen, hemşire ve antrenör hediyeleri",
      ],
      faqs: [
        {
          q: "Toz boyalı bir bardakta lazer kazıma nasıl görünür?",
          a: "Lazer toz boyayı kaldırır ve altındaki paslanmaz çeliği açığa çıkarır; iz, gövde renginin üzerinde temiz gümüş-beyaz bir kontrast olarak okunur. Üzerine basılmaz, yüzeye işlenir — bu yüzden bulaşık makinesine, buza ve yıllarca günlük kullanıma dayanır.",
        },
        {
          q: "Fotoğraf ya da renkli logo kazıyabiliyor musunuz?",
          a: "Kazıma tek tonludur; renkli logo lazere gitmeden önce tek renk vektöre çevrilir. Çizgi çalışmaları, kelime logoları ve monogramlar çok iyi çıkar; fotoğraf ve degrade çıkmaz ve bunu üretimden önce söyleriz, bulanık bir sonuç göndermeyiz. Tasarım gerçekten renk istiyorsa doğru yöntem UV baskıdır.",
        },
        {
          q: "Ürünleri kendi markam altında, gizli sevkiyatla gönderiyor musunuz?",
          a: "Evet. Siparişler senin iade adresin ve senin ekleriyle çıkar; kutuda FomaPrint'e ait hiçbir şey olmaz. Müşterin yalnızca senin markanı görür.",
        },
        {
          q: "Bardaklarda alt sipariş limiti var mı?",
          a: "Yok. Tek kazımalı ürün burada normal bir sipariştir — katalogun tamamı siparişe göre üretilir. Hacim fiyatı vardır ama bu bir indirimdir, bir eşik değil.",
        },
      ],
    },
  },

  "kitchen-and-bar": {
    en: {
      intro: [
        "Kitchen and bar pieces are the highest-margin corner of the personalized-gift market because the blank itself reads as a real object: a bamboo or black walnut board, a slate serving surface, a stainless flask, a full BBQ set in a case. Wood engraves to a warm dark brown that deepens with the density of the grain, slate burns to a chalk white, and stainless flasks take the same bright metal contrast as drinkware.",
        "These are the products people buy for weddings, housewarmings, Father's Day and corporate closing gifts — occasions where the buyer chooses on perceived value rather than price. Because we engrave on demand from stock blanks, you can list a full range of board sizes and finishes and only pay for the one that actually sells.",
      ],
      highlights: [
        "Wedding and anniversary cutting boards with names and dates",
        "Groomsmen flask and BBQ set bundles",
        "Realtor closing gifts and housewarming boards",
        "Restaurant and bar branding on serving boards",
      ],
      faqs: [
        {
          q: "Which wood engraves best?",
          a: "Bamboo and maple give the highest contrast and the crispest small text because the grain is tight and even. Black walnut and acacia engrave darker and more subtly — beautiful on larger marks and monograms, less forgiving on fine print. Slate is the highest-contrast option of all: the mark comes out near-white.",
        },
        {
          q: "Are engraved cutting boards food-safe?",
          a: "Yes. Engraving is a thermal process with no ink, dye or coating involved — nothing is added to the surface. We engrave one face so the other stays a clean cutting surface, and the boards ship food-safe as supplied.",
        },
        {
          q: "Can you engrave both sides of a board?",
          a: "Second-side engraving is available on request as part of a quote. Most sellers keep the back plain so the board stays usable for cutting.",
        },
      ],
    },
    tr: {
      intro: [
        "Mutfak ve bar ürünleri kişiselleştirilmiş hediye pazarının en yüksek marjlı köşesidir; çünkü ürünün kendisi gerçek bir nesne olarak algılanır: bambu ya da siyah ceviz kesme tahtası, arduvaz servis yüzeyi, paslanmaz matara, çantasıyla komple mangal seti. Ahşap, damarın yoğunluğuna göre koyulaşan sıcak bir kahverengiye kazınır; arduvaz tebeşir beyazı verir; paslanmaz matara ise bardaklardaki aynı parlak metal kontrastını alır.",
        "Bunlar düğün, yeni ev, Babalar Günü ve kurumsal kapanış hediyesi için alınan ürünlerdir — alıcının fiyata değil, algılanan değere baktığı anlar. Boş stoktan siparişe göre kazıdığımız için tüm tahta ölçülerini ve kaplamalarını ilanlayabilir, yalnızca gerçekten satanın parasını ödersin.",
      ],
      highlights: [
        "İsim ve tarihli düğün / yıl dönümü kesme tahtaları",
        "Sağdıç matarası ve mangal seti paketleri",
        "Emlakçı kapanış hediyeleri ve yeni ev tahtaları",
        "Servis tahtalarına restoran ve bar markalaması",
      ],
      faqs: [
        {
          q: "Hangi ahşap daha iyi kazınır?",
          a: "Bambu ve akçaağaç en yüksek kontrastı ve en net küçük yazıyı verir, çünkü damar sık ve düzgündür. Siyah ceviz ve akasya daha koyu ve daha yumuşak kazınır — büyük izlerde ve monogramlarda çok güzeldir, ince yazıda affetmez. En yüksek kontrast arduvazdadır: iz neredeyse beyaz çıkar.",
        },
        {
          q: "Kazınmış kesme tahtaları gıdaya uygun mu?",
          a: "Evet. Kazıma ısıl bir işlemdir; mürekkep, boya ya da kaplama girmez, yüzeye hiçbir şey eklenmez. Tek yüze kazırız, diğer yüz temiz kesme yüzeyi olarak kalır ve tahtalar tedarik edildiği gıdaya uygun hâliyle çıkar.",
        },
        {
          q: "Tahtanın iki yüzüne birden kazıyabiliyor musunuz?",
          a: "İkinci yüz kazıma, teklif kapsamında talep üzerine yapılır. Satıcıların çoğu arka yüzü boş bırakır ki tahta kesme için kullanılabilir kalsın.",
        },
      ],
    },
  },

  "office-tech": {
    en: {
      intro: [
        "Leatherette journals, portfolios, notepads and desk pieces are the workhorses of corporate gifting. The material is a laminated PU leatherette over board or foam: it engraves in a fraction of a second, and the laser burns through the colour layer to reveal the core underneath, which is why a logo on leatherette reads sharper than the same logo debossed into real leather.",
        "The practical consequence for a reseller is turnaround. A hundred-piece onboarding order with a company wordmark is a same-day job here, not a two-week import — and because the blanks are stocked in a dozen colours, you can sell the colour match the client asks for rather than the one your supplier happens to have.",
      ],
      highlights: [
        "Employee onboarding kits and new-hire welcome sets",
        "Conference and trade-show giveaways with a company mark",
        "Graduation, mentor and teacher gifts",
        "Law, real-estate and consulting client folders",
      ],
      faqs: [
        {
          q: "What is leatherette and how is it different from leather?",
          a: "Leatherette is a polyurethane surface laminated to a fabric or board backing. It is consistent sheet to sheet — no hide variation, no scars, no dye lots — which is exactly what you want when the same logo has to match across a hundred units.",
        },
        {
          q: "What colour does the engraving come out?",
          a: "It depends on the core beneath the surface colour, not on any setting we choose. Most colourways expose a black core, so the mark reads black; tan and rustic finishes expose a lighter one. The tone is a fixed property of the blank, so we take it from the first unit and it stays identical across the run.",
        },
        {
          q: "Can you engrave a company logo, not just text?",
          a: "Yes. Send vector artwork (SVG, AI, EPS or PDF) and we engrave it as supplied. A high-resolution PNG can be traced, but a vector always gives cleaner edges on small marks.",
        },
        {
          q: "How fast can a bulk corporate order ship?",
          a: "Orders placed before 2pm ET dispatch the same day. Large runs are quoted with a production date up front, so you can give your client a real delivery promise instead of a guess.",
        },
      ],
    },
    tr: {
      intro: [
        "Suni deri defterler, portföyler, not blokları ve masa ürünleri kurumsal hediyeciliğin yük beygirleridir. Malzeme, karton veya sünger üzerine lamine edilmiş PU suni deridir: saniyenin çok altında kazınır ve lazer renk katmanını delip altındaki çekirdeği açığa çıkarır. Suni deri üzerindeki bir logonun gerçek deriye gofre edilmiş aynı logodan daha keskin okunmasının sebebi budur.",
        "Bunun satıcı için pratik sonucu termin süresidir. Şirket logolu yüz parçalık bir işe başlama siparişi burada aynı gün çıkan bir iştir, iki haftalık ithalat değil. Boş ürünler on iki renkte stokta durduğu için müşterinin istediği rengi satabilirsin, tedarikçinde ne varsa onu değil.",
      ],
      highlights: [
        "İşe başlama kitleri ve yeni çalışan karşılama setleri",
        "Şirket logolu konferans ve fuar hediyeleri",
        "Mezuniyet, mentor ve öğretmen hediyeleri",
        "Hukuk, emlak ve danışmanlık müşteri dosyaları",
      ],
      faqs: [
        {
          q: "Suni deri nedir, gerçek deriden farkı ne?",
          a: "Suni deri, kumaş ya da karton tabana lamine edilmiş poliüretan bir yüzeydir. Levhadan levhaya aynıdır — post farkı, yara izi, boya partisi farkı yok. Aynı logonun yüz parçada birbirini tutması gerekirken tam olarak istediğin şey budur.",
        },
        {
          q: "Kazıma hangi renkte çıkar?",
          a: "Bu, bizim seçtiğimiz bir ayara değil, yüzey renginin altındaki çekirdeğe bağlıdır. Renklerin çoğunda siyah çekirdek çıkar, iz siyah okunur; bej ve rustik kaplamalarda daha açık bir çekirdek çıkar. Ton, boş ürünün sabit bir özelliğidir; ilk üründen alırız ve tüm parti boyunca aynı kalır.",
        },
        {
          q: "Sadece yazı değil, şirket logosu da kazıyabiliyor musunuz?",
          a: "Evet. Vektör dosya (SVG, AI, EPS veya PDF) gönder, geldiği gibi kazırız. Yüksek çözünürlüklü PNG vektöre çevrilebilir ama küçük izlerde kenar temizliğini her zaman vektör verir.",
        },
        {
          q: "Toplu kurumsal sipariş ne kadar sürede çıkar?",
          a: "ET saatiyle 14:00'ten önce verilen siparişler aynı gün sevk edilir. Büyük partiler için üretim tarihi baştan teklifte yazılır; müşterine tahmin değil, gerçek bir teslim sözü verebilirsin.",
        },
      ],
    },
  },

  "personal-accessories": {
    en: {
      intro: [
        "Wallets, money clips, checkbook covers, lighters and pocket knives are small, low-shipping-weight items with an unusually high emotional price ceiling — an engraved bifold wallet with a short handwritten-style message sells at a multiple of the blank cost, and it fits in a padded envelope.",
        "That combination is why this category works so well for a first-time reseller: cheap to ship, easy to photograph, and the personalization is the entire product. Every item is engraved to order from stock, so a shop can offer the full colour range on day one and hold no inventory at all.",
      ],
      highlights: [
        "Father's Day and Valentine's wallets with a message inside",
        "Groomsmen gift bundles: wallet, knife, money clip",
        "Milestone birthday and retirement keepsakes",
        "Low-shipping-cost add-on products for an existing store",
      ],
      faqs: [
        {
          q: "Can you engrave handwriting or a signature?",
          a: "Yes — send the handwriting as an image or vector file and it is engraved as artwork rather than typed text. A scan on white paper with a dark pen reproduces best.",
        },
        {
          q: "How much text fits on a wallet interior?",
          a: "Roughly four to six short lines on a standard bifold interior panel, depending on the font. The engraving area is listed on each product page, and we size the artwork to fit rather than shrinking it to illegibility.",
        },
        {
          q: "Do engraved wallets scratch or wear at the mark?",
          a: "No. The mark is a colour change in the material, not a coating, so it wears at exactly the same rate as the rest of the surface.",
        },
      ],
    },
    tr: {
      intro: [
        "Cüzdan, para tokası, çek defteri kılıfı, çakmak ve çakı; kargo ağırlığı düşük, duygusal fiyat tavanı alışılmadık derecede yüksek küçük ürünlerdir. El yazısı görünümlü kısa bir mesajla kazınmış bir cüzdan, boş ürün maliyetinin katları fiyata satılır ve zarfla gider.",
        "Bu birleşim, kategoriyi ilk kez satış yapan biri için çok verimli kılar: kargosu ucuz, fotoğraflaması kolay ve kişiselleştirmenin kendisi ürünün ta kendisi. Her ürün stoktan siparişe göre kazınır; bir mağaza ilk günden tüm renk skalasını sunup hiç stok tutmayabilir.",
      ],
      highlights: [
        "İçine mesaj kazınmış Babalar Günü ve Sevgililer Günü cüzdanları",
        "Sağdıç hediye paketleri: cüzdan, çakı, para tokası",
        "Önemli yaş günü ve emeklilik hatıraları",
        "Mevcut mağazaya düşük kargo maliyetli ek ürün",
      ],
      faqs: [
        {
          q: "El yazısı ya da imza kazıyabiliyor musunuz?",
          a: "Evet — el yazısını görsel veya vektör dosya olarak gönder, yazı olarak değil çizim olarak kazınır. Beyaz kâğıda koyu kalemle yazılmış bir tarama en iyi sonucu verir.",
        },
        {
          q: "Cüzdanın içine ne kadar yazı sığar?",
          a: "Standart bir cüzdan iç panelinde fonta göre kabaca dört ila altı kısa satır. Kazıma alanı her ürün sayfasında yazılıdır; tasarımı okunmaz hâle küçültmek yerine alana göre ölçeklendiririz.",
        },
        {
          q: "Kazınmış cüzdanlarda iz zamanla çizilir mi, aşınır mı?",
          a: "Hayır. İz bir kaplama değil, malzemenin renk değişimidir; yüzeyin geri kalanıyla tamamen aynı hızda yaşlanır.",
        },
      ],
    },
  },

  "travel-accessories": {
    en: {
      intro: [
        "Passport holders, luggage tags, jewelry boxes and travel organizers sell on a single idea: the buyer is giving someone a trip, not an object. That makes the category strongly seasonal around graduations, honeymoons, anniversaries and end-of-year travel, and it rewards a shop that can turn a personalized order around in days rather than weeks.",
        "The leatherette and PU pieces here take a crisp engraved mark that will not lift in a suitcase, and the jewelry boxes come in sizes from a travel roll to a full lidded case, so the same design idea can be sold at three price points.",
      ],
      highlights: [
        "Honeymoon and anniversary passport-holder pairs",
        "Graduation and study-abroad gifts",
        "Bridesmaid jewelry boxes with initials",
        "Corporate travel kits for frequent-flyer teams",
      ],
      faqs: [
        {
          q: "Can you engrave initials or a monogram on a passport holder?",
          a: "Yes — initials, a full name, coordinates or a short date line are all standard. The engraving area on each product page tells you what will comfortably fit.",
        },
        {
          q: "Do the jewelry boxes come in matching sets?",
          a: "The travel roll, the small case and the large lidded box share the same finishes, so a set can be listed as a bundle with one engraving design across all three.",
        },
        {
          q: "Will the engraving survive airport handling?",
          a: "Yes. There is no applied layer to scuff off — the mark is burned into the material itself.",
        },
      ],
    },
    tr: {
      intro: [
        "Pasaportluk, bagaj etiketi, mücevher kutusu ve seyahat düzenleyicileri tek bir fikir üzerinden satılır: alıcı bir nesne değil, bir yolculuk hediye ediyordur. Bu da kategoriyi mezuniyet, balayı, yıl dönümü ve yıl sonu seyahatleri çevresinde güçlü şekilde mevsimsel yapar ve kişiselleştirilmiş siparişi haftalarla değil günlerle çeviren mağazayı ödüllendirir.",
        "Buradaki suni deri ve PU ürünler valizde kalkmayacak net bir kazıma izi alır. Mücevher kutuları seyahat rulosundan kapaklı büyük kasaya kadar farklı ölçülerde gelir; yani aynı tasarım fikri üç ayrı fiyat noktasında satılabilir.",
      ],
      highlights: [
        "Balayı ve yıl dönümü için ikili pasaportluk",
        "Mezuniyet ve yurt dışı eğitim hediyeleri",
        "Baş harfli nedime mücevher kutuları",
        "Sık uçan ekipler için kurumsal seyahat setleri",
      ],
      faqs: [
        {
          q: "Pasaportluğa baş harf ya da monogram kazıyabiliyor musunuz?",
          a: "Evet — baş harfler, tam isim, koordinat ya da kısa bir tarih satırı standarttır. Her ürün sayfasındaki kazıma alanı neyin rahatça sığacağını gösterir.",
        },
        {
          q: "Mücevher kutuları takım hâlinde geliyor mu?",
          a: "Seyahat rulosu, küçük kutu ve kapaklı büyük kutu aynı kaplamaları paylaşır; üçüne aynı kazıma tasarımı uygulanıp tek paket olarak ilanlanabilir.",
        },
        {
          q: "Kazıma havalimanı kullanımına dayanır mı?",
          a: "Evet. Sıyrılacak bir kaplama katmanı yok — iz malzemenin içine yakılmıştır.",
        },
      ],
    },
  },

  "frames-and-decor": {
    en: {
      intro: [
        "Photo frames, slate signage and hanging decor are the keepsake end of the catalogue: the buyer is marking a wedding, a birth, a memorial or a first home, and the piece is meant to stay on a wall for years. Solid wood and red alder frames engrave to a warm brown, glass takes a frosted etch, and slate produces the sharpest contrast of any material we run.",
        "Frames are stocked in small, medium and large, which matters more than it sounds: the same design sells as a five-inch desk piece and an eleven-inch wall piece at very different prices, from one artwork file and no extra inventory.",
      ],
      highlights: [
        "Wedding, baby and memorial keepsake frames",
        "House-warming and first-home slate signs",
        "Family-name and established-date wall pieces",
        "Seasonal ornaments and holiday decor runs",
      ],
      faqs: [
        {
          q: "Can you engrave a photograph into slate or wood?",
          a: "Photo engraving is possible on slate and on some woods, but it is a halftone conversion, not a print — contrast and clarity vary with the source image. Send the photo before listing it and we will tell you honestly whether it will read well.",
        },
        {
          q: "What is the difference between engraving glass and engraving slate?",
          a: "Glass etches to a soft translucent frost that catches light, which suits fine script and delicate line art. Slate burns to a near-white chalk tone with hard edges, which suits bold text, family names and signage.",
        },
        {
          q: "Do frames ship with the glass and backing in place?",
          a: "Yes, frames ship complete and ready to gift; we engrave the frame face and leave the assembly untouched.",
        },
      ],
    },
    tr: {
      intro: [
        "Fotoğraf çerçeveleri, arduvaz tabelalar ve asma dekorlar katalogun hatıra ucudur: alıcı bir düğünü, bir doğumu, bir anmayı ya da ilk evi işaretliyordur ve ürünün yıllarca duvarda kalması beklenir. Masif ahşap ve kızıl kızılağaç çerçeveler sıcak bir kahverengiye kazınır, cam buzlu bir doku alır, arduvaz ise çalıştığımız tüm malzemeler içinde en keskin kontrastı verir.",
        "Çerçeveler küçük, orta ve büyük olarak stoklanır; bu kulağa geldiğinden daha önemlidir: aynı tasarım tek bir dosyayla ve ek stok olmadan hem beş inçlik masa ürünü hem on bir inçlik duvar ürünü olarak, çok farklı fiyatlardan satılır.",
      ],
      highlights: [
        "Düğün, bebek ve anma hatıra çerçeveleri",
        "Yeni ev ve ilk ev arduvaz tabelaları",
        "Aile adı ve kuruluş tarihi duvar ürünleri",
        "Sezonluk süsler ve yılbaşı dekor partileri",
      ],
      faqs: [
        {
          q: "Arduvaz veya ahşaba fotoğraf kazıyabiliyor musunuz?",
          a: "Fotoğraf kazıma arduvazda ve bazı ahşaplarda mümkündür ama bu bir baskı değil, yarım ton dönüşümüdür; kontrast ve netlik kaynak görsele göre değişir. İlan açmadan önce fotoğrafı gönder, iyi çıkıp çıkmayacağını dürüstçe söyleyelim.",
        },
        {
          q: "Cam kazımayla arduvaz kazıma arasındaki fark ne?",
          a: "Cam, ışığı yakalayan yumuşak yarı saydam bir buz dokusuna kazınır; ince el yazısına ve zarif çizgilere yakışır. Arduvaz ise sert kenarlı, neredeyse beyaz bir tebeşir tonu verir; kalın yazıya, aile adlarına ve tabelaya yakışır.",
        },
        {
          q: "Çerçeveler camı ve arkalığı takılı mı geliyor?",
          a: "Evet, çerçeveler hediye edilmeye hazır ve komple gelir; biz çerçeve yüzeyini kazırız, montaja dokunmayız.",
        },
      ],
    },
  },

  patches: {
    en: {
      intro: [
        "Leatherette patches are the fastest-growing branding format in custom apparel, and the reason is economics: a heat-applied patch turns a plain $4 hat into a $28 branded product with about twenty seconds of press time and no embroidery setup fee, no digitizing charge and no minimum.",
        "We stock rectangle, round, oval, square and hex patches in two sizes, with or without adhesive backing, in the standard leatherette colour range. Each is engraved to your artwork and ships ready to press — which means you can sell hat, bag and jacket branding without owning a laser or an embroidery machine.",
      ],
      highlights: [
        "Custom hat and trucker-cap brands sold per unit",
        "Small-business and farm logos on workwear",
        "Team, club and event merchandise runs",
        "Wholesale patch supply for local apparel shops",
      ],
      faqs: [
        {
          q: "How do you apply a leatherette patch to a hat?",
          a: "With a heat press. The usual starting point is roughly 285°F for about 20 seconds with medium pressure on the adhesive-backed version, then a short cool-down before handling. Curved hat presses give the cleanest result on a structured cap.",
        },
        {
          q: "What sizes and shapes are available?",
          a: "Rectangle, round, oval, square and hex, each in two sizes — small for pockets and caps, larger for jacket backs and bags. Every shape is on its own collection page with the exact dimensions.",
        },
        {
          q: "Do patches come with adhesive backing?",
          a: "Both versions exist: adhesive-backed for heat pressing and plain for sewing. Adhesive is the usual choice for hats; sewn is preferred on heavy workwear that gets industrial laundering.",
        },
        {
          q: "Is there a minimum patch order?",
          a: "No minimum and no setup fee. One patch is a valid order, which is what makes per-unit dropshipping of custom hats workable at all.",
        },
      ],
    },
    tr: {
      intro: [
        "Suni deri patch'ler, özel üretim tekstilde en hızlı büyüyen markalama biçimidir ve sebebi ekonomiktir: ısıyla yapıştırılan bir patch, yaklaşık yirmi saniyelik pres süresiyle 4 dolarlık düz bir şapkayı 28 dolarlık markalı bir ürüne çevirir — nakış kalıp ücreti yok, dijitalleştirme bedeli yok, alt limit yok.",
        "Dikdörtgen, yuvarlak, oval, kare ve altıgen patch'leri iki ölçüde, yapışkanlı ya da yapışkansız, standart suni deri renk skalasında stoklarız. Her biri senin tasarımınla kazınır ve prese hazır çıkar; yani lazerin ya da nakış makinen olmadan şapka, çanta ve ceket markalaması satabilirsin.",
      ],
      highlights: [
        "Adetle satılan özel şapka ve trucker cap markaları",
        "İş kıyafetlerine küçük işletme ve çiftlik logoları",
        "Takım, kulüp ve etkinlik ürün partileri",
        "Yerel tekstilcilere toptan patch tedariki",
      ],
      faqs: [
        {
          q: "Suni deri patch şapkaya nasıl uygulanır?",
          a: "Isı presiyle. Yapışkanlı sürümde alışılmış başlangıç noktası yaklaşık 140°C'de (285°F) orta basınçla 20 saniyedir; ardından ele almadan önce kısa bir soğuma. Yapılandırılmış şapkalarda en temiz sonucu kavisli şapka presi verir.",
        },
        {
          q: "Hangi ölçü ve şekiller var?",
          a: "Dikdörtgen, yuvarlak, oval, kare ve altıgen; her biri iki ölçüde — cep ve şapka için küçük, ceket sırtı ve çanta için büyük. Her şeklin kendi koleksiyon sayfasında tam ölçüleri yazılıdır.",
        },
        {
          q: "Patch'ler yapışkanlı mı geliyor?",
          a: "İki sürüm de var: ısı presi için yapışkanlı, dikiş için düz. Şapkada alışılmış tercih yapışkanlıdır; endüstriyel yıkamaya giren ağır iş kıyafetlerinde dikiş tercih edilir.",
        },
        {
          q: "Patch siparişinde alt limit var mı?",
          a: "Alt limit ve kalıp ücreti yok. Tek patch geçerli bir siparştir; özel şapkaların adetle stoksuz satışını mümkün kılan şey tam olarak budur.",
        },
      ],
    },
  },

  "gift-sets": {
    en: {
      intro: [
        "A gift set is the easiest way to raise an average order value without adding a single new customer: card and dice sets, whiskey stone sets, wine boxes with tools and poker sets all arrive as a finished presentation piece in a case, so one engraved lid does the work of an entire product photo shoot.",
        "Sets are also the strongest seller for corporate and wedding-party orders, where the buyer needs one item that looks considered and does not require them to assemble anything. Engraving goes on the case or lid, and the set ships complete.",
      ],
      highlights: [
        "Groomsmen and best-man gift sets",
        "Corporate client and holiday gifting",
        "Retirement and milestone presentations",
        "Higher-AOV bundles for an existing gift store",
      ],
      faqs: [
        {
          q: "Where is the engraving placed on a gift set?",
          a: "On the case or lid, which is the presentation surface. Some sets also allow engraving on an interior component — ask in a quote and we will confirm what the specific set supports.",
        },
        {
          q: "Do the sets ship assembled and ready to gift?",
          a: "Yes. Sets ship complete in their case with all components in place, so nothing needs to be built or repacked before it reaches your customer.",
        },
        {
          q: "Can a set be bundled with another engraved product?",
          a: "Yes — a set plus a matching flask or tumbler is a common groomsmen bundle. Send both SKUs on the same order and they ship together in one parcel.",
        },
      ],
    },
    tr: {
      intro: [
        "Hediye seti, tek bir yeni müşteri eklemeden ortalama sepet tutarını yükseltmenin en kolay yoludur: kart-zar setleri, viski taşı setleri, aletleriyle şarap kutuları ve poker setleri çantasıyla bitmiş bir sunum ürünü olarak gelir; kazınmış tek bir kapak, koca bir ürün çekiminin işini görür.",
        "Setler ayrıca kurumsal ve düğün siparişlerinin en güçlü satıcısıdır: alıcı, düşünülmüş görünen ve kendisinin bir şey birleştirmesini gerektirmeyen tek bir ürün ister. Kazıma çantaya ya da kapağa uygulanır, set komple sevk edilir.",
      ],
      highlights: [
        "Sağdıç ve baş sağdıç hediye setleri",
        "Kurumsal müşteri ve yılbaşı hediyeleri",
        "Emeklilik ve dönüm noktası takdimleri",
        "Mevcut hediye mağazasına sepet yükselten paketler",
      ],
      faqs: [
        {
          q: "Hediye setinde kazıma nereye yapılır?",
          a: "Sunum yüzeyi olan çanta ya da kapağa. Bazı setlerde iç parçalardan birine de kazıma yapılabilir — teklifte sor, o setin neyi desteklediğini net söyleriz.",
        },
        {
          q: "Setler kurulu ve hediyeye hazır mı geliyor?",
          a: "Evet. Setler tüm parçaları yerinde, çantasıyla komple çıkar; müşterine ulaşmadan önce hiçbir şeyin kurulması ya da yeniden paketlenmesi gerekmez.",
        },
        {
          q: "Bir set başka bir kazımalı ürünle birlikte paketlenebilir mi?",
          a: "Evet — set artı eşleşen bir matara ya da bardak yaygın bir sağdıç paketidir. İki SKU'yu aynı siparişte gönder, tek kolide birlikte çıksınlar.",
        },
      ],
    },
  },
};
