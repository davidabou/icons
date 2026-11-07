# CodeX Icons Nuxt module

[![npm](https://img.shields.io/npm/v/@davidabou/nuxt-icons)](https://www.npmjs.com/package/@davidabou/nuxt-icons)
[![npm downloads](https://img.shields.io/npm/dm/@davidabou/nuxt-icons)](https://www.npmjs.com/package/@davidabou/nuxt-icons)
[![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js)](https://nuxt.com)

This module simplifies using the [`@davidabou/icons`](https://github.com/davidabou/icons) pack (an extended fork of CodeX Icons) in Nuxt projects.

[![nuxt-icons](https://raw.githubusercontent.com/davidabou/icons/master/showcase.png "CodeX Icons showcase")](https://github.com/davidabou/icons/tree/master/packages/nuxt)

## Features

1. 💖 Auto-imported `<CodeXIcon>` component, rendered on the server as a plain `<svg>` (no `v-html`)
2. 💝 Coloring through `currentColor`
3. 💞 Typed icon names, with autocompletion and type errors on unknown names

Requires Nuxt 4.

## Installation

1. Get the package

```bash
bun add @davidabou/nuxt-icons
```

2. Add module to the `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  modules: [
    '@davidabou/nuxt-icons'
  ]
})
```

## Usage

Use the `CodeXIcon` component (or `code-x-icon` in kebab-case) with the `name` property: the icon name in kebab-case, as shown on [icons.abou.dev](https://icons.abou.dev) (`arrow-left`, `table-with-headings`, `h1`…).

```vue
<CodeXIcon name="heart" />
<code-x-icon name="sparkles" :size="20" class="text-primary" />
<CodeXIcon :name="isOpen ? 'chevron-up' : 'chevron-down'" />
```

The icon takes the current text color, so it can be colored with CSS `color` or any utility class.

## Properties

| prop | type | description |
| -- | -- | -- |
| `name` | `CodeXIconName` | Required. Icon name in kebab-case, for example `arrow-left` |
| `size` | `number \| string` | Icon width and height, `24` by default (in pixels when a number) |

Any other attribute (`class`, `style`, `aria-label`…) is passed to the `<svg>`. Icons are decorative by default (`aria-hidden="true"`), unless they get an `aria-label`.

The `CodeXIconName` type can be imported to type your own props:

```ts
import type { CodeXIconName } from '@davidabou/nuxt-icons'
```

To import icons one by one instead (only those end up in the bundle), use [`@davidabou/icons-vue`](https://github.com/davidabou/icons/tree/master/packages/vue) directly.

### Migrating from `<DaIcon>`

`<DaIcon>` was replaced by `<CodeXIcon>` in 0.2.0, which takes kebab-case names without the `Icon` prefix:

```diff
- <DaIcon name="IconArrowLeft" />
+ <CodeXIcon name="arrow-left" />
```

The type of the names is now `CodeXIconName`. `<DaIcon>` and `DaIconName` still work, with the former names, but are deprecated.

In both components, the icon is no longer wrapped in a `<span class="da-icon">`: attributes now land on the `<svg>` itself, and the `.da-icon` class is gone.

## Development

```bash
bun install
bun run dev          # playground with hot reload
bun run test:types   # type-check the module and the playground
bun run prepack      # build the module into dist/
```

## Credits

Based on [`@codexteam/nuxt-icons`](https://github.com/codex-team/icons/tree/master/packages/nuxt) by [CodeX](https://codex.so), released under the MIT license. This fork is not affiliated with or endorsed by CodeX.
