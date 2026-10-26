import { useSyncExternalStore } from 'react'

// Mankende gösterilen ürün. Kartın üzerine gelince değişir, fare ayrılınca son ürün kalır.
let current = null
const subs = new Set()

export const getTryOn = () => current

export function setTryOn(product) {
  if (product === current) return
  current = product
  subs.forEach((fn) => fn())
}

const subscribe = (fn) => {
  subs.add(fn)
  return () => subs.delete(fn)
}

export const useTryOn = () => useSyncExternalStore(subscribe, getTryOn)
