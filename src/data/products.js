// Ürün listesi — ad, fiyat, açıklama ve 3D modeli buradan düzenleyin.
// model: src/three/Models.jsx içindeki modellerden biri
// (watch, dogtags, glasses, flask, flashlight, backpack, lighter, compass, headphones)

export const CATEGORIES = ['Tümü', 'Saat', 'Aksesuar', 'Ekipman', 'Elektronik']

export const PRODUCTS = [
  {
    id: 'ranger-chrono',
    name: 'Ranger Chrono',
    category: 'Saat',
    model: 'watch',
    price: 4890,
    oldPrice: 5490,
    rating: 4.9,
    tag: 'Çok Satan',
    desc: 'Safir kristal cam, karanlıkta parlayan yeşil kadran ve 200 metre su geçirmezlik. Zorlu görevler için tasarlandı.',
    specs: ['42 mm titanyum kasa', '200 m su geçirmez', 'Fosforlu kadran', '5 yıl pil ömrü']
  },
  {
    id: 'unit-dogtags',
    name: 'Unit Künye Seti',
    category: 'Aksesuar',
    model: 'dogtags',
    price: 690,
    rating: 4.8,
    tag: 'Kişiye Özel',
    desc: 'Paslanmaz çelikten iki künye ve sağlam bilyeli zincir. İsim veya kod lazerle kazınır.',
    specs: ['316L paslanmaz çelik', 'Lazer kazıma', '60 cm zincir', 'Hediye kutusu']
  },
  {
    id: 'falcon-aviator',
    name: 'Falcon Aviator',
    category: 'Aksesuar',
    model: 'glasses',
    price: 1790,
    rating: 4.7,
    desc: 'Polarize yeşil camlar ve hafif metal çerçeve. Güneşe karşı tam koruma, net görüş.',
    specs: ['UV400 koruma', 'Polarize cam', 'Hafif metal çerçeve', 'Sert taşıma kutusu']
  },
  {
    id: 'field-flask',
    name: 'Field Matara',
    category: 'Ekipman',
    model: 'flask',
    price: 890,
    oldPrice: 1090,
    rating: 4.8,
    desc: 'Çift cidarlı yalıtım ile 24 saat soğuk, 12 saat sıcak. Darbeye dayanıklı mat kaplama.',
    specs: ['1 L kapasite', 'Çift cidar yalıtım', 'BPA içermez', 'Sızdırmaz kapak']
  },
  {
    id: 'nightops-torch',
    name: 'NightOps Fener',
    category: 'Ekipman',
    model: 'flashlight',
    price: 1290,
    rating: 4.9,
    tag: 'Yeni',
    desc: '2000 lümen, 5 mod ve USB-C şarj. Uçak sınıfı alüminyum gövde ile her koşulda ışık.',
    specs: ['2000 lümen', 'USB-C şarj', 'IP68 koruma', '5 aydınlatma modu']
  },
  {
    id: 'recon-pack',
    name: 'Recon 35L Çanta',
    category: 'Ekipman',
    model: 'backpack',
    price: 3490,
    oldPrice: 3990,
    rating: 4.8,
    desc: 'MOLLE sistemli, su itici 1000D Cordura kumaş. Günlük kullanımdan uzun rotalara kadar.',
    specs: ['35 L hacim', '1000D Cordura', 'MOLLE panel', 'Laptop bölmesi']
  },
  {
    id: 'ember-lighter',
    name: 'Ember Çakmak',
    category: 'Aksesuar',
    model: 'lighter',
    price: 540,
    rating: 4.6,
    desc: 'Rüzgâra dayanıklı alev, pirinç iç mekanizma ve ömür boyu dayanacak çelik gövde.',
    specs: ['Rüzgâr geçirmez', 'Doldurulabilir', 'Çelik gövde', 'Kazıma seçeneği']
  },
  {
    id: 'vector-compass',
    name: 'Vector Pusula',
    category: 'Ekipman',
    model: 'compass',
    price: 760,
    rating: 4.7,
    desc: 'Sıvı dolu kadran, fosforlu yön işaretleri ve pirinç kasa. Sinyal yoksa yön sende.',
    specs: ['Sıvı sönümlemeli', 'Fosforlu işaretler', 'Pirinç kasa', 'Boyun askısı']
  },
  {
    id: 'comms-h1',
    name: 'Comms H1 Kulaklık',
    category: 'Elektronik',
    model: 'headphones',
    price: 5990,
    oldPrice: 6790,
    rating: 4.8,
    tag: 'Sınırlı Seri',
    desc: 'Aktif gürültü engelleme, 40 saat pil ve sahada test edilmiş sağlam yapı.',
    specs: ['Aktif gürültü engelleme', '40 saat pil', 'Bluetooth 5.3', 'Katlanabilir']
  }
]

export const formatPrice = (n) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n)
