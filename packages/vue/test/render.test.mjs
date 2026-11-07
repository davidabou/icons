import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import * as icons from '../dist/index.mjs'

const render = vnode => renderToString(createSSRApp({ render: () => vnode }))

test('exports one component per source icon', () => {
  const index = readFileSync(new URL('../../../src/index.ts', import.meta.url), 'utf8')
  const names = [...index.matchAll(/export const (Icon\w+)/g)].map(match => match[1])

  assert.ok(names.length > 0)
  assert.deepEqual(Object.keys(icons).filter(key => key.startsWith('Icon')).sort(), names.sort())
})

test('maps every icon by its kebab-case name', () => {
  const components = Object.entries(icons).filter(([key]) => key.startsWith('Icon'))

  assert.equal(Object.keys(icons.icons).length, components.length)
  assert.equal(icons.icons['arrow-left'], icons.IconArrowLeft)
  assert.equal(icons.icons['table-with-headings'], icons.IconTableWithHeadings)
  assert.equal(icons.icons.h1, icons.IconH1)
})

test('renders a 24px decorative svg by default', async () => {
  const html = await render(h(icons.IconHeart))

  assert.match(html, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">/)
  assert.match(html, /<path [^>]*stroke="currentColor"/)
})

test('applies the size and passes attributes to the svg', async () => {
  const html = await render(h(icons.IconHeart, { 'size': 16, 'class': 'icon', 'aria-label': 'Like' }))

  assert.match(html, /width="16" height="16"/)
  assert.match(html, /class="icon"/)
  assert.match(html, /aria-label="Like"/)
  assert.doesNotMatch(html, /aria-hidden/)
})

test('renders nested elements', async () => {
  const html = await render(h(icons.IconLoader))

  assert.match(html, /<path [^>]*><animateTransform [^>]*><\/animateTransform><\/path>/)
})
