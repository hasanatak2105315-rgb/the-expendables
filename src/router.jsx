import { useSyncExternalStore } from 'react'
import { lenis, scrollToId } from './scroll'

// Küçük sayfa yönlendirici: /hakkimizda, /sss gibi gerçek adresler
const EVENT = 'routechange'

const subscribe = (fn) => {
  window.addEventListener('popstate', fn)
  window.addEventListener(EVENT, fn)
  return () => {
    window.removeEventListener('popstate', fn)
    window.removeEventListener(EVENT, fn)
  }
}

const getPath = () => window.location.pathname.replace(/\/+$/, '') || '/'

export const usePath = () => useSyncExternalStore(subscribe, getPath)

const toTop = () => {
  if (lenis) lenis.scrollTo(0, { immediate: true })
  window.scrollTo(0, 0)
}

export function navigate(to) {
  if (to === getPath()) return toTop()
  window.history.pushState(null, '', to)
  window.dispatchEvent(new Event(EVENT))
  toTop()
}

// Ana sayfadaki bir bölüme git (başka sayfadaysak önce ana sayfaya dön)
export function goToSection(id) {
  if (getPath() === '/') return scrollToId(id)
  navigate('/')
  setTimeout(() => scrollToId(id), 120)
}

export function Link({ to, children, ...rest }) {
  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
