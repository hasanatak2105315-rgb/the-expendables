import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Logo } from './Navbar'
import { scrollToId } from '../scroll'

const ease = [0.22, 1, 0.36, 1]

export function Marquee() {
  const items = ['Ücretsiz kargo 1.500 ₺ üzeri', 'Sahada test edildi', '2 yıl garanti', '30 gün koşulsuz iade', 'Sınırlı üretim']
  const row = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((k) => (
          <div key={k} className="marquee__group">
            {row.map((t, i) => (
              <span key={i}>
                {t} <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  const color = useTransform(progress, range, ['#cfe9da', '#eafff3'])
  return (
    <motion.span style={{ opacity, color }} className="word">
      {children}{' '}
    </motion.span>
  )
}

// Kaydırdıkça kelime kelime aydınlanan manifesto
export function Story() {
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.55'] })
  const text =
    'Biz trendleri takip etmeyiz. Zor koşullarda çalışan, yıllarca dayanan ve sana hiçbir zaman ihanet etmeyen ekipmanlar üretiriz. Her dikiş, her vida ve her kadran tek bir görev için var: Sen görevini tamamlarken yanında olmak.'
  const words = text.split(' ')
  return (
    <section className="section story" id="hikaye">
      <div className="container">
        <p className="eyebrow">
          <span className="dot" /> Manifesto
        </p>
        <p ref={ref} className="story__text">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </p>
        <div className="stats">
          {[
            ['MIL-STD', '810H dayanıklılık testi'],
            ['45K+', 'Birlik üyesi'],
            ['4.9/5', 'Müşteri puanı'],
            ['24 SA', 'İçinde kargoda']
          ].map(([a, b], i) => (
            <motion.div
              key={a}
              className="stat"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.9, ease }}
            >
              <strong>{a}</strong>
              <span>{b}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FEATURES = [
  {
    title: 'Hızlı Teslimat',
    text: '24 saat içinde kargoda. 1.500 ₺ üzeri siparişlerde kargo bizden.',
    icon: <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
  },
  {
    title: '2 Yıl Garanti',
    text: 'Tüm ürünlerde üretici garantisi. Sorun olursa yenisiyle değiştiriyoruz.',
    icon: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3ZM9 12l2 2 4-4" />
  },
  {
    title: 'Güvenli Ödeme',
    text: '256-bit SSL ile şifrelenmiş ödeme. Kart bilgilerin bizde saklanmaz.',
    icon: <path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" />
  }
]

export function Features() {
  return (
    <section className="section" id="avantajlar">
      <div className="container">
        <div className="features">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.12, duration: 0.9, ease }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                {f.icon}
              </svg>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BigBanner() {
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-35%'])
  return (
    <section ref={ref} className="banner" aria-hidden="true">
      <motion.div style={{ x }} className="banner__text">
        GÖREV KABUL EDİLDİ — GÖREV KABUL EDİLDİ —
      </motion.div>
    </section>
  )
}

export function Newsletter() {
  const [sent, setSent] = useState(false)
  return (
    <section className="section" id="iletisim">
      <div className="container">
        <motion.div
          className="newsletter"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
        >
          <p className="eyebrow">
            <span className="dot" /> Birliğe Katıl
          </p>
          <h2 className="display">
            İlk siparişte <em>%10</em> indirim
          </h2>
          <p className="muted">Yeni seriler, sınırlı üretimler ve özel kampanyalar önce birlik üyelerine.</p>
          {sent ? (
            <p className="newsletter__ok">✓ Kaydın alındı. Hoş geldin, asker.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <input type="email" required placeholder="E-posta adresin" aria-label="E-posta" />
              <button className="btn btn--primary" type="submit">
                Katıl
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <Logo />
            <p className="muted">Dayanıklılık için tasarlandı. İstanbul, Türkiye.</p>
          </div>
          <div className="footer__cols">
            <div>
              <h4>Mağaza</h4>
              <button onClick={() => scrollToId('koleksiyon')}>Koleksiyon</button>
              <button onClick={() => scrollToId('koleksiyon')}>Yeni gelenler</button>
              <button onClick={() => scrollToId('koleksiyon')}>Çok satanlar</button>
            </div>
            <div>
              <h4>Yardım</h4>
              <a href="#">Kargo ve teslimat</a>
              <a href="#">İade ve değişim</a>
              <a href="#">Sıkça sorulanlar</a>
            </div>
            <div>
              <h4>İletişim</h4>
              <a href="mailto:destek@theexpendables.com.tr">destek@theexpendables.com.tr</a>
              <a href="#">Instagram</a>
              <a href="#">YouTube</a>
            </div>
          </div>
        </div>
        <div className="footer__giant" aria-hidden="true">
          EXPENDABLES
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} The Expendables. Tüm hakları saklıdır.</span>
          <span>KVKK · Mesafeli Satış Sözleşmesi · Çerez Politikası</span>
        </div>
      </div>
    </footer>
  )
}
