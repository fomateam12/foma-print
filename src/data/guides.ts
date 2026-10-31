import type { Locale } from "@/lib/i18n";

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface GuideCopy {
  title: string;
  /** Meta description and index-card subtitle. Keep under ~155 characters. */
  description: string;
  /** One-line hook shown under the title on the article page. */
  lede: string;
  sections: GuideSection[];
  faqs?: { q: string; a: string }[];
}

export interface Guide {
  slug: string;
  /** ISO date — feeds `datePublished` and the visible byline date. */
  published: string;
  /** Rough reading time in minutes, shown on the index. */
  minutes: number;
  copy: Record<Locale, GuideCopy>;
}

/**
 * The guides section.
 *
 * Why it exists: every page on this site used to be either a sales page or a
 * catalogue page. A reseller researching "how does print-on-demand engraving
 * work" or "how do I heat press a hat patch" had no reason to land here, and
 * the site had nothing to rank for informational queries — which is most of
 * the search volume in this market. These articles answer the questions we
 * actually get asked by email, in the same voice as the rest of the site.
 *
 * Adding one: append an entry with both locales filled in. The index page,
 * the sitemap and the internal links pick it up automatically.
 */
export const GUIDES: Guide[] = [
  {
    slug: "print-on-demand-laser-engraving",
    published: "2026-08-20",
    minutes: 6,
    copy: {
      en: {
        title: "How print-on-demand laser engraving actually works",
        description:
          "What happens between a customer clicking buy and an engraved tumbler arriving at their door — the process, the costs and where the margin comes from.",
        lede: "The process, end to end, with the parts most suppliers do not explain.",
        sections: [
          {
            heading: "What print-on-demand engraving is",
            paragraphs: [
              "Print-on-demand engraving means nobody buys stock before a customer orders. The blank products — tumblers, boards, journals, wallets — sit in a fulfilment warehouse. When an order comes in, one unit is pulled, engraved with that specific customer's text or artwork, packed and shipped. The seller pays for that single unit after it has already been sold.",
              "That is different from traditional custom-product wholesale, where you buy fifty units, engrave them yourself or pay a setup fee to have them done in a batch, and then hope the design sells. The economics are completely different: with print-on-demand there is no inventory risk, no setup fee, no minimum, and no dead stock at the end of a season.",
            ],
          },
          {
            heading: "What happens to a single order",
            paragraphs: [
              "The mechanics are simpler than most sellers expect. An order carries three things: the SKU of the blank, the personalization content, and the shipping address.",
            ],
            bullets: [
              "The order arrives with the SKU and the customer's engraving text or artwork file.",
              "The blank is pulled from stock and fixtured in the laser.",
              "The artwork is scaled to that product's engraving area — not shrunk to fit an arbitrary box.",
              "The laser engraves; on a coated tumbler this takes well under a minute.",
              "The item is checked, packed with your inserts, and labelled with your return address.",
              "It ships the same day when the order lands before the daily cutoff.",
            ],
          },
          {
            heading: "Where the margin actually comes from",
            paragraphs: [
              "Two places. The first is the gap between the blank cost plus the engraving fee and the retail price a personalized item commands — personalization typically doubles or triples what a buyer will pay for the same object, because it can no longer be comparison-shopped against an identical listing.",
              "The second is inventory that you never bought. A shop listing forty tumbler colourways with no stock has the same working capital as a shop listing four. That is the part that changes what a small seller can do, and it is why the size of your catalogue stops being a function of your bank balance.",
            ],
          },
          {
            heading: "What engraving cannot do",
            paragraphs: [
              "It is worth being honest about the limits before you build listings around them. Laser engraving is single-tone: it removes or darkens material, so it cannot produce colour. A full-colour logo has to be converted to one-colour artwork, and a photograph becomes a halftone at best. Gradients do not survive the conversion.",
              "For designs that genuinely need colour, UV printing is the right process, and any supplier who tells you a laser can reproduce a colour logo is setting you up for a refund. If you send us artwork that will not engrave well, we will say so before production rather than after.",
            ],
          },
        ],
        faqs: [
          {
            q: "How long does a print-on-demand engraved order take to ship?",
            a: "Orders placed before 2pm ET dispatch the same day. Transit time is on top of that and depends on the service the buyer chose.",
          },
          {
            q: "Do I need my own laser to sell engraved products?",
            a: "No. That is the point of the model — the equipment, the blanks and the operators sit on the fulfilment side, and you sell the finished product under your own brand.",
          },
        ],
      },
      tr: {
        title: "Talebe göre lazer kazıma gerçekte nasıl çalışır",
        description:
          "Müşteri satın al'a bastığı an ile kazınmış bardağın kapıya vardığı an arasında ne oluyor — süreç, maliyetler ve marjın nereden geldiği.",
        lede: "Uçtan uca süreç, tedarikçilerin çoğunun anlatmadığı kısımlarıyla.",
        sections: [
          {
            heading: "Talebe göre kazıma nedir",
            paragraphs: [
              "Talebe göre kazıma, müşteri sipariş vermeden kimsenin stok almaması demektir. Boş ürünler — bardaklar, tahtalar, defterler, cüzdanlar — bir depoda durur. Sipariş geldiğinde tek bir ürün çekilir, o müşterinin metniyle ya da tasarımıyla kazınır, paketlenir ve gönderilir. Satıcı o tek ürünün parasını, ürün zaten satıldıktan sonra öder.",
              "Bu, elli adet alıp kendin kazıdığın ya da kalıp ücreti ödeyip toplu yaptırdığın ve sonra tasarımın satmasını umduğun klasik özel ürün toptancılığından tamamen farklıdır. Ekonomisi başka: stok riski yok, kalıp ücreti yok, alt limit yok ve sezon sonunda elde kalan ölü stok yok.",
            ],
          },
          {
            heading: "Tek bir siparişte ne oluyor",
            paragraphs: [
              "Mekanik, satıcıların çoğunun sandığından basit. Sipariş üç şey taşır: boş ürünün SKU'su, kişiselleştirme içeriği ve teslimat adresi.",
            ],
            bullets: [
              "Sipariş, SKU ve müşterinin kazıma metni ya da tasarım dosyasıyla gelir.",
              "Boş ürün stoktan çekilir ve lazerde fikstüre bağlanır.",
              "Tasarım, o ürünün kazıma alanına göre ölçeklenir — rastgele bir kutuya sıkıştırılmaz.",
              "Lazer kazır; kaplamalı bir bardakta bu bir dakikanın çok altında sürer.",
              "Ürün kontrol edilir, senin eklerinle paketlenir ve senin iade adresinle etiketlenir.",
              "Sipariş günlük kesim saatinden önce düştüyse aynı gün sevk edilir.",
            ],
          },
          {
            heading: "Marj gerçekte nereden geliyor",
            paragraphs: [
              "İki yerden. Birincisi, boş ürün maliyeti artı kazıma ücreti ile kişiselleştirilmiş bir ürünün getirdiği perakende fiyat arasındaki fark. Kişiselleştirme, alıcının aynı nesneye ödeyeceği parayı tipik olarak ikiye üçe katlar; çünkü ürün artık birebir aynı bir ilanla fiyat karşılaştırmasına girmez.",
              "İkincisi, hiç satın almadığın stok. Kırk bardak rengini stoksuz ilanlayan bir mağazanın işletme sermayesi, dört tane ilanlayanla aynıdır. Küçük bir satıcının yapabileceklerini değiştiren kısım budur ve katalogunun büyüklüğünün banka bakiyenin bir fonksiyonu olmaktan çıkmasının sebebi de budur.",
            ],
          },
          {
            heading: "Kazımanın yapamadıkları",
            paragraphs: [
              "İlanları bunların üzerine kurmadan önce sınırları dürüstçe söylemekte fayda var. Lazer kazıma tek tonludur: malzemeyi kaldırır ya da koyulaştırır, yani renk üretemez. Renkli bir logo tek renk çizime çevrilmek zorundadır; fotoğraf ise en iyi ihtimalle yarım tona döner. Degradeler bu dönüşümden sağ çıkmaz.",
              "Gerçekten renk isteyen tasarımlar için doğru yöntem UV baskıdır ve sana lazerin renkli logoyu basabileceğini söyleyen tedarikçi seni iadeye hazırlıyordur. Bize iyi kazınmayacak bir tasarım gönderirsen, bunu üretimden sonra değil önce söyleriz.",
            ],
          },
        ],
        faqs: [
          {
            q: "Talebe göre kazımalı bir sipariş ne kadar sürede çıkar?",
            a: "ET saatiyle 14:00'ten önce verilen siparişler aynı gün sevk edilir. Taşıma süresi bunun üzerine eklenir ve alıcının seçtiği servise bağlıdır.",
          },
          {
            q: "Kazımalı ürün satmak için kendi lazerim olması gerekir mi?",
            a: "Hayır. Modelin bütün amacı bu — makine, boş ürün ve operatör tedarik tarafındadır; sen bitmiş ürünü kendi markanla satarsın.",
          },
        ],
      },
    },
  },

  {
    slug: "start-personalized-gift-store-without-inventory",
    published: "2026-08-20",
    minutes: 7,
    copy: {
      en: {
        title: "How to start a personalized gift store without inventory",
        description:
          "A practical first-90-days plan for launching a custom-gift shop with no stock, no equipment and no minimum order — what to list, what to price and what to skip.",
        lede: "What to do in the first ninety days, and the three mistakes that cost new sellers the most.",
        sections: [
          {
            heading: "Pick a lane before you pick products",
            paragraphs: [
              "The most common failure in personalized gifting is listing everything. A store with tumblers, cutting boards, wallets, patches and frames looks like a catalogue, and a catalogue competes on price. A store built around one occasion — weddings, new babies, groomsmen, teacher gifts, corporate onboarding — competes on being obviously the right shop for that moment.",
              "Pick the occasion first, then choose the products that serve it. A wedding shop needs a cutting board, a pair of tumblers, a set of flasks and a jewelry box. That is four products, not four hundred, and it is enough to fill a storefront that converts.",
            ],
          },
          {
            heading: "Start with eight to twelve listings",
            paragraphs: [
              "Every listing needs photographs, a description, personalization fields and a plan for how customers send their text. Doing that properly takes a couple of hours per listing. Twelve good listings will outsell sixty rushed ones, because the search algorithms on both Etsy and Amazon reward listings that convert, and a rushed listing converts badly.",
              "Choose them so they cover three price points — an entry item under $30, a core item in the $35 to $60 band, and one premium piece above that. The premium piece rarely sells the most units, but it makes the core item look reasonable.",
            ],
          },
          {
            heading: "Price from the total landed cost, not the product cost",
            paragraphs: [
              "This is where new sellers lose money. The number you must cover is the blank cost, plus the engraving fee, plus shipping, plus the marketplace commission, plus the payment processing fee, plus the share of returns and remakes you will inevitably have. Marketplace commissions alone run from about 6% to over 15% depending on the platform.",
              "Work backwards instead: take the retail price you believe the market accepts, subtract every one of those costs, and see what is left. If the answer is thin, the fix is usually a higher-perceived-value product rather than a higher price on the same one.",
            ],
          },
          {
            heading: "The three mistakes that cost the most",
            paragraphs: [
              "First, free shipping absorbed into a price that was never recalculated. Second, unlimited personalization — letting a customer request anything guarantees you will eventually receive a request nobody can produce, and every one of those becomes a refund. Constrain the fields: a name, a date, a choice of font.",
              "Third, promising a delivery date instead of a dispatch date. You control when an order leaves; you do not control the carrier. Say when it ships and give a transit estimate separately, and the same delay stops being your fault.",
            ],
          },
          {
            heading: "What you do not need on day one",
            paragraphs: [
              "You do not need a laser, a heat press, a photography studio, a warehouse or a trademark. You need listings, a fulfilment partner who ships blind under your brand, and a way to collect personalization text cleanly at checkout. Everything else is an optimisation you can buy later out of profit.",
            ],
          },
        ],
      },
      tr: {
        title: "Stoksuz kişiselleştirilmiş hediye mağazası nasıl açılır",
        description:
          "Stoksuz, makinesiz ve alt limitsiz bir özel hediye mağazası için ilk 90 günün pratik planı — ne ilanlanır, nasıl fiyatlanır, neye hiç girilmez.",
        lede: "İlk doksan günde ne yapılacağı ve yeni satıcılara en pahalıya patlayan üç hata.",
        sections: [
          {
            heading: "Ürün seçmeden önce şerit seç",
            paragraphs: [
              "Kişiselleştirilmiş hediyecilikte en yaygın başarısızlık, her şeyi ilanlamaktır. Bardağı, kesme tahtası, cüzdanı, patch'i ve çerçevesi olan bir mağaza katalog gibi görünür; katalog da fiyatla yarışır. Tek bir ana etrafında kurulmuş bir mağaza — düğün, yeni bebek, sağdıç, öğretmen hediyesi, kurumsal işe başlama — o an için apaçık doğru mağaza olmakla yarışır.",
              "Önce anı seç, sonra ona hizmet eden ürünleri. Bir düğün mağazasına bir kesme tahtası, bir çift bardak, bir matara seti ve bir mücevher kutusu gerekir. Bu dört üründür, dört yüz değil ve dönüşen bir vitrini doldurmaya yeter.",
            ],
          },
          {
            heading: "Sekiz ila on iki ilanla başla",
            paragraphs: [
              "Her ilan fotoğraf, açıklama, kişiselleştirme alanları ve müşterinin metnini nasıl göndereceğine dair bir plan ister. Bunu düzgün yapmak ilan başına birkaç saat sürer. On iki iyi ilan, altmış aceleye getirilmiş ilandan fazla satar; çünkü hem Etsy hem Amazon'un algoritmaları dönüşen ilanı ödüllendirir ve acele ilan kötü dönüşür.",
              "İlanları üç fiyat noktasını kapsayacak şekilde seç — 30 doların altında bir giriş ürünü, 35-60 dolar bandında bir ana ürün ve bunun üstünde bir premium parça. Premium parça nadiren en çok adedi satar ama ana ürünü makul gösterir.",
            ],
          },
          {
            heading: "Ürün maliyetinden değil, toplam inen maliyetten fiyatla",
            paragraphs: [
              "Yeni satıcıların para kaybettiği yer burasıdır. Karşılaman gereken sayı; boş ürün maliyeti artı kazıma ücreti artı kargo artı pazaryeri komisyonu artı ödeme işlem ücreti artı kaçınılmaz olarak yaşayacağın iade ve yeniden üretim payıdır. Tek başına pazaryeri komisyonları platforma göre yaklaşık %6 ile %15'in üzerinde arasında değişir.",
              "Tersten çalış: pazarın kabul ettiğine inandığın perakende fiyatı al, bu maliyetlerin her birini çıkar ve geriye ne kaldığına bak. Sonuç inceyse, çözüm genelde aynı ürüne daha yüksek fiyat değil, algılanan değeri daha yüksek bir üründür.",
            ],
          },
          {
            heading: "En pahalıya patlayan üç hata",
            paragraphs: [
              "Birincisi, hiç yeniden hesaplanmamış bir fiyatın içine gömülmüş ücretsiz kargo. İkincisi, sınırsız kişiselleştirme — müşterinin her şeyi isteyebilmesi, er ya da geç kimsenin üretemeyeceği bir talebin gelmesini garantiler ve bunların her biri iadeye döner. Alanları sınırla: bir isim, bir tarih, bir font seçeneği.",
              "Üçüncüsü, sevk tarihi yerine teslim tarihi sözü vermek. Siparişin ne zaman çıkacağını sen kontrol edersin, kargoyu etmezsin. Ne zaman sevk edileceğini söyle, taşıma tahminini ayrı ver; aynı gecikme senin suçun olmaktan çıksın.",
            ],
          },
          {
            heading: "İlk gün gerekmeyen şeyler",
            paragraphs: [
              "Lazere, ısı presine, fotoğraf stüdyosuna, depoya ya da tescilli markaya ihtiyacın yok. İhtiyacın olan şey: ilanlar, senin markanla gizli sevkiyat yapan bir üretim ortağı ve ödeme adımında kişiselleştirme metnini temiz toplayan bir yöntem. Geri kalan her şey, sonradan kârdan satın alabileceğin bir iyileştirmedir.",
            ],
          },
        ],
      },
    },
  },

  {
    slug: "laser-engraving-vs-uv-printing",
    published: "2026-08-20",
    minutes: 5,
    copy: {
      en: {
        title: "Laser engraving vs UV printing: which to use on drinkware",
        description:
          "Engraving is permanent but single-tone; UV printing is full colour but sits on the surface. A practical comparison for sellers choosing between the two.",
        lede: "Two processes, two completely different products. Choosing wrong is the most common cause of refunds in this category.",
        sections: [
          {
            heading: "What each process physically does",
            paragraphs: [
              "Laser engraving removes material. On a powder-coated stainless tumbler, the laser burns off the coating and exposes the steel underneath, so the mark is a physical change in the object. Nothing is added to the surface, which is why the mark cannot chip, peel or wash off.",
              "UV printing adds material. Ink is cured onto the surface with ultraviolet light in a thin layer that sits on top of the product. That layer can carry full colour, gradients and photographs — and, because it is a layer, it can eventually wear at points of hard abrasion.",
            ],
          },
          {
            heading: "When engraving is the right choice",
            paragraphs: [
              "Choose engraving when the design is text, a monogram, a single-colour logo or line art, and when the buyer's expectation is permanence: wedding keepsakes, memorial pieces, corporate gifts meant to last, anything that will go through a dishwasher for years.",
              "It is also the right choice when consistency matters across a large run. Engraving depth and tone are a property of the material, so the hundredth unit looks exactly like the first.",
            ],
          },
          {
            heading: "When UV printing is the right choice",
            paragraphs: [
              "Choose UV when the design needs colour and the colour is the point — a full-colour brand logo, an illustrated character, a photograph, a pattern with more than one tone. No amount of laser skill produces colour, and converting a colourful design to single-tone usually destroys what made it sell.",
              "It is also the practical choice on materials that engrave poorly or unpredictably, where a printed layer gives a more consistent result than a burn would.",
            ],
          },
          {
            heading: "How to explain the difference to a customer",
            paragraphs: [
              "The clearest framing for a product listing is this: engraving is part of the cup, printing is on the cup. Buyers understand that immediately, and it sets an accurate expectation about both the look and the durability.",
              "It also protects you. A customer who was told the engraving would be silver-coloured is not surprised when it arrives silver-coloured, and a customer who chose printing knowingly is not surprised that it is a printed layer.",
            ],
          },
        ],
        faqs: [
          {
            q: "Can you engrave in colour?",
            a: "No. Engraving exposes or darkens the material itself, and the resulting tone is a fixed property of that material. Any colour in a design has to come from printing.",
          },
          {
            q: "Which lasts longer on a tumbler?",
            a: "Engraving, because there is no applied layer to wear through. A well-cured UV print is durable, but engraving is the one that is effectively permanent.",
          },
        ],
      },
      tr: {
        title: "Lazer kazıma mı UV baskı mı: içecek ürünlerinde hangisi",
        description:
          "Kazıma kalıcıdır ama tek tonludur; UV baskı tam renklidir ama yüzeyin üzerinde durur. İkisi arasında seçim yapan satıcılar için pratik bir karşılaştırma.",
        lede: "İki yöntem, tamamen iki farklı ürün. Yanlış seçim bu kategorideki iadelerin en yaygın sebebidir.",
        sections: [
          {
            heading: "Her yöntem fiziksel olarak ne yapar",
            paragraphs: [
              "Lazer kazıma malzemeyi kaldırır. Toz boyalı paslanmaz bir bardakta lazer kaplamayı yakıp altındaki çeliği açığa çıkarır; yani iz, nesnenin kendisindeki fiziksel bir değişimdir. Yüzeye hiçbir şey eklenmez — izin çatlayamamasının, kalkamamasının ve yıkanıp gidememesinin sebebi budur.",
              "UV baskı ise malzeme ekler. Mürekkep, ürünün üzerinde duran ince bir katman hâlinde ultraviyole ışıkla kürlenir. Bu katman tam rengi, degradeleri ve fotoğrafı taşıyabilir — ve bir katman olduğu için sert sürtünme noktalarında zamanla aşınabilir.",
            ],
          },
          {
            heading: "Kazıma ne zaman doğru seçim",
            paragraphs: [
              "Tasarım yazı, monogram, tek renk logo ya da çizgi çalışmasıysa ve alıcının beklentisi kalıcılıksa kazımayı seç: düğün hatıraları, anma parçaları, uzun ömürlü olması istenen kurumsal hediyeler, yıllarca bulaşık makinesine girecek her şey.",
              "Büyük partilerde tutarlılık önemliyse de doğru seçim kazımadır. Kazıma derinliği ve tonu malzemenin bir özelliğidir; yüzüncü ürün birinciyle birebir aynı görünür.",
            ],
          },
          {
            heading: "UV baskı ne zaman doğru seçim",
            paragraphs: [
              "Tasarım renk istiyorsa ve asıl mesele renkse UV'yi seç — tam renkli marka logosu, çizim karakter, fotoğraf, birden fazla tonu olan desen. Hiçbir lazer becerisi renk üretmez ve renkli bir tasarımı tek tona çevirmek genelde onu satan şeyi yok eder.",
              "Kötü ya da öngörülemez kazınan malzemelerde de pratik seçim UV'dir; basılı katman, yanıktan daha tutarlı bir sonuç verir.",
            ],
          },
          {
            heading: "Farkı müşteriye nasıl anlatmalı",
            paragraphs: [
              "Bir ürün ilanı için en net çerçeve şu: kazıma bardağın parçasıdır, baskı bardağın üzerindedir. Alıcılar bunu anında anlar ve bu, hem görünüm hem dayanıklılık konusunda doğru bir beklenti kurar.",
              "Bu seni de korur. Kazımanın gümüş renkli olacağı söylenmiş bir müşteri, ürün gümüş renkli geldiğinde şaşırmaz; bilerek baskıyı seçmiş bir müşteri de basılı bir katman olmasına şaşırmaz.",
            ],
          },
        ],
        faqs: [
          {
            q: "Renkli kazıma yapılabilir mi?",
            a: "Hayır. Kazıma malzemenin kendisini açığa çıkarır ya da koyulaştırır ve çıkan ton o malzemenin sabit bir özelliğidir. Tasarımdaki her renk baskıdan gelmek zorundadır.",
          },
          {
            q: "Bardakta hangisi daha uzun ömürlü?",
            a: "Kazıma; çünkü aşınacak bir uygulanmış katman yok. İyi kürlenmiş bir UV baskı dayanıklıdır ama fiilen kalıcı olan kazımadır.",
          },
        ],
      },
    },
  },

  {
    slug: "how-to-apply-leatherette-patches",
    published: "2026-08-20",
    minutes: 5,
    copy: {
      en: {
        title: "How to heat press a leatherette patch onto a hat",
        description:
          "Press settings, placement, and the mistakes that ruin a cap — a step-by-step guide to applying engraved leatherette patches to hats, bags and workwear.",
        lede: "Twenty seconds of press time turns a plain cap into a branded product. Here is how to not ruin it.",
        sections: [
          {
            heading: "What you need",
            paragraphs: [
              "An adhesive-backed leatherette patch, a heat press, and the garment. For structured caps a curved hat press gives a far cleaner result than a flat press, because a flat platen cannot make even contact with a curved crown.",
            ],
            bullets: [
              "Adhesive-backed engraved patch",
              "Heat press — curved cap press for structured hats, flat press for bags and flat panels",
              "A heat-resistant cover sheet",
              "A ruler or a centring tool for placement",
            ],
          },
          {
            heading: "Settings to start from",
            paragraphs: [
              "A typical starting point is around 285°F for about 20 seconds at medium pressure. Treat that as a starting point rather than a rule: presses read temperature differently, cap crowns vary in thickness, and the fabric under the patch changes how heat transfers.",
              "Press one test unit before you run an order. A patch that lifts at a corner was under-pressed; a patch with a scorched halo in the fabric around it was over-pressed or held too long.",
            ],
          },
          {
            heading: "Placement",
            paragraphs: [
              "On a standard trucker cap the patch sits centred on the front panel with its lower edge roughly a centimetre above the brim seam. Measure it rather than eyeballing it — an off-centre patch is the single most visible defect on a finished hat, and it is not recoverable once pressed.",
              "For bags and jacket backs, place the patch relative to a seam rather than to the edge of the fabric, since seams are what the eye reads as the centre line.",
            ],
          },
          {
            heading: "After the press",
            paragraphs: [
              "Let the piece cool completely before handling it. The adhesive reaches full strength as it cools, and pulling at a warm patch is the most common way to lift a corner that would otherwise have held.",
              "For garments that will be laundered industrially, sew the patch rather than relying on adhesive alone. Heat-applied patches are excellent on caps and bags; heavy repeated washing is where stitching earns its keep.",
            ],
          },
        ],
        faqs: [
          {
            q: "Can I press a patch onto a structured cap with a flat press?",
            a: "You can, but the result is usually uneven because the platen only contacts the highest part of the crown. A curved cap press is the tool that makes this repeatable.",
          },
          {
            q: "Do leatherette patches peel over time?",
            a: "A correctly pressed patch on a cap holds well. Lifting almost always traces back to insufficient pressure, too short a press, or handling the piece before it cooled.",
          },
        ],
      },
      tr: {
        title: "Suni deri patch şapkaya nasıl preslenir",
        description:
          "Pres ayarları, konumlandırma ve bir şapkayı mahveden hatalar — kazınmış suni deri patch'leri şapka, çanta ve iş kıyafetine uygulamak için adım adım rehber.",
        lede: "Yirmi saniyelik pres, düz bir şapkayı markalı bir ürüne çevirir. İşte onu mahvetmemenin yolu.",
        sections: [
          {
            heading: "Gerekenler",
            paragraphs: [
              "Yapışkan arkalıklı bir suni deri patch, bir ısı presi ve giysi. Yapılandırılmış şapkalarda kavisli şapka presi düz presten çok daha temiz sonuç verir; çünkü düz plaka kavisli bir kubbeyle eşit temas kuramaz.",
            ],
            bullets: [
              "Yapışkan arkalıklı kazınmış patch",
              "Isı presi — yapılandırılmış şapkada kavisli şapka presi, çanta ve düz panelde düz pres",
              "Isıya dayanıklı örtü kâğıdı",
              "Konumlandırma için cetvel ya da ortalama aparatı",
            ],
          },
          {
            heading: "Başlangıç ayarları",
            paragraphs: [
              "Tipik başlangıç noktası yaklaşık 140°C'de (285°F), orta basınçla 20 saniyedir. Bunu bir kural değil, başlangıç noktası olarak gör: presler sıcaklığı farklı okur, şapka kubbelerinin kalınlığı değişir ve patch'in altındaki kumaş ısının nasıl geçtiğini değiştirir.",
              "Siparişi koşmadan önce bir test ürünü presle. Köşesi kalkan patch az preslenmiştir; çevresindeki kumaşta yanık halesi olan patch fazla preslenmiş ya da fazla bekletilmiştir.",
            ],
          },
          {
            heading: "Konumlandırma",
            paragraphs: [
              "Standart bir trucker şapkada patch ön panele ortalanır ve alt kenarı siperlik dikişinin yaklaşık bir santim üstünde durur. Göz kararı yapma, ölç — ortalanmamış patch bitmiş bir şapkadaki en görünür kusurdur ve preslendikten sonra geri dönüşü yoktur.",
              "Çanta ve ceket sırtında patch'i kumaşın kenarına göre değil bir dikişe göre yerleştir; çünkü göz orta çizgi olarak dikişi okur.",
            ],
          },
          {
            heading: "Presten sonra",
            paragraphs: [
              "Ürünü ele almadan önce tamamen soğumaya bırak. Yapışkan tam gücüne soğurken ulaşır ve sıcak patch'i çekiştirmek, aslında tutacak olan bir köşeyi kaldırmanın en yaygın yoludur.",
              "Endüstriyel yıkamaya girecek giysilerde patch'i yalnızca yapışkana güvenmek yerine dik. Isıyla uygulanan patch'ler şapka ve çantada mükemmeldir; dikişin hakkını verdiği yer ağır ve tekrarlı yıkamadır.",
            ],
          },
        ],
        faqs: [
          {
            q: "Yapılandırılmış şapkaya düz presle patch basabilir miyim?",
            a: "Basabilirsin ama sonuç genelde eşitsiz olur; plaka yalnızca kubbenin en yüksek yerine temas eder. Bunu tekrarlanabilir kılan alet kavisli şapka presidir.",
          },
          {
            q: "Suni deri patch'ler zamanla kalkar mı?",
            a: "Doğru preslenmiş bir patch şapkada iyi tutar. Kalkma neredeyse her zaman yetersiz basınca, kısa pres süresine ya da ürünü soğumadan ellemeye dayanır.",
          },
        ],
      },
    },
  },

  {
    slug: "blind-shipping-for-resellers",
    published: "2026-08-20",
    minutes: 4,
    copy: {
      en: {
        title: "Blind shipping explained: keeping your supplier invisible",
        description:
          "What blind shipping is, what actually appears on the parcel, and what to check before you trust a fulfilment partner with your customers.",
        lede: "Your customer should never learn who made their order. Here is what that requires in practice.",
        sections: [
          {
            heading: "What blind shipping means",
            paragraphs: [
              "Blind shipping means the parcel that reaches your customer carries your identity, not your supplier's. Your return address is on the label, your inserts are in the box, and there is no packing slip, branding, marketing card or invoice from the party who actually produced the order.",
              "The purpose is simple: your customer's relationship is with your brand. If they can read the name of the factory on the label, they can order direct next time, and every repeat sale you would have had becomes someone else's.",
            ],
          },
          {
            heading: "What to check before you trust a partner",
            paragraphs: [
              "The details are where blind shipping quietly fails. Ask specifically about each of these rather than accepting a yes to the general question.",
            ],
            bullets: [
              "Whose return address prints on the shipping label",
              "Whether any packing slip or invoice goes in the box, and whose name is on it",
              "Whether promotional inserts, cards or stickers are added by default",
              "Whether your own inserts can be included, and at what cost",
              "What the tracking page shows the recipient as the sender",
              "What happens on a return — who receives it and what the customer sees",
            ],
          },
          {
            heading: "Where it usually goes wrong",
            paragraphs: [
              "The most common leak is not the label — it is an insert. A supplier who adds their own thank-you card or discount code to every parcel has just marketed to your customer with your money, and most sellers only discover it when a buyer mentions it.",
              "The second most common is the return path. A parcel that comes back with a different name on it, or a customer-service email from an unfamiliar company, undoes the whole arrangement at the exact moment the customer is already unhappy.",
            ],
          },
          {
            heading: "What it does not protect",
            paragraphs: [
              "Blind shipping hides who fulfils your orders; it does not hide what you sell. Anyone can reverse-search a product photo and find the same blank elsewhere. What keeps a customer with you is the personalization, the listing, the service and the speed — not the secrecy of your supply chain.",
            ],
          },
        ],
        faqs: [
          {
            q: "Does blind shipping cost extra?",
            a: "It should be part of the service rather than a surcharge. Ask before you build a business on it — a partner who charges to keep their own branding out of your parcel is telling you something.",
          },
        ],
      },
      tr: {
        title: "Gizli sevkiyat nedir: tedarikçini görünmez tutmak",
        description:
          "Gizli sevkiyat nedir, kolinin üzerinde gerçekte ne görünür ve müşterilerini bir üretim ortağına emanet etmeden önce neyi kontrol etmelisin.",
        lede: "Müşterin siparişini kimin ürettiğini asla öğrenmemeli. Bunun pratikte gerektirdiği şeyler.",
        sections: [
          {
            heading: "Gizli sevkiyat ne demek",
            paragraphs: [
              "Gizli sevkiyat, müşterine ulaşan kolinin tedarikçinin değil senin kimliğini taşıması demektir. Etikette senin iade adresin, kutuda senin eklerin bulunur; siparişi fiilen üreten taraftan gelen hiçbir irsaliye, marka, pazarlama kartı ya da fatura olmaz.",
              "Amaç basit: müşterinin ilişkisi senin markanla. Etikette fabrikanın adını okuyabiliyorsa bir dahaki sefere doğrudan sipariş verebilir ve senin olacak her tekrar satış bir başkasının olur.",
            ],
          },
          {
            heading: "Bir ortağa güvenmeden önce kontrol edilecekler",
            paragraphs: [
              "Gizli sevkiyat sessizce ayrıntılarda çöker. Genel soruya alınan evete güvenmek yerine bunların her birini tek tek sor.",
            ],
            bullets: [
              "Kargo etiketine kimin iade adresi basılıyor",
              "Kutuya irsaliye ya da fatura giriyor mu, üzerinde kimin adı var",
              "Varsayılan olarak tanıtım eki, kart ya da sticker ekleniyor mu",
              "Senin kendi eklerin konulabiliyor mu, hangi bedelle",
              "Takip sayfası alıcıya göndericiyi kim olarak gösteriyor",
              "İadede ne oluyor — kim teslim alıyor ve müşteri ne görüyor",
            ],
          },
          {
            heading: "Genelde nerede bozuluyor",
            paragraphs: [
              "En yaygın sızıntı etiket değil, ektir. Her koliye kendi teşekkür kartını ya da indirim kodunu koyan bir tedarikçi, senin paranla senin müşterine pazarlama yapmış olur ve satıcıların çoğu bunu ancak bir alıcı bahsedince öğrenir.",
              "İkinci en yaygını iade yoludur. Üzerinde başka bir isim olan bir koli ya da tanımadık bir şirketten gelen müşteri hizmetleri e-postası, müşterinin zaten mutsuz olduğu tam anda tüm düzeni bozar.",
            ],
          },
          {
            heading: "Neyi korumaz",
            paragraphs: [
              "Gizli sevkiyat siparişlerini kimin ürettiğini gizler; ne sattığını gizlemez. Herkes bir ürün fotoğrafını ters aratıp aynı boş ürünü başka yerde bulabilir. Müşteriyi seninle tutan şey kişiselleştirme, ilan, hizmet ve hızdır — tedarik zincirinin gizliliği değil.",
            ],
          },
        ],
        faqs: [
          {
            q: "Gizli sevkiyat ek ücretli mi?",
            a: "Ek ücret değil, hizmetin parçası olmalı. Üzerine iş kurmadan önce sor — kendi markasını senin kolinden çıkarmak için para isteyen bir ortak sana bir şey söylüyordur.",
          },
        ],
      },
    },
  },
  {
    slug: "choose-laser-engraving-fulfillment-partner",
    published: "2026-10-31",
    minutes: 6,
    copy: {
      en: {
        title: "How to choose a laser engraving fulfillment partner for Etsy, Amazon and Shopify",
        description:
          "A practical checklist for picking a print-on-demand engraving supplier: test orders, artwork checks, blind shipping, cutoffs, minimums and how payment works.",
        lede: "Seven questions to ask before you route a single customer order to anyone.",
        sections: [
          {
            heading: "Why the choice matters more than the price list",
            paragraphs: [
              "When you sell personalized products without your own laser, your fulfilment partner becomes part of your shop. Every late parcel, crooked name or supplier flyer in the box lands in your reviews, not theirs. A blank that is a dollar cheaper is worth nothing if one in twenty orders comes back.",
              "The good news is that the differences between suppliers are easy to test before you commit. Most of what matters shows up in a single sample order and a few direct questions.",
            ],
          },
          {
            heading: "The checklist",
            paragraphs: [
              "Ask every candidate the same questions and keep the answers in one place. Vague answers are an answer too.",
            ],
            bullets: [
              "Minimums: can you order one unit, or do you have to pre-buy stock? Made-to-order should mean exactly that.",
              "Cutoff and dispatch: what time does an order have to arrive to ship the same day, and is transit time quoted separately?",
              "Blind shipping: does the parcel carry your return address, and is anything with the supplier's name — inserts, invoices, packing slips — kept out of the box?",
              "Artwork checks: will someone tell you before production when a file will not engrave well, or do you find out from the customer?",
              "Engraving areas: do they publish the real engraving area for each product, so your listing mockups match what ships?",
              "Payment: per-order card charges, an invoice, or a prepaid balance — and are there subscription or setup fees on top?",
              "Where production happens: a U.S. workshop with stocked blanks behaves very differently at holiday peaks from an overseas factory.",
            ],
          },
          {
            heading: "Run one real test order",
            paragraphs: [
              "Send an order exactly the way a customer would: a real name, your actual font, a product you plan to list, shipped to your own address. Then check the engraving depth and alignment, how the item was protected, what was printed on the label and what was inside the box.",
              "Time it too. The gap between the promised and the actual dispatch time on a quiet week tells you what to expect in December.",
            ],
          },
          {
            heading: "Red flags",
            paragraphs: [
              "A partner who charges extra to leave their own branding out of your parcels, who cannot say what the engraving area of a product is, or who promises a laser can reproduce a full-colour photo is telling you how the relationship will go. So is a supplier who answers every question with a sales call instead of a written answer.",
            ],
          },
        ],
        faqs: [
          {
            q: "Can I use a fulfillment partner for Etsy personalized listings?",
            a: "Yes. Etsy allows production partners for items you design; you disclose the partner in your listing. You keep the listing and the customer, and the partner engraves and ships each order.",
          },
          {
            q: "What should a sample order cost?",
            a: "A sample should cost the same as a normal single order. With a made-to-order supplier there is no reason to charge a setup fee for one unit.",
          },
          {
            q: "How does FomaPrint handle these points?",
            a: "No minimums, same-day dispatch on orders before 2pm ET, blind shipping under your brand, artwork checked before production, and a prepaid wallet with no subscription. Production is in Alpharetta, Georgia.",
          },
        ],
      },
      tr: {
        title: "Etsy, Amazon ve Shopify için lazer kazıma üretim ortağı nasıl seçilir",
        description:
          "Talebe göre kazıma tedarikçisi seçmek için pratik kontrol listesi: deneme siparişi, tasarım kontrolü, gizli sevkiyat, kesim saati, alt limit ve ödeme.",
        lede: "Tek bir müşteri siparişini birine yönlendirmeden önce sorulacak yedi soru.",
        sections: [
          {
            heading: "Seçim neden fiyat listesinden daha önemli",
            paragraphs: [
              "Kendi lazerin olmadan kişiselleştirilmiş ürün sattığında, üretim ortağın mağazanın bir parçası olur. Her geç kargo, kayık isim ya da kolideki tedarikçi broşürü onların değil senin yorumlarına düşer. Bir dolar daha ucuz boş ürün, yirmi siparişten biri geri dönüyorsa hiçbir şey ifade etmez.",
              "İyi haber şu: tedarikçiler arasındaki farklar, bağlanmadan önce kolayca test edilebilir. Önemli olanın çoğu tek bir deneme siparişinde ve birkaç doğrudan soruda ortaya çıkar.",
            ],
          },
          {
            heading: "Kontrol listesi",
            paragraphs: [
              "Her adaya aynı soruları sor ve cevapları tek bir yerde tut. Belirsiz cevap da bir cevaptır.",
            ],
            bullets: [
              "Alt limit: tek adet sipariş verebiliyor musun, yoksa önceden stok mu almak zorundasın? Siparişe göre üretim tam olarak bu demek olmalı.",
              "Kesim saati ve sevk: siparişin aynı gün çıkması için saat kaça kadar gelmesi gerekiyor ve kargo süresi ayrıca mı belirtiliyor?",
              "Gizli sevkiyat: kolide senin iade adresin mi var ve tedarikçinin adını taşıyan her şey — ekler, faturalar, irsaliyeler — koliden uzak tutuluyor mu?",
              "Tasarım kontrolü: bir dosya iyi kazınmayacaksa üretimden önce biri sana söylüyor mu, yoksa bunu müşteriden mi öğreniyorsun?",
              "Kazıma alanları: her ürünün gerçek kazıma alanını yayınlıyorlar mı, böylece ilan görsellerin gönderilenle örtüşsün?",
              "Ödeme: sipariş başına kart, fatura ya da ön yüklemeli bakiye — üstüne abonelik ya da kurulum ücreti var mı?",
              "Üretim nerede: stoklu boş ürünlerle çalışan bir ABD atölyesi, tatil yoğunluğunda yurt dışındaki bir fabrikadan çok farklı davranır.",
            ],
          },
          {
            heading: "Tek bir gerçek deneme siparişi ver",
            paragraphs: [
              "Siparişi tam bir müşteri gibi gönder: gerçek bir isim, kendi yazı tipin, ilanlamayı düşündüğün bir ürün, kendi adresine. Sonra kazıma derinliğini ve hizasını, ürünün nasıl korunduğunu, etikette ne yazdığını ve kolinin içinde ne olduğunu kontrol et.",
              "Süreyi de ölç. Sakin bir haftada söz verilen ile gerçek sevk saati arasındaki fark, Aralık'ta ne bekleyeceğini söyler.",
            ],
          },
          {
            heading: "Kırmızı bayraklar",
            paragraphs: [
              "Kendi markasını senin kolinden çıkarmak için ek ücret isteyen, bir ürünün kazıma alanını söyleyemeyen ya da lazerin renkli fotoğraf basabileceğini vaat eden ortak, ilişkinin nasıl gideceğini sana anlatıyordur. Her soruya yazılı cevap yerine satış görüşmesiyle dönen tedarikçi de öyle.",
            ],
          },
        ],
        faqs: [
          {
            q: "Etsy'deki kişiselleştirilmiş ilanlar için üretim ortağı kullanabilir miyim?",
            a: "Evet. Etsy, senin tasarladığın ürünler için üretim ortağına izin verir; ortağı ilanında belirtirsin. İlan ve müşteri sende kalır, ortak her siparişi kazıyıp gönderir.",
          },
          {
            q: "Bir deneme siparişi ne kadar tutmalı?",
            a: "Deneme siparişi normal tek bir siparişle aynı tutmalı. Siparişe göre üreten bir tedarikçinin tek adet için kurulum ücreti alması için bir sebep yok.",
          },
          {
            q: "FomaPrint bu noktaları nasıl karşılıyor?",
            a: "Alt limit yok, 14:00 ET öncesi siparişlerde aynı gün sevk, senin markanla gizli sevkiyat, üretim öncesi tasarım kontrolü ve aboneliksiz ön yüklemeli cüzdan. Üretim Alpharetta, Georgia'da.",
          },
        ],
      },
    },
  },
  {
    slug: "prepare-artwork-for-laser-engraving",
    published: "2026-10-31",
    minutes: 5,
    copy: {
      en: {
        title: "How to prepare artwork for laser engraving (SVG and DXF)",
        description:
          "File format, colours, line thickness and sizing for laser engraving artwork — the checks that decide whether a design engraves cleanly or comes out broken.",
        lede: "Most engraving problems are file problems. Here is how to avoid them.",
        sections: [
          {
            heading: "Use vector files: SVG or DXF",
            paragraphs: [
              "A laser follows paths, so the cleanest results come from vector artwork. SVG and DXF keep every edge sharp at any size; a JPG or PNG has to be traced first, and tracing softens corners, loses thin details and invents bumps along curves.",
              "Convert all text to outlines before exporting. A font that is installed on your computer may not exist on the production machine, and a missing font silently changes the design.",
            ],
          },
          {
            heading: "One colour, high contrast",
            paragraphs: [
              "Engraving is single-tone. Prepare artwork as solid black on a transparent background: black is what gets engraved, everything else is left alone. Remove gradients, drop shadows, glows and soft edges — they cannot be engraved, and the laser has to decide where they start and stop.",
              "If a logo only exists in colour, redraw it as one-colour line art before sending it. That is a design decision, and it is better made by you than guessed in production.",
            ],
          },
          {
            heading: "Line thickness and small text",
            paragraphs: [
              "Thin lines are the most common cause of a disappointing result. Measured at the final engraved size, keep strokes at least about 0.4 mm thick. Hairline serifs, delicate script connectors and tiny ornaments that look fine on a screen can break up or disappear on a curved tumbler or textured leatherette.",
              "Check the artwork at its real physical size, not zoomed in. If you have to squint at 100% on a ruler-scaled preview, it will be hard to read on the product.",
            ],
            bullets: [
              "Expand strokes into filled shapes so the thickness is fixed.",
              "Keep the gaps between letters open — touching letters merge when engraved.",
              "Avoid text smaller than the product can resolve; script fonts need more size than block fonts.",
            ],
          },
          {
            heading: "Size the design to the engraving area",
            paragraphs: [
              "Every product has a fixed engraving area. Design to that box rather than to the product photo, and leave a small margin from the edges. A design that is scaled down to fit an area it was not drawn for loses its thin details first.",
              "Personalized fields — names, dates, initials — need room for the longest likely value. Test your layout with a long name, not just a short one.",
            ],
          },
        ],
        faqs: [
          {
            q: "Can I send a PNG or JPG for laser engraving?",
            a: "It can be traced, but tracing loses detail and sharpness. A clean SVG or DXF with text converted to outlines gives a reliably better result.",
          },
          {
            q: "Can a laser engrave a photo?",
            a: "Only as a one-tone halftone, and the result depends heavily on the material. For a true colour photo, UV printing is the right process.",
          },
          {
            q: "What does FomaPrint require?",
            a: "High-contrast black vector artwork (SVG or DXF) on a transparent background, sized to the product's engraving area. Resellers receive the per-product spec sheet with their welcome pack.",
          },
        ],
      },
      tr: {
        title: "Lazer kazıma için tasarım dosyası nasıl hazırlanır (SVG ve DXF)",
        description:
          "Lazer kazıma tasarımında dosya formatı, renk, çizgi kalınlığı ve ölçü — bir tasarımın temiz mi yoksa kırık mı kazınacağına karar veren kontroller.",
        lede: "Kazıma sorunlarının çoğu dosya sorunudur. Onlardan nasıl kaçınılacağı burada.",
        sections: [
          {
            heading: "Vektör dosya kullan: SVG ya da DXF",
            paragraphs: [
              "Lazer yolları takip eder, bu yüzden en temiz sonuç vektör tasarımdan gelir. SVG ve DXF her kenarı her ölçüde keskin tutar; JPG ya da PNG önce vektöre çevrilmek zorundadır ve bu çevirme köşeleri yumuşatır, ince detayları kaybeder, eğrilerde tümsekler üretir.",
              "Dışa aktarmadan önce tüm yazıları dış hatta (outline) çevir. Senin bilgisayarında yüklü olan bir yazı tipi üretim makinesinde olmayabilir ve eksik yazı tipi tasarımı sessizce değiştirir.",
            ],
          },
          {
            heading: "Tek renk, yüksek kontrast",
            paragraphs: [
              "Kazıma tek tonludur. Tasarımı şeffaf zemin üzerinde düz siyah olarak hazırla: siyah kazınır, geri kalan hiçbir şeye dokunulmaz. Degradeleri, gölgeleri, parlamaları ve yumuşak kenarları kaldır — bunlar kazınamaz ve lazerin nerede başlayıp bittiklerine karar vermesi gerekir.",
              "Bir logo yalnızca renkli olarak varsa, göndermeden önce tek renk çizgi çizime dönüştür. Bu bir tasarım kararıdır ve üretimde tahmin edilmesindense senin tarafından verilmesi daha iyidir.",
            ],
          },
          {
            heading: "Çizgi kalınlığı ve küçük yazı",
            paragraphs: [
              "İnce çizgiler hayal kırıklığı yaratan sonucun en yaygın sebebidir. Son kazınmış ölçüde çizgileri en az yaklaşık 0,4 mm kalınlıkta tut. Ekranda iyi görünen kıl inceliğinde tırnaklar, narin el yazısı bağlantıları ve minik süslemeler kavisli bir bardakta ya da dokulu suni deride kopabilir veya kaybolabilir.",
              "Tasarımı yakınlaştırarak değil, gerçek fiziksel ölçüsünde kontrol et. Cetvel ölçekli %100 önizlemede gözünü kısman gerekiyorsa, ürün üzerinde okunması zor olacaktır.",
            ],
            bullets: [
              "Kalınlığın sabit kalması için çizgileri dolu şekillere genişlet (expand stroke).",
              "Harfler arasındaki boşlukları açık tut — birbirine değen harfler kazınınca birleşir.",
              "Ürünün çözebileceğinden küçük yazıdan kaçın; el yazısı fontlar blok fontlardan daha fazla ölçü ister.",
            ],
          },
          {
            heading: "Tasarımı kazıma alanına göre boyutlandır",
            paragraphs: [
              "Her ürünün sabit bir kazıma alanı vardır. Ürün fotoğrafına değil o kutuya göre tasarla ve kenarlardan küçük bir pay bırak. Çizilmediği bir alana sığdırmak için küçültülen tasarım önce ince detaylarını kaybeder.",
              "Kişiselleştirme alanları — isimler, tarihler, baş harfler — muhtemel en uzun değere yer bırakmalı. Yerleşimini sadece kısa bir isimle değil, uzun bir isimle de dene.",
            ],
          },
        ],
        faqs: [
          {
            q: "Lazer kazıma için PNG ya da JPG gönderebilir miyim?",
            a: "Vektöre çevrilebilir ama bu çevirme detay ve keskinlik kaybettirir. Yazıları dış hatta çevrilmiş temiz bir SVG ya da DXF her zaman daha iyi sonuç verir.",
          },
          {
            q: "Lazer fotoğraf kazıyabilir mi?",
            a: "Yalnızca tek tonlu yarım ton olarak ve sonuç büyük ölçüde malzemeye bağlıdır. Gerçek renkli fotoğraf için doğru yöntem UV baskıdır.",
          },
          {
            q: "FomaPrint ne istiyor?",
            a: "Şeffaf zemin üzerinde yüksek kontrastlı siyah vektör tasarım (SVG ya da DXF), ürünün kazıma alanına göre boyutlandırılmış. Satıcılar ürün bazlı teknik şartnameyi hoş geldin paketiyle alır.",
          },
        ],
      },
    },
  },
  {
    slug: "engraved-tumblers-for-resellers",
    published: "2026-10-31",
    minutes: 5,
    copy: {
      en: {
        title: "Engraved tumblers for resellers: sizes, finishes and what sells",
        description:
          "How to build a personalized tumbler line without stock — 20, 30 and 40 oz sizes, powder-coated versus leatherette finishes, and the occasions that drive orders.",
        lede: "Drinkware is the volume category for most personalized-gift shops. Here is how to choose what to list.",
        sections: [
          {
            heading: "Why tumblers sell so well personalized",
            paragraphs: [
              "A tumbler is used every day, carried everywhere and easy to gift. Add a name, a monogram or a date and it stops being a commodity that can be price-compared against an identical listing — which is exactly where a small shop's margin comes from.",
              "Because each unit is engraved to order, you can list many sizes and colours without owning any of them, and drop the ones that do not sell without writing off stock.",
            ],
          },
          {
            heading: "Choosing sizes",
            paragraphs: [
              "Different sizes serve different buyers, and most shops list a small spread rather than a single size.",
            ],
            bullets: [
              "20 oz: the everyday size — fits cup holders and is the default for gift sets and bridal parties.",
              "30 oz: a step up for long days, popular with coaches, nurses and commuters.",
              "40 oz with handle: the trend size; buyers often choose it by colour as much as by function.",
              "Skinny tumblers: slimmer profile and a taller engraving area that suits vertical names and script.",
              "Wine tumblers, pints and pilsners: strong for weddings, groomsmen and bar gifts.",
            ],
          },
          {
            heading: "Powder-coated versus leatherette",
            paragraphs: [
              "On a powder-coated stainless tumbler the laser removes the coating and exposes the steel underneath, so the mark reads as bright silver against the body colour. It is cut into the surface, so it survives dishwashers and daily handling in a way vinyl and printed transfers do not.",
              "Leatherette-wrapped tumblers engrave differently: the laser removes the top layer of the wrap and reveals a contrasting colour underneath. The result is warmer and more premium-looking, and it suits monograms and rustic designs.",
            ],
          },
          {
            heading: "The occasions that drive orders",
            paragraphs: [
              "Personalized tumblers sell on occasions more than on features, so build listings and photos around them: bridesmaid and groomsmen sets, teacher and nurse appreciation, team and coach gifts, Father's Day and Christmas, and corporate onboarding gifts. Seasonal peaks are predictable — list before them, not during.",
            ],
          },
        ],
        faqs: [
          {
            q: "Will an engraved name come off a tumbler in the dishwasher?",
            a: "No. Laser engraving removes the coating rather than adding ink on top, so there is nothing to peel or fade.",
          },
          {
            q: "Do I need to buy tumblers in bulk to sell them personalized?",
            a: "Not with a print-on-demand engraving partner. Each order is engraved and shipped individually, so a single unit is a normal order.",
          },
        ],
      },
      tr: {
        title: "Satıcılar için kazımalı termos bardaklar: ölçüler, kaplamalar ve ne satar",
        description:
          "Stoksuz kişiselleştirilmiş termos bardak serisi kurmak — 20, 30 ve 40 oz ölçüler, toz boya ile suni deri kaplama farkı ve siparişi getiren özel günler.",
        lede: "Kişiselleştirilmiş hediye mağazalarının çoğunda hacmi bardaklar taşır. Neyin ilanlanacağı böyle seçilir.",
        sections: [
          {
            heading: "Termos bardaklar kişiselleştirilince neden bu kadar iyi satar",
            paragraphs: [
              "Termos bardak her gün kullanılır, her yere taşınır ve hediye etmesi kolaydır. Bir isim, monogram ya da tarih eklendiğinde, birebir aynı bir ilanla fiyat karşılaştırması yapılabilen sıradan bir ürün olmaktan çıkar — küçük bir mağazanın marjı tam olarak buradan gelir.",
              "Her ürün siparişe göre kazındığı için birçok ölçü ve rengi hiçbirine sahip olmadan ilanlayabilir, satmayanları stok zararı yazmadan kaldırabilirsin.",
            ],
          },
          {
            heading: "Ölçü seçimi",
            paragraphs: [
              "Farklı ölçüler farklı alıcılara hitap eder ve mağazaların çoğu tek bir ölçü yerine küçük bir yelpaze ilanlar.",
            ],
            bullets: [
              "20 oz: günlük ölçü — araç bardaklığına sığar, hediye setleri ve nedime grupları için varsayılan seçimdir.",
              "30 oz: uzun günler için bir üst ölçü; antrenörler, hemşireler ve işe gidip gelenler arasında popüler.",
              "Saplı 40 oz: trend ölçü; alıcılar onu çoğu zaman işlevi kadar rengine göre de seçer.",
              "Skinny bardaklar: daha ince gövde ve dikey isimlere ve el yazısına uyan daha uzun bir kazıma alanı.",
              "Şarap bardakları, pint ve pilsner: düğünler, sağdıç hediyeleri ve bar hediyeleri için güçlü.",
            ],
          },
          {
            heading: "Toz boya kaplama mı, suni deri mi",
            paragraphs: [
              "Toz boyalı paslanmaz çelik bir bardakta lazer kaplamayı kaldırıp altındaki çeliği açığa çıkarır; işaret gövde rengine karşı parlak gümüş olarak okunur. Yüzeyin içine işlendiği için vinil ve baskı transferlerinin dayanamadığı bulaşık makinesine ve günlük kullanıma dayanır.",
              "Suni deri kaplı bardaklar farklı kazınır: lazer kaplamanın üst katmanını kaldırır ve altındaki kontrast rengi ortaya çıkarır. Sonuç daha sıcak ve daha premium görünür; monogramlara ve rustik tasarımlara uyar.",
            ],
          },
          {
            heading: "Siparişi getiren özel günler",
            paragraphs: [
              "Kişiselleştirilmiş bardaklar özelliklerden çok özel günlerle satar; ilanları ve fotoğrafları bunların etrafında kur: nedime ve sağdıç setleri, öğretmen ve hemşire teşekkürleri, takım ve antrenör hediyeleri, Babalar Günü ve Noel, kurumsal işe başlama hediyeleri. Sezon zirveleri önceden bellidir — onların sırasında değil, öncesinde ilanla.",
            ],
          },
        ],
        faqs: [
          {
            q: "Kazınmış isim bulaşık makinesinde bardaktan çıkar mı?",
            a: "Hayır. Lazer kazıma üstüne mürekkep eklemez, kaplamayı kaldırır; soyulacak ya da solacak bir şey yoktur.",
          },
          {
            q: "Kişiselleştirilmiş satmak için bardakları toplu almam gerekir mi?",
            a: "Talebe göre kazıma ortağıyla gerekmez. Her sipariş tek tek kazınıp gönderilir, yani tek adet normal bir sipariştir.",
          },
        ],
      },
    },
  },
  {
    slug: "bulk-personalized-corporate-gifts",
    published: "2026-10-31",
    minutes: 5,
    copy: {
      en: {
        title: "Bulk personalized corporate gifts: how to run an order with a different name on every item",
        description:
          "How to plan a bulk engraved gift order for a team, client list or event — name lists, logos, proofing, timelines and shipping to one address or many.",
        lede: "Fifty gifts with fifty different names is a data job before it is a production job.",
        sections: [
          {
            heading: "Start with the list, not the product",
            paragraphs: [
              "The thing that goes wrong in bulk personalized orders is rarely the engraving. It is the list: a misspelled surname, a nickname instead of a legal name, a duplicate row, a missing title. Collect names in a spreadsheet with one row per item and one column per engraved field, and have the client approve that sheet before anything else happens.",
              "Decide early how long values are handled. A layout that fits \"Ana Lee\" has to fit \"Christopher Montgomery\" too, so test the design with the longest name on the list.",
            ],
          },
          {
            heading: "Logos and brand rules",
            paragraphs: [
              "Corporate gifts usually combine a company logo with an individual name. The logo needs to exist as one-colour vector artwork; ask the client's marketing team for an SVG or DXF rather than tracing a website image. Check whether their brand guidelines allow a single-colour version and a minimum size.",
            ],
          },
          {
            heading: "Proofing and timelines",
            paragraphs: [
              "Approve a layout once, then let the data fill it. Proofing every item individually does not scale past a few dozen; proofing the template with the longest and shortest names, plus the approved list, catches nearly every error.",
              "Work backwards from the event date. Leave time for list collection and approval, production, transit and a margin for a reprint. Holiday and year-end orders need the most margin, because everyone else is ordering too.",
            ],
            bullets: [
              "Lock the list and the layout before production starts.",
              "Mix products freely — a tumbler, a journal and a keychain can share one design system.",
              "Decide whether gifts ship to one office or straight to each recipient's address.",
            ],
          },
          {
            heading: "Why made-to-order helps",
            paragraphs: [
              "Because each item is engraved individually from stocked blanks, a bulk order does not need a setup fee per name, and late additions — a new hire, a forgotten client — can be produced as single units afterwards in the same style.",
            ],
          },
        ],
        faqs: [
          {
            q: "Can every item in a bulk order have a different name?",
            a: "Yes. Each unit is engraved individually, so per-item names, dates or initials are normal for a bulk order.",
          },
          {
            q: "How do I request a bulk or corporate quote from FomaPrint?",
            a: "Use the quote form with the products, quantities and deadline. Volume pricing is a discount, not a minimum — single units are also fine.",
          },
        ],
      },
      tr: {
        title: "Toplu kişiselleştirilmiş kurumsal hediyeler: her üründe farklı isim olan sipariş nasıl yürütülür",
        description:
          "Bir ekip, müşteri listesi ya da etkinlik için toplu kazımalı hediye siparişi planlamak — isim listeleri, logolar, onay, zamanlama ve tek ya da çok adrese gönderim.",
        lede: "Elli farklı isimli elli hediye, üretim işinden önce bir veri işidir.",
        sections: [
          {
            heading: "Ürünle değil listeyle başla",
            paragraphs: [
              "Toplu kişiselleştirilmiş siparişlerde ters giden şey nadiren kazımadır. Liste ters gider: yanlış yazılmış bir soyadı, resmi isim yerine takma ad, mükerrer bir satır, eksik bir unvan. İsimleri her ürün için bir satır ve her kazınacak alan için bir sütun olan bir tabloda topla ve başka hiçbir şey olmadan önce müşteriye o tabloyu onaylat.",
              "Uzun değerlerin nasıl ele alınacağına erkenden karar ver. \"Ana Lee\"ye uyan bir yerleşim \"Christopher Montgomery\"ye de uymalı; tasarımı listedeki en uzun isimle dene.",
            ],
          },
          {
            heading: "Logolar ve marka kuralları",
            paragraphs: [
              "Kurumsal hediyeler genellikle şirket logosunu kişisel bir isimle birleştirir. Logonun tek renk vektör tasarım olarak var olması gerekir; web sitesindeki bir görseli vektöre çevirmek yerine müşterinin pazarlama ekibinden SVG ya da DXF iste. Marka kılavuzlarının tek renkli kullanıma ve bir minimum ölçüye izin verip vermediğini kontrol et.",
            ],
          },
          {
            heading: "Onay ve zamanlama",
            paragraphs: [
              "Yerleşimi bir kez onayla, sonra veri onu doldursun. Her ürünü tek tek onaylatmak birkaç düzinenin ötesinde ölçeklenmez; şablonu en uzun ve en kısa isimle, artı onaylı listeyle onaylatmak hataların neredeyse tamamını yakalar.",
              "Etkinlik tarihinden geriye doğru çalış. Liste toplama ve onay, üretim, kargo ve olası bir yeniden üretim için pay bırak. Tatil ve yıl sonu siparişleri en çok payı ister, çünkü herkes aynı anda sipariş veriyordur.",
            ],
            bullets: [
              "Üretim başlamadan listeyi ve yerleşimi kilitle.",
              "Ürünleri serbestçe karıştır — bir bardak, bir defter ve bir anahtarlık tek bir tasarım sistemini paylaşabilir.",
              "Hediyelerin tek bir ofise mi yoksa doğrudan her alıcının adresine mi gideceğine karar ver.",
            ],
          },
          {
            heading: "Siparişe göre üretim neden yardımcı olur",
            paragraphs: [
              "Her ürün stoklu boş ürünlerden tek tek kazındığı için toplu siparişte isim başına kurulum ücreti gerekmez; sonradan eklenenler — yeni bir çalışan, unutulmuş bir müşteri — aynı stilde tek adet olarak sonradan üretilebilir.",
            ],
          },
        ],
        faqs: [
          {
            q: "Toplu siparişte her üründe farklı isim olabilir mi?",
            a: "Evet. Her ürün tek tek kazınır; ürün başına isim, tarih ya da baş harf toplu siparişte normaldir.",
          },
          {
            q: "FomaPrint'ten toplu ya da kurumsal teklif nasıl istenir?",
            a: "Ürünler, adetler ve teslim tarihiyle teklif formunu kullan. Hacim fiyatı bir alt limit değil indirimdir — tek adet de olur.",
          },
        ],
      },
    },
  },
  {
    slug: "leatherette-vs-embroidered-vs-pvc-patches",
    published: "2026-10-31",
    minutes: 5,
    copy: {
      en: {
        title: "Leatherette vs embroidered vs PVC patches: which to use on hats",
        description:
          "How engraved leatherette, embroidered and PVC patches compare on look, detail, setup, minimums and durability — and which one fits a small custom hat business.",
        lede: "Three patch types, three very different cost structures. Pick the one that matches how you sell.",
        sections: [
          {
            heading: "The short answer",
            paragraphs: [
              "Leatherette patches suit one-off and small-batch custom hats, because each patch is laser engraved individually with no setup. Embroidered patches suit colourful logos ordered in volume. PVC patches suit bold, rubbery, multi-colour designs where a mould cost can be spread over a large run.",
            ],
          },
          {
            heading: "Engraved leatherette",
            paragraphs: [
              "A leatherette patch is a synthetic leather blank that a laser engraves to your artwork; the engraving removes the top layer and shows a contrasting colour underneath. The look is warm and premium, close to a debossed leather label, which is why it dominates trucker caps, outdoor brands and rustic gift lines.",
              "Because the design is engraved rather than stitched or moulded, there is no digitizing charge, no mould and no minimum. A single patch with a customer's name costs the same to set up as a hundred with a logo. The trade-off is colour: engraving is single-tone, so a multi-colour logo has to become one-colour artwork.",
            ],
            bullets: [
              "Best for: personalized names and dates, small batches, rustic and outdoor brands",
              "Setup: none — vector artwork sized to the patch",
              "Application: adhesive backing and a heat press, or sewn",
            ],
          },
          {
            heading: "Embroidered patches",
            paragraphs: [
              "Embroidery stitches thread onto a twill backing, so it handles several colours and has the classic textured look of team and uniform patches. Very fine text and small details are its weak point, because thread has a minimum width.",
              "Embroidery usually needs the artwork digitized into a stitch file first, and producers commonly set minimum quantities. That makes it economical for one logo ordered many times, and expensive for a different name on every hat.",
            ],
          },
          {
            heading: "PVC patches",
            paragraphs: [
              "PVC patches are moulded from soft rubber in layered colours. They are bright, waterproof and three-dimensional, popular for tactical and outdoor gear. Each design needs its own mould, so they make sense only when one design will be produced in quantity, and they cannot be personalized per unit.",
            ],
          },
          {
            heading: "Which one for a custom hat shop",
            paragraphs: [
              "If you sell personalized hats — names, initials, small-business logos ordered a few at a time — leatherette is the format whose economics work at quantity one. If you sell a single team or company logo in large runs and need full colour, compare embroidery and PVC quotes for that run. Many shops use leatherette for personalization and outsource embroidery only for big uniform orders.",
            ],
          },
        ],
        faqs: [
          {
            q: "Are leatherette patches cheaper than embroidered patches?",
            a: "For small quantities and personalized designs, usually yes, because there is no digitizing or minimum order. For a single logo in large volume, embroidery pricing can become competitive.",
          },
          {
            q: "Can a leatherette patch be full colour?",
            a: "No. Laser engraving is single-tone; the contrast comes from the layer under the surface. Full-colour designs need embroidery, PVC or a printed patch.",
          },
          {
            q: "What leatherette patches does FomaPrint offer?",
            a: "Rectangle, round, oval, square and hex patches in two sizes, with or without adhesive backing, in the standard leatherette colour range — each engraved to your artwork with no minimum.",
          },
        ],
      },
      tr: {
        title: "Suni deri, nakış ve PVC arma karşılaştırması: şapkada hangisi kullanılmalı",
        description:
          "Kazımalı suni deri, nakışlı ve PVC armaların görünüm, detay, kurulum, alt limit ve dayanıklılık açısından farkı — ve küçük bir özel şapka işine hangisinin uyduğu.",
        lede: "Üç arma türü, birbirinden çok farklı üç maliyet yapısı. Nasıl sattığına uyanı seç.",
        sections: [
          {
            heading: "Kısa cevap",
            paragraphs: [
              "Suni deri armalar tek adetlik ve küçük partili özel şapkalara uyar; çünkü her arma kurulum olmadan tek tek lazerle kazınır. Nakışlı armalar yüksek adette sipariş edilen renkli logolara uyar. PVC armalar ise kalıp maliyetinin büyük bir üretime yayılabildiği, kalın, kauçuk dokulu, çok renkli tasarımlara uyar.",
            ],
          },
          {
            heading: "Kazımalı suni deri",
            paragraphs: [
              "Suni deri arma, lazerin senin tasarımına göre kazıdığı sentetik deri bir boş üründür; kazıma üst katmanı kaldırır ve altındaki kontrast rengi gösterir. Görünümü sıcak ve premiumdur, kabartmalı deri etikete yakındır; trucker şapkalarda, outdoor markalarda ve rustik hediye serilerinde bu yüzden öne çıkar.",
              "Tasarım dikilmediği ya da kalıplanmadığı, kazındığı için dijitalleştirme ücreti, kalıp ve alt limit yoktur. Müşterinin adını taşıyan tek bir armanın kurulum maliyeti, logolu yüz armanınkiyle aynıdır. Bedeli renktir: kazıma tek tonludur, çok renkli bir logo tek renk çizime dönüşmek zorundadır.",
            ],
            bullets: [
              "En uygun: kişiye özel isim ve tarihler, küçük partiler, rustik ve outdoor markalar",
              "Kurulum: yok — armaya göre boyutlandırılmış vektör tasarım yeterli",
              "Uygulama: yapışkanlı arka yüz ve ısı presi ya da dikiş",
            ],
          },
          {
            heading: "Nakışlı armalar",
            paragraphs: [
              "Nakış, ipliği dimi bir zemine diker; birkaç rengi kaldırır ve takım ve üniforma armalarının klasik dokulu görünümünü verir. Zayıf noktası çok ince yazı ve küçük detaylardır, çünkü ipliğin bir minimum genişliği vardır.",
              "Nakış genellikle tasarımın önce dikiş dosyasına dijitalleştirilmesini ister ve üreticiler çoğunlukla minimum adet koyar. Bu da onu aynı logonun çok kez sipariş edildiği işlerde ekonomik, her şapkada farklı isim olan işlerde pahalı yapar.",
            ],
          },
          {
            heading: "PVC armalar",
            paragraphs: [
              "PVC armalar yumuşak kauçuktan katmanlı renklerle kalıplanır. Parlak, su geçirmez ve üç boyutludurlar; taktik ve outdoor ekipmanda popülerdirler. Her tasarım kendi kalıbını ister; bu yüzden yalnızca tek bir tasarım yüksek adette üretilecekse mantıklıdırlar ve ürün başına kişiselleştirilemezler.",
            ],
          },
          {
            heading: "Özel şapka mağazası için hangisi",
            paragraphs: [
              "Kişiselleştirilmiş şapka satıyorsan — isimler, baş harfler, birkaç adet sipariş edilen küçük işletme logoları — ekonomisi tek adette işleyen format suni deridir. Büyük partilerde tek bir takım ya da şirket logosu satıyor ve tam renk istiyorsan, o parti için nakış ve PVC tekliflerini karşılaştır. Birçok mağaza kişiselleştirme için suni deri kullanır, nakışı yalnızca büyük üniforma siparişleri için dışarı verir.",
            ],
          },
        ],
        faqs: [
          {
            q: "Suni deri armalar nakışlı armalardan ucuz mu?",
            a: "Küçük adetlerde ve kişiselleştirilmiş tasarımlarda genellikle evet; çünkü dijitalleştirme ya da minimum sipariş yoktur. Yüksek adette tek bir logo için nakış fiyatı rekabetçi hale gelebilir.",
          },
          {
            q: "Suni deri arma tam renkli olabilir mi?",
            a: "Hayır. Lazer kazıma tek tonludur; kontrast yüzeyin altındaki katmandan gelir. Tam renkli tasarımlar için nakış, PVC ya da baskılı arma gerekir.",
          },
          {
            q: "FomaPrint hangi suni deri armaları sunuyor?",
            a: "Dikdörtgen, yuvarlak, oval, kare ve altıgen armalar, iki ölçüde, yapışkanlı ya da yapışkansız, standart suni deri renk yelpazesinde — her biri alt limit olmadan senin tasarımına göre kazınır.",
          },
        ],
      },
    },
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
