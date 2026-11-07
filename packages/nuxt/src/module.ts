import { defineNuxtModule, createResolver, addComponent } from '@nuxt/kit'

/**
 * Union type for available icon names, in kebab-case (same as runtime/types.ts, exposed to module consumers)
 */
export type CodeXIconName = import('@davidabou/icons-vue').IconName

/**
 * @deprecated Names of the former <DaIcon> ('IconHeart'…). Use <CodeXIcon> and CodeXIconName.
 */
export type DaIconName = Extract<keyof typeof import('@davidabou/icons-vue'), `Icon${string}`>

export default defineNuxtModule({
  meta: {
    name: '@davidabou/nuxt-icons',
    configKey: 'daIcons',
    compatibility: {
      nuxt: '>=4.0.0'
    }
  },
  setup() {
    const { resolve } = createResolver(import.meta.url)
    /**
     * Usable as <CodeXIcon> or <code-x-icon> in templates
     */
    addComponent({
      name: 'CodeXIcon',
      filePath: resolve('./runtime/components/CodeXIcon.vue')
    })

    /**
     * Former component, with 'IconHeart'-style names, kept so existing templates keep working.
     * Deprecated, use <CodeXIcon>.
     */
    addComponent({
      name: 'DaIcon',
      filePath: resolve('./runtime/components/DaIcon.vue')
    })
  }
})
