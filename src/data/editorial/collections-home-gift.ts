import type { EditorialEntry } from "@/data/category-editorial";

/**
 * Frames & decor, kitchen & bar, patches and travel collections. See
 * `collections.ts` for the rules these entries follow.
 */
export const HOME_GIFT_COLLECTION_COPY: Record<string, EditorialEntry> = {
  "frames-and-decor/wind-chimes": {
    en: {
      intro: [
        "A wind chime is the rare personalized product that lives outdoors and is bought as a housewarming, memorial or anniversary gift rather than an impulse. The engraving surface is the flat aluminum sail hanging under the tubes: 4 inches on the 30\" chime, 5 1/4 inches on the 36\", and it takes laser engraving or UV print on both sides.",
        "Two lengths and three powder-coated finishes — black, copper and dark peacock green — cover the whole line. The 30\" body carries five 7/8\" tubes, the 36\" carries six 1\" tubes and rings noticeably deeper, which is the difference buyers hear in a video.",
      ],
      highlights: [
        "Housewarming and memorial gifts",
        "Two-sided sail: engrave a name on one face, a date on the other",
        "Outdoor-rated powder-coated aluminum",
      ],
      faqs: [
        {
          q: "Which part of a wind chime is engraved?",
          a: "The sail — the flat disc that hangs below the tubes and catches the wind. It is 4\" across on the 30\" chime and 5 1/4\" on the 36\", and both faces can be decorated.",
        },
        {
          q: "What is the difference between the 30\" and 36\" chime?",
          a: "Tube count and tone. The 30\" has five 7/8\" tubes, the 36\" has six 1\" tubes and a deeper, fuller sound. The larger sail also gives more engraving room.",
        },
        {
          q: "Can the sail be replaced if a laser file goes wrong?",
          a: "Yes — the supplier sells the sail on its own for each length and finish, so a mis-engraved disc does not write off the whole chime.",
        },
      ],
    },
    tr: {
      intro: [
        "Rüzgar çanı, kişiselleştirilebilir ürünler içinde dışarıda yaşayan ve anlık dürtüyle değil; yeni ev, anma ya da yıl dönümü hediyesi olarak alınan ender üründür. Kazıma yüzeyi boruların altında sallanan düz alüminyum yelkendir: 30\" çanda 4 inç, 36\" çanda 5 1/4 inç; her iki yüzü de lazer kazıma veya UV baskı kabul eder.",
        "İki boy ve üç toz boya rengi — siyah, bakır ve koyu tavus yeşili — hattın tamamını kapsar. 30\" gövdede beş adet 7/8\" boru, 36\" gövdede altı adet 1\" boru vardır; ikincisi belirgin biçimde daha kalın tınlar, videoda duyulan fark budur.",
      ],
      highlights: [
        "Yeni ev ve anma hediyeleri",
        "Çift yüzlü yelken: bir yüze isim, diğerine tarih",
        "Dış mekâna uygun toz boyalı alüminyum",
      ],
      faqs: [
        {
          q: "Rüzgar çanının neresi kazınır?",
          a: "Yelken — boruların altında asılı duran, rüzgarı tutan düz disk. 30\" çanda 4\", 36\" çanda 5 1/4\" çapındadır ve iki yüzü de işlenebilir.",
        },
        {
          q: "30\" ile 36\" çan arasındaki fark ne?",
          a: "Boru sayısı ve tını. 30\" beş adet 7/8\" boru taşır; 36\" altı adet 1\" boru taşır ve daha derin, daha dolu ses verir. Büyük yelken ayrıca daha çok kazıma alanı bırakır.",
        },
        {
          q: "Lazer dosyası yanlış giderse yelken değiştirilebilir mi?",
          a: "Evet — tedarikçi her boy ve renk için yelkeni tek başına satıyor; yanlış kazınan disk yüzünden çanın tamamı çöpe gitmiyor.",
        },
      ],
    },
  },

  "frames-and-decor/photo-frames-small": {
    en: {
      intro: [
        "Small frames — 4x6 and similar — are the desk and shelf format, and they are the price point that lets a keepsake listing start under thirty dollars. They are also the easiest frame to ship, which protects the margin on a low-priced item.",
        "Engraving on a narrow moulding means fewer words at a readable size: a name, a date, or a two-word line beneath the aperture.",
      ],
      highlights: [
        "Entry-price keepsake listings",
        "Desk and shelf gifting",
        "New-baby and graduation frames",
      ],
      faqs: [
        {
          q: "How much text fits on a small frame?",
          a: "A single line beneath the opening is the practical limit — usually a name with a date. The engraving area is listed on each product page.",
        },
      ],
    },
    tr: {
      intro: [
        "Küçük çerçeveler — 4x6 ve benzeri — masa ve raf formudur ve bir hatıra ilanının otuz doların altında başlamasını sağlayan fiyat noktasıdır. Kargolanması en kolay çerçeve de bunlardır; bu da düşük fiyatlı bir üründe marjı korur.",
        "Dar bir çerçevede kazıma, okunur ölçüde daha az kelime demektir: bir isim, bir tarih ya da açıklığın altında iki kelimelik bir satır.",
      ],
      highlights: [
        "Giriş fiyatlı hatıra ilanları",
        "Masa ve raf hediyeleri",
        "Yeni bebek ve mezuniyet çerçeveleri",
      ],
      faqs: [
        {
          q: "Küçük çerçeveye ne kadar yazı sığar?",
          a: "Pratik sınır açıklığın altında tek satırdır — genelde bir isim ve tarih. Kazıma alanı her ürün sayfasında yazılıdır.",
        },
      ],
    },
  },

  "frames-and-decor/photo-frames-medium": {
    en: {
      intro: [
        "Medium frames are the volume seller of the frame range: big enough to read as a real gift, small enough to sit on a shelf, and priced where most keepsake buying happens.",
        "The wider moulding takes two lines comfortably, which is what a wedding or memorial frame usually needs — names above, date beneath.",
      ],
      highlights: [
        "Wedding and anniversary keepsakes",
        "Two-line name and date engraving",
        "Core price point for a frame listing",
      ],
      faqs: [
        {
          q: "Which frame size should a new listing start with?",
          a: "Medium. It carries enough engraving room for a proper two-line message and sits at the price point most keepsake buyers expect.",
        },
      ],
    },
    tr: {
      intro: [
        "Orta boy çerçeveler çerçeve yelpazesinin hacim satıcısıdır: gerçek bir hediye olarak okunacak kadar büyük, rafta duracak kadar küçük ve hatıra alımlarının çoğunun gerçekleştiği fiyatta.",
        "Daha geniş çerçeve iki satırı rahatça alır; bir düğün ya da anma çerçevesinin genelde ihtiyacı olan da budur — üstte isimler, altında tarih.",
      ],
      highlights: [
        "Düğün ve yıl dönümü hatıraları",
        "İki satırlı isim ve tarih kazıma",
        "Çerçeve ilanı için ana fiyat noktası",
      ],
      faqs: [
        {
          q: "Yeni bir ilan hangi çerçeve ölçüsüyle başlamalı?",
          a: "Orta boy. Düzgün iki satırlık bir mesaja yetecek kazıma alanı taşır ve hatıra alıcılarının çoğunun beklediği fiyatta durur.",
        },
      ],
    },
  },

  "frames-and-decor/photo-frames-large": {
    en: {
      intro: [
        "Large frames are wall pieces, and they are bought for the occasions people expect to still be marking in twenty years — weddings, family portraits, memorials, retirement presentations.",
        "The wide moulding is the most generous engraving surface in the frame range: multi-line messages, full names and a date all fit without crowding.",
      ],
      highlights: [
        "Wall-hung wedding and family pieces",
        "Retirement and presentation gifts",
        "Multi-line engraved messages",
      ],
      faqs: [
        {
          q: "Do large frames ship safely?",
          a: "They ship with the glass and backing in place and are packed for transit. They cost more to ship than small frames, which is worth building into the listing price.",
        },
      ],
    },
    tr: {
      intro: [
        "Büyük çerçeveler duvar ürünüdür ve insanların yirmi yıl sonra da anıyor olmayı bekledikleri anlar için alınır — düğünler, aile portreleri, anmalar, emeklilik takdimleri.",
        "Geniş çerçeve, çerçeve yelpazesindeki en cömert kazıma yüzeyidir: çok satırlı mesajlar, tam isimler ve bir tarih sıkışmadan sığar.",
      ],
      highlights: [
        "Duvara asılan düğün ve aile ürünleri",
        "Emeklilik ve takdim hediyeleri",
        "Çok satırlı kazınmış mesajlar",
      ],
      faqs: [
        {
          q: "Büyük çerçeveler güvenli kargolanıyor mu?",
          a: "Camı ve arkalığı takılı olarak, taşımaya uygun paketlenir. Küçük çerçevelerden pahalı kargolanır; bunu ilan fiyatına katmakta fayda var.",
        },
      ],
    },
  },

  "frames-and-decor/solid-wood-photo-frames": {
    en: {
      intro: [
        "Solid wood frames engrave to a warm brown that deepens with the density of the grain, which gives a very different feeling from a painted or composite frame — the mark looks grown into the wood rather than applied to it.",
        "That warmth is why solid wood is the material of choice for family-name pieces and anything meant to read as an heirloom rather than a product.",
      ],
      highlights: [
        "Family-name and heirloom pieces",
        "Rustic and farmhouse listings",
        "Wedding and anniversary gifting",
      ],
      faqs: [
        {
          q: "Does the grain affect how the engraving looks?",
          a: "Yes — denser grain burns darker, so the mark varies slightly with the wood. That variation is part of the material's appeal, but it is why fine small text belongs on bamboo or maple instead.",
        },
      ],
    },
    tr: {
      intro: [
        "Masif ahşap çerçeveler, damarın yoğunluğuna göre koyulaşan sıcak bir kahverengiye kazınır; bu, boyalı ya da kompozit bir çerçeveden çok farklı bir his verir — iz, üzerine uygulanmış değil ahşabın içinde yetişmiş gibi görünür.",
        "Bu sıcaklık, masif ahşabı aile adı ürünlerinde ve ürün değil yadigâr olarak okunması istenen her şeyde tercih edilen malzeme yapar.",
      ],
      highlights: [
        "Aile adı ve yadigâr ürünler",
        "Rustik ve country ilanlar",
        "Düğün ve yıl dönümü hediyeleri",
      ],
      faqs: [
        {
          q: "Damar kazımanın görünümünü etkiliyor mu?",
          a: "Evet — yoğun damar daha koyu yanar, iz ahşaba göre biraz değişir. Bu değişkenlik malzemenin çekiciliğinin parçasıdır ama ince küçük yazının bambu ya da akçaağaca ait olmasının da sebebidir.",
        },
      ],
    },
  },

  "frames-and-decor/glass-frames-and-decor": {
    en: {
      intro: [
        "Glass frames and decor pieces etch to a soft translucent frost that catches light from the edge, which makes them the most display-dependent product in the catalogue — they look ordinary flat on a table and striking when light hits them.",
        "It is the right material for delicate script, floral line work and anything where the design should feel light rather than heavy.",
      ],
      highlights: [
        "Wedding and anniversary display pieces",
        "Delicate script and line-art designs",
        "Award and recognition pieces",
      ],
      faqs: [
        {
          q: "How should glass pieces be photographed for a listing?",
          a: "Against a dark background with side lighting — the etch reads as white against dark and nearly disappears against white. It is the single biggest factor in whether a glass listing converts.",
        },
      ],
    },
    tr: {
      intro: [
        "Cam çerçeveler ve dekor ürünleri, kenardan gelen ışığı yakalayan yumuşak yarı saydam bir buz dokusuna aşındırılır; bu da onları katalogun sergilemeye en bağımlı ürünü yapar — masada düz dururken sıradan, ışık vurduğunda çarpıcı görünürler.",
        "İnce el yazısı, çiçekli çizgi çalışması ve tasarımın ağır değil hafif hissettirmesi gereken her şey için doğru malzeme budur.",
      ],
      highlights: [
        "Düğün ve yıl dönümü sergi ürünleri",
        "İnce el yazısı ve çizgi tasarımlar",
        "Ödül ve takdir ürünleri",
      ],
      faqs: [
        {
          q: "Cam ürünler ilan için nasıl fotoğraflanmalı?",
          a: "Koyu zeminde, yandan ışıkla — aşındırma koyu üzerinde beyaz okunur, beyaz üzerinde neredeyse kaybolur. Bir cam ilanının dönüşüp dönüşmemesindeki en büyük tek etken budur.",
        },
      ],
    },
  },

  "kitchen-and-bar/bbq-sets-and-utensils": {
    en: {
      intro: [
        "BBQ sets are the single strongest Father's Day product in the catalogue, and they carry an unusually high perceived value because the blank arrives as a complete cased set rather than a loose tool.",
        "Engraving goes on the case or the handles, so one mark makes the whole set look commissioned rather than bought.",
      ],
      highlights: [
        "Father's Day and birthday gifting",
        "Groomsmen and retirement sets",
        "High-AOV bundles for a gift store",
      ],
      faqs: [
        {
          q: "Where is a BBQ set engraved?",
          a: "The case lid is the standard placement because it is the presentation surface. Handle engraving is available on request when the tools should carry the mark individually.",
        },
      ],
    },
    tr: {
      intro: [
        "Mangal setleri katalogun en güçlü Babalar Günü ürünüdür ve algılanan değerleri alışılmadık derecede yüksektir; çünkü boş ürün tek bir alet olarak değil, çantasıyla komple bir set olarak gelir.",
        "Kazıma çantaya ya da saplara yapılır; tek bir iz tüm seti satın alınmış değil ısmarlanmış gösterir.",
      ],
      highlights: [
        "Babalar Günü ve doğum günü hediyeleri",
        "Sağdıç ve emeklilik setleri",
        "Hediye mağazası için sepet yükselten paketler",
      ],
      faqs: [
        {
          q: "Mangal seti nereye kazınıyor?",
          a: "Standart yerleşim çanta kapağıdır, çünkü sunum yüzeyi orasıdır. Aletlerin tek tek iz taşıması isteniyorsa talep üzerine sap kazıma da yapılır.",
        },
      ],
    },
  },

  "kitchen-and-bar/cigar-accessories-and-bar-gift-sets": {
    en: {
      intro: [
        "Cigar accessories and cased bar sets sit at the top of the gifting price range because the case does the work: a lidded box with fitted tools reads as a considered, expensive present before it is even opened.",
        "One engraved lid is the entire personalization, which makes these among the fastest high-value items to produce.",
      ],
      highlights: [
        "Premium groomsmen and client gifts",
        "Retirement and milestone presentations",
        "Top-tier bundle in a gift store",
      ],
      faqs: [
        {
          q: "Can the tools inside be engraved as well as the case?",
          a: "On some sets, yes. Ask in a quote and we will confirm what the specific set supports before you build the listing around it.",
        },
      ],
    },
    tr: {
      intro: [
        "Puro aksesuarları ve çantalı bar setleri hediye fiyat aralığının tepesindedir; çünkü işi çanta yapar: içine yerleştirilmiş aletleriyle kapaklı bir kutu, açılmadan önce bile düşünülmüş ve pahalı bir hediye olarak okunur.",
        "Kişiselleştirmenin tamamı tek bir kazınmış kapaktır; bu da onları üretimi en hızlı yüksek değerli ürünler arasına sokar.",
      ],
      highlights: [
        "Premium sağdıç ve müşteri hediyeleri",
        "Emeklilik ve dönüm noktası takdimleri",
        "Hediye mağazasında en üst kademe paket",
      ],
      faqs: [
        {
          q: "Çantanın yanı sıra içindeki aletler de kazınabiliyor mu?",
          a: "Bazı setlerde evet. Teklifte sor; ilanı onun üzerine kurmadan önce o setin neyi desteklediğini net söyleriz.",
        },
      ],
    },
  },

  "kitchen-and-bar/scented-candles": {
    en: {
      intro: [
        "Candles are the impulse-price item that makes a bundle feel complete. On their own they are a modest sale; paired with a board, a coaster set or a jewelry box they raise the cart without raising the buyer's resistance.",
        "The engraved element is the vessel or lid rather than the wax, so the personalization survives the candle itself and the container gets kept.",
      ],
      highlights: [
        "Bundle filler that lifts cart value",
        "Hostess and housewarming gifting",
        "Wedding favours in volume",
      ],
      faqs: [
        {
          q: "What part of a candle is personalized?",
          a: "The vessel or the lid. That is also why buyers keep them — the container outlives the wax.",
        },
      ],
    },
    tr: {
      intro: [
        "Mumlar, bir paketi tamamlanmış hissettiren anlık alım ürünleridir. Tek başlarına mütevazı bir satıştır; bir tahta, altlık seti ya da mücevher kutusuyla eşleştiğinde alıcının direncini artırmadan sepeti yükseltir.",
        "Kazınan parça mum değil kap ya da kapaktır; yani kişiselleştirme mumun kendisinden sonra da yaşar ve kap saklanır.",
      ],
      highlights: [
        "Sepet tutarını yükselten paket tamamlayıcısı",
        "Ev sahibesi ve yeni ev hediyeleri",
        "Toplu düğün hediyelikleri",
      ],
      faqs: [
        {
          q: "Mumun neresi kişiselleştiriliyor?",
          a: "Kap ya da kapak. Alıcıların saklamasının sebebi de budur — kap mumdan uzun yaşar.",
        },
      ],
    },
  },

  "patches/oval-patches": {
    en: {
      intro: [
        "The oval patch is the classic workwear name badge shape — it is what a mechanic's shirt patch looks like, and that association is worth using rather than fighting.",
        "It suits a name over a role, or a brand over a tagline, better than a circle does, because the horizontal stretch gives text room while keeping the badge silhouette.",
      ],
      highlights: [
        "Workwear name and role badges",
        "Trade and service branding",
        "Retro and heritage brand looks",
      ],
      faqs: [
        {
          q: "Oval or rectangle for a two-line mark?",
          a: "Rectangle gives more usable area; oval gives the badge look. If the design is a name over a role, oval reads more like a uniform patch and rectangle more like a logo tag.",
        },
      ],
    },
    tr: {
      intro: [
        "Oval patch klasik iş kıyafeti isimlik biçimidir — bir tamircinin gömlek patch'i böyle görünür ve bu çağrışımla kavga etmek yerine onu kullanmak daha akıllıcadır.",
        "Yatay uzama yazıya yer verirken rozet siluetini koruduğu için, ismin altında görev ya da markanın altında slogan olan tasarımlara daireden daha uygundur.",
      ],
      highlights: [
        "İş kıyafeti isim ve görev rozetleri",
        "Esnaf ve servis markalaması",
        "Retro ve miras marka görünümü",
      ],
      faqs: [
        {
          q: "İki satırlı bir iz için oval mi dikdörtgen mi?",
          a: "Dikdörtgen daha fazla kullanılabilir alan verir; oval rozet görünümü verir. Tasarım ismin altında görevse oval daha çok üniforma patch'i, dikdörtgen daha çok logo etiketi gibi okunur.",
        },
      ],
    },
  },

  "patches/square-patches": {
    en: {
      intro: [
        "The square patch is the format for a centred emblem — a monogram, an icon, an initial — where a rectangle would leave dead space either side of the mark.",
        "It is the shape that suits modern minimal branding best, and it presses onto a cap front and a bag panel equally well.",
      ],
      highlights: [
        "Monogram and single-icon marks",
        "Modern minimal apparel brands",
        "Bag and jacket panel branding",
      ],
      faqs: [
        {
          q: "When is square the right patch shape?",
          a: "When the artwork is roughly as tall as it is wide. A horizontal wordmark wastes a square; a centred emblem wastes a rectangle.",
        },
      ],
    },
    tr: {
      intro: [
        "Kare patch, ortalanmış bir amblem için doğru biçimdir — monogram, ikon, baş harf — dikdörtgenin izin iki yanında ölü alan bırakacağı yerlerde.",
        "Modern minimal markalamaya en çok yakışan şekildir ve şapka önüne de çanta paneline de aynı derecede iyi preslenir.",
      ],
      highlights: [
        "Monogram ve tek ikonlu işaretler",
        "Modern minimal tekstil markaları",
        "Çanta ve ceket paneli markalaması",
      ],
      faqs: [
        {
          q: "Kare ne zaman doğru patch biçimi?",
          a: "Tasarım eni kadar boyluysa. Yatay bir kelime logosu kareyi ziyan eder; ortalanmış bir amblem dikdörtgeni.",
        },
      ],
    },
  },

  "patches/hex-patches": {
    en: {
      intro: [
        "The hex patch is the shape that signals a deliberate brand rather than a generic badge — it is unusual enough to be noticed and geometric enough not to look novelty.",
        "It has become the default in outdoor, coffee and craft branding, where a plain rectangle reads as too corporate.",
      ],
      highlights: [
        "Outdoor and adventure brands",
        "Coffee, craft and maker branding",
        "Distinctive cap-front listings",
      ],
      faqs: [
        {
          q: "Does a hex patch press the same as a rectangle?",
          a: "Yes — same material, same adhesive, same settings. The corners are what to watch: check them first when you inspect a test press.",
        },
      ],
    },
    tr: {
      intro: [
        "Altıgen patch, jenerik bir rozetten çok bilinçli bir markayı işaret eden biçimdir — fark edilecek kadar sıra dışı, gösterişe kaçmayacak kadar geometrik.",
        "Düz dikdörtgenin fazla kurumsal okunduğu outdoor, kahve ve el işi markalamada varsayılan hâline geldi.",
      ],
      highlights: [
        "Outdoor ve macera markaları",
        "Kahve, el işi ve üretici markalaması",
        "Ayırt edici şapka önü ilanları",
      ],
      faqs: [
        {
          q: "Altıgen patch dikdörtgenle aynı şekilde mi presleniyor?",
          a: "Evet — aynı malzeme, aynı yapışkan, aynı ayarlar. Dikkat edilecek yer köşelerdir: test presini incelerken önce oraya bak.",
        },
      ],
    },
  },

  "gift-sets/bar-gift-sets": {
    en: {
      intro: [
        "A cased bar set is the product that lets a shop sell one item instead of assembling four. Everything arrives fitted in a presentation case, so a single engraved lid finishes the gift.",
        "These are bought for the occasions where the giver wants the present to look substantial without needing to know anything about the recipient's taste in barware.",
      ],
      highlights: [
        "Groomsmen and best-man gifting",
        "Corporate client and holiday gifts",
        "Retirement and milestone presentations",
      ],
      faqs: [
        {
          q: "Do bar sets ship ready to gift?",
          a: "Yes — complete in the case with all components fitted, so nothing needs assembling or repacking before it reaches your customer.",
        },
      ],
    },
    tr: {
      intro: [
        "Çantalı bar seti, bir mağazanın dört parça birleştirmek yerine tek ürün satmasını sağlayan üründür. Her şey sunum çantasına yerleştirilmiş gelir; kazınmış tek bir kapak hediyeyi tamamlar.",
        "Hediye edenin, alan kişinin bar zevkine dair hiçbir şey bilmeye ihtiyaç duymadan hediyenin dolgun görünmesini istediği anlar için alınır.",
      ],
      highlights: [
        "Sağdıç ve baş sağdıç hediyeleri",
        "Kurumsal müşteri ve yılbaşı hediyeleri",
        "Emeklilik ve dönüm noktası takdimleri",
      ],
      faqs: [
        {
          q: "Bar setleri hediyeye hazır mı geliyor?",
          a: "Evet — tüm parçalar yerinde, çantasıyla komple; müşterine ulaşmadan önce hiçbir şeyin kurulması ya da yeniden paketlenmesi gerekmez.",
        },
      ],
    },
  },

  "travel-accessories/travel-jewelry-boxes": {
    en: {
      intro: [
        "Travel jewelry cases are the bridesmaid gift that has largely replaced the tumbler in the last few years — they are personal, they are used, and an initial on the lid makes each one belong to a specific person.",
        "They are compact and light, so a set of six ships cheaply, which is what makes bulk bridesmaid orders viable for a small shop.",
      ],
      highlights: [
        "Bridesmaid and wedding-party sets",
        "Initial and monogram listings",
        "Honeymoon and travel gifting",
      ],
      faqs: [
        {
          q: "Can each case in a bridesmaid set carry a different initial?",
          a: "Yes — per-unit personalization is the normal case. Send the list of names or initials with the order.",
        },
      ],
    },
    tr: {
      intro: [
        "Seyahat mücevher kutuları, son birkaç yılda bardağın yerini büyük ölçüde almış nedime hediyesidir — kişiseldir, kullanılır ve kapaktaki bir baş harf her birini belirli bir kişiye ait kılar.",
        "Kompakt ve hafiftirler; altılı bir set ucuza kargolanır ve küçük bir mağaza için toplu nedime siparişini mümkün kılan şey budur.",
      ],
      highlights: [
        "Nedime ve düğün setleri",
        "Baş harf ve monogram ilanları",
        "Balayı ve seyahat hediyeleri",
      ],
      faqs: [
        {
          q: "Nedime setindeki her kutuda farklı baş harf olabilir mi?",
          a: "Evet — ürün başına kişiselleştirme normaldir. İsim ya da baş harf listesini siparişle gönder.",
        },
      ],
    },
  },

  "travel-accessories/large-jewelry-boxes": {
    en: {
      intro: [
        "Large lidded jewelry boxes are the dressing-table version of the travel case: they stay in one place, they hold a collection rather than a trip's worth, and they are bought as a milestone gift rather than a party favour.",
        "The wide lid is the most generous engraving surface in the travel range, which makes it the right piece for a full name or a multi-line message.",
      ],
      highlights: [
        "Milestone birthday and anniversary gifts",
        "Full-name and multi-line engraving",
        "Premium tier above a travel case listing",
      ],
      faqs: [
        {
          q: "Should I list the travel case and the large box together?",
          a: "They share finishes, so the same engraving design covers both — a natural good-better pairing at two price points.",
        },
      ],
    },
    tr: {
      intro: [
        "Büyük kapaklı mücevher kutuları, seyahat kutusunun tuvalet masası sürümüdür: tek bir yerde durur, bir yolculuğun değil bir koleksiyonun ihtiyacını karşılar ve parti hediyeliği değil dönüm noktası hediyesi olarak alınır.",
        "Geniş kapak, seyahat yelpazesindeki en cömert kazıma yüzeyidir; tam isim ya da çok satırlı bir mesaj için doğru ürün budur.",
      ],
      highlights: [
        "Önemli yaş günü ve yıl dönümü hediyeleri",
        "Tam isim ve çok satırlı kazıma",
        "Seyahat kutusu ilanının üstünde premium kademe",
      ],
      faqs: [
        {
          q: "Seyahat kutusuyla büyük kutuyu birlikte mi ilanlamalıyım?",
          a: "Kaplamaları ortaktır; aynı kazıma tasarımı ikisini de karşılar — iki fiyat noktasında doğal bir iyi/daha iyi ikilisi.",
        },
      ],
    },
  },

  "travel-accessories/crossbody-bags": {
    en: {
      intro: [
        "Crossbody bags are the highest ticket item in the travel range, and personalization here has to be restrained — a small monogram on a panel, not a large mark across the front, because the buyer is choosing the bag first and the engraving second.",
        "That restraint is the listing advice as much as the production note: an over-marked bag looks like merchandise, a discreetly marked one looks bespoke.",
      ],
      highlights: [
        "Premium personalized gifting",
        "Discreet monogram placements",
        "Bridesmaid and travel bundles",
      ],
      faqs: [
        {
          q: "How large should a monogram be on a bag?",
          a: "Small and off-centre reads as bespoke; large and centred reads as branded merchandise. Most buyers of this product want the first.",
        },
      ],
    },
    tr: {
      intro: [
        "Çapraz askılı çantalar seyahat yelpazesinin en yüksek fiyatlı ürünüdür ve burada kişiselleştirme ölçülü olmak zorundadır — önün tamamına büyük bir iz değil, bir panele küçük bir monogram; çünkü alıcı önce çantayı, sonra kazımayı seçer.",
        "Bu ölçülülük üretim notu kadar ilan tavsiyesidir de: fazla işaretlenmiş çanta ticari ürün gibi, ölçülü işaretlenmiş olan ısmarlama gibi görünür.",
      ],
      highlights: [
        "Premium kişiselleştirilmiş hediye",
        "Ölçülü monogram yerleşimleri",
        "Nedime ve seyahat paketleri",
      ],
      faqs: [
        {
          q: "Çantada monogram ne kadar büyük olmalı?",
          a: "Küçük ve merkez dışı ısmarlama okunur; büyük ve ortalanmış markalı ürün okunur. Bu ürünün alıcılarının çoğu birincisini ister.",
        },
      ],
    },
  },

  "travel-accessories/travel-items": {
    en: {
      intro: [
        "This collection holds the smaller travel pieces that do not form a family of their own — luggage tags, organizers, pouches and similar. They are cheap to ship and easy to bundle, which makes them the practical add-on to a passport-holder or jewelry-case listing.",
        "A luggage tag with a name on it is also one of the few personalized products bought for a genuinely functional reason, which keeps the category selling outside gifting season.",
      ],
      highlights: [
        "Add-on products for a travel bundle",
        "Functional, year-round listings",
        "Corporate travel kit components",
      ],
      faqs: [
        {
          q: "What should go on a luggage tag?",
          a: "A name and a contact line. Keep it short — the tag is small, and legibility from a baggage belt is the whole point.",
        },
      ],
    },
    tr: {
      intro: [
        "Bu koleksiyon kendi başına bir aile oluşturmayan küçük seyahat parçalarını tutar — bagaj etiketleri, düzenleyiciler, keseler ve benzerleri. Ucuz kargolanır ve kolay paketlenir; bu da onları pasaportluk veya mücevher kutusu ilanının pratik ek ürünü yapar.",
        "Üzerinde isim olan bir bagaj etiketi ayrıca gerçekten işlevsel bir sebeple alınan birkaç kişiselleştirilmiş üründen biridir; kategoriyi hediye sezonu dışında da satar hâlde tutan şey budur.",
      ],
      highlights: [
        "Seyahat paketi için ek ürünler",
        "İşlevsel, yıl boyu satan ilanlar",
        "Kurumsal seyahat kiti parçaları",
      ],
      faqs: [
        {
          q: "Bagaj etiketine ne yazılmalı?",
          a: "Bir isim ve bir iletişim satırı. Kısa tut — etiket küçüktür ve bütün mesele bagaj bandından okunabilmesidir.",
        },
      ],
    },
  },
};
