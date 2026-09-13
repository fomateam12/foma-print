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
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
