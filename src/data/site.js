// Mağaza ve şirket bilgileri. Boş bırakılan alanlar sitede gösterilmez.
export const SITE = {
  name: 'The Expendables',
  company: '', // Resmî şirket unvanı (ör. "Ad Soyad - The Expendables" veya "X Ltd. Şti.")
  taxInfo: '', // Vergi dairesi ve numarası
  email: 'destek@theexpendables.com.tr',
  phone: '', // ör. '+90 5xx xxx xx xx'
  address: 'İstanbul, Türkiye',
  hours: 'Hafta içi 09:00 – 18:00',
  instagram: '#',
  url: 'https://theexpendables.com.tr', // Sitenin yayındaki adresi (sitemap ve paylaşım görseli için)
  analyticsId: '' // Google Analytics 4 ölçüm kimliği (ör. 'G-XXXXXXX'). Boşsa analytics ve çerez bandı kapalıdır
}

// Sayfa adresleri, başlıkları ve Google'da görünecek açıklamaları
export const ROUTES = {
  '/': ['The Expendables — El Yapımı Takı ve 3D Baskı', 'El yapımı gümüş takılar ve kişiye özel 3D baskı tasarımlar. Yüzük, kolye, küpe, vazo ve lamba. 1.500 ₺ üzeri ücretsiz kargo.'],
  '/hakkimizda': ['Hakkımızda', 'El yapımı takılar ile 3D baskı tasarımlarını aynı atölyede buluşturan İstanbul merkezli bir marka. Hikâyemiz ve üretim sürecimiz.'],
  '/iletisim': ['İletişim', 'Sipariş, kişiye özel tasarım ya da iade için bize ulaş. En geç bir iş günü içinde dönüyoruz.'],
  '/sss': ['Sıkça Sorulan Sorular', 'Kargo süresi, ürün malzemeleri, kişiye özel sipariş, ödeme ve iade hakkında sık sorulan sorular.'],
  '/iade': ['İade ve Değişim', '30 gün içinde koşulsuz iade. İade adımları, iade edilemeyen ürünler ve değişim koşulları.'],
  '/kvkk': ['KVKK Aydınlatma Metni', '6698 sayılı KVKK kapsamında kişisel verilerinin nasıl işlendiğine dair aydınlatma metni.'],
  '/gizlilik': ['Gizlilik ve Çerez Politikası', 'Hangi bilgileri topladığımız, çerezleri nasıl kullandığımız ve verilerini nasıl koruduğumuz.'],
  '/kullanim-kosullari': ['Kullanım Koşulları', 'The Expendables internet sitesinin kullanım koşulları.'],
  '/mesafeli-satis': ['Mesafeli Satış Sözleşmesi', 'Ön bilgilendirme formu ve mesafeli satış sözleşmesi.']
}

export const owner = () => SITE.company || SITE.name
