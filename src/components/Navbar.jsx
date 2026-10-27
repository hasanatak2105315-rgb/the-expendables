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

export function Logo() {
  return (
    <span className="logo">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 7h22v4.5H18.3V27h-4.6V11.5H5z" fill="currentColor" />
        <path d="M5 29h22" stroke="var(--accent-2)" strokeWidth="2" />
      </svg>
      THE EXPENDABLES
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
      transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
