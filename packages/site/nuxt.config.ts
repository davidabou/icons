import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  /**
   * Use the local Nuxt module, so the site dogfoods <CodeXIcon>
   */
  modules: ['../nuxt/src/module', '@nuxt/fonts', '@vercel/analytics', 'shadcn-nuxt'],

  shadcn: {
    prefix: '',
    componentDir: '~/components/ui'
  },

  /**
   * Point the icons packages to the generated sources of this repo,
   * so the site always shows the latest icons, even unpublished ones
   */
  alias: {
    '@davidabou/icons': fileURLToPath(new URL('../../src/index.ts', import.meta.url)),
    '@davidabou/icons-vue': fileURLToPath(new URL('../vue/src/index.ts', import.meta.url))
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

  /**
   * Public URL, for canonical links, social images and the sitemap (see modules/seo.ts)
   */
  runtimeConfig: {
    public: { siteUrl: 'https://icons.abou.dev' }
  },

  /**
   * Per-page title, description and social tags are set in app.vue
   */
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#09090b', media: '(prefers-color-scheme: dark)' },
        { name: 'author', content: 'davidabou' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        // For LLMs and coding assistants (see modules/llms.ts)
        { rel: 'alternate', type: 'text/markdown', href: '/llms.txt', title: 'LLM-friendly summary' }
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
