import * as iconsModule from '@davidabou/icons';
import type { DaIconName } from '../../../nuxt/src/runtime/types';

export interface IconEntry {
  /** Export name, e.g. IconArrowLeft */
  name: DaIconName;
  /** Source file name, e.g. arrow-left */
  slug: string;
  /** Optimized SVG markup */
  svg: string;
}

const icons: Record<string, string> = iconsModule;

/**
 * IconTableWithHeadings → table-with-headings, IconH1 → h1
 */
function toSlug (name: string): string {
  return name
    .replace(/^Icon/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

const list: IconEntry[] = Object.entries(icons)
  .filter(([name, svg]) => name.startsWith('Icon') && typeof svg === 'string')
  .map(([name, svg]) => ({ name: name as DaIconName, slug: toSlug(name), svg }))
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
