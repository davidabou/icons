import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  /**
   * Use the local Nuxt module, so the site dogfoods <DaIcon>
   */
  modules: ['../nuxt/src/module', '@nuxt/fonts', 'shadcn-nuxt'],

  shadcn: {
    prefix: '',
    componentDir: '~/components/ui'
  },

  /**
   * Point the icons package to the generated sources of this repo,
   * so the site always shows the latest icons, even unpublished ones
   */
  alias: {
    '@davidabou/icons': fileURLToPath(new URL('../../src/index.ts', import.meta.url))
  },

  /**
   * Fredoka, self-hosted at build time by @nuxt/fonts
   */
  fonts: {
    families: [
      { name: 'Fredoka', provider: 'google', weights: [500, 600, 700] },
      { name: 'Geist Mono', provider: 'google', weights: [500] }
    ]
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'CodeX Icons (Extended) - rounded outline SVG icons',
      meta: [
        { name: 'description', content: 'Rounded outline SVG icons, 24×24 with a 2px stroke. Search, copy and download.' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: 'favicon.svg' }
      ]
    }
  },

  // modules/ runs in Node at build time
  typescript: {
    nodeTsConfig: { compilerOptions: { types: ['node'] } }
  },

  devtools: { enabled: true },
  compatibilityDate: 'latest'
});
