/**
 * Name helpers, shared by the app and the build-time SEO module (so: no imports here)
 */

/**
 * IconTableWithHeadings → table-with-headings, IconH1 → h1
 */
export function toSlug (name: string): string {
  return name
    .replace(/^Icon/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * table-with-headings → Table With Headings, h1 → H1: the human name used in titles
 */
export function toTitle (slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
