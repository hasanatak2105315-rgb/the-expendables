# THE EXPENDABLES

Sinematik 3D e-ticaret sitesi. React, Three.js (React Three Fiber) ve Motion ile yapıldı.

## Kurulum (VS Code)

1. ZIP'i bir klasöre çıkar ve klasörü VS Code ile aç (**File → Open Folder**).
2. Bilgisayarında **Node.js** yoksa https://nodejs.org adresinden **LTS** sürümünü kur.
3. VS Code'da terminali aç (**Terminal → New Terminal**) ve şunları yaz:

```bash
npm install
npm run dev
```

4. Terminalde çıkan adresi (genelde **http://localhost:5173**) tarayıcıda aç.

Dosyaları kaydettikçe site tarayıcıda kendiliğinden yenilenir.

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusunu başlatır |
| `npm run build` | Yayına hazır dosyaları `dist/` klasörüne üretir |
| `npm run preview` | Üretilen siteyi yerelde önizler |

## Neler var

- Açılış animasyonu (sayaç + harf harf beliren logo)
- 3D giriş sahnesi: dönen taktik saat, yörüngede künye ve pusula, yansıyan zemin, parlama (bloom), film greni, vinyet
- Fare ve kaydırmayla hareket eden sinematik kamera
- Yumuşak kaydırma (Lenis)
- 9 ürünün hepsi gerçek zamanlı 3D model. Kartın üstüne gelince hızlanıyor ve büyüyor
- Ürün detay penceresi: modeli fareyle döndürebilirsin
- Kategori filtreleri, kayan şerit, kaydırdıkça aydınlanan manifesto metni
- Sepet (tarayıcıda saklanır), ücretsiz kargo çubuğu, demo ödeme formu
- Telefon ve tablet uyumlu

## Nereden ne değişir

| Ne | Dosya |
|---|---|
| Ürünler, fiyatlar, açıklamalar | `src/data/products.js` |
| Renkler ve yazı tipleri | `src/styles.css` (en üstteki `:root` bölümü) |
| 3D ürün modelleri | `src/three/Models.jsx` |
| Giriş sahnesi (ışık, kamera, efektler) | `src/three/HeroScene.jsx` |
| Sayfa bölümleri ve metinler | `src/components/` |
| Kargo ücreti ve ücretsiz kargo sınırı | `src/store/cart.jsx` |

## Klasör yapısı

```
src/
  App.jsx               → Sayfanın genel düzeni
  styles.css            → Tüm tasarım
  data/products.js      → Ürün listesi
  store/cart.jsx        → Sepet mantığı
  three/                → 3D sahneler ve modeller
  components/           → Menü, giriş, koleksiyon, sepet vb.
```

## Notlar

- Ödeme formu **demodur**, gerçek ödeme almaz. Gerçek satış için iyzico, PayTR veya Stripe entegrasyonu gerekir.
- Yönetim paneli bu sürümde yok (önce site).
- Ürünler kodla çizilmiş 3D modellerdir. Gerçek ürünlerin `.glb` modelleri olursa `useGLTF` ile kolayca değiştirilir.
