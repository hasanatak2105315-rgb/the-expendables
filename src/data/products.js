// Ürün listesi — ad, fiyat, açıklama ve 3D modeli buradan düzenleyin.
// model: src/three/Models.jsx içindeki modellerden biri
// (ring, pendant, earrings, bracelet, vase, lamp, planter, sculpture, keychain)

export const CATEGORIES = ['Tümü', 'Takı', '3D Baskı', 'Kişiye Özel']

export const PRODUCTS = [
  {
    id: 'zumrut-yuzuk',
    name: 'Zümrüt Yüzük',
    category: 'Takı',
    model: 'ring',
    price: 2490,
    oldPrice: 2890,
    rating: 4.9,
    tag: 'Çok Satan',
    desc: '925 ayar gümüş üzerine altın kaplama, el işçiliğiyle yerleştirilmiş yeşil zirkon taş. Günlük kullanıma ve özel günlere uygun.',
    specs: ['925 ayar gümüş', 'Altın kaplama', 'Yeşil zirkon taş', 'Ölçü seçeneği']
  },
  {
    id: 'damla-kolye',
    name: 'Damla Kolye',
    category: 'Takı',
    model: 'pendant',
    price: 1890,
    rating: 4.8,
    tag: 'Yeni',
    desc: 'Damla kesim yeşil taş ve ince zincir. Sade ama dikkat çeken bir parça.',
    specs: ['45 cm zincir', 'Altın kaplama', 'Damla kesim taş', 'Hediye kutusu']
  },
  {
    id: 'halka-kupe',
    name: 'Halka Küpe',
    category: 'Takı',
    model: 'earrings',
    price: 990,
    rating: 4.7,
    desc: 'Hafif ve zarif halka küpeler, ucunda küçük yeşil taş. Gün boyu rahat kullanım.',
    specs: ['925 ayar gümüş', 'Altın kaplama', 'Hipoalerjenik', '3 cm çap']
  },
  {
    id: 'boncuk-bileklik',
    name: 'Boncuk Bileklik',
    category: 'Takı',
    model: 'bracelet',
    price: 690,
    oldPrice: 850,
    rating: 4.8,
    desc: 'Altın kaplama boncuklar ve yeşil taşlar, ucunda isim baş harfi kazınabilen madalyon.',
    specs: ['Esnek ip', 'Altın kaplama boncuk', 'Harf kazıma', 'Tek beden']
  },
  {
    id: 'spiral-vazo',
    name: 'Spiral Vazo',
    category: '3D Baskı',
    model: 'vase',
    price: 590,
    rating: 4.9,
    tag: 'Çok Satan',
    desc: 'Kıvrımlı spiral formuyla 3D yazıcıda katman katman basılır. Kuru çiçek ve dekorasyon için ideal.',
    specs: ['Biyobozunur PLA', '22 cm yükseklik', 'Renk seçeneği', 'El ile son işlem']
  },
  {
    id: 'geo-lamba',
    name: 'Geo Lamba',
    category: '3D Baskı',
    model: 'lamp',
    price: 1290,
    rating: 4.8,
    tag: 'Yeni',
    desc: 'Geometrik kabuğu ile ortama yumuşak ve desenli bir ışık verir. USB ile çalışır.',
    specs: ['LED ampul dahil', 'USB güç', 'Sıcak / soğuk ışık', '18 cm çap']
  },
  {
    id: 'altigen-saksi',
    name: 'Altıgen Saksı',
    category: '3D Baskı',
    model: 'planter',
    price: 390,
    rating: 4.7,
    desc: 'Sukulent ve kaktüsler için altıgen formlu mini saksı. Alt kısımda su tahliye deliği vardır.',
    specs: ['PLA malzeme', 'Drenaj deliği', '10 cm çap', 'Renk seçeneği']
  },
  {
    id: 'sonsuzluk-heykeli',
    name: 'Sonsuzluk Heykeli',
    category: '3D Baskı',
    model: 'sculpture',
    price: 790,
    oldPrice: 950,
    rating: 4.9,
    desc: 'Düğüm formunda modern masa objesi. İpek görünümlü filament ile basılır.',
    specs: ['İpek PLA', '20 cm yükseklik', 'Kaymaz taban', 'Hediye paketi']
  },
  {
    id: 'isimli-anahtarlik',
    name: 'İsimli Anahtarlık',
    category: 'Kişiye Özel',
    model: 'keychain',
    price: 190,
    rating: 4.9,
    tag: 'Kişiye Özel',
    desc: 'İstediğin isim, harf veya logoyla 3D yazıcıda basılır. Hediye için harika.',
    specs: ['İsim / logo baskı', 'Dayanıklı PLA', 'Metal halka', 'Renk seçeneği']
  }
]

export const formatPrice = (n) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n)
