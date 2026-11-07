import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'url';

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      formats: ['es', 'cjs'],
      fileName: format => (format === 'es' ? 'index.mjs' : 'index.cjs')
    },
    rollupOptions: {
      external: ['vue']
    },
    /**
     * Not minified, so the /* @__PURE__ *\/ annotations survive and unused icons are tree-shaken
     */
    minify: false
  },
  plugins: [
    dts({
      include: ['src'],
      entryRoot: 'src'
    })
  ]
});
