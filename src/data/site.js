// Mağaza ve şirket bilgileri. Boş bırakılan alanlar sitede gösterilmez.
export const SITE = {
  name: 'The Expendables',
  company: '', // Resmî şirket unvanı (ör. "Ad Soyad - The Expendables" veya "X Ltd. Şti.")
  taxInfo: '', // Vergi dairesi ve numarası
  email: 'destek@theexpendables.com.tr',
  phone: '', // ör. '+90 5xx xxx xx xx'
  address: 'İstanbul, Türkiye',
  hours: 'Hafta içi 09:00 – 18:00',
  instagram: '#'
}

export const owner = () => SITE.company || SITE.name
