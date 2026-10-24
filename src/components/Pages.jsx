import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { SITE, owner } from '../data/site'
import { FREE_SHIPPING, SHIPPING_FEE } from '../store/cart'
import { formatPrice } from '../data/products'
import { Link } from '../router'

const ease = [0.22, 1, 0.36, 1]

const Reveal = ({ children, delay = 0, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ delay, duration: 0.9, ease }}
  >
    {children}
  </motion.div>
)

// Tüm alt sayfaların ortak başlığı
function Page({ eyebrow, title, intro, docTitle, children }) {
  useEffect(() => {
    document.title = `${docTitle} — ${SITE.name}`
  }, [docTitle])
  return (
    <section className="page">
      <div className="container">
        <motion.header className="page__head" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
          <p className="eyebrow">
            <span className="dot" /> {eyebrow}
          </p>
          <h1 className="display">{title}</h1>
          {intro && <p className="page__intro muted">{intro}</p>}
        </motion.header>
        {children}
      </div>
    </section>
  )
}

/* ---------------- Hakkımızda ---------------- */

const VALUES = [
  ['El İşçiliği', 'Takılarımızı tek tek elde şekillendirip cilalıyoruz. Her parçada küçük farklar olması, onun el yapımı olduğunun işareti.'],
  ['Katman Katman', '3D baskı tasarımlarımızı biyobozunur PLA ile, ince katmanlar hâlinde basıyor ve son işlemlerini elle yapıyoruz.'],
  ['Sana Özel', 'İsim, tarih, logo ya da kendi çizimin. Aklındaki fikri birlikte tasarlayıp gerçeğe dönüştürüyoruz.']
]

const STEPS = [
  ['Tasarım', 'Fikir eskizden dijital modele dönüşür.'],
  ['Üretim', 'Takı atölyede şekillenir, tasarım yazıcıda basılır.'],
  ['Son Dokunuş', 'Zımpara, cila ve kalite kontrolü elle yapılır.'],
  ['Paketleme', 'Her sipariş hediye kutusunda yola çıkar.']
]

