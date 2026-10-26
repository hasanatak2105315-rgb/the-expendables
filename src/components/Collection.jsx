import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CATEGORIES, PRODUCTS, formatPrice } from '../data/products'
import { useCart } from '../store/cart'
import { setTryOn, useTryOn } from '../store/tryon'

const CardView = lazy(() => import('../three/ProductViews').then((m) => ({ default: m.CardView })))
const MannequinView = lazy(() => import('../three/ProductViews').then((m) => ({ default: m.MannequinView })))

// Manken yalnızca fareli, geniş ekranlarda gösterilir (dokunmatikte "üzerine gelme" yok)
const WIDE = '(min-width: 1025px) and (hover: hover)'
function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches)
  useEffect(() => {
    const mq = window.matchMedia(WIDE)
    const onChange = () => setWide(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return wide
}

// Ürünlerin yanında ekranla birlikte kayan sanal prova alanı
function TryOn() {
  const product = useTryOn()
  return (
    <aside className="tryon" role="img" aria-label={product ? `Mankenin üzerinde ${product.name}` : 'Vitrin mankeni'}>
      <Suspense fallback={<div className="stage-loader" aria-hidden="true" />}>
        <MannequinView className="tryon__view" />
      </Suspense>
      <p className="eyebrow tryon__label">
        <span className="dot" /> Sanal prova
      </p>
      <div className="tryon__info">
        <AnimatePresence mode="wait">
          <motion.div
            key={product?.id ?? 'empty'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            {product ? (
              <>
                <small>{product.category}</small>
                <strong>{product.name}</strong>
                <span className="price">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="tryon__hint">Bir ürünün üzerine gel, mankende gör</span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  )
}

function ProductCard({ product, index, onOpen }) {
  const { add } = useCart()
  const [hovered, setHovered] = useState(false)
  const ref = useRef()

  // Fareye göre hafif 3D eğim
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.setProperty('--rx', `${-y * 6}deg`)
    ref.current.style.setProperty('--ry', `${x * 8}deg`)
    ref.current.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
    ref.current.style.setProperty('--my', `${(y + 0.5) * 100}%`)
  }
  const onLeave = () => {
    setHovered(false)
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }

  return (
    <motion.article
      layout
      ref={ref}
      className="card"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => {
        setHovered(true)
        setTryOn(product)
      }}
      onFocus={() => setTryOn(product)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <button className="card__stage" onClick={() => onOpen(product)} aria-label={`${product.name} detay`}>
        <span className="card__index">{String(index + 1).padStart(2, '0')}</span>
        {product.tag && <span className="card__tag">{product.tag}</span>}
        <Suspense fallback={<div className="stage-loader" aria-hidden="true" />}>
          <CardView className="card__view" model={product.model} hovered={hovered} />
        </Suspense>
        <span className="card__look">İncele</span>
      </button>
      <div className="card__body">
        <div>
          <small>{product.category}</small>
          <h3>{product.name}</h3>
          <div className="price">
            {formatPrice(product.price)}
            {product.oldPrice && <s>{formatPrice(product.oldPrice)}</s>}
          </div>
        </div>
        <button className="add-btn" onClick={() => add(product.id)} aria-label="Sepete ekle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </motion.article>
  )
}

export default function Collection({ onOpen }) {
  const [cat, setCat] = useState('Tümü')
  const list = cat === 'Tümü' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)
  const wide = useWide()

  return (
    <section className="section" id="koleksiyon">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">
              <span className="dot" /> Koleksiyon
            </p>
            <h2 className="display">
              Sana özel <em>tasarımlar</em>
            </h2>
          </div>
          <div className="filters">
            {CATEGORIES.map((c) => (
              <button key={c} className={c === cat ? 'active' : ''} onClick={() => setCat(c)}>
                {c === cat && <motion.span layoutId="filter-pill" className="filter-pill" />}
                <span>{c}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={wide ? 'collection collection--tryon' : 'collection'}>
          {wide && <TryOn />}
          <motion.div layout className="grid">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onOpen={onOpen} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
