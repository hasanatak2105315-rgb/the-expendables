// Ürün listesi — ad, fiyat, açıklama ve 3D modeli buradan düzenleyin.
// model: src/three/Models.jsx içindeki modellerden biri
// (tshirt, sweatshirt, hoodie, joggers, tracksuit, vase, lamp, planter, sculpture, keychain)
// Giyimde: color = kumaş rengi, color2 = eşofman takımının altı, print = göğüsteki baskı yazısı,
// sizes = beden seçenekleri (varsa sepete eklemeden önce beden seçilir)

export const CATEGORIES = ['Tümü', 'Giyim', '3D Baskı', 'Kişiye Özel']

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export const PRODUCTS = [
  {
    id: 'baskili-tisort',
    name: 'Baskılı Tişört',
    category: 'Giyim',
    model: 'tshirt',
    color: '#f1ece2',
    print: 'Zela 47',
    sizes: SIZES,
    price: 449,
    oldPrice: 549,
    rating: 4.9,
    tag: 'Çok Satan',
    desc: 'Yumuşak penye kumaş üzerine kendi tasarımımız olan göğüs baskısı. Rahat kesim, günlük kullanım için ideal.',
    specs: ['%100 pamuk', '180 g/m² penye', 'Solmayan DTF baskı', 'Unisex kesim']
  },
  {
    id: 'baskili-sweatshirt',
    name: 'Baskılı Sweatshirt',
    category: 'Giyim',
    model: 'sweatshirt',
    color: '#7a2420',
    print: 'Est. 2026',
    sizes: SIZES,
    price: 749,
    rating: 4.8,
    tag: 'Yeni',
    desc: 'İçi şardonlu, kalın dokulu sweatshirt. Ribanalı yaka, kol ve etek ucu; göğüste nakış görünümlü baskı.',
    specs: ['%80 pamuk, %20 polyester', 'İçi şardonlu', 'Ribanalı uçlar', 'Unisex kesim']
  },
  {
    id: 'kapusonlu-sweatshirt',
    name: 'Kapüşonlu Sweatshirt',
    category: 'Giyim',
    model: 'hoodie',
    color: '#f2a65a',
    print: 'Tokat',
    sizes: SIZES,
    price: 849,
    oldPrice: 990,
    rating: 4.9,
    desc: 'Kanguru cepli, bağcıklı kapüşonlu sweatshirt. Oversize kalıp, sırt ya da göğüs baskısıyla.',
    specs: ['Kanguru cep', 'Bağcıklı kapüşon', 'İçi şardonlu', 'Oversize kalıp']
  },
  {
    id: 'esofman-alti',
    name: 'Eşofman Altı',
    category: 'Giyim',
    model: 'joggers',
    color: '#9aa3ab',
    sizes: SIZES,
    price: 649,
    rating: 4.7,
    desc: 'Gri melanj, paçası lastikli jogger eşofman altı. Yanda altın sarısı şerit, belde bağcık, iki yan cep.',
    specs: ['Lastikli paça', 'Bağcıklı bel', 'İki yan cep', 'Yan şerit detayı']
  },
  {
    id: 'esofman-takimi',
    name: 'Eşofman Takımı',
    category: 'Giyim',
    model: 'tracksuit',
    color: '#2c4a7a',
    color2: '#2c4a7a',
    print: 'TX',
    sizes: SIZES,
    price: 1290,
    oldPrice: 1490,
    rating: 4.8,
    tag: 'Takım',
    desc: 'Sweatshirt ve jogger altından oluşan takım. Kayısı şerit detaylı, göğüste küçük logo baskısı.',
    specs: ['Üst + alt takım', 'İçi şardonlu', 'Lastikli paça', 'Logo baskı']
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
