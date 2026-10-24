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

## Dosyalar

- `src/data/products.js`: ürünler ve kategoriler (Takı, 3D Baskı, Kişiye Özel)
- `src/three/Models.jsx`: ürünlerin kodla çizilmiş 3D modelleri (yüzük, kolye, küpe, bileklik, vazo, lamba, saksı, heykel, anahtarlık)
- `src/three/HeroScene.jsx`: giriş sahnesi (zümrüt yüzük, yansıyan zemin, bloom)
- `src/three/ProductViews.jsx`: ürün kartlarındaki 3D görünümler (tek ortak Canvas + drei `View`) ve ürün detayındaki 3D sahne
- `src/components/`: menü, giriş, koleksiyon, bölümler, sepet ve ürün detayı
- `src/components/Pages.jsx`: alt sayfalar (Hakkımızda, İletişim, SSS, İade, KVKK) ve 404
- `src/router.jsx`: küçük yönlendirici. Gerçek adresler kullanır (`/hakkimizda`, `/iletisim`, `/sss`, `/iade`, `/kvkk`). Sayfa listesi `src/App.jsx` içindeki `PAGES`
- `src/data/site.js`: şirket ve iletişim bilgileri (e-posta, telefon, adres, şirket unvanı). Boş alanlar sitede gösterilmez
- `public/_redirects` (Netlify) ve `vercel.json`: doğrudan açılan alt sayfa adresleri için yönlendirme
- `src/store/cart.jsx`: sepet (localStorage), kargo ücreti ve ücretsiz kargo sınırı

## Yapılanlar

- Site kuruldu, yuvarlak özel fare imleci kaldırıldı
- Ürünler taktik ekipmandan takı ve 3D baskıya çevrildi
- Sitedeki tüm metinler (giriş, şerit, manifesto, istatistikler, bant, avantajlar, bülten, alt bilgi, yükleme ekranı, sepet, sayfa başlığı) takı ve 3D baskı temasına çevrildi. İstatistiklerdeki sayılar (4.9/5 puan, 0.1 mm vb.) örnek değerlerdir, kullanıcı gerçekleriyle değiştirebilir.
- Hakkımızda, İletişim, SSS, İade ve KVKK sayfaları ile 404 sayfası eklendi. Menü ve alt bilgi bu sayfalara bağlandı. İletişim formunda hata mesajları var; sunucu olmadığı için form, ziyaretçinin e-posta uygulamasını hazır mesajla açar.

## Sıradaki işler

1. Kullanıcının istediği kontrol listesi: meta title/description, ilk ekran CTA, favicon, robots.txt, sitemap.xml, Open Graph görseli, alt metinler, mobil uyum, sabit mobil CTA, yükleme durumları, form hataları, teşekkürler sayfası, gizlilik sayfası, kullanım koşulları, çerez bannerı, analytics, iletişim bilgileri, görsel optimizasyonu
2. Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu (Türkiye'de e-ticaret için zorunlu)
3. Yayına alma (Vercel veya Netlify)

## Notlar

- Ödeme formu demodur, gerçek ödeme almaz.
- KVKK ve iade metinleri genel taslaktır. Yayından önce şirket unvanı, vergi bilgisi ve telefon `src/data/site.js` içine girilmeli, metinler bir hukukçuya kontrol ettirilmeli.
- "The Expendables" bilinen bir film serisinin adı. Kullanıcıya marka tescilini kontrol ettirmesi önerildi.
