/**
 * Framework chosen by the visitor, shared by the install tabs of the page and the snippets
 * of the icon dialog, and kept in localStorage.
 */

export const FRAMEWORKS = ['vue', 'nuxt', 'vanilla'] as const;

export type Framework = typeof FRAMEWORKS[number];

const STORAGE_KEY = 'framework';

const framework = ref<Framework>('vue');

let loaded = false;

function isFramework (value: unknown): value is Framework {
  return FRAMEWORKS.includes(value as Framework);
}

export function useFramework () {
  // Read the saved choice once, on the client (the site is prerendered)
  if (import.meta.client && !loaded) {
    loaded = true;
    onMounted(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (isFramework(saved)) {
          framework.value = saved;
        }
      } catch {
        // Storage unavailable (private mode, blocked site data): keep the default
      }
    });
  }

  /**
   * Writable, for v-model: ignores values that are not frameworks (the dialog's React and SVG tabs)
   */
  return computed({
    get: () => framework.value,
    set: (value: string) => {
      if (!isFramework(value)) {
        return;
      }
      framework.value = value;
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch {
        // Not saved: the choice still applies to this visit
      }
    }
  });
}
