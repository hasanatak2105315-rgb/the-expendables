import { useSyncExternalStore } from 'react'

// Ziyaretçinin beden ölçüleri: manken bu ölçülere göre şekillenir ve beden önerilir.
// Ölçüler tarayıcıda saklanır. Varsayılanlar mankenin kendi ölçüleridir.

const KEY = 'tx-body'

export const FIELDS = [
  { key: 'height', label: 'Boy', unit: 'cm', min: 150, max: 200, base: 170 },
  { key: 'weight', label: 'Kilo', unit: 'kg', min: 45, max: 120, base: 68 },
  { key: 'chest', label: 'Göğüs', unit: 'cm', min: 80, max: 130, base: 92 },
  { key: 'waist', label: 'Bel', unit: 'cm', min: 60, max: 120, base: 76 },
  { key: 'hip', label: 'Kalça', unit: 'cm', min: 84, max: 130, base: 96 }
]

const DEFAULTS = Object.fromEntries(FIELDS.map((f) => [f.key, f.base]))

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (saved) return { ...DEFAULTS, ...saved, open: false }
  } catch {}
  return { ...DEFAULTS, custom: false, open: false }
}

let state = load()
const subs = new Set()
const emit = () => subs.forEach((fn) => fn())

const save = () => {
  try {
    const { open, ...rest } = state
    if (rest.custom) localStorage.setItem(KEY, JSON.stringify(rest))
    else localStorage.removeItem(KEY)
  } catch {}
}

export const getBody = () => state

export function setBody(patch) {
  state = { ...state, ...patch, custom: true }
  save()
  emit()
}

export function resetBody() {
  state = { ...DEFAULTS, custom: false, open: state.open }
  save()
  emit()
}

// Ölçü paneli açık mı (açıkken manken tam boy gösterilir)
export function setBodyOpen(open) {
  state = { ...state, open }
  emit()
}

const subscribe = (fn) => {
  subs.add(fn)
  return () => subs.delete(fn)
}

export const useBody = () => useSyncExternalStore(subscribe, getBody)

// Örnek beden tablosu: üstlerde göğüs, altlarda kalça çevresine göre (cm, üst sınırlar)
const TOPS = [['S', 93], ['M', 100], ['L', 107], ['XL', 114], ['XXL', Infinity]]
const BOTTOMS = [['S', 95], ['M', 101], ['L', 107], ['XL', 113], ['XXL', Infinity]]
const pick = (table, v) => table.find(([, max]) => v <= max)[0]

export const topSize = (b) => pick(TOPS, b.chest)
export const bottomSize = (b) => pick(BOTTOMS, Math.max(b.hip, b.waist + 18))

// Ürün için önerilen beden (ölçü girilmediyse ya da beden yoksa null)
export function recommendedSize(product, b = state) {
  if (!b.custom || !product?.sizes) return null
  return product.model === 'joggers' ? bottomSize(b) : topSize(b)
}
