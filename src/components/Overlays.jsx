import { Suspense, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useCart, FREE_SHIPPING } from '../store/cart'
import { formatPrice } from '../data/products'
import { lockScroll } from '../scroll'
import { ProductStage } from '../three/ProductViews'

const ease = [0.22, 1, 0.36, 1]

function useEscape(active, fn) {
  useEffect(() => {
    if (!active) return
    lockScroll(true)
    const onKey = (e) => e.key === 'Escape' && fn()
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [active, fn])
}

export function ProductModal({ product, onClose }) {
  const { add, setOpen } = useCart()
  const [qty, setQty] = useState(1)
  useEscape(!!product, onClose)
  useEffect(() => setQty(1), [product])

  return (
    <AnimatePresence>
      {product && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="modal__box"
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.6, ease }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
          >
            <button className="icon-btn modal__close" onClick={onClose} aria-label="Kapat">
              ✕
            </button>
            <div className="modal__stage">
              <Suspense fallback={null}>
                <ProductStage model={product.model} />
              </Suspense>
              <span className="modal__hint">Döndürmek için sürükle</span>
            </div>
            <div className="modal__info">
              <small className="eyebrow">
                <span className="dot" /> {product.category}
              </small>
              <h2 className="display">{product.name}</h2>
              <div className="rating">★★★★★ <span>{product.rating} · 120+ değerlendirme</span></div>
              <div className="price price--lg">
                {formatPrice(product.price)}
                {product.oldPrice && <s>{formatPrice(product.oldPrice)}</s>}
              </div>
              <p className="muted">{product.desc}</p>
              <ul className="specs">
                {product.specs.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <div className="modal__buy">
                <div className="qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Azalt">−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} aria-label="Artır">+</button>
                </div>
                <button
                  className="btn btn--primary btn--grow"
                  onClick={() => {
                    add(product.id, qty)
                    onClose()
                    setOpen(true)
                  }}
                >
                  Sepete Ekle · {formatPrice(product.price * qty)}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, shipping, total, setQty, clear } = useCart()
  const [step, setStep] = useState('cart')
  const [orderNo, setOrderNo] = useState('')
  const close = () => setOpen(false)
  useEscape(open, close)
  useEffect(() => {
    if (open && step === 'done') setStep('cart')
  }, [open])

  const left = FREE_SHIPPING - subtotal

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside
            className="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease }}
            aria-label="Sepet"
          >
            <div className="drawer__head">
              <h3 className="display">{step === 'checkout' ? 'Ödeme' : 'Sepetin'}</h3>
              <button className="icon-btn" onClick={close} aria-label="Kapat">
                ✕
              </button>
            </div>

            {step === 'done' ? (
              <div className="drawer__done">
                <div className="done-mark">✓</div>
                <h3 className="display">Teşekkürler!</h3>
                <p className="muted">
                  Siparişin alındı. Sipariş numaran: <strong>{orderNo}</strong>
                </p>
                <button className="btn btn--primary" onClick={close}>
                  Alışverişe devam et
                </button>
              </div>
            ) : step === 'checkout' ? (
              <form
                className="checkout"
                onSubmit={(e) => {
                  e.preventDefault()
                  setOrderNo('EX-' + Math.floor(100000 + Math.random() * 900000))
                  clear()
                  setStep('done')
                }}
              >
                <div className="row">
                  <input required placeholder="Ad" />
                  <input required placeholder="Soyad" />
                </div>
                <input required type="email" placeholder="E-posta" />
                <input required type="tel" placeholder="Telefon" />
                <textarea required rows={2} placeholder="Teslimat adresi" />
                <input required placeholder="Kart numarası" inputMode="numeric" maxLength={19} />
                <div className="row">
                  <input required placeholder="AA/YY" maxLength={5} />
                  <input required placeholder="CVC" maxLength={4} inputMode="numeric" />
                </div>
                <p className="note">Bu bir demo ödeme formudur, gerçek ödeme alınmaz.</p>
                <div className="totals">
                  <div className="grand">
                    <span>Toplam</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <button className="btn btn--primary btn--block" type="submit">
                  Siparişi Onayla
                </button>
                <button type="button" className="btn btn--ghost btn--block" onClick={() => setStep('cart')}>
                  Sepete dön
                </button>
              </form>
            ) : (
              <>
                <div className="drawer__body">
                  {lines.length === 0 ? (
                    <div className="empty">
                      <p className="display">Sepetin boş</p>
                      <p className="muted">Koleksiyona göz at ve sana uygun parçayı seç.</p>
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {lines.map((l) => (
                        <motion.div
                          key={l.id}
                          className="line"
                          layout
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                        >
                          <div className="line__thumb">
                            {l.product.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                          </div>
                          <div className="line__info">
                            <strong>{l.product.name}</strong>
                            <span className="muted">{formatPrice(l.product.price)}</span>
                            <div className="qty qty--sm">
                              <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Azalt">−</button>
                              <span>{l.qty}</span>
                              <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Artır">+</button>
                            </div>
                          </div>
                          <button className="line__remove" onClick={() => setQty(l.id, 0)}>
                            Kaldır
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
                <div className="drawer__foot">
                  {subtotal > 0 && (
                    <div className="ship">
                      <div className="ship__bar">
                        <span style={{ transform: `scaleX(${Math.min(subtotal / FREE_SHIPPING, 1)})` }} />
                      </div>
                      <small className="muted">
                        {left > 0 ? `Ücretsiz kargo için ${formatPrice(left)} daha ekle` : 'Kargo bizden 🎉'}
                      </small>
                    </div>
                  )}
                  <div className="totals">
                    <div>
                      <span>Ara toplam</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div>
                      <span>Kargo</span>
                      <span>{shipping ? formatPrice(shipping) : 'Ücretsiz'}</span>
                    </div>
                    <div className="grand">
                      <span>Toplam</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  <button className="btn btn--primary btn--block" disabled={!lines.length} onClick={() => setStep('checkout')}>
                    Ödemeye Geç
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export function Toast() {
  const { toast } = useCart()
  return (
    <AnimatePresence>
      {toast && (
        <motion.div className="toast" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
          <span className="dot" /> {toast}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
