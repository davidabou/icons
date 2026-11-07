import type { Ref } from 'vue'
import type { IconEntry } from './useIcons'
import { toTitle } from '../lib/icon-names'

const siteName = 'CodeX Icons Extended'
const repository = 'https://github.com/davidabou/icons'
const license = 'https://opensource.org/licenses/MIT'

/**
 * SEO: title, description, canonical URL, social previews and structured data, for the home
 * (no icon selected) and for each icon page. The images and the sitemap are generated at build
 * time by modules/seo.ts.
 */
export function useIconSeo(selected: Ref<IconEntry | null>) {
  const siteUrl = useRuntimeConfig().public.siteUrl
  const count = useIcons().length

  const seo = computed(() => {
    const icon = selected.value

    if (!icon) {
      return {
        title: `${siteName}: ${count} free rounded outline SVG icons`,
        description: `${count} free rounded outline SVG icons, drawn on a 24×24 grid with a 2px stroke. Search, copy for Vue or React, or download the SVG. MIT licensed.`,
        url: `${siteUrl}/`,
        image: `${siteUrl}/og.png`,
        alt: siteName
      }
    }
    const title = toTitle(icon.slug)

    return {
      title: `${title} icon: free SVG for Vue and React | ${siteName}`,
      description: `Free ${title.toLowerCase()} icon in a rounded outline style: 24×24 SVG with a 2px stroke. Copy it for Vue or React, or download the SVG. MIT licensed.`,
      url: `${siteUrl}/icons/${icon.slug}`,
      image: `${siteUrl}/og/${icon.slug}.png`,
      alt: `${title} icon`
    }
  })

  /** The site and the package on the home, the image and its breadcrumb on icon pages */
  const structuredData = computed(() => {
    const icon = selected.value

    if (!icon) {
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': siteName,
          'url': `${siteUrl}/`,
          'description': seo.value.description
        },
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          'name': '@davidabou/icons',
          'description': seo.value.description,
          'codeRepository': repository,
          'programmingLanguage': ['TypeScript', 'SVG'],
          'runtimePlatform': ['Vue', 'React', 'Nuxt'],
          license,
          'url': `${siteUrl}/`
        }
      ]
    }

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        'name': seo.value.alt,
        'description': seo.value.description,
        'contentUrl': `${siteUrl}/svg/${icon.slug}.svg`,
        'thumbnailUrl': seo.value.image,
        'encodingFormat': 'image/svg+xml',
        license,
        'acquireLicensePage': seo.value.url,
        'creditText': siteName,
        'creator': { '@type': 'Person', 'name': 'davidabou', 'url': 'https://github.com/davidabou' },
        'copyrightNotice': 'MIT License'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': siteName, 'item': `${siteUrl}/` },
          { '@type': 'ListItem', 'position': 2, 'name': seo.value.alt, 'item': seo.value.url }
        ]
      }
    ]
  })

  useSeoMeta({
    title: () => seo.value.title,
    description: () => seo.value.description,
    ogType: 'website',
    ogSiteName: siteName,
    ogTitle: () => seo.value.title,
    ogDescription: () => seo.value.description,
    ogUrl: () => seo.value.url,
    ogImage: () => seo.value.image,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: () => seo.value.alt,
    twitterCard: 'summary_large_image',
    twitterTitle: () => seo.value.title,
    twitterDescription: () => seo.value.description,
    twitterImage: () => seo.value.image
  })

  useHead({
    link: [{ rel: 'canonical', href: () => seo.value.url }],
    script: [{ type: 'application/ld+json', innerHTML: () => JSON.stringify(structuredData.value) }]
  })
}
