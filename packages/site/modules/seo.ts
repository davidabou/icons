import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'
import { Resvg } from '@resvg/resvg-js'
import * as iconsModule from '../../../src/index'
import { toSlug, toTitle } from '../app/lib/icon-names'

/**
 * Build-time SEO assets, served from the site root:
 * - robots.txt and sitemap.xml (home + one page per icon)
 * - og.png (home) and og/<slug>.png (one per icon), 1200×630 social previews
 * - svg/<slug>.svg, the plain file of each icon (image search, JSON-LD contentUrl)
 * - apple-touch-icon.png
 * It also adds every /icons/<slug> page to the prerendered routes.
 */

const COLORS = {
  background: '#ffffff',
  foreground: '#18181b',
  muted: '#f4f4f5',
  mutedForeground: '#71717a',
  primary: '#7c3aed'
}

/** The logo (IconSparkles in the header, also the favicon) */
const LOGO = 'M10 9Q11 13 15 14Q11 15 10 19Q9 15 5 14Q9 13 10 9ZM16.5 5.5Q16.9 7.1 18.5 7.5Q16.9 7.9 16.5 9.5Q16.1 7.9 14.5 7.5Q16.1 7.1 16.5 5.5Z'

/** Icons shown first on the home preview, when they exist */
const FEATURED = [
  'heart', 'search', 'picture', 'rocket', 'sun', 'moon', 'star', 'gift', 'coffee', 'bell', 'user', 'settings',
  'trash', 'copy', 'link', 'lock', 'calendar', 'clock', 'home', 'globe', 'play', 'download', 'check', 'plus'
]

interface Icon {
  slug: string
  svg: string
}

const icons: Icon[] = Object.entries(iconsModule as Record<string, unknown>)
  .filter((entry): entry is [string, string] => entry[0].startsWith('Icon') && typeof entry[1] === 'string')
  .map(([name, svg]) => ({ slug: toSlug(name), svg }))
  .sort((a, b) => a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0)

