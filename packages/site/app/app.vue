<script setup lang="ts">
import type { IconEntry } from './composables/useIcons';
import { Highlight, HighlightItem } from '@animate-ui/vue/primitives/effects/highlight';
import { ThemeToggler } from '@animate-ui/vue/primitives/effects/theme-toggler';

const icons = useIcons();
const sound = useSound();

const links = [
  { label: 'GitHub', href: 'https://github.com/davidabou/icons' },
  { label: 'npm', href: 'https://www.npmjs.com/package/@davidabou/icons' }
];

/**
 * External URLs, bound rather than written as static attributes: vue-tsc 3.3 turns the `//` of a
 * static `href="https://…"` into a comment in its generated code, which breaks the type checking
 * of the rest of the template (spurious "Property 'value' does not exist" errors).
 */
const urls = {
  sponsor: 'https://github.com/sponsors/davidabou',
  iconRequest: 'https://github.com/davidabou/icons/issues/new?template=icon-request.yml',
  upstream: 'https://github.com/codex-team/icons'
};

/**
 * Theme: the initial class is set by an inline script before hydration, to avoid a flash.
 * Animate UI's ThemeToggler then animates each switch and commits it through setTheme.
 */
useHead({
  script: [{
    innerHTML: `(function(){try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`
  }]
});

type Theme = 'light' | 'dark';

const theme = ref<Theme>('light');

function setTheme (value: Theme | 'system') {
  const resolved: Theme = value === 'system'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : value;

  theme.value = resolved;
  sound.play('toggle');
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  localStorage.setItem('theme', resolved);
}

/**
 * Install command, for each package manager
 */
const installTabs = [
  { id: 'pnpm', label: 'pnpm', code: 'pnpm add @davidabou/icons' },
  { id: 'npm', label: 'npm', code: 'npm install @davidabou/icons' },
  { id: 'yarn', label: 'yarn', code: 'yarn add @davidabou/icons' },
  { id: 'bun', label: 'bun', code: 'bun add @davidabou/icons' }
];

const installTab = ref('pnpm');

/**
 * Search and preview size
 */
const query = ref('');
const searchInput = ref<{ $el: HTMLInputElement }>();
const sizes = [16, 24, 32];
const previewSize = ref(24);

/**
 * "Suggest an icon" link: opens the icon request form with the search prefilled as the icon name.
 */
const iconRequestUrl = computed(() => {
  const name = query.value.trim();
  const params = new URLSearchParams({ title: `Icon request: ${name}`, name });

  return `${urls.iconRequest}&${params}`;
});

const filtered = computed(() => {
  const words = query.value.trim().toLowerCase().split(/[\s-]+/).filter(Boolean);

  if (!words.length) {
    return icons;
  }

  return icons.filter(icon => {
    const haystack = `${icon.slug} ${icon.name.toLowerCase()}`;

    return words.every(word => haystack.includes(word));
  });
});

/**
 * Selected icon: the route itself (/icons/arrow-left), so it can be shared and indexed.
 * Sounds play from the clicks themselves: opening from the URL is silent.
 */
const route = useRoute();
const router = useRouter();

const selected = computed<IconEntry | null>(() => icons.find(icon => icon.slug === route.params.slug) ?? null);

function close () {
  sound.play('close');
  // Opened from the grid: going back closes it, without leaving a /icons entry to come back to
  if (router.options.history.state.back === '/') {
    router.back();
  } else {
    router.replace('/');
  }
}

/** Title, description, social previews and structured data of the current page */
useIconSeo(selected);

/**
 * Keyboard: "/" focuses the search, Escape clears it (the Dialog closes itself on Escape)
 */
function onKeydown (event: KeyboardEvent) {
  const input = searchInput.value?.$el;
  const typing = event.target instanceof HTMLInputElement;

  if (event.key === '/' && !typing) {
    event.preventDefault();
    input?.focus();
  } else if (event.key === 'Escape' && typing && !selected.value) {
    query.value = '';
    input?.blur();
  }
}

