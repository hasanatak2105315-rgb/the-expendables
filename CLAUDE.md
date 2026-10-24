# The Expendables — proje notları

Takı ve 3D baskı ürünleri satan, sinematik 3D bir e-ticaret sitesi. Şimdilik sadece web sitesi var, yönetim paneli yok.

## Çalışma şekli (önemli)

- Kullanıcı Türkçe konuşur ve yazılımcı değildir. Açıklamaları sade Türkçe ile, adım adım yaz.
- Kullanıcı Windows ve VS Code kullanır. Değişiklikleri **Claude yapar**: kodu değiştirir, `npm run build` ve tarayıcıda test eder, sonra `main` dalına commit edip push eder.
- Kullanıcı güncel hâli kendi bilgisayarına VS Code terminalinde `git pull` ile çeker. Her push sonrası bunu hatırlat.
- Kullanıcıdan elle kod değiştirmesini isteme.

## Teknoloji

- Vite + React 19, Three.js (`@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`), `motion`, `lenis`
- Komutlar: `npm install`, `npm run dev`, `npm run build`
- Renk paleti: koyu yeşil zemin, nane / zümrüt / limon yeşili vurgular (`src/styles.css` içindeki `:root`)
- Yazı tipleri (Google Fonts, `index.html`): başlıklarda **Cormorant Garamond** (zarif serif, takı hissi; vurgulu kelimeler `<em>` ile italik ve nane yeşili), metin ve butonlarda **Manrope** (modern, 3D baskı hissi). Büyük başlıklar büyük harfe çevrilmez; küçük etiketler (eyebrow, buton) büyük harf kalır. `--font-display` ve `--font-body` değişkenleri `:root` içinde

## Dosyalar

- `src/data/products.js`: ürünler ve kategoriler (Takı, 3D Baskı, Kişiye Özel)
- `src/data/site.js`: şirket ve iletişim bilgileri, site adresi (`url`), Google Analytics kimliği (`analyticsId`) ve her sayfanın Google başlığı/açıklaması (`ROUTES`). Boş alanlar sitede gösterilmez
- `src/three/Models.jsx`: ürünlerin kodla çizilmiş 3D modelleri (yüzük, kolye, küpe, bileklik, vazo, lamba, saksı, heykel, anahtarlık)
- `src/three/HeroScene.jsx`: giriş sahnesi (zümrüt yüzük, yansıyan zemin, bloom)
- `src/three/ProductViews.jsx`: ürün kartlarındaki 3D görünümler (tek ortak Canvas + drei `View`) ve ürün detayındaki 3D sahne
- `src/components/`: menü, giriş, koleksiyon, bölümler, sepet, ödeme formu ve ürün detayı
- `src/components/Pages.jsx`: alt sayfalar (Hakkımızda, İletişim, SSS, İade, KVKK, Gizlilik, Kullanım Koşulları, Mesafeli Satış, Teşekkürler) ve 404
- `src/components/Extras.jsx`: sabit mobil buton, çerez bandı ve Google Analytics yükleyici
- `src/router.jsx`: küçük yönlendirici, gerçek adresler kullanır. Sayfa listesi `src/App.jsx` içindeki `PAGES`. Yeni sayfa eklenince `site.js` içindeki `ROUTES`'a da eklenmeli (sitemap oradan üretilir)
- `src/meta.js`: sayfa değişince başlık, açıklama, canonical ve paylaşım bilgilerini günceller
- `vite.config.js`: derlemede `sitemap.xml` ve `robots.txt` üretir, `index.html` içindeki site adresini `site.js`'teki `url` ile değiştirir
- `public/`: favicon, `apple-touch-icon.png`, `icon-512.png`, `og-image.png` (1200×630 paylaşım görseli), `_redirects` (Netlify). Kökte `vercel.json`
- `src/store/cart.jsx`: sepet (localStorage), kargo ücreti ve ücretsiz kargo sınırı

## Yapılanlar

- Site kuruldu, yuvarlak özel fare imleci kaldırıldı
- Ürünler taktik ekipmandan takı ve 3D baskıya çevrildi
- Sitedeki tüm metinler takı ve 3D baskı temasına çevrildi. İstatistiklerdeki sayılar (4.9/5 puan, 0.1 mm vb.) örnek değerlerdir.
- Hakkımızda, İletişim, SSS, İade, KVKK ve 404 sayfaları eklendi. İletişim formu, sunucu olmadığı için ziyaretçinin e-posta uygulamasını hazır mesajla açar.
- Kontrol listesi tamamlandı:
  - Yasal: Mesafeli Satış Sözleşmesi + Ön Bilgilendirme Formu, Kullanım Koşulları, Gizlilik ve Çerez Politikası. Ödeme formunda sözleşme onay kutusu zorunlu
  - SEO: her sayfaya ayrı başlık/açıklama, canonical, robots.txt, sitemap.xml, Open Graph görseli, iPhone ikonu, 3D alanlara ekran okuyucu açıklaması
  - Mobil: sabit alt buton (sepette ürün varsa sepeti açar), yükleme göstergeleri
  - Formlar: ödeme ve bülten formlarında alan alan hata mesajları, kart numarası/tarih otomatik biçimleniyor
  - Sipariş sonrası `/tesekkurler` sayfası (sipariş numarası sessionStorage'dan okunur, Google'a kapalı)
  - Google Analytics 4 + çerez bandı hazır ama `analyticsId` boş olduğu için kapalı. Kimlik girilince bant çıkar, GA yalnızca "Kabul et" sonrası yüklenir
- Performans: 3D kodu ayrı parçalara bölündü. İlk açılışta ~445 KB (gzip ~140 KB) iner, önceden 1,42 MB idi. 3D dosyaları (`three`, `r3f`, `postfx`) `React.lazy` ile sonradan yüklenir; alt sayfalarda hiç inmez. Bölme ayarı `vite.config.js` içindeki `manualChunks`. Vite yardımcıları ve React `react` parçasında kalmalı, yoksa 3D dosyası baştan iner. Derlenmiş hâli denemek için `.claude/launch.json` içinde `preview` (port 4173) var

## Sıradaki işler

1. Kullanıcıdan alınacak bilgiler: şirket unvanı, vergi bilgisi, telefon, Instagram adresi, gerçek alan adı, (istenirse) Google Analytics kimliği
2. Yayına alma (Vercel veya Netlify)

## Notlar

- Ödeme formu demodur, gerçek ödeme almaz. Gerçek ödeme için iyzico / PayTR gibi bir sağlayıcı ve sunucu gerekir.
- KVKK, iade, mesafeli satış, kullanım koşulları ve gizlilik metinleri genel taslaktır. Yayından önce bir hukukçuya kontrol ettirilmeli.
- Paylaşım görseli (`public/og-image.png`) kodla üretildi; görseldeki alan adı `theexpendables.com.tr` ve başlık yazısı Impact. Alan adı değişirse ya da yeni yazı tipine uydurulmak istenirse yeniden üretilmeli.
- Kullanıcının önceliği yayına almak değil, siteyi geliştirmek.
- "The Expendables" bilinen bir film serisinin adı. Kullanıcıya marka tescilini kontrol ettirmesi önerildi.
