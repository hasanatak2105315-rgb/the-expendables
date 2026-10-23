import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS } from '../data/products'

const CartContext = createContext(null)
const KEY = 'tx-cart'

const load = () => {
  try {
    const items = JSON.parse(localStorage.getItem(KEY)) ?? []
    return items.filter((i) => PRODUCTS.some((p) => p.id === i.id))
  } catch {
    return []
  }
}

export const FREE_SHIPPING = 1500
export const SHIPPING_FEE = 79

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const value = useMemo(() => {
    const lines = items.map((i) => ({ ...i, product: PRODUCTS.find((p) => p.id === i.id) }))
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0)
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE
    return {
      lines,
      open,
      toast,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      setOpen,
      add(id, qty = 1) {
        setItems((prev) => {
          const found = prev.find((i) => i.id === id)
          return found ? prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i)) : [...prev, { id, qty }]
        })
        setToast(`${PRODUCTS.find((p) => p.id === id).name} sepete eklendi`)
      },
      setQty(id, qty) {
        setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))))
      },
      clear: () => setItems([])
    }
  }, [items, open, toast])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