onMounted(() => {
  theme.value = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  // Links shared before icon pages existed (/?icon=arrow-left)
  const legacy = route.query.icon;

  if (typeof legacy === 'string' && icons.some(icon => icon.slug === legacy)) {
    router.replace(`/icons/${legacy}`);
  }

  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <TooltipProvider :open-delay="300">
    <div class="mx-auto max-w-280 px-4 sm:px-6">
      <header class="flex h-18 items-center justify-between">
        <NuxtLink class="flex items-center gap-2 text-[17px] font-semibold" to="/">
          <DaIcon name="IconSparkles" class="text-primary" />
          <div class="inline-flex items-baseline gap-2">
            <span>CodeX Icons</span>
            <span class="text-muted-foreground text-sm">Extended</span>
          </div>
        </NuxtLink>
        <nav class="flex items-center gap-1">
          <Button
            v-for="link in links"
            :key="link.label"
            as="a"
            variant="ghost"
            :href="link.href"
            target="_blank"
            rel="noopener"
            class="text-muted-foreground"
          >
            {{ link.label }}
          </Button>
          <Button
            as="a"
            variant="outline"
            :href="urls.sponsor"
            target="_blank"
            rel="noopener"
            aria-label="Sponsor on GitHub"
            class="mx-1 gap-1.5 px-2.5 sm:px-3"
          >
            <DaIcon name="IconHeart" class="text-pink-500" />
            <span class="hidden sm:inline">Sponsor</span>
          </Button>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon-lg"
                class="text-muted-foreground"
                :aria-label="sound.enabled.value ? 'Mute sounds' : 'Unmute sounds'"
                :aria-pressed="!sound.enabled.value"
                @click="sound.toggle"
              >
                <DaIcon :name="sound.enabled.value ? 'IconVolume' : 'IconMute'" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{{ sound.enabled.value ? 'Mute sounds' : 'Unmute sounds' }}</TooltipContent>
          </Tooltip>
          <ThemeToggler
            v-slot="{ resolved, toggleTheme }"
            :theme="theme"
            :resolved-theme="theme"
            :set-theme="setTheme"
            direction="ltr"
          >
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  class="text-muted-foreground"
                  :aria-label="resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
                  @click="toggleTheme(resolved === 'dark' ? 'light' : 'dark')"
                >
                  <DaIcon :name="resolved === 'dark' ? 'IconSun' : 'IconMoon'" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{{ resolved === 'dark' ? 'Light theme' : 'Dark theme' }}</TooltipContent>
            </Tooltip>
          </ThemeToggler>
        </nav>
      </header>

      <section class="max-w-160 pt-8 pb-6 sm:pt-14 sm:pb-10">
        <h1 class="mb-3 text-[clamp(32px,5vw,44px)] leading-[1.1] font-semibold tracking-tight">
          {{ icons.length }} rounded outline icons
        </h1>
        <p class="mb-7 text-[17px] leading-normal text-muted-foreground">
          Drawn on a 24×24 grid with a 2px stroke. They take the current text color. Click an icon to copy it.
        </p>
        <Tabs v-model="installTab" class="max-w-110" @update:model-value="sound.play('tap')">
          <TabsList>
            <TabsTrigger v-for="tab in installTabs" :key="tab.id" :value="tab.id" class="px-3">
              {{ tab.label }}
            </TabsTrigger>
          </TabsList>
          <TabsContent v-for="tab in installTabs" :key="tab.id" :value="tab.id">
            <CodeRow :code="tab.code" label="Install command" />
          </TabsContent>
        </Tabs>
      </section>

      <div class="sticky top-0 z-5 flex gap-3 bg-background py-3">
        <div class="relative flex-1">
          <DaIcon name="IconSearch" :size="20" class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref="searchInput"
            v-model="query"
            type="search"
            :placeholder="`Search ${icons.length} icons`"
            aria-label="Search icons"
            class="h-12 pr-12 pl-11 text-base md:text-base"
          />
          <Kbd v-if="!query" class="absolute top-1/2 right-3.5 -translate-y-1/2 bg-transparent">/</Kbd>
        </div>
        <ToggleGroup
          :model-value="previewSize"
          type="single"
          variant="outline"
          class="hidden h-12 sm:flex"
          aria-label="Preview size"
          @update:model-value="(value) => { if (value) { previewSize = Number(value); sound.play('tap') } }"
        >
          <ToggleGroupItem
            v-for="size in sizes"
            :key="size"
            :value="size"
            class="h-12 w-12"
            :aria-label="`${size} pixels`"
          >
            {{ size }}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <main>
        <p class="mt-1 mb-3 text-sm text-muted-foreground" aria-live="polite">
          {{ filtered.length }} {{ filtered.length === 1 ? 'icon' : 'icons' }}
        </p>
        <!--
          "parent" mode: a single surface for the whole grid, whose position and size are animated.
          Moving fast across tiles retargets the same spring (keeping its velocity) instead of
          destroying and recreating a surface in each tile, which looked jerky.
          Each grid cell (padding included) is an item, so there is no dead zone between tiles;
          boundsOffset shrinks the surface back to the tile.
          The surface ignores the pointer: it lies over the cell padding, and hovering it would
          count as leaving the item, clearing the surface and recreating it.
        -->
        <Highlight
          v-if="filtered.length"
          mode="parent"
          hover
          controlled-items
          class="pointer-events-none rounded-2xl bg-muted"
          :bounds-offset="{ top: 4, left: 4, width: -8, height: -8 }"
          :transition="{ type: 'spring', stiffness: 400, damping: 40 }"
          @update:model-value="(value) => value && sound.play('tick')"
        >
          <ul class="-m-1 grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
            <HighlightItem
              v-for="icon in filtered"
              :key="icon.name"
              :value="icon.slug"
              as="li"
              class="p-1"
            >
              <!--
                No selected state: the dialog opens over the grid.
                A real link to the icon's page, so search engines can follow it.
              -->
              <NuxtLink
                :to="`/icons/${icon.slug}`"
                :title="icon.name"
                class="flex aspect-square w-full flex-col items-center justify-center gap-3.5 rounded-2xl px-2 py-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                @click="sound.play('open')"
              >
                <DaIcon :name="icon.name" :size="previewSize" />
                <span class="max-w-full truncate text-xs text-muted-foreground">{{ icon.slug }}</span>
              </NuxtLink>
            </HighlightItem>
          </ul>
        </Highlight>
        <div v-else class="flex flex-col items-center gap-3 py-20 text-muted-foreground">
          <DaIcon name="IconSearch" :size="32" />
          <p>No icon matches “{{ query }}”.</p>
          <Button as="a" variant="outline" :href="iconRequestUrl" target="_blank" rel="noopener">
            Suggest an icon
          </Button>
        </div>
      </main>

      <footer class="pt-16 pb-10 text-center text-sm text-muted-foreground">
        MIT licensed · Fork of
        <Button as="a" variant="link" class="h-auto p-0 text-muted-foreground" :href="urls.upstream" target="_blank" rel="noopener">
          CodeX Icons
        </Button>
      </footer>
    </div>

    <IconDialog :icon="selected" @close="close" />
    <NuxtPage />
  </TooltipProvider>
</template>
