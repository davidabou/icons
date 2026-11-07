import { defineNuxtModule, createResolver, addComponent } from '@nuxt/kit';

/**
 * Union type for available icon names (same as runtime/types.ts, exposed to module consumers)
 */
export type CodeXIconName = Extract<keyof typeof import('@davidabou/icons-vue'), `Icon${string}`>;

/**
 * @deprecated Renamed to CodeXIconName
 */
export type DaIconName = CodeXIconName;

export default defineNuxtModule({
  meta: {
    name: '@davidabou/nuxt-icons',
    configKey: 'daIcons',
    compatibility: {
      nuxt: '>=4.0.0'
    }
  },
  setup () {
    const { resolve } = createResolver(import.meta.url);
    const filePath = resolve('./runtime/components/CodeXIcon.vue');

    /**
     * Usable as <CodeXIcon> or <code-x-icon> in templates
     */
    addComponent({ name: 'CodeXIcon', filePath });

    /**
     * Former name, kept so existing templates keep working. Deprecated, use <CodeXIcon>.
     */
    addComponent({ name: 'DaIcon', filePath });
  }
});
