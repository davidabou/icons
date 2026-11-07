# CLAUDE.md

Fork of [`@codexteam/icons`](https://github.com/codex-team/icons). Goal of this fork: **grow the icon library** while staying strictly faithful to the existing style. A new icon must be visually indistinguishable from the ones already in the set.

## Structure

- `src/icons/*.svg` — **single source of truth**. This is the only place where icons are added or modified.
- `bin/generate.js` — optimizes the SVGs (svgo), generates `src/index.ts`, `dist/icons/Icon*.svg`, `packages/vue/src/icons.ts`, `packages/react/src/icons.ts` and the `showcase.png` preview (all icons as a grid, rendered with `@resvg/resvg-js`).
- `src/index.ts`, `dist/`, `packages/vue/src/icons.ts`, `packages/react/src/icons.ts`, `showcase.png` — **generated, never edit by hand**.
- `packages/vue/` — `@davidabou/icons-vue`, one functional Vue 3 component per icon (`<IconHeart :size="20" />`) plus an `icons` map by kebab-case name (`IconName` type, same names as the site URLs), built from the parsed SVG elements by `createIcon` (`src/create-icon.ts`), no `v-html`. `bun run vue:test` builds it and checks the SSR output.
- `packages/react/` — `@davidabou/icons-react`, the same for React 18/19 (`<IconHeart size={20} />`, `forwardRef`, same `icons` map and `IconName`), from the same nodes with React attribute names (`strokeWidth`…). `bun run react:test` builds it and checks the server-rendered markup.
- `packages/nuxt/` — Nuxt module (`<CodeXIcon name="arrow-left" />`, or `<code-x-icon>`: kebab-case names, from the `icons` map of `@davidabou/icons-vue`). `<DaIcon name="IconArrowLeft" />` and the `DaIconName` type are deprecated, kept for compatibility.
- `packages/site/` — Nuxt website (search, copy, download), statically generated and deployed on Vercel at icons.abou.dev (project root directory `packages/site`, build settings in `vercel.json`). It uses the local module and aliases `@davidabou/icons` to `src/index.ts` and `@davidabou/icons-vue` to `packages/vue/src/index.ts`, so new icons show up without publishing.
  - Each icon's dialog shows the first `@davidabou/icons` version that contains it, read at build time by `modules/icon-versions.ts` from the published npm tarballs. `npm-publish.yml` triggers a Vercel rebuild (`VERCEL_DEPLOY_HOOK` secret) after each publish, so nothing needs updating by hand. The same module reads the Iconify `codex` collection, to show the "View on Iconify" link only for icons Iconify already has.
  - UI: Tailwind CSS v4 + shadcn-vue components (`app/components/ui/`, added with `bunx shadcn-vue@latest add <name>`), animated by Animate UI: after adding a component, run `bunx @animate-ui/cli@latest animate all` (it swaps `reka-ui` imports for `@animate-ui/vue/primitives/reka-ui`). Components use `<CodeXIcon>`, never Lucide. Exception: `ui/tooltip` is built on Animate UI's own tooltip primitive (`@animate-ui/vue/primitives/tooltip`, one shared popup that glides between triggers), not on shadcn-vue: do not re-add it with the CLI. Font: Fredoka via `@nuxt/fonts`, minimum weight 500. Dark theme: `.dark` class on `<html>`, switched by Animate UI's `ThemeToggler`.
  - SEO: each icon has its own prerendered page `/icons/<slug>` (`app/pages/icons/[slug].vue`; the grid and the dialog stay in `app.vue`, which opens the dialog from the route). Titles, descriptions, canonical, OpenGraph and JSON-LD are set in `app.vue`. `modules/seo.ts` generates `robots.txt`, `sitemap.xml`, the social images (`og.png`, `og/<slug>.png`, rendered with resvg and Fredoka), `svg/<slug>.svg` and `apple-touch-icon.png` at build time, so new icons get them automatically. The site URL is `runtimeConfig.public.siteUrl`.
  - For LLMs and coding assistants: `modules/llms.ts` generates `llms.txt` (packages and usage, in Markdown) and `llms-full.txt` (the same plus every icon with its export and kebab-case names) at build time. Keep its usage examples in sync with the package READMEs.
  - Interaction sounds: `app/composables/useSound.ts` synthesizes them with the Web Audio API (no audio files). On by default, muted by the header button (kept in localStorage). To add one, add a recipe to `SOUNDS` and call `useSound().play('name')`.

## Commands

```sh
bun run generate   # regenerates index.ts, dist/icons, the Vue/React icons and showcase.png
bun run build      # generate + vite build (dist/index.mjs, index.umd.js, index.d.ts)
bun run site:dev   # website dev server (packages/site)
bun run site:generate  # static build of the website
bun run vue:test   # builds packages/vue and checks the rendered components
bun run react:test # builds packages/react and checks the rendered components
bun run set-version 0.3.0  # sets the same version on all published packages
```

After adding an icon: run `bun run build` and check that the report prints `N of N icons were generated`.

## Icon naming, style guide and checklist

The rules for drawing and naming icons live in `CONTRIBUTING.md`, imported here: follow them strictly.

@CONTRIBUTING.md

## Misc

- 2-space indentation, LF, final newline (`.editorconfig`).
- The project's package manager is **Bun** (CI: `bun install && bun run build`). The root is a Bun workspace with `packages/vue`, `packages/react` and `packages/nuxt` (one `bun.lock` at the root); `packages/site` stays outside, with its own `bun.lock`.
- **Synchronized versions**: `@davidabou/icons`, `@davidabou/icons-vue`, `@davidabou/icons-react` and `@davidabou/nuxt-icons` always share the same version, set with `bun run set-version <x.y.z>` (never edit one `version` field alone). `npm-publish.yml` (manual) publishes the four in that order and skips the ones already on npm. A breaking change in any package bumps all of them.
- The generator sorts icons explicitly (code-point order, so `H1`…`H6` come first) so its output is identical on Windows and Linux. CI regenerates and commits the build on every PR.
- devDependency versions are pinned by the root `bun.lock`. Keep TypeScript on the same major version at the root and in `packages/nuxt` (editors pick the root one), and check that `bun run build` still outputs only `dist/index.{mjs,umd.js,d.ts}` after upgrading Vite or `vite-plugin-dts`.
- Keep upstream compatibility: do not rename/remove existing icons (that would be a breaking change for `IconXxx` imports).
