import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Collection from './components/Collection'
import { Marquee, Story, Features, BigBanner, Newsletter, Footer } from './components/Sections'
import { ProductModal, CartDrawer, Toast } from './components/Overlays'
import { ViewsCanvas } from './three/ProductViews'
import { CartProvider } from './store/cart'
import { startSmoothScroll, lockScroll } from './scroll'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => startSmoothScroll(), [])
  useEffect(() => {
    lockScroll(loading)
    if (loading) window.scrollTo(0, 0)
  }, [loading])

  const done = useCallback(() => setLoading(false), [])
  const closeModal = useCallback(() => setSelected(null), [])

  return (
    <CartProvider>
      <AnimatePresence>{loading && <Loader onDone={done} />}</AnimatePresence>
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero ready={!loading} />
        <Marquee />
        <Collection onOpen={setSelected} />
        <BigBanner />
        <Story />
        <Features />
        <Newsletter />
      </main>
      <Footer />
      <ViewsCanvas />
      <CartDrawer />
      <ProductModal product={selected} onClose={closeModal} />
      <Toast />
    </CartProvider>
  )
}
