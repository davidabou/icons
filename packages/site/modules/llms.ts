import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { defineNuxtModule } from '@nuxt/kit';
import * as iconsModule from '../../../src/index';
import { toSlug } from '../app/lib/icon-names';

/**
 * Build-time files for LLMs and coding assistants (https://llmstxt.org), served from the site root:
 * - llms.txt: what the packages are and how to use them, in Markdown
 * - llms-full.txt: the same, followed by every icon with its exact names, so assistants
 *   use icons that exist instead of guessing (IconTrash, not IconDelete)
 * Generated from src/index.ts, so new icons are listed without any change here.
 */

const names = Object.keys(iconsModule)
  .filter(name => name.startsWith('Icon'))
  .sort((a, b) => toSlug(a) < toSlug(b) ? -1 : toSlug(a) > toSlug(b) ? 1 : 0);

function summary (siteUrl: string): string {
  return `# CodeX Icons Extended

> ${names.length} free, MIT-licensed rounded outline SVG icons (24×24 grid, 2px stroke, \`currentColor\`), an extended fork of CodeX Icons (\`@codexteam/icons\`). Available as SVG strings, Vue 3 components, React components and a Nuxt module.

Every icon has two names, derived from its file name:

- export name, in PascalCase with an \`Icon\` prefix: \`arrow-left.svg\` → \`IconArrowLeft\` (core, Vue and React packages)
- kebab-case name: \`arrow-left\` (Nuxt \`<CodeXIcon name="…">\`, the \`icons\` map of the Vue and React packages, and the site URLs)

Only use names from the list of icons (${siteUrl}/llms-full.txt): there is no alias, so an icon that is not listed does not exist.

## Packages

All packages share the same version and are tree-shakable.

### Vue 3: @davidabou/icons-vue

\`\`\`sh
npm install @davidabou/icons-vue
\`\`\`

\`\`\`vue
<script setup lang="ts">
import { IconHeart } from '@davidabou/icons-vue';
</script>

<template>
  <IconHeart :size="20" class="text-primary" />
</template>
\`\`\`

### React 18/19: @davidabou/icons-react

\`\`\`sh
npm install @davidabou/icons-react
\`\`\`

\`\`\`tsx
import { IconHeart } from '@davidabou/icons-react';

<IconHeart size={20} className="text-primary" />
\`\`\`

### Nuxt 4: @davidabou/nuxt-icons

\`\`\`sh
npx nuxi module add @davidabou/nuxt-icons
\`\`\`

\`<CodeXIcon>\` is auto-imported and takes the kebab-case name:

\`\`\`vue
<CodeXIcon name="heart" :size="20" />
\`\`\`

### Plain JavaScript / TypeScript: @davidabou/icons

\`\`\`sh
npm install @davidabou/icons
\`\`\`

Each export is an SVG string, 24px by default:

\`\`\`js
import { IconHeart } from '@davidabou/icons';

element.innerHTML = IconHeart;
\`\`\`

## Components

- \`size\` (number or string, default \`24\`): width and height.
- Any other attribute or prop (\`class\`/\`className\`, \`style\`, \`aria-label\`, event listeners) is passed to the \`<svg>\`.
- Icons are decorative by default (\`aria-hidden="true"\`); give them an \`aria-label\` when they carry meaning on their own.
- Colors follow the text color (\`currentColor\`): style them with \`color\`.
- Dynamic icons, when the name is only known at runtime: \`import { icons, type IconName } from '@davidabou/icons-vue'\` (or \`-react\`), then \`icons['arrow-left']\`. It bundles every icon: prefer the named exports.

## Links

- [Website](${siteUrl}/): search, copy and download the icons
- [List of icons](${siteUrl}/llms-full.txt): every icon with its export and kebab-case names
- [GitHub repository](https://github.com/davidabou/icons)
- [Vue package](https://github.com/davidabou/icons/tree/master/packages/vue#readme)
- [React package](https://github.com/davidabou/icons/tree/master/packages/react#readme)
- [Nuxt module](https://github.com/davidabou/icons/tree/master/packages/nuxt#readme)
- [SVG files](https://github.com/davidabou/icons/tree/master/dist/icons), also at ${siteUrl}/svg/<kebab-case-name>.svg
`;
}

function list (siteUrl: string): string {
  return [
    '## Icons',
    '',
    `${names.length} icons, as \`export name\` / \`kebab-case name\`:`,
    '',
    ...names.map(name => `- [\`${name}\` / \`${toSlug(name)}\`](${siteUrl}/icons/${toSlug(name)})`),
    ''
  ].join('\n');
}

export default defineNuxtModule({
  meta: { name: 'llms' },
  async setup (_, nuxt) {
    const siteUrl = (nuxt.options.runtimeConfig.public as { siteUrl: string }).siteUrl;
    // Not in buildDir: Nuxt empties it after the modules have run
    const dir = join(nuxt.options.rootDir, 'node_modules', '.cache', 'llms');

    nuxt.options.nitro.publicAssets = [...nuxt.options.nitro.publicAssets ?? [], { dir, maxAge: 60 * 60 * 24 }];

    await mkdir(dir, { recursive: true });
    await Promise.all([
      writeFile(join(dir, 'llms.txt'), summary(siteUrl)),
      writeFile(join(dir, 'llms-full.txt'), `${summary(siteUrl)}\n${list(siteUrl)}`)
    ]);
  }
});
