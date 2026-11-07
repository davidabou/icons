# CodeX Icons (extended)

[![npm](https://img.shields.io/npm/v/@davidabou/icons?label=%40davidabou%2Ficons)](https://www.npmjs.com/package/@davidabou/icons)
[![npm](https://img.shields.io/npm/v/@davidabou/icons-vue?label=%40davidabou%2Ficons-vue)](https://www.npmjs.com/package/@davidabou/icons-vue)
[![npm](https://img.shields.io/npm/v/@davidabou/icons-react?label=%40davidabou%2Ficons-react)](https://www.npmjs.com/package/@davidabou/icons-react)
[![npm](https://img.shields.io/npm/v/@davidabou/nuxt-icons?label=%40davidabou%2Fnuxt-icons)](https://www.npmjs.com/package/@davidabou/nuxt-icons)
[![npm downloads](https://img.shields.io/npm/dm/@davidabou/icons)](https://www.npmjs.com/package/@davidabou/icons)
[![license](https://img.shields.io/npm/l/@davidabou/icons)](LICENSE)

A growing set of small, airy outline icons. It extends [CodeX Icons](https://github.com/codex-team/icons) with new icons drawn to be indistinguishable from the originals, and keeps every original `IconXxx` export, so it works as a drop-in replacement for `@codexteam/icons`.

![CodeX Icons showcase](showcase.png)

## Features

- **Consistent style**: 24×24 grid, 14×14 live area, 2px rounded strokes, outline only.
- **Colors with your text**: every icon uses `currentColor`.
- **Lightweight**: plain SVG strings, no runtime dependencies, tree-shakable ES module.
- **Typed**: TypeScript declarations are included.
- **Vue and React components**: optional [Vue](packages/vue) and [React](packages/react) packages with one tree-shakable component per icon.
- **Nuxt ready**: an optional [Nuxt module](packages/nuxt) with an auto-imported `<CodeXIcon>` component.

## Installation

```sh
bun add @davidabou/icons
# or
npm install @davidabou/icons
```

## Usage

Each icon is exported as an SVG string, named after its file in `PascalCase` with an `Icon` prefix (`arrow-left.svg` → `IconArrowLeft`).

```js
import { IconHeart } from '@davidabou/icons';

button.innerHTML = IconHeart; // '<svg xmlns="http://www.w3.org/2000/svg" ...'
```

Icons are 24px by default. Resize them with CSS and color them with `color`:

```css
.icon svg {
  width: 20px;
  height: 20px;
  color: tomato;
}
```

### Vue

```sh
bun add @davidabou/icons-vue
```

```vue
<script setup lang="ts">
import { IconHeart } from '@davidabou/icons-vue';
</script>

<template>
  <IconHeart :size="20" class="text-primary" />
</template>
```

See the [package documentation](packages/vue#readme) for the properties.

### React

```sh
bun add @davidabou/icons-react
```

```tsx
import { IconHeart } from '@davidabou/icons-react';

<IconHeart size={20} className="text-primary" />
```

See the [package documentation](packages/react#readme) for the properties.

### Nuxt

```sh
bun add @davidabou/nuxt-icons
```

```vue
<CodeXIcon name="heart" :size="20" />
```

See the [module documentation](packages/nuxt#readme) for the setup.

### SVG files

Optimized SVG files are available in [`dist/icons`](dist/icons), for design tools or direct use in an `<img>`, for example through jsDelivr:

```html
<img src="https://cdn.jsdelivr.net/gh/davidabou/icons/dist/icons/IconHeart.svg" alt="" width="24" height="24">
```

### For LLMs and coding assistants

Point your assistant to [icons.abou.dev/llms-full.txt](https://icons.abou.dev/llms-full.txt): it describes the packages and lists every icon with its exact names, so the generated code uses icons that exist.

## List of icons

<!-- DO NOT EDIT THE FOLLOWING SECTION MANUALLY -->
<!-- BEGIN TABLE_OF_ICONS -->
| Icon | Name |
| --- | --- |
| ![IconH1](dist/icons/IconH1.svg) | `IconH1` |
| ![IconH2](dist/icons/IconH2.svg) | `IconH2` |
| ![IconH3](dist/icons/IconH3.svg) | `IconH3` |
| ![IconH4](dist/icons/IconH4.svg) | `IconH4` |
| ![IconH5](dist/icons/IconH5.svg) | `IconH5` |
| ![IconH6](dist/icons/IconH6.svg) | `IconH6` |
| ![IconAddBackground](dist/icons/IconAddBackground.svg) | `IconAddBackground` |
| ![IconAddBorder](dist/icons/IconAddBorder.svg) | `IconAddBorder` |
| ![IconAlignCenter](dist/icons/IconAlignCenter.svg) | `IconAlignCenter` |
| ![IconAlignJustify](dist/icons/IconAlignJustify.svg) | `IconAlignJustify` |
| ![IconAlignLeft](dist/icons/IconAlignLeft.svg) | `IconAlignLeft` |
| ![IconAlignRight](dist/icons/IconAlignRight.svg) | `IconAlignRight` |
| ![IconApplication](dist/icons/IconApplication.svg) | `IconApplication` |
| ![IconArchive](dist/icons/IconArchive.svg) | `IconArchive` |
| ![IconArrowDown](dist/icons/IconArrowDown.svg) | `IconArrowDown` |
| ![IconArrowLeft](dist/icons/IconArrowLeft.svg) | `IconArrowLeft` |
| ![IconArrowRight](dist/icons/IconArrowRight.svg) | `IconArrowRight` |
| ![IconArrowUp](dist/icons/IconArrowUp.svg) | `IconArrowUp` |
| ![IconBell](dist/icons/IconBell.svg) | `IconBell` |
| ![IconBold](dist/icons/IconBold.svg) | `IconBold` |
| ![IconBolt](dist/icons/IconBolt.svg) | `IconBolt` |
| ![IconBook](dist/icons/IconBook.svg) | `IconBook` |
| ![IconBookmark](dist/icons/IconBookmark.svg) | `IconBookmark` |
| ![IconBorder](dist/icons/IconBorder.svg) | `IconBorder` |
| ![IconBox](dist/icons/IconBox.svg) | `IconBox` |
| ![IconBracketsVertical](dist/icons/IconBracketsVertical.svg) | `IconBracketsVertical` |
| ![IconBrackets](dist/icons/IconBrackets.svg) | `IconBrackets` |
| ![IconBrain](dist/icons/IconBrain.svg) | `IconBrain` |
| ![IconBriefcase](dist/icons/IconBriefcase.svg) | `IconBriefcase` |
| ![IconCalendar](dist/icons/IconCalendar.svg) | `IconCalendar` |
| ![IconCart](dist/icons/IconCart.svg) | `IconCart` |
| ![IconChat](dist/icons/IconChat.svg) | `IconChat` |
| ![IconCheck](dist/icons/IconCheck.svg) | `IconCheck` |
| ![IconChecklist](dist/icons/IconChecklist.svg) | `IconChecklist` |
| ![IconChevronDown](dist/icons/IconChevronDown.svg) | `IconChevronDown` |
| ![IconChevronLeft](dist/icons/IconChevronLeft.svg) | `IconChevronLeft` |
| ![IconChevronRight](dist/icons/IconChevronRight.svg) | `IconChevronRight` |
| ![IconChevronUp](dist/icons/IconChevronUp.svg) | `IconChevronUp` |
| ![IconClipboard](dist/icons/IconClipboard.svg) | `IconClipboard` |
| ![IconClock](dist/icons/IconClock.svg) | `IconClock` |
| ![IconCloud](dist/icons/IconCloud.svg) | `IconCloud` |
| ![IconCode](dist/icons/IconCode.svg) | `IconCode` |
| ![IconCoffee](dist/icons/IconCoffee.svg) | `IconCoffee` |
| ![IconCollapse](dist/icons/IconCollapse.svg) | `IconCollapse` |
| ![IconColor](dist/icons/IconColor.svg) | `IconColor` |
| ![IconCopyCheck](dist/icons/IconCopyCheck.svg) | `IconCopyCheck` |
| ![IconCopy](dist/icons/IconCopy.svg) | `IconCopy` |
| ![IconCreditCard](dist/icons/IconCreditCard.svg) | `IconCreditCard` |
| ![IconCross](dist/icons/IconCross.svg) | `IconCross` |
| ![IconCurlyBrackets](dist/icons/IconCurlyBrackets.svg) | `IconCurlyBrackets` |
| ![IconCursor](dist/icons/IconCursor.svg) | `IconCursor` |
| ![IconDatabase](dist/icons/IconDatabase.svg) | `IconDatabase` |
| ![IconDelimiter](dist/icons/IconDelimiter.svg) | `IconDelimiter` |
| ![IconDesktop](dist/icons/IconDesktop.svg) | `IconDesktop` |
| ![IconDirectionDownRight](dist/icons/IconDirectionDownRight.svg) | `IconDirectionDownRight` |
| ![IconDirectionLeftDown](dist/icons/IconDirectionLeftDown.svg) | `IconDirectionLeftDown` |
| ![IconDirectionRightDown](dist/icons/IconDirectionRightDown.svg) | `IconDirectionRightDown` |
| ![IconDirectionUpRight](dist/icons/IconDirectionUpRight.svg) | `IconDirectionUpRight` |
| ![IconDocument](dist/icons/IconDocument.svg) | `IconDocument` |
| ![IconDotCircle](dist/icons/IconDotCircle.svg) | `IconDotCircle` |
| ![IconDownload](dist/icons/IconDownload.svg) | `IconDownload` |
| ![IconDrag](dist/icons/IconDrag.svg) | `IconDrag` |
| ![IconError](dist/icons/IconError.svg) | `IconError` |
| ![IconEtcHorisontal](dist/icons/IconEtcHorisontal.svg) | `IconEtcHorisontal` |
| ![IconEtcVertical](dist/icons/IconEtcVertical.svg) | `IconEtcVertical` |
| ![IconExternalLink](dist/icons/IconExternalLink.svg) | `IconExternalLink` |
| ![IconEye](dist/icons/IconEye.svg) | `IconEye` |
| ![IconFile](dist/icons/IconFile.svg) | `IconFile` |
| ![IconFilm](dist/icons/IconFilm.svg) | `IconFilm` |
| ![IconFilter](dist/icons/IconFilter.svg) | `IconFilter` |
| ![IconFolderOpen](dist/icons/IconFolderOpen.svg) | `IconFolderOpen` |
| ![IconFolder](dist/icons/IconFolder.svg) | `IconFolder` |
| ![IconGift](dist/icons/IconGift.svg) | `IconGift` |
| ![IconGitBranch](dist/icons/IconGitBranch.svg) | `IconGitBranch` |
| ![IconGlobe](dist/icons/IconGlobe.svg) | `IconGlobe` |
| ![IconGridView](dist/icons/IconGridView.svg) | `IconGridView` |
| ![IconHash](dist/icons/IconHash.svg) | `IconHash` |
| ![IconHeading](dist/icons/IconHeading.svg) | `IconHeading` |
| ![IconHeart](dist/icons/IconHeart.svg) | `IconHeart` |
| ![IconHidden](dist/icons/IconHidden.svg) | `IconHidden` |
| ![IconHome](dist/icons/IconHome.svg) | `IconHome` |
| ![IconHtml](dist/icons/IconHtml.svg) | `IconHtml` |
| ![IconInbox](dist/icons/IconInbox.svg) | `IconInbox` |
| ![IconInfo](dist/icons/IconInfo.svg) | `IconInfo` |
| ![IconInstagram](dist/icons/IconInstagram.svg) | `IconInstagram` |
| ![IconItalic](dist/icons/IconItalic.svg) | `IconItalic` |
| ![IconKey](dist/icons/IconKey.svg) | `IconKey` |
| ![IconLaptop](dist/icons/IconLaptop.svg) | `IconLaptop` |
| ![IconLightbulb](dist/icons/IconLightbulb.svg) | `IconLightbulb` |
| ![IconLink](dist/icons/IconLink.svg) | `IconLink` |
| ![IconLinkedin](dist/icons/IconLinkedin.svg) | `IconLinkedin` |
| ![IconListBulleted](dist/icons/IconListBulleted.svg) | `IconListBulleted` |
| ![IconListNumbered](dist/icons/IconListNumbered.svg) | `IconListNumbered` |
| ![IconLoader](dist/icons/IconLoader.svg) | `IconLoader` |
| ![IconLocation](dist/icons/IconLocation.svg) | `IconLocation` |
| ![IconLock](dist/icons/IconLock.svg) | `IconLock` |
| ![IconLogIn](dist/icons/IconLogIn.svg) | `IconLogIn` |
| ![IconLogOut](dist/icons/IconLogOut.svg) | `IconLogOut` |
| ![IconLogs](dist/icons/IconLogs.svg) | `IconLogs` |
| ![IconMail](dist/icons/IconMail.svg) | `IconMail` |
| ![IconMarker](dist/icons/IconMarker.svg) | `IconMarker` |
| ![IconMenuSmall](dist/icons/IconMenuSmall.svg) | `IconMenuSmall` |
| ![IconMenu](dist/icons/IconMenu.svg) | `IconMenu` |
| ![IconMicrophone](dist/icons/IconMicrophone.svg) | `IconMicrophone` |
| ![IconMinimize](dist/icons/IconMinimize.svg) | `IconMinimize` |
| ![IconMinus](dist/icons/IconMinus.svg) | `IconMinus` |
| ![IconMoney](dist/icons/IconMoney.svg) | `IconMoney` |
| ![IconMoon](dist/icons/IconMoon.svg) | `IconMoon` |
| ![IconMute](dist/icons/IconMute.svg) | `IconMute` |
| ![IconPause](dist/icons/IconPause.svg) | `IconPause` |
| ![IconPhone](dist/icons/IconPhone.svg) | `IconPhone` |
| ![IconPicture](dist/icons/IconPicture.svg) | `IconPicture` |
| ![IconPlay](dist/icons/IconPlay.svg) | `IconPlay` |
| ![IconPlug](dist/icons/IconPlug.svg) | `IconPlug` |
| ![IconPlus](dist/icons/IconPlus.svg) | `IconPlus` |
| ![IconQuestion](dist/icons/IconQuestion.svg) | `IconQuestion` |
| ![IconQuote](dist/icons/IconQuote.svg) | `IconQuote` |
| ![IconRedo](dist/icons/IconRedo.svg) | `IconRedo` |
| ![IconRefresh](dist/icons/IconRefresh.svg) | `IconRefresh` |
| ![IconRemoveBackground](dist/icons/IconRemoveBackground.svg) | `IconRemoveBackground` |
| ![IconReplace](dist/icons/IconReplace.svg) | `IconReplace` |
| ![IconRocket](dist/icons/IconRocket.svg) | `IconRocket` |
| ![IconSave](dist/icons/IconSave.svg) | `IconSave` |
| ![IconSearch](dist/icons/IconSearch.svg) | `IconSearch` |
| ![IconSend](dist/icons/IconSend.svg) | `IconSend` |
| ![IconSettings](dist/icons/IconSettings.svg) | `IconSettings` |
| ![IconShare](dist/icons/IconShare.svg) | `IconShare` |
| ![IconShield](dist/icons/IconShield.svg) | `IconShield` |
| ![IconSidebar](dist/icons/IconSidebar.svg) | `IconSidebar` |
| ![IconSort](dist/icons/IconSort.svg) | `IconSort` |
| ![IconSparkles](dist/icons/IconSparkles.svg) | `IconSparkles` |
| ![IconSpeedometer](dist/icons/IconSpeedometer.svg) | `IconSpeedometer` |
| ![IconStar](dist/icons/IconStar.svg) | `IconStar` |
| ![IconStop](dist/icons/IconStop.svg) | `IconStop` |
| ![IconStretch](dist/icons/IconStretch.svg) | `IconStretch` |
| ![IconStrikethrough](dist/icons/IconStrikethrough.svg) | `IconStrikethrough` |
| ![IconSun](dist/icons/IconSun.svg) | `IconSun` |
| ![IconTableWithHeadings](dist/icons/IconTableWithHeadings.svg) | `IconTableWithHeadings` |
| ![IconTableWithoutHeadings](dist/icons/IconTableWithoutHeadings.svg) | `IconTableWithoutHeadings` |
| ![IconTable](dist/icons/IconTable.svg) | `IconTable` |
| ![IconTag](dist/icons/IconTag.svg) | `IconTag` |
| ![IconTerminal](dist/icons/IconTerminal.svg) | `IconTerminal` |
| ![IconText](dist/icons/IconText.svg) | `IconText` |
| ![IconTranslate](dist/icons/IconTranslate.svg) | `IconTranslate` |
| ![IconTrash](dist/icons/IconTrash.svg) | `IconTrash` |
| ![IconTwitter](dist/icons/IconTwitter.svg) | `IconTwitter` |
| ![IconUnderline](dist/icons/IconUnderline.svg) | `IconUnderline` |
| ![IconUndo](dist/icons/IconUndo.svg) | `IconUndo` |
| ![IconUnlink](dist/icons/IconUnlink.svg) | `IconUnlink` |
| ![IconUnlock](dist/icons/IconUnlock.svg) | `IconUnlock` |
| ![IconUpload](dist/icons/IconUpload.svg) | `IconUpload` |
| ![IconUser](dist/icons/IconUser.svg) | `IconUser` |
| ![IconUsersGroup](dist/icons/IconUsersGroup.svg) | `IconUsersGroup` |
| ![IconVideo](dist/icons/IconVideo.svg) | `IconVideo` |
| ![IconVolume](dist/icons/IconVolume.svg) | `IconVolume` |
| ![IconWarning](dist/icons/IconWarning.svg) | `IconWarning` |
<!-- END TABLE_OF_ICONS -->

## Contributing

- Request an icon via [an issue](https://github.com/davidabou/icons/issues/new).
- Or draw it yourself: add an SVG to `src/icons/` following the style guide in [`CLAUDE.md`](CLAUDE.md), run `bun run build`, and open a PR.

## License

[MIT](LICENSE). Original icons © 2022 CodeX, additions © 2026 davidabou.

This is an independent fork, not affiliated with or endorsed by CodeX.
