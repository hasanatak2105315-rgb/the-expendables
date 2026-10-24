import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ROUTES, SITE } from './src/data/site.js'

// Derleme sırasında sayfa listesinden sitemap.xml ve robots.txt üretir
function seoFiles() {
  return {
    name: 'seo-files',
    // index.html içindeki site adresini site.js'teki adresle eşitle
    transformIndexHtml: (html) => html.replaceAll('https://theexpendables.com.tr', SITE.url),
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      const urls = Object.keys(ROUTES)
        .map((p) => `  <url><loc>${SITE.url}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod><priority>${p === '/' ? '1.0' : '0.6'}</priority></url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /tesekkurler\n\nSitemap: ${SITE.url}/sitemap.xml\n`
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), seoFiles()],
  base: '/',
  build: { chunkSizeWarningLimit: 2000 }
})
