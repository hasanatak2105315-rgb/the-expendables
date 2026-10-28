import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useCart } from '../store/cart'
import { goToSection, navigate } from '../router'

// '#' ile başlayanlar ana sayfadaki bölümler, '/' ile başlayanlar ayrı sayfalar
const LINKS = [
  ['#koleksiyon', 'Koleksiyon'],
  ['/hakkimizda', 'Hakkımızda'],
  ['/sss', 'SSS'],
  ['/iletisim', 'İletişim']
]

// Logo: 3D yazıcıdan çıkmış gibi katman katman üst üste binen E.
// Arkadaki katman kayısı, öndeki turkuaz. favicon.svg ve paylaşım görseli de aynı çizimi kullanır
const E = 'M20 16H92V36H44V50H82V68H44V82H92V102H20Z'
const LAYERS = [
  [16, '#7a3f12'],
  [14, '#a8581d'],
  [12, '#d97f33'],
  [10, '#ffb86b'],
  [8, '#c9a77a'],
  [6, '#5fb7b8'],
  [4, '#14b8c6'],
  [2, '#22c9d6'],
  [0, '#2fd8e6']
]

// animated: katmanlar alttan üste doğru tek tek "basılır" (açılış ekranı)
export function EMark({ className, animated = false }) {
  return (
    <svg className={className} viewBox="16 12 96 108" aria-hidden="true">
      {LAYERS.map(([d, fill], i) => (
        <motion.g
          key={d}
          initial={animated ? { opacity: 0, y: -10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 + i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <path d={E} transform={`translate(${d} ${d})`} fill={fill} stroke={d && d < 16 ? '#03171c' : 'none'} strokeWidth="0.7" />
        </motion.g>
      ))}
      <path d="M26 22H86" stroke="#ecfdff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="logo">
      <EMark />
      <span className="logo__text">
        <small>THE</small>
        EXPENDABLES
      </span>
    </span>
  )
}

export default function Navbar() {
  const { count, setOpen } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (to) => {
    setMenu(false)
    to.startsWith('#') ? goToSection(to.slice(1)) : navigate(to)
  }

  return (
    <motion.header
      className={`nav ${scrolled ? 'nav--solid' : ''} ${menu ? 'nav--open' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container nav__inner">
        <a href="/" aria-label="Ana sayfa" onClick={(e) => { e.preventDefault(); setMenu(false); navigate('/') }}>
          <Logo />
        </a>
        <nav className="nav__links">
          {LINKS.map(([to, label]) => (
            <button key={to} onClick={() => go(to)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="nav__actions">
          <button className="cart-btn" onClick={() => setOpen(true)} aria-label="Sepeti aç">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 7h12l-1 13H7L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span>Sepet</span>
            <motion.b key={count} initial={{ scale: 1.6 }} animate={{ scale: 1 }}>
              {count}
            </motion.b>
          </button>
          <button className="burger" onClick={() => setMenu((m) => !m)} aria-label="Menü">
            <i />
            <i />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
