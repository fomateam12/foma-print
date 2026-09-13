import type { EditorialEntry } from "@/data/category-editorial";

/**
 * Remaining drinkware collections. Same rules as `collections.ts` — written
 * per collection, never generated, and specific enough that the page answers
 * a buyer's question rather than restating the category.
 */
export const DRINKWARE_COLLECTION_COPY: Record<string, EditorialEntry> = {
  "drinkware/glassware": {
    en: {
      intro: [
        "Glass etches rather than engraves. The laser frosts the surface to a soft translucent white that catches light from the side, which is a completely different look from the hard metal contrast you get on a coated tumbler — softer, more decorative, and better suited to script and delicate line work.",
        "It is the material buyers expect for wine, whiskey and barware gifts, and it photographs beautifully against a dark background, which matters more for glass listings than for any other category.",
      ],
      highlights: [
        "Wedding and anniversary barware sets",
        "Whiskey and wine gifting with monograms",
        "Restaurant and event branding on glasses",
      ],
      faqs: [
        {
          q: "Is etched glass dishwasher safe?",
          a: "The etching is, since it is a change in the glass itself rather than an applied layer. Care beyond that follows the glassware's own guidance.",
        },
        {
          q: "Can you etch all the way around a glass?",
          a: "Wrapped etching is possible on cylindrical glasses. Tapered and faceted shapes limit how far the design can wrap; the engraving area on each product page is the usable figure.",
        },
      ],
    },
    tr: {
      intro: [
        "Cam kazınmaz, aşındırılır. Lazer yüzeyi yandan ışığı yakalayan yumuşak yarı saydam bir beyaza çevirir; bu, kaplamalı bir bardaktaki sert metal kontrastından tamamen farklı bir görünümdür — daha yumuşak, daha dekoratif ve el yazısıyla ince çizgilere daha uygun.",
        "Şarap, viski ve bar hediyelerinde alıcının beklediği malzeme budur ve koyu zeminde çok iyi fotoğraflanır; bu da cam ilanlarında diğer kategorilerden daha çok işe yarar.",
      ],
      highlights: [
        "Düğün ve yıl dönümü bar setleri",
        "Monogramlı viski ve şarap hediyeleri",
        "Bardaklara restoran ve etkinlik markalaması",
      ],
      faqs: [
        {
          q: "Aşındırılmış cam bulaşık makinesine dayanır mı?",
          a: "Aşındırma dayanır; çünkü uygulanmış bir katman değil, camın kendisindeki bir değişimdir. Ötesi ürünün kendi bakım talimatına tabidir.",
        },
        {
          q: "Bardağın tamamına dolanan bir desen yapılabilir mi?",
          a: "Silindirik bardaklarda sarmal aşındırma mümkündür. Daralan ve köşeli formlar tasarımın ne kadar dolanacağını sınırlar; her ürün sayfasındaki kazıma alanı kullanılabilir ölçüdür.",
        },
      ],
    },
  },

  "drinkware/pilsners": {
    en: {
      intro: [
        "Pilsner glasses are the highest-volume etched glassware line because the tall straight wall is the easiest glass surface to work with: a name, a crest or a full wrap design all sit cleanly without fighting a taper.",
        "They sell hardest as sets — groomsmen, brewery merchandise, team gifts — where the same design is repeated across four, six or twelve glasses and consistency matters more than complexity.",
      ],
      highlights: [
        "Groomsmen and bachelor-party sets",
        "Brewery and taproom branded glassware",
        "Fantasy league and team trophies",
      ],
      faqs: [
        {
          q: "How many pilsners do buyers usually order at once?",
          a: "Sets of four to twelve are the typical pattern, which is why per-unit personalization matters — each glass in a groomsmen set usually carries a different name.",
        },
      ],
    },
    tr: {
      intro: [
        "Pilsner bardakları en çok satan aşındırılmış cam hattıdır; çünkü uzun ve düz duvar, çalışması en kolay cam yüzeydir: isim, arma ya da tam sarma tasarım hiçbir daralmayla boğuşmadan temiz oturur.",
        "En çok set olarak satarlar — sağdıç, bira fabrikası ürünü, takım hediyesi — aynı tasarımın dört, altı ya da on iki bardakta tekrarlandığı ve tutarlılığın karmaşıklıktan önemli olduğu yerlerde.",
      ],
      highlights: [
        "Sağdıç ve bekârlığa veda setleri",
        "Bira fabrikası ve taproom markalı bardaklar",
        "Lig ve takım ödülleri",
      ],
      faqs: [
        {
          q: "Alıcılar genelde kaç pilsner birden sipariş ediyor?",
          a: "Tipik desen dört ila on iki bardaklık setlerdir; ürün başına kişiselleştirmenin önemi de buradan gelir — sağdıç setinde her bardakta genelde farklı bir isim olur.",
        },
      ],
    },
  },

  "drinkware/pints": {
    en: {
      intro: [
        "The pint glass is the most recognisable barware shape there is, which makes it the easy sell: a buyer does not need the product explained, only the personalization shown.",
        "The wide straight wall takes a large mark, so full logos and crest designs read at a size that smaller glassware cannot carry.",
      ],
      highlights: [
        "Pub, bar and brewery branding",
        "Father's Day and birthday gifting",
        "Team and club sets",
      ],
      faqs: [
        {
          q: "Can you etch a full logo on a pint glass?",
          a: "Yes — the flat wide face is one of the more generous etching surfaces in the glassware range. Send vector artwork for the cleanest edges.",
        },
      ],
    },
    tr: {
      intro: [
        "Pint bardağı var olan en tanınır bar formudur; bu da onu kolay satılan ürün yapar: alıcıya ürünü anlatmak gerekmez, yalnızca kişiselleştirmeyi göstermek yeter.",
        "Geniş düz duvar büyük bir iz alır; tam logolar ve arma tasarımları, daha küçük cam ürünlerin taşıyamayacağı bir ölçüde okunur.",
      ],
      highlights: [
        "Pub, bar ve bira fabrikası markalaması",
        "Babalar Günü ve doğum günü hediyeleri",
        "Takım ve kulüp setleri",
      ],
      faqs: [
        {
          q: "Pint bardağına tam logo aşındırılabilir mi?",
          a: "Evet — düz ve geniş yüz, cam yelpazesindeki en cömert aşındırma yüzeylerinden biridir. En temiz kenarlar için vektör dosya gönder.",
        },
      ],
    },
  },

  "drinkware/stemless-wine-chillers": {
    en: {
      intro: [
        "Stemless wine tumblers and insulated wine chillers are the drinkware line that sells hardest outside the summer peak — they are a gifting item all year, and they are the format most often bought in pairs.",
        "Insulated stainless versions engrave to bright steel and keep wine cold outdoors; stemless glass versions etch to a frost. The two look and price very differently, so it is worth listing whichever matches the story your shop tells.",
      ],
      highlights: [
        "Pair listings for couples and anniversaries",
        "Bridesmaid and hostess gifting",
        "Outdoor, patio and poolside sets",
      ],
      faqs: [
        {
          q: "What is the difference between a stemless wine tumbler and a wine chiller?",
          a: "The insulated stainless chiller keeps wine at temperature and engraves to bright metal; the stemless glass is a drinking glass that etches to a frost. Same occasion, different product and different price.",
        },
      ],
    },
    tr: {
      intro: [
        "Ayaksız şarap bardakları ve yalıtımlı şarap soğutucuları, yaz zirvesi dışında en iyi satan içecek hattıdır — yıl boyu hediyelik ürünlerdir ve en çok çift olarak alınan formdur.",
        "Yalıtımlı paslanmaz sürümler parlak çeliğe kazınır ve şarabı dışarıda soğuk tutar; ayaksız cam sürümler ise buzlu bir dokuya aşındırılır. İkisi hem görünüm hem fiyat olarak çok farklıdır; mağazanın anlattığı hikâyeye uyanı ilanlamak mantıklıdır.",
      ],
      highlights: [
        "Çiftler ve yıl dönümleri için ikili ilanlar",
        "Nedime ve ev sahibesi hediyeleri",
        "Bahçe, teras ve havuz başı setleri",
      ],
      faqs: [
        {
          q: "Ayaksız şarap bardağıyla şarap soğutucu arasındaki fark ne?",
          a: "Yalıtımlı paslanmaz soğutucu şarabı sıcaklığında tutar ve parlak metale kazınır; ayaksız cam ise buzlu dokuya aşındırılan bir içme bardağıdır. Aynı an, farklı ürün, farklı fiyat.",
        },
      ],
    },
  },

  "drinkware/square-and-round-laserable-ceramic-mugs": {
    en: {
      intro: [
        "Laserable ceramic mugs carry a coating designed to be marked by a laser, which gives a far crisper result than trying to engrave a standard glazed mug. The mark comes out as a clean tonal contrast within the surface rather than a scratch.",
        "Square and round bodies suit different designs: the square face is effectively a flat panel for logos and framed text, while the round body suits wraps and script.",
      ],
      highlights: [
        "Office and team mugs with a company mark",
        "Name and quote listings that sell year-round",
        "Gift sets paired with coasters",
      ],
      faqs: [
        {
          q: "Why a laserable mug rather than a normal ceramic mug?",
          a: "The coating is made to react to the laser, so the mark is sharp and repeatable. A standard glaze gives an inconsistent result that varies mug to mug.",
        },
      ],
    },
    tr: {
      intro: [
        "Lazere uygun seramik kupalar, lazerle işaretlenmek için tasarlanmış bir kaplama taşır; bu da standart sırlı bir kupayı kazımaya çalışmaktan çok daha net sonuç verir. İz bir çizik değil, yüzey içinde temiz bir ton kontrastı olarak çıkar.",
        "Kare ve yuvarlak gövdeler farklı tasarımlara yakışır: kare yüz, logolar ve çerçeveli yazı için fiilen düz bir paneldir; yuvarlak gövde ise sarma ve el yazısına uygundur.",
      ],
      highlights: [
        "Şirket işaretli ofis ve ekip kupaları",
        "Yıl boyu satan isim ve söz ilanları",
        "Bardak altlığıyla eşleştirilmiş hediye setleri",
      ],
      faqs: [
        {
          q: "Neden normal seramik kupa değil de lazere uygun kupa?",
          a: "Kaplama lazere tepki verecek şekilde üretilmiştir; iz keskin ve tekrarlanabilir olur. Standart sır, kupadan kupaya değişen tutarsız bir sonuç verir.",
        },
      ],
    },
  },

  "drinkware/travel-and-barrel-mugs-beverage-holders": {
    en: {
      intro: [
        "Travel and barrel mugs are the commuter format: a handle, a lid and an insulated body, bought to be used every morning rather than displayed. The personalization is usually a name or a company mark, and the buyer cares more about the lid working than about the design being clever.",
        "The barrel shape gives a wider mid-body panel than a tapered tumbler, so a horizontal wordmark sits without curving out of readability.",
      ],
      highlights: [
        "Office and commuter gifting",
        "Company mark runs for teams",
        "Trade and service branding",
      ],
      faqs: [
        {
          q: "Is a barrel mug better than a tumbler for a logo?",
          a: "For a wide horizontal logo, yes — the straighter mid-body means less curvature across the mark, so it reads flatter from the front.",
        },
      ],
    },
    tr: {
      intro: [
        "Termos ve fıçı kupalar yol formudur: kulp, kapak ve yalıtımlı gövde; sergilenmek için değil her sabah kullanılmak için alınır. Kişiselleştirme genelde bir isim ya da şirket işaretidir ve alıcı, tasarımın zekice olmasından çok kapağın çalışmasına bakar.",
        "Fıçı formu, daralan bir bardaktan daha geniş bir orta gövde paneli verir; yatay bir kelime logosu okunmazlığa kıvrılmadan oturur.",
      ],
      highlights: [
        "Ofis ve yol hediyeleri",
        "Ekipler için şirket işareti partileri",
        "Esnaf ve servis markalaması",
      ],
      faqs: [
        {
          q: "Logo için fıçı kupa bardaktan iyi mi?",
          a: "Geniş yatay bir logo için evet — daha düz orta gövde, iz boyunca daha az kavis demektir; önden bakıldığında daha düz okunur.",
        },
      ],
    },
  },

  "drinkware/beverage-holders": {
    en: {
      intro: [
        "Can and bottle holders are the lowest-price entry into personalized drinkware, which makes them the item that gets added to a cart rather than searched for on its own. They ship light, they cost little, and they are the natural bundle partner for a tumbler listing.",
        "Insulated stainless holders engrave to bright metal; leatherette-wrapped versions take a sharp engraved mark in the core colour.",
      ],
      highlights: [
        "Add-on product to raise cart value",
        "Bachelor and bachelorette party sets",
        "Event and festival branded runs",
      ],
      faqs: [
        {
          q: "Do beverage holders fit standard cans?",
          a: "Each product page lists the can or bottle size the holder is built for. Slim-can and standard-can bodies are different products.",
        },
      ],
    },
    tr: {
      intro: [
        "Kutu ve şişe tutucular kişiselleştirilmiş içecek ürünlerine en ucuz giriştir; bu da onları tek başına aranan değil, sepete eklenen ürün yapar. Hafif kargolanır, az maliyetlidir ve bir bardak ilanının doğal paket ortağıdır.",
        "Yalıtımlı paslanmaz tutucular parlak metale kazınır; suni deri kaplı sürümler çekirdek renginde keskin bir iz alır.",
      ],
      highlights: [
        "Sepet tutarını yükselten ek ürün",
        "Bekârlığa veda parti setleri",
        "Etkinlik ve festival markalı partiler",
      ],
      faqs: [
        {
          q: "Tutucular standart kutulara uyuyor mu?",
          a: "Her ürün sayfası tutucunun hangi kutu ya da şişe ölçüsü için yapıldığını yazar. İnce kutu ve standart kutu gövdeleri ayrı ürünlerdir.",
        },
      ],
    },
  },

  "drinkware/leatherette-mug-sleeve-and-beverage-holder": {
    en: {
      intro: [
        "Leatherette sleeves and holders combine the cheapest blank in the catalogue with the sharpest engraving surface, which is an unusually good margin combination. The mark burns through the surface colour to the core, so a logo reads crisply even at small size.",
        "They work as a standalone low-price listing and as the branded component in a gift bundle.",
      ],
      highlights: [
        "Low-cost corporate giveaways",
        "Bundle component with a mug or tumbler",
        "Small-logo branding at readable size",
      ],
      faqs: [
        {
          q: "What colour does the engraving come out on leatherette?",
          a: "It depends on the core beneath the surface colour — most colourways expose a black core. The tone is fixed by the blank rather than chosen, so it stays identical across a run.",
        },
      ],
    },
    tr: {
      intro: [
        "Suni deri kılıflar ve tutucular, katalogun en ucuz boş ürünüyle en keskin kazıma yüzeyini birleştirir; bu alışılmadık derecede iyi bir marj bileşimidir. İz yüzey renginin altındaki çekirdeğe kadar yanar, logo küçük ölçüde bile net okunur.",
        "Hem tek başına düşük fiyatlı bir ilan hem de hediye paketindeki markalı parça olarak çalışır.",
      ],
      highlights: [
        "Düşük maliyetli kurumsal hediyeler",
        "Kupa ya da bardakla paket parçası",
        "Küçük logoyu okunur ölçüde markalama",
      ],
      faqs: [
        {
          q: "Suni deride kazıma hangi renkte çıkar?",
          a: "Yüzey renginin altındaki çekirdeğe bağlıdır — renklerin çoğunda siyah çekirdek çıkar. Ton seçilmez, boş ürün tarafından sabitlenir; parti boyunca aynı kalır.",
        },
      ],
    },
  },

  "drinkware/leatherette-coasters-and-coaster-sets": {
    en: {
      intro: [
        "Coaster sets are one of the few products where the personalization is visible every day in a customer's living room, which is exactly what a housewarming or wedding gift is meant to do.",
        "Sets usually come with a holder, and engraving the holder as well as the coasters turns four cheap blanks into one considered gift.",
      ],
      highlights: [
        "Housewarming and wedding gifting",
        "Family-name and monogram sets",
        "Bar and restaurant branding",
      ],
      faqs: [
        {
          q: "Can each coaster in a set carry a different design?",
          a: "Yes. Per-unit artwork is normal here — a four-piece set with four different marks is a single order.",
        },
      ],
    },
    tr: {
      intro: [
        "Bardak altlığı setleri, kişiselleştirmenin müşterinin oturma odasında her gün göründüğü birkaç üründen biridir; yeni ev ya da düğün hediyesinin yapması gereken tam da budur.",
        "Setler genelde bir standla gelir; altlıklarla birlikte standı da kazımak, dört ucuz boş ürünü düşünülmüş tek bir hediyeye çevirir.",
      ],
      highlights: [
        "Yeni ev ve düğün hediyeleri",
        "Aile adı ve monogram setleri",
        "Bar ve restoran markalaması",
      ],
      faqs: [
        {
          q: "Setteki her altlıkta farklı tasarım olabilir mi?",
          a: "Evet. Burada ürün başına tasarım normaldir — dört farklı izli dört parçalık bir set tek siparştir.",
        },
      ],
    },
  },

  "drinkware/bamboo-cork-slate-coasters": {
    en: {
      intro: [
        "Bamboo, cork and slate coasters each engrave differently, and the difference is the whole reason to pick one over another: bamboo burns to a warm brown, cork to a soft dark tone, and slate to a near-white chalk that reads from across a room.",
        "Slate is the choice when the mark has to be the loudest thing on the table; bamboo when it should look warm and understated.",
      ],
      highlights: [
        "Natural-material gifting",
        "Housewarming and hostess sets",
        "Restaurant and tasting-room branding",
      ],
      faqs: [
        {
          q: "Which coaster material gives the sharpest mark?",
          a: "Slate — the laser lightens the stone to a near-white chalk tone, which is the highest contrast of the three.",
        },
      ],
    },
    tr: {
      intro: [
        "Bambu, mantar ve arduvaz altlıklar birbirinden farklı kazınır ve birini diğerine tercih etmenin bütün sebebi bu farktır: bambu sıcak bir kahverengiye, mantar yumuşak koyu bir tona, arduvaz ise odanın öbür ucundan okunan neredeyse beyaz bir tebeşire kazınır.",
        "İzin masadaki en yüksek sesli şey olması gerekiyorsa arduvaz, sıcak ve gösterişsiz görünmesi gerekiyorsa bambu doğru seçimdir.",
      ],
      highlights: [
        "Doğal malzeme hediyeleri",
        "Yeni ev ve ev sahibesi setleri",
        "Restoran ve tadım salonu markalaması",
      ],
      faqs: [
        {
          q: "Hangi altlık malzemesi en keskin izi verir?",
          a: "Arduvaz — lazer taşı neredeyse beyaz bir tebeşir tonuna açar; üçü içinde en yüksek kontrast budur.",
        },
      ],
    },
  },

  "drinkware/bottle-openers": {
    en: {
      intro: [
        "Bottle openers are a pocket-sized, cheap-to-ship gift with an unusually long life — people keep them for years, which is why an engraved date or name on one works as a wedding favour or a milestone keepsake.",
        "Wood-handled and stainless versions engrave very differently, so the same design can carry a rustic or a modern listing without changing the artwork.",
      ],
      highlights: [
        "Wedding favours in volume",
        "Groomsmen and party bundles",
        "Brewery and bar merchandise",
      ],
      faqs: [
        {
          q: "Are bottle openers viable as a bulk wedding favour?",
          a: "Yes — they are among the cheapest engraved items per unit and ship light, which is what makes a hundred-piece favour order affordable.",
        },
      ],
    },
    tr: {
      intro: [
        "Şişe açacakları cep boyu, kargosu ucuz ve alışılmadık derecede uzun ömürlü hediyelerdir — insanlar yıllarca saklar; üzerine kazınmış bir tarih ya da ismin düğün hediyeliği veya dönüm noktası hatırası olarak çalışmasının sebebi budur.",
        "Ahşap saplı ve paslanmaz sürümler çok farklı kazınır; aynı tasarım, çizim değişmeden hem rustik hem modern bir ilanı taşıyabilir.",
      ],
      highlights: [
        "Toplu düğün hediyelikleri",
        "Sağdıç ve parti paketleri",
        "Bira fabrikası ve bar ürünleri",
      ],
      faqs: [
        {
          q: "Toplu düğün hediyeliği olarak şişe açacağı mantıklı mı?",
          a: "Evet — birim başına en ucuz kazımalı ürünler arasındadır ve hafif kargolanır; yüz parçalık bir hediyelik siparişini karşılanabilir kılan şey budur.",
        },
      ],
    },
  },

  "drinkware/sippy-cups": {
    en: {
      intro: [
        "Insulated kids' cups with a name on them are one of the few personalized items bought for practical reasons first — a named cup is the one that comes back from daycare and school.",
        "The bodies are stainless with a powder coat, so the name engraves to bright steel and survives being dropped, washed and lost in a bag for a week.",
      ],
      highlights: [
        "Daycare, preschool and school listings",
        "Birthday and new-baby gifting",
        "Sibling and family sets",
      ],
      faqs: [
        {
          q: "Will the name wear off a kids' cup?",
          a: "No. It is cut into the steel beneath the coating, so there is no printed layer to scratch away.",
        },
      ],
    },
    tr: {
      intro: [
        "Üzerinde isim olan yalıtımlı çocuk bardakları, önce pratik sebeple alınan birkaç kişiselleştirilmiş üründen biridir — kreşten ve okuldan geri dönen bardak, isimli olandır.",
        "Gövdeler toz boyalı paslanmaz çeliktir; isim parlak çeliğe kazınır ve düşürülmeye, yıkanmaya, bir hafta çantada kaybolmaya dayanır.",
      ],
      highlights: [
        "Kreş, anaokulu ve okul ilanları",
        "Doğum günü ve yeni bebek hediyeleri",
        "Kardeş ve aile setleri",
      ],
      faqs: [
        {
          q: "Çocuk bardağındaki isim silinir mi?",
          a: "Hayır. Kaplamanın altındaki çeliğe işlenmiştir; çizilip gidecek basılı bir katman yoktur.",
        },
      ],
    },
  },
};
