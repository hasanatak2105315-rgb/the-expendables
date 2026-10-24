import { Suspense, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useCart, FREE_SHIPPING } from '../store/cart'
import { formatPrice } from '../data/products'
import { lockScroll } from '../scroll'
import { ProductStage } from '../three/ProductViews'
import { navigate } from '../router'

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
            <div className="modal__stage" role="img" aria-label={`${product.name} — sürükleyerek döndürülebilen 3D görünüm`}>
              <Suspense fallback={<div className="stage-loader" aria-hidden="true" />}>
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

/* ---------------- Ödeme formu ---------------- */

const digits = (v) => v.replace(/\D/g, '')

function checkoutErrors(f) {
  const e = {}
  if (f.name.trim().length < 2) e.name = 'Adını yaz.'
  if (f.surname.trim().length < 2) e.surname = 'Soyadını yaz.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Geçerli bir e-posta adresi yaz.'
  if (!/^(90)?0?5\d{9}$/.test(digits(f.phone))) e.phone = 'Telefonunu 05xx xxx xx xx şeklinde yaz.'
  if (f.address.trim().length < 15) e.address = 'Mahalle, sokak, no, ilçe ve il ile tam adresini yaz.'
  if (digits(f.card).length !== 16) e.card = 'Kart numarası 16 haneli olmalı.'
  const [mm, yy] = f.exp.split('/').map(Number)
  const now = new Date()
  const expired = 2000 + yy < now.getFullYear() || (2000 + yy === now.getFullYear() && mm < now.getMonth() + 1)
  if (!/^\d{2}\/\d{2}$/.test(f.exp) || mm < 1 || mm > 12) e.exp = 'AA/YY şeklinde yaz.'
  else if (expired) e.exp = 'Kartının süresi dolmuş.'
  if (!/^\d{3,4}$/.test(f.cvc)) e.cvc = '3 ya da 4 haneli olmalı.'
  if (!f.agree) e.agree = 'Devam etmek için sözleşmeleri onaylamalısın.'
  return e
}

function Checkout({ total, onBack, onDone }) {
  const [f, setF] = useState({ name: '', surname: '', email: '', phone: '', address: '', card: '', exp: '', cvc: '', agree: false })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const format = {
    card: (v) => digits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '),
    exp: (v) => digits(v).slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2'),
    cvc: (v) => digits(v).slice(0, 4)
  }
  const set = (k) => (e) => {
    const v = k === 'agree' ? e.target.checked : format[k] ? format[k](e.target.value) : e.target.value
    setF((x) => ({ ...x, [k]: v }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }
  const err = (k) => errors[k] && <small role="alert">{errors[k]}</small>
  const cls = (k) => `field ${errors[k] ? 'field--error' : ''}`
  const input = (k, label, props = {}) => (
    <label className={cls(k)}>
      <span>{label}</span>
      <input value={f[k]} onChange={set(k)} aria-invalid={!!errors[k]} {...props} />
      {err(k)}
    </label>
  )

  const submit = (e) => {
    e.preventDefault()
    const found = checkoutErrors(f)
    setErrors(found)
    if (Object.keys(found).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }
    setBusy(true)
    // Demo: gerçek ödeme yerine kısa bir bekleme
    setTimeout(() => {
      const order = { no: 'EX-' + Math.floor(100000 + Math.random() * 900000), total, email: f.email.trim() }
      try {
        sessionStorage.setItem('last-order', JSON.stringify(order))
      } catch {}
      onDone()
      navigate('/tesekkurler')
    }, 1200)
  }

  return (
    <form className="checkout" onSubmit={submit} noValidate>
      <div className="row">
        {input('name', 'Ad', { name: 'name', autoComplete: 'given-name' })}
        {input('surname', 'Soyad', { name: 'surname', autoComplete: 'family-name' })}
      </div>
      {input('email', 'E-posta', { name: 'email', type: 'email', autoComplete: 'email' })}
      {input('phone', 'Telefon', { name: 'phone', type: 'tel', autoComplete: 'tel', placeholder: '05xx xxx xx xx' })}
      <label className={cls('address')}>
        <span>Teslimat adresi</span>
        <textarea name="address" rows={2} value={f.address} onChange={set('address')} autoComplete="street-address" aria-invalid={!!errors.address} />
        {err('address')}
      </label>
      {input('card', 'Kart numarası', { name: 'card', inputMode: 'numeric', autoComplete: 'cc-number', placeholder: '0000 0000 0000 0000' })}
      <div className="row">
        {input('exp', 'Son kullanma', { name: 'exp', inputMode: 'numeric', autoComplete: 'cc-exp', placeholder: 'AA/YY' })}
        {input('cvc', 'CVC', { name: 'cvc', inputMode: 'numeric', autoComplete: 'cc-csc', placeholder: '123' })}
      </div>
      <label className={`check ${errors.agree ? 'field--error' : ''}`}>
        <input type="checkbox" name="agree" checked={f.agree} onChange={set('agree')} />
        <span>
          <a href="/mesafeli-satis#on-bilgilendirme" target="_blank" rel="noopener">Ön Bilgilendirme Formu</a>’nu ve{' '}
          <a href="/mesafeli-satis" target="_blank" rel="noopener">Mesafeli Satış Sözleşmesi</a>’ni okudum, onaylıyorum.
        </span>
      </label>
      {err('agree')}
      <p className="note">Bu bir demo ödeme formudur, gerçek ödeme alınmaz.</p>
      <div className="totals">
        <div className="grand">
          <span>Toplam</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      <button className="btn btn--primary btn--block" type="submit" disabled={busy} aria-busy={busy}>
        {busy ? <><span className="spinner" aria-hidden="true" /> Ödeme işleniyor…</> : 'Siparişi Onayla'}
      </button>
      <button type="button" className="btn btn--ghost btn--block" onClick={onBack} disabled={busy}>
        Sepete dön
      </button>
    </form>
  )
}

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, shipping, total, setQty, clear } = useCart()
  const [step, setStep] = useState('cart')
  const close = () => setOpen(false)
  useEscape(open, close)
  useEffect(() => {
    if (!open) setStep('cart')
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

            {step === 'checkout' ? (
              <Checkout total={total} onBack={() => setStep('cart')} onDone={() => { clear(); close() }} />
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
