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
- `src/store/cart.jsx`: sepet (localStorage), kargo ücreti ve ücretsiz kargo sınırı

## Yapılanlar

- Site kuruldu, yuvarlak özel fare imleci kaldırıldı
- Ürünler taktik ekipmandan takı ve 3D baskıya çevrildi

## Sıradaki işler

1. Metinleri takı ve 3D baskıya uygun hâle getir. Giriş başlığı, alt yazı, "Sezon 01 — Operasyon Serisi", kayan şerit, manifesto, istatistikler (MIL-STD vb.), "Görev kabul edildi" bandı, avantajlar, bülten ve alt bilgi hâlâ eski taktik temada.
2. Hakkımızda, İletişim, SSS, iade ve KVKK sayfaları
3. Yayına alma (Vercel veya Netlify)

## Notlar

- Ödeme formu demodur, gerçek ödeme almaz.
- "The Expendables" bilinen bir film serisinin adı. Kullanıcıya marka tescilini kontrol ettirmesi önerildi.
