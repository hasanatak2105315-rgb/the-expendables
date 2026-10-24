import { lazy, Suspense } from 'react'
import { motion } from 'motion/react'
import { scrollToId } from '../scroll'

const HeroScene = lazy(() => import('../three/HeroScene'))

const ease = [0.22, 1, 0.36, 1]

function Line({ children, delay, ready }) {
  return (
    <span className="reveal-line">
      <motion.span initial={{ y: '105%' }} animate={ready ? { y: 0 } : {}} transition={{ delay, duration: 1.1, ease }}>
        {children}
      </motion.span>
    </span>
  )
}

export default function Hero({ ready }) {
  const d = 0.2
  return (
    <section className="hero">
      <div className="hero__canvas" role="img" aria-label="Işık altında dönen, zümrüt taşlı altın yüzük">
        <Suspense fallback={<div className="stage-loader" aria-hidden="true" />}>
          <HeroScene />
        </Suspense>
      </div>
      <div className="hero__shade" />

      <div className="container hero__content">
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: d, duration: 1 }}>
          <span className="dot" /> Sezon 01 — El Yapımı Koleksiyon
        </motion.p>
        <h1 className="hero__title">
          <Line ready={ready} delay={d + 0.1}>Işıltı</Line>
          <Line ready={ready} delay={d + 0.22}>
            <em>bir detay</em> değil,
          </Line>
          <Line ready={ready} delay={d + 0.34}>bir imza.</Line>
        </h1>
        <motion.p
          className="hero__lead"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: d + 0.6, duration: 1, ease }}
        >
          El işçiliğiyle hazırlanan takılar ve katman katman basılan 3D tasarımlar. Her parça sana özel, özenle üretiliyor.
        </motion.p>
        <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: d + 0.75, duration: 1, ease }}
        >
          <button className="btn btn--primary" onClick={() => scrollToId('koleksiyon')}>
            Koleksiyonu Keşfet
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
          <button className="btn btn--ghost" onClick={() => scrollToId('hikaye')}>
            Hikâyemiz
          </button>
        </motion.div>
      </div>

      <motion.div className="hero__meta container" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: d + 1, duration: 1 }}>
        <div>
          <small>Öne çıkan</small>
          <strong>Zümrüt Yüzük</strong>
        </div>
        <div className="scroll-hint">
          <span />
          Kaydır
        </div>
        <div className="hero__coords">
          <small>Atölye</small>
          <strong>41.0082° N, 28.9784° E</strong>
        </div>
      </motion.div>
    </section>
  )
}
