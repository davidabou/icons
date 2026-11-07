import type { RouterConfig } from '@nuxt/schema';

/**
 * Opening or closing an icon changes the route (/ ↔ /icons/<slug>) over the same grid:
 * keep the scroll position instead of jumping to the top.
 */
export default {
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? false
} satisfies RouterConfig;
