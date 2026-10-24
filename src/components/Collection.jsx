import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CATEGORIES, PRODUCTS, formatPrice } from '../data/products'
import { CardView } from '../three/ProductViews'
import { useCart } from '../store/cart'

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
      onMouseEnter={() => setHovered(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <button className="card__stage" onClick={() => onOpen(product)} aria-label={`${product.name} detay`}>
        <span className="card__index">{String(index + 1).padStart(2, '0')}</span>
        {product.tag && <span className="card__tag">{product.tag}</span>}
        <CardView className="card__view" model={product.model} hovered={hovered} />
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

        <motion.div layout className="grid">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onOpen={onOpen} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
