import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement, createRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as icons from '../dist/index.mjs'

const render = (component, props) => renderToStaticMarkup(createElement(component, props))

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

test('renders a 24px decorative svg by default', () => {
  const html = render(icons.IconHeart)

  assert.match(html, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">/)
  assert.match(html, /<path [^>]*stroke="currentColor"/)
})

test('renders the attributes with their SVG names', () => {
  const html = render(icons.IconArrowLeft)

  assert.match(html, /stroke-width="2"/)
  assert.match(html, /stroke-linecap="round"/)
  assert.doesNotMatch(html, /strokeWidth|strokeLinecap/)
})

test('applies the size and passes props to the svg', () => {
  const html = render(icons.IconHeart, { 'size': 16, 'className': 'icon', 'aria-label': 'Like' })

  assert.match(html, /width="16" height="16"/)
  assert.match(html, /class="icon"/)
  assert.match(html, /aria-label="Like"/)
  assert.doesNotMatch(html, /aria-hidden/)
})

test('renders nested elements', () => {
  const html = render(icons.IconLoader)

  assert.match(html, /<path [^>]*><animateTransform [^>]*attributeName="transform"[^>]*repeatCount="indefinite"[^>]*><\/animateTransform><\/path>/)
})

test('forwards the ref and has a display name', () => {
  const ref = createRef()

  assert.equal(typeof icons.IconHeart.$$typeof, 'symbol')
  assert.equal(icons.IconHeart.displayName, 'IconHeart')
  assert.doesNotThrow(() => render(icons.IconHeart, { ref }))
})
