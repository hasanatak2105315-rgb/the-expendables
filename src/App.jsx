import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Collection from './components/Collection'
import { Marquee, Story, Features, BigBanner, Newsletter, Footer } from './components/Sections'
import { ProductModal, CartDrawer, Toast } from './components/Overlays'
import { About, Contact, Faq, Returns, Kvkk, Privacy, Terms, DistanceSales, ThankYou, NotFound } from './components/Pages'
import { MobileCta, CookieBanner } from './components/Extras'
import { usePath } from './router'
import { applyMeta } from './meta'
import { ViewsCanvas } from './three/ProductViews'
import { CartProvider } from './store/cart'
import { startSmoothScroll, lockScroll } from './scroll'

const PAGES = {
  '/hakkimizda': About,
  '/iletisim': Contact,
  '/sss': Faq,
  '/iade': Returns,
  '/kvkk': Kvkk,
  '/gizlilik': Privacy,
  '/kullanim-kosullari': Terms,
  '/mesafeli-satis': DistanceSales,
  '/tesekkurler': ThankYou
}

export default function App() {
  const path = usePath()
  const Page = path === '/' ? null : PAGES[path] ?? NotFound
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => startSmoothScroll(), [])
  useEffect(() => {
    lockScroll(loading)
    if (loading) window.scrollTo(0, 0)
  }, [loading])
  useEffect(() => applyMeta(path), [path])

  const done = useCallback(() => setLoading(false), [])
  const closeModal = useCallback(() => setSelected(null), [])

  return (
    <CartProvider>
      <AnimatePresence>{loading && <Loader onDone={done} />}</AnimatePresence>
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main>
        {Page ? (
          <Page />
        ) : (
          <>
            <Hero ready={!loading} />
            <Marquee />
            <Collection onOpen={setSelected} />
            <BigBanner />
            <Story />
            <Features />
            <Newsletter />
          </>
        )}
      </main>
      <Footer />
      <ViewsCanvas />
      <MobileCta />
      <CartDrawer />
      <ProductModal product={selected} onClose={closeModal} />
      <Toast />
      <CookieBanner />
    </CartProvider>
  )
}