export function About() {
  return (
    <Page
      docTitle="Hakkımızda"
      eyebrow="Hakkımızda"
      title={<>Küçük bir atölye, <em>büyük bir özen</em></>}
      intro="The Expendables, el yapımı takılar ile 3D baskı tasarımları aynı çatı altında buluşturan İstanbul merkezli bir atölye. Seri üretim yerine, her parçaya ayrı ayrı zaman ayırmayı seçiyoruz."
    >
      <div className="values">
        {VALUES.map(([t, d], i) => (
          <Reveal key={t} className="feature" delay={i * 0.1}>
            <span className="values__no">0{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="page__block">
        <h2 className="display page__h2">Bir parça nasıl doğar?</h2>
        <ol className="steps">
          {STEPS.map(([t, d]) => (
            <li key={t}>
              <strong>{t}</strong>
              <span className="muted">{d}</span>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="page__cta">
        <p className="muted">Aklında sana özel bir tasarım mı var?</p>
        <div className="hero__cta">
          <Link className="btn btn--primary" to="/iletisim">Bize Yaz</Link>
          <Link className="btn btn--ghost" to="/">Koleksiyona Dön</Link>
        </div>
      </Reveal>
    </Page>
  )
}

/* ---------------- İletişim ---------------- */

const TOPICS = ['Sipariş ve kargo', 'Kişiye özel tasarım', 'İade ve değişim', 'Diğer']

function validate(f) {
  const e = {}
  if (f.name.trim().length < 2) e.name = 'Lütfen adını yaz.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Geçerli bir e-posta adresi yaz.'
  if (f.message.trim().length < 10) e.message = 'Mesajın en az 10 karakter olmalı.'
  return e
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return
    // Sunucu olmadığı için mesaj, ziyaretçinin e-posta uygulamasında hazır açılır
    const body = `${form.message}\n\n${form.name} — ${form.email}`
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`${form.topic} — ${form.name}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const field = (k, label, input) => (
    <label className={`field ${errors[k] ? 'field--error' : ''}`}>
      <span>{label}</span>
      {input}
      {errors[k] && <small role="alert">{errors[k]}</small>}
    </label>
  )

  return (
    <Page
      docTitle="İletişim"
      eyebrow="İletişim"
      title={<>Bize <em>ulaş</em></>}
      intro="Siparişin, kişiye özel bir tasarım fikrin ya da aklına takılan bir soru mu var? Yaz, en geç bir iş günü içinde dönelim."
    >
      <div className="contact">
        <Reveal className="contact__info">
          <div>
            <small>E-posta</small>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
          {SITE.phone && (
            <div>
              <small>Telefon</small>
              <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a>
            </div>
          )}
          <div>
            <small>Atölye</small>
            <span>{SITE.address}</span>
          </div>
          <div>
            <small>Çalışma saatleri</small>
            <span>{SITE.hours}</span>
          </div>
          <div>
            <small>Sosyal medya</small>
            <a href={SITE.instagram}>Instagram</a>
          </div>
          <p className="muted">
            Sık sorulan sorulara <Link to="/sss">SSS sayfamızdan</Link> hemen ulaşabilirsin.
          </p>
        </Reveal>

        <Reveal className="contact__form" delay={0.1}>
          {sent ? (
            <div className="contact__done">
              <div className="done-mark">✓</div>
              <h2 className="display">Mesajın hazır</h2>
              <p className="muted">
                E-posta uygulaman mesajınla birlikte açıldı, göndermeyi unutma. Açılmadıysa doğrudan{' '}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a> adresine yazabilirsin.
              </p>
              <button className="btn btn--ghost" onClick={() => setSent(false)}>
                Yeni mesaj
              </button>
            </div>
          ) : (
            <form className="checkout" onSubmit={submit} noValidate>
              {field('name', 'Ad soyad', <input value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />)}
              {field('email', 'E-posta', <input type="email" value={form.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} />)}
              {field(
                'topic',
                'Konu',
                <select value={form.topic} onChange={set('topic')}>
                  {TOPICS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              )}
              {field('message', 'Mesajın', <textarea rows={6} value={form.message} onChange={set('message')} aria-invalid={!!errors.message} />)}
              <button className="btn btn--primary btn--block" type="submit">
                Mesajı Gönder
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </Page>
  )
}

/* ---------------- SSS ---------------- */

const FAQ = [
  {
    group: 'Sipariş ve kargo',
    items: [
      ['Siparişim ne zaman kargoya verilir?', 'Stoktaki ürünler 1–3 iş günü içinde kargoya verilir. Kişiye özel siparişler tasarım onayından sonra 5–7 iş günü içinde hazırlanır. Kargoya verildiğinde takip numarası e-postana gelir.'],
      ['Kargo ücreti ne kadar?', `${formatPrice(FREE_SHIPPING)} ve üzeri siparişlerde kargo ücretsizdir. Altındaki siparişler için kargo ücreti ${formatPrice(SHIPPING_FEE)}’dir.`],
      ['Hediye paketi yapıyor musunuz?', 'Evet. Tüm siparişler ücretsiz olarak hediye kutusunda gönderilir. İstersen siparişe not yazarak kutuya el yazısı bir kart ekleyebiliriz.']
    ]
  },
  {
    group: 'Ürünler',
    items: [
      ['Takılarınız hangi malzemeden yapılıyor?', 'Takılarımızın çoğu 925 ayar gümüş üzerine altın kaplamadır. Her ürünün malzemesi, ürün detayındaki özellikler bölümünde yazar.'],
      ['Gümüş takılar kararır mı?', 'Gümüş zamanla hava ile temas edip kararabilir. Takını parfüm, deniz ve havuz suyundan uzak tutup kutusunda saklarsan ışıltısı çok daha uzun sürer. Yumuşak bir bezle silmek yeterlidir.'],
      ['3D baskı ürünler dayanıklı mı?', 'Tasarımlarımızı PLA ile basıyoruz. İç mekânda uzun yıllar kullanılabilir. Doğrudan güneş altında ve 50°C üzeri sıcakta bırakılmamalı, bulaşık makinesine konmamalıdır.'],
      ['Yüzük ölçümü nasıl bilebilirim?', 'Mevcut bir yüzüğünün iç çapını milimetre olarak ölçüp bize yazman yeterli. Emin değilsen iletişim sayfasından ulaş, birlikte doğru ölçüyü bulalım.']
    ]
  },
  {
    group: 'Kişiye özel',
    items: [
      ['Kişiye özel sipariş nasıl veriyorum?', 'Ürünü sepete ekledikten sonra iletişim sayfasından bize isim, tarih ya da tasarım fikrini yaz. Üretime başlamadan önce sana bir önizleme gönderip onayını alıyoruz.'],
      ['Kendi tasarımımı bastırabilir miyim?', 'Evet. Çizimini, fotoğrafını ya da 3D modelini (STL) gönderebilirsin. Basılabilirliğini kontrol edip fiyat ve süre bilgisi veriyoruz.']
    ]
  },
  {
    group: 'Ödeme ve iade',
    items: [
      ['Ödeme güvenli mi?', 'Ödemeler 256-bit SSL ile şifrelenir ve kart bilgilerin bizim sistemimizde saklanmaz.'],
      ['İade edebilir miyim?', 'Evet, ürünü teslim aldığın günden itibaren 30 gün içinde iade edebilirsin. Kişiye özel ürünler ve hijyen nedeniyle ambalajı açılmış küpeler iade edilemez.']
    ]
  }
]

export function Faq() {
  return (
    <Page
      docTitle="Sıkça Sorulan Sorular"
      eyebrow="Yardım"
      title={<>Sıkça sorulan <em>sorular</em></>}
      intro="Aradığın cevabı bulamazsan bize yazman yeterli."
    >
      <div className="faq">
        {FAQ.map((g) => (
          <Reveal key={g.group} className="faq__group">
            <h2>{g.group}</h2>
            {g.items.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p className="muted">{a}</p>
              </details>
            ))}
          </Reveal>
        ))}
      </div>
      <Reveal className="page__cta">
        <p className="muted">İade koşullarının tamamı için:</p>
        <div className="hero__cta">
          <Link className="btn btn--ghost" to="/iade">İade ve Değişim</Link>
          <Link className="btn btn--primary" to="/iletisim">Bize Yaz</Link>
        </div>
      </Reveal>
    </Page>
  )
}

/* ---------------- İade ve değişim ---------------- */

export function Returns() {
  return (
    <Page
      docTitle="İade ve Değişim"
      eyebrow="Yardım"
      title={<>İade ve <em>değişim</em></>}
      intro="Aldığın üründen memnun kalmazsan, teslim aldığın günden itibaren 30 gün içinde iade edebilirsin."
    >
      <div className="prose">
        <h2>İade süresi</h2>
        <p>
          Ürünü teslim aldığın tarihten itibaren <strong>30 gün</strong> içinde, herhangi bir gerekçe göstermeden iade edebilirsin. Bu süre, yasal 14 günlük cayma
          hakkından daha uzundur.
        </p>

        <h2>İade nasıl yapılır?</h2>
        <ol>
          <li>
            <Link to="/iletisim">İletişim sayfasından</Link> ya da <a href={`mailto:${SITE.email}`}>{SITE.email}</a> adresinden sipariş numaranla birlikte bize yaz.
          </li>
          <li>Sana anlaşmalı kargo firmasının iade kodunu gönderelim.</li>
          <li>Ürünü orijinal kutusu ve faturasıyla birlikte paketleyip kargoya ver.</li>
          <li>Ürün bize ulaşıp kontrol edildikten sonra ücretin en geç 14 gün içinde ödeme yaptığın karta iade edilir.</li>
        </ol>

        <h2>İade edilemeyen ürünler</h2>
        <ul>
          <li>İsim, tarih, logo ya da sana özel tasarımla üretilen kişiye özel ürünler</li>
          <li>Hijyen nedeniyle ambalajı açılmış küpeler</li>
          <li>Kullanılmış, zarar görmüş ya da orijinal kutusu olmayan ürünler</li>
        </ul>

        <h2>Değişim</h2>
        <p>
          Yüzük ölçüsü ya da renk değişimi için aynı adımları izleyebilirsin. Değişim talebinde yeni ürünün kargo ücreti bizden. Kişiye özel ürünlerde değişim
          yapılamaz.
        </p>

        <h2>Hasarlı ya da hatalı ürün</h2>
        <p>
          Ürün sana hasarlı ya da hatalı ulaştıysa, teslimattan sonraki 3 gün içinde fotoğrafıyla birlikte bize yaz. Kişiye özel ürünler dahil, hatalı tüm ürünleri
          ücretsiz olarak yeniliyor ya da ücretini iade ediyoruz.
        </p>
      </div>
    </Page>
  )
}

/* ---------------- KVKK ---------------- */

export function Kvkk() {
  return (
    <Page
      docTitle="KVKK Aydınlatma Metni"
      eyebrow="Yasal"
      title={<>KVKK <em>aydınlatma metni</em></>}
      intro="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinin nasıl işlendiğini aşağıda açıklıyoruz."
    >
      <div className="prose">
        <h2>Veri sorumlusu</h2>
        <p>
          Kişisel verilerin, veri sorumlusu sıfatıyla <strong>{owner()}</strong> ({SITE.address}) tarafından işlenmektedir.
        </p>

        <h2>İşlenen kişisel veriler</h2>
        <ul>
          <li><strong>Kimlik:</strong> ad, soyad</li>
          <li><strong>İletişim:</strong> e-posta adresi, telefon numarası, teslimat adresi</li>
          <li><strong>Müşteri işlem:</strong> sipariş bilgileri, talep ve şikâyetler</li>
          <li><strong>İşlem güvenliği:</strong> IP adresi, tarayıcı ve çerez bilgileri</li>
          <li><strong>Pazarlama:</strong> bülten aboneliği için e-posta adresi (yalnızca izin verirsen)</li>
        </ul>
        <p>Kart bilgilerin tarafımızca saklanmaz; ödeme işlemleri lisanslı ödeme kuruluşu üzerinden yapılır.</p>

        <h2>İşleme amaçları</h2>
        <ul>
          <li>Siparişlerinin alınması, hazırlanması, teslim edilmesi ve faturalandırılması</li>
          <li>İade, değişim ve müşteri hizmetleri taleplerinin yanıtlanması</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          <li>Site güvenliğinin sağlanması</li>
          <li>İzin vermen hâlinde kampanya ve yeni ürün duyurularının gönderilmesi</li>
        </ul>

        <h2>Hukuki sebepler ve toplama yöntemi</h2>
        <p>
          Kişisel verilerin; internet sitemizdeki sipariş, iletişim ve bülten formları ile çerezler aracılığıyla elektronik ortamda toplanır. Bu veriler KVKK’nın 5.
          maddesindeki sözleşmenin kurulması ve ifası, hukuki yükümlülüğün yerine getirilmesi ve meşru menfaat hukuki sebeplerine; bülten ve pazarlama iletileri
          için ise açık rızana dayanılarak işlenir.
        </p>

        <h2>Aktarım</h2>
        <p>
          Kişisel verilerin yalnızca yukarıdaki amaçlarla sınırlı olarak; kargo firmalarına, ödeme kuruluşlarına, barındırma ve e-posta hizmeti sağlayıcılarına ve
          talep hâlinde yetkili kamu kurumlarına aktarılabilir.
        </p>

        <h2>Haklarınız</h2>
        <p>KVKK’nın 11. maddesi uyarınca;</p>
        <ul>
          <li>Kişisel verilerinin işlenip işlenmediğini öğrenme ve bilgi talep etme,</li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
          <li>Eksik veya yanlış işlenmişse düzeltilmesini, şartları oluştuğunda silinmesini isteme,</li>
          <li>Otomatik sistemlerle analiz sonucu aleyhine bir sonuç çıkmasına itiraz etme,</li>
          <li>Kanuna aykırı işleme nedeniyle zarara uğradıysan zararın giderilmesini talep etme</li>
        </ul>
        <p>
          haklarına sahipsin. Taleplerini <a href={`mailto:${SITE.email}`}>{SITE.email}</a> adresine yazılı olarak iletebilirsin. Başvurun en geç 30 gün içinde
          ücretsiz olarak sonuçlandırılır.
        </p>

        <h2 id="cerez">Çerezler</h2>
        <p>
          Sitemiz, sepetinin hatırlanması gibi temel işlevler için tarayıcında küçük veriler saklar. Bu veriler zorunlu işlevler içindir ve tarayıcı ayarlarından
          dilediğin zaman silinebilir.
        </p>
      </div>
    </Page>
  )
}

/* ---------------- 404 ---------------- */

export function NotFound() {
  return (
    <Page docTitle="Sayfa bulunamadı" eyebrow="404" title={<>Bu sayfa <em>kayıp</em></>} intro="Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.">
      <div className="hero__cta">
        <Link className="btn btn--primary" to="/">Ana Sayfaya Dön</Link>
        <Link className="btn btn--ghost" to="/iletisim">Bize Yaz</Link>
      </div>
    </Page>
  )
}
