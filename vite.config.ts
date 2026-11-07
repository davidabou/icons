import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'index.mjs'
    },
    emptyOutDir: false
  },
  plugins: [
    dts({
      include: ['src/index.ts'],
      entryRoot: 'src'
    })
  ]
})
