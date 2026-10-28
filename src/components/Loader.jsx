import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { EMark } from './Navbar'

const TITLE = 'THE EXPENDABLES'

// Açılış ekranı: katman katman basılan E, harf harf beliren marka adı ve sayaç; sonra perde gibi yukarı kalkar
export default function Loader({ onDone }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const dur = 1100
    let id
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) id = requestAnimationFrame(tick)
      else setTimeout(onDone, 120)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [onDone])

  return (
    <motion.div
      className="loader"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
    >
      <EMark className="loader__mark" animated />
      <div className="loader__title" aria-label={TITLE}>
        {TITLE.split('').map((c, i) => (
          <motion.span
            key={i}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08 + i * 0.022, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {c === ' ' ? ' ' : c}
          </motion.span>
        ))}
      </div>
      <div className="loader__bar">
        <span style={{ transform: `scaleX(${n / 100})` }} />
      </div>
      <div className="loader__meta">
        <span>KOLEKSİYON YÜKLENİYOR</span>
        <span className="loader__count">{String(n).padStart(3, '0')}</span>
      </div>
    </motion.div>
  )
}
