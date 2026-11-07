# Contributing

Thanks for helping the set grow! The goal of this fork is more icons, each one **visually indistinguishable** from the existing ones: the style rules below are strict.

## Requesting an icon

[Open an icon request](https://github.com/davidabou/icons/issues/new?template=icon-request.yml): give it a name, describe where you would use it, and add references if you have some. Check [icons.abou.dev](https://icons.abou.dev) first: the icon may already exist under another name.

## Drawing an icon

1. Fork the repository and install the dependencies with [Bun](https://bun.sh): `bun install`.
2. Add your SVG to `src/icons/`, following the naming rules, the style guide and the checklist below.
3. Run `bun run build` and check that the report prints `N of N icons were generated`.
4. Commit the SVG with the regenerated files, and open a pull request.

Only `src/icons/*.svg` is edited by hand: `src/index.ts`, `dist/`, `packages/vue/src/icons.ts`, `packages/react/src/icons.ts` and `showcase.png` are generated from it.

Existing icons are never renamed or removed: their `IconXxx` exports are used by apps and by Iconify (`codex` prefix).

To preview your icon on the website, run `bun run site:dev`: it uses the icons of your working copy.

## Naming

- File name in **kebab-case**, in English: `arrow-left.svg`, `table-with-headings.svg`.
- The export name is derived automatically: `arrow-left.svg` → `IconArrowLeft`. Do not prefix the file with `icon-`.
- Name = what the icon represents or the action it triggers (`trash`, `copy`, `search`), not its shape.
- Variants: descriptive suffix (`menu` / `menu-small`, `chevron-up` / `chevron-down`, `direction-up-right`).
- Check that no existing icon already covers the need before creating a new one.

## Style guide (strictly enforced)

Values measured on the existing icons (`check`, `plus`, `search`, `picture`, `warning`, `align-left`…).

### Canvas

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  ...
</svg>
```

- Always **24×24**, `viewBox="0 0 24 24"`, `fill="none"` on the root element.
- **Live area ≈ 14×14, from 5 to 19** on each axis (5px padding). The path (stroke centerline) stays within this area: icons are intentionally **small and airy** inside their square. Do not fill the canvas edge to edge.
- Simple shapes can be even smaller (e.g. `plus` / `cross` / `check`: 7→17 or 8→16; `dot-circle`: circle r=4).
- Optically center the icon on (12, 12).

### Stroke

- `stroke="black"` — svgo converts it to `currentColor` during generation. Never use any other color (no grey, no `#hex`).
- `stroke-width="2"` — **standard weight, non-negotiable**.
- `stroke-linecap="round"` on every open stroke (lines, unclosed paths).
- `stroke-linejoin="round"` whenever a path has corners.
- **No fills**: 100% outline style. Solid dots are drawn with a near-zero-length stroke (see below). Only exception: the media controls (see below).

### Recurring shapes

- **Container rectangle** (picture frame, warning…): `<rect x="5" y="5" width="14" height="14" rx="4" .../>` — rounded corners `rx="4"`.
- **Dots** (menus, "etc."): a near-zero-length path with a thicker stroke:
  ```svg
  <path d="M12.01 12H12" stroke="black" stroke-width="2.6" stroke-linecap="round"/>
  ```
  `2.6` is the **only** allowed exception to `stroke-width="2"`, and only for dots.
- **Small accent dot** (sun in `picture`, dot in `warning`): near-zero-length path with `stroke-width="2"`.
- **Text lines** (`align-*`, `list-*`): horizontal lines spaced 5px apart (y = 7, 12, 17), from x=5 to x=17/19.
- **Curves**: prefer soft curves and rounded ends; no harsh sharp angles.

### Media controls (filled exception)

`play`, `pause` and `stop` are **solid shapes without a container**, by convention for player controls. Each shape uses `fill="black"` **plus** a matching `stroke="black" stroke-width="2" stroke-linejoin="round"`, which rounds its corners; svgo turns both into `currentColor`. All three share the same visible height (6→18). Do not extend this filled style to other icons.

### Forbidden

- No colored `fill`, gradients, shadows, filters, `<style>`, CSS classes, `<mask>`/`<clipPath>` unless absolutely necessary.
- No text (`<text>`): letters (H1, B, I…) are drawn as paths.
- No complex `transform` when direct coordinates would do.
- No canvas size other than 24×24, no stroke width other than 2 (except 2.6 for dots).

## Adding an icon — checklist

1. Pick 2–3 similar existing icons (same family or same complexity) as references and re-read them before drawing.
2. Create `src/icons/<kebab-name>.svg` with the canvas above, paths within the 5→19 area, `stroke="black"`, `stroke-width="2"`, `round` caps/joins, no `fill`.
3. Readable coordinates: round to 2 decimals max when possible; snap straight lines to integers/half-integers (crisp rendering).
4. Check consistency with a quick sanity check:
   ```sh
   grep -L 'viewBox="0 0 24 24"' src/icons/*.svg          # should list nothing
   grep -oh 'stroke-width="[^"]*"' src/icons/*.svg | sort | uniq -c
   ```
5. `bun run build`, then visually check the new icon in `showcase.png`, next to the existing ones (also check `dist/icons/Icon<Name>.svg` at 24px **and** 16px).
6. Commit the source SVG **and** the regenerated files (`src/index.ts`, `packages/vue/src/icons.ts`, `packages/react/src/icons.ts`, `dist/`, `showcase.png`).