const escapeXml = (text: string) => text.replace(/[<>&"']/g, char => `&#${char.charCodeAt(0)};`)

/**
 * An icon placed in a bigger SVG: its inner markup in a nested 24×24 viewport
 */
function place(icon: Icon, x: number, y: number, size: number, color: string): string {
  const inner = icon.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').replaceAll('currentColor', color)

  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">${inner}</svg>`
}

const logo = (x: number, y: number, size: number) =>
  `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="${LOGO}" stroke="${COLORS.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`

const canvas = (width: number, height: number, content: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="Fredoka"><rect width="${width}" height="${height}" fill="${COLORS.background}"/>${content}</svg>`

function homeImage(): string {
  const featured = [
    ...FEATURED.map(slug => icons.find(icon => icon.slug === slug)).filter(icon => !!icon),
    ...icons.filter(icon => !FEATURED.includes(icon.slug))
  ].slice(0, 24)

  // Two rows of 12 tiles, centered
  const tile = 76
  const gap = 12
  const left = (1200 - (12 * tile + 11 * gap)) / 2
  const tiles = featured.map((icon, index) => {
    const x = left + (index % 12) * (tile + gap)
    const y = 340 + Math.floor(index / 12) * (tile + gap)

    return `<rect x="${x}" y="${y}" width="${tile}" height="${tile}" rx="22" fill="${COLORS.muted}"/>${place(icon, x + 20, y + 20, 36, COLORS.foreground)}`
  })

  return canvas(1200, 630, [
    logo(left - 6, 92, 72),
    `<text x="${left + 78}" y="152" font-size="64" font-weight="600" fill="${COLORS.foreground}">CodeX Icons <tspan fill="${COLORS.mutedForeground}" font-weight="500">Extended</tspan></text>`,
    `<text x="${left}" y="244" font-size="38" font-weight="500" fill="${COLORS.mutedForeground}">${icons.length} free rounded outline SVG icons, 24×24, 2px stroke</text>`,
    ...tiles,
    `<text x="600" y="580" text-anchor="middle" font-size="28" font-weight="500" fill="${COLORS.mutedForeground}">icons.abou.dev</text>`
  ].join(''))
}

function iconImage(icon: Icon): string {
  const title = toTitle(icon.slug)
  // Shrink long names so they fit in the 600px text column (Fredoka is about 0.55em per character)
  const fontSize = Math.min(80, Math.floor(600 / (title.length * 0.56)))

  return canvas(1200, 630, [
    `<rect x="80" y="105" width="420" height="420" rx="72" fill="${COLORS.muted}"/>`,
    place(icon, 170, 195, 240, COLORS.foreground),
    `<text x="560" y="${300 + fontSize * 0.35}" font-size="${fontSize}" font-weight="600" fill="${COLORS.foreground}">${escapeXml(title)}</text>`,
    `<text x="560" y="${300 + fontSize * 0.35 + 64}" font-size="34" font-weight="500" fill="${COLORS.mutedForeground}">Free SVG icon · Vue · React</text>`,
    logo(554, 440, 44),
    `<text x="606" y="474" font-size="30" font-weight="600" fill="${COLORS.foreground}">CodeX Icons <tspan fill="${COLORS.mutedForeground}" font-weight="500">Extended</tspan></text>`
  ].join(''))
}

/**
 * Fredoka TTF files (resvg needs TrueType; Google Fonts serves it to clients that do not ask for woff2),
 * saved to `dir`: resvg-js ignores fonts passed as buffers, only files work
 */
async function fetchFonts(dir: string): Promise<string[]> {
  const css = await (await fetch('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600', { signal: AbortSignal.timeout(10_000) })).text()
  const urls = [...css.matchAll(/url\((https:[^)]+\.ttf)\)/g)].flatMap(([, url]) => url ? [url] : [])

  if (!urls.length) {
    throw new Error('no TTF in the Google Fonts response')
  }

  await mkdir(dir, { recursive: true })

  return Promise.all(urls.map(async (url, index) => {
    const file = join(dir, `fredoka-${index}.ttf`)

    await writeFile(file, Buffer.from(await (await fetch(url, { signal: AbortSignal.timeout(10_000) })).arrayBuffer()))

    return file
  }))
}

export default defineNuxtModule({
  meta: { name: 'seo' },
  async setup(_, nuxt) {
    const siteUrl = (nuxt.options.runtimeConfig.public as { siteUrl: string }).siteUrl
    // Not in buildDir: Nuxt empties it after the modules have run
    const dir = join(nuxt.options.rootDir, 'node_modules', '.cache', 'seo')
    const routes = icons.map(icon => `/icons/${icon.slug}`)

    nuxt.options.nitro.prerender ??= {}
    nuxt.options.nitro.prerender.routes = [...nuxt.options.nitro.prerender.routes ?? [], ...routes]
    nuxt.options.nitro.publicAssets = [...nuxt.options.nitro.publicAssets ?? [], { dir, maxAge: 60 * 60 * 24 }]

    const fonts = await fetchFonts(join(dir, '..', 'seo-fonts')).catch((error) => {
      console.warn('[seo] Fredoka unavailable, the social images fall back to system fonts', error)

      return [] as string[]
    })

    const png = (svg: string, width?: number) => new Resvg(svg, {
      font: { fontFiles: fonts, loadSystemFonts: !fonts.length, defaultFontFamily: 'Fredoka' },
      ...width ? { fitTo: { mode: 'width' as const, value: width } } : {}
    }).render().asPng()

    await mkdir(join(dir, 'og'), { recursive: true })
    await mkdir(join(dir, 'svg'), { recursive: true })

    const sitemap = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
      `<url><loc>${siteUrl}/</loc></url>`,
      ...icons.map(icon => `<url><loc>${siteUrl}/icons/${icon.slug}</loc><image:image><image:loc>${siteUrl}/svg/${icon.slug}.svg</image:loc></image:image></url>`),
      '</urlset>',
      ''
    ].join('\n')

    await Promise.all([
      writeFile(join(dir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`),
      writeFile(join(dir, 'sitemap.xml'), sitemap),
      writeFile(join(dir, 'og.png'), png(homeImage())),
      // The logo on a white square with some padding, as iOS expects (no transparency)
      writeFile(join(dir, 'apple-touch-icon.png'), png(canvas(180, 180, logo(30, 30, 120)))),
      ...icons.map(icon => writeFile(join(dir, 'svg', `${icon.slug}.svg`), icon.svg)),
      ...icons.map(icon => writeFile(join(dir, 'og', `${icon.slug}.png`), png(iconImage(icon))))
    ])
  }
})
