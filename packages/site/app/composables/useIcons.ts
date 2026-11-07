import * as iconsModule from '@davidabou/icons';
import type { CodeXIconName } from '../../../nuxt/src/runtime/types';
import { toSlug } from '../lib/icon-names';

export interface IconEntry {
  /** Export name, e.g. IconArrowLeft */
  name: CodeXIconName;
  /** Source file name, e.g. arrow-left */
  slug: string;
  /** Optimized SVG markup */
  svg: string;
}

const icons: Record<string, string> = iconsModule;

const list: IconEntry[] = Object.entries(icons)
  .filter(([name, svg]) => name.startsWith('Icon') && typeof svg === 'string')
  .map(([name, svg]) => ({ name: name as CodeXIconName, slug: toSlug(name), svg }))
  /**
   * Sort explicitly: the key order of a module namespace differs between server and client,
   * which would break hydration. Headings come first, like in the README.
   */
  .sort((a, b) => {
    const aHeading = /^h\d$/.test(a.slug);
    const bHeading = /^h\d$/.test(b.slug);

    if (aHeading !== bHeading) {
      return aHeading ? -1 : 1;
    }

    return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
  });

export function useIcons () {
  return list;
}
