import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Collection from './components/Collection'
import { Marquee, Story, Features, BigBanner, Newsletter, Footer } from './components/Sections'
import { ProductModal, CustomPrintModal, CartDrawer, Toast } from './components/Overlays'
import { About, Contact, Faq, Returns, Kvkk, Privacy, Terms, DistanceSales, ThankYou, NotFound } from './components/Pages'
import { MobileCta, CookieBanner, WhatsAppButton } from './components/Extras'
import { usePath } from './router'
import { applyMeta } from './meta'
import { CartProvider } from './store/cart'
import { startSmoothScroll, lockScroll } from './scroll'

// 3D kodu ana dosyadan ayrı, sonradan yüklenir
const ViewsCanvas = lazy(() => import('./three/ProductViews').then((m) => ({ default: m.ViewsCanvas })))

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
  const [customFor, setCustomFor] = useState(null)

  useEffect(() => startSmoothScroll(), [])
  useEffect(() => {
    lockScroll(loading)
    if (loading) window.scrollTo(0, 0)
  }, [loading])
  useEffect(() => applyMeta(path), [path])

  const done = useCallback(() => setLoading(false), [])
  const closeModal = useCallback(() => setSelected(null), [])
  const closeCustom = useCallback(() => setCustomFor(null), [])
  const openCustom = useCallback((product) => {
    setSelected(null)
    setCustomFor(product)
  }, [])

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
            <Collection onOpen={setSelected} onCustom={openCustom} />
            <BigBanner />
            <Story />
            <Features />
            <Newsletter />
          </>
        )}
      </main>
      <Footer />
      {!Page && (
        <Suspense fallback={null}>
          <ViewsCanvas />
        </Suspense>
      )}
      <MobileCta />
      <WhatsAppButton />
      <CartDrawer />
      <ProductModal product={selected} onClose={closeModal} onCustom={openCustom} />
      <CustomPrintModal product={customFor} onClose={closeCustom} />
      <Toast />
      <CookieBanner />
    </CartProvider>
  )
}
