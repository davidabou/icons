<script setup lang="ts">
import type { IconEntry } from '~/composables/useIcons';
import { CopyButton, CopyButtonIcon } from '@animate-ui/vue/primitives/buttons/copy';
import { cn } from 'cn';
import { buttonVariants } from '~/components/ui/button';

const sound = useSound();

const props = defineProps<{
  icon: IconEntry | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const DEFAULT_SIZE = 48;
const sizes = [16, 20, 24, 32, 48];
const size = ref(DEFAULT_SIZE);
/** null = currentColor */
const color = ref<string | null>(null);
const tab = ref('vue');

const customized = computed(() => size.value !== DEFAULT_SIZE || color.value !== null);

function reset () {
  sound.play('tap');
  size.value = DEFAULT_SIZE;
  color.value = null;
}


/**
 * The SVG with the chosen size and color applied
 */
const svg = computed(() => {
  if (!shown.value) {
    return '';
  }
  let markup = shown.value.svg.replace('width="24" height="24"', `width="${size.value}" height="${size.value}"`);

  if (color.value) {
    markup = markup.replaceAll('currentColor', color.value);
  }

  return markup;
});

/**
 * Last opened icon: kept while the dialog animates out, so its content does not vanish at once
 */
const shown = ref<IconEntry | null>(props.icon);

watch(() => props.icon, icon => {
  if (icon) {
    shown.value = icon;
  }
});

/**
 * First published version containing each icon, read at build time from the npm tarballs
 * (see modules/icon-versions.ts); null when the registry could not be reached
 */
const releases = useAppConfig().iconReleases as Record<string, string> | null;
const release = computed(() => (shown.value && releases?.[shown.value.name]) || null);

const releaseLabel = computed(() => release.value ? `Added in v${release.value}` : 'Unreleased');

/**
 * Icons on Iconify (`codex` prefix), read at build time: a new icon only gets there after Iconify
 * syncs the repo. null when the API could not be reached: the link is then shown for every icon.
 */
const iconify = useAppConfig().iconifyIcons as string[] | null;
const onIconify = computed(() => !!shown.value && (!iconify || iconify.includes(shown.value.slug)));

const snippets = computed(() => {
  if (!shown.value) {
    return [];
  }
  const { name } = shown.value;
  // The strings are 24px: another size rewrites the root attributes, as in the SVG tab
  const sized = size.value !== 24;
  const icon = sized ? 'icon' : name;
  const script = [
    `import { ${name} } from '@davidabou/icons';`,
    ...sized ? ['', `const icon = ${name}.replace('width="24" height="24"', 'width="${size.value}" height="${size.value}"');`] : []
  ].join('\n');
  const vueStyle = color.value ? ` style="color: ${color.value}"` : '';
  const reactStyle = color.value ? ` style={{ color: '${color.value}' }}` : '';

  return [
    {
      id: 'vue',
      label: 'Vue',
      // Split tag: a literal closing script tag would end this component's own script block
      code: `<script setup>\n${script}\n</` + `script>\n\n<template>\n  <span v-html="${icon}"${vueStyle} />\n</template>`
    },
    {
      id: 'react',
      label: 'React',
      code: `${script}\n\n<span dangerouslySetInnerHTML={{ __html: ${icon} }}${reactStyle} />`
    },
    { id: 'svg', label: 'SVG', code: svg.value }
  ];
});

/** Shows a check on the download button for a moment, like the copy buttons */
const downloaded = ref(false);
let downloadedTimeout: ReturnType<typeof setTimeout> | undefined;

function download () {
  if (!shown.value) {
    return;
  }
  const url = URL.createObjectURL(new Blob([svg.value], { type: 'image/svg+xml' }));
  const link = document.createElement('a');

  link.href = url;
  link.download = `${shown.value.slug}.svg`;
  link.click();
  URL.revokeObjectURL(url);

  // Same delay as the copy buttons
  sound.play('success');
  downloaded.value = true;
  clearTimeout(downloadedTimeout);
  downloadedTimeout = setTimeout(() => downloaded.value = false, 3000);
}

onBeforeUnmount(() => clearTimeout(downloadedTimeout));
</script>

<template>
  <Dialog :open="!!icon" @update:open="(open: boolean) => { if (!open) emit('close') }">
    <DialogContent
      :show-close-button="false"
      class="gap-0 overflow-hidden p-0 sm:max-w-[760px]"
      @open-auto-focus="(event: Event) => event.preventDefault()"
    >
      <!-- `shown` outlives `icon` while the close animation plays -->
      <template v-if="shown">
        <!-- Header: breadcrumb, close -->
        <div class="flex items-center justify-between gap-4 px-6 pt-5 pb-2">
          <nav class="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <span class="truncate">@davidabou/icons</span>
            <DaIcon name="IconChevronRight" :size="16" class="shrink-0" />
            <span class="truncate font-semibold text-foreground">{{ shown.slug }}</span>
          </nav>
          <DialogClose as-child>
            <Button variant="ghost" size="icon-lg" class="shrink-0 text-muted-foreground" aria-label="Close">
              <DaIcon name="IconCross" :size="20" />
            </Button>
          </DialogClose>
        </div>

        <!-- 174px: the preview is as tall as the column next to it (title, badge, settings, download) -->
        <div class="grid gap-6 px-6 pt-4 pb-6 sm:grid-cols-[174px_1fr]">
          <!-- Preview, at the chosen size and color -->
          <div class="flex aspect-square items-center justify-center rounded-3xl bg-muted" :style="color ? { color } : undefined">
            <DaIcon :name="shown.name" :size="size" />
          </div>

          <div class="flex min-w-0 flex-col gap-4">
            <div>
              <div class="flex items-center gap-1">
                <DialogTitle class="truncate text-2xl font-semibold">
                  {{ shown.name }}
                </DialogTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <CopyButton
                      :content="shown.name"
                      :class="cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'text-muted-foreground')"
                      aria-label="Copy icon name"
                      @copied-change="(copied: boolean) => copied && sound.play('success')"
                    >
                      <CopyButtonIcon>
                        <template #icon>
                          <DaIcon name="IconCopy" :size="20" />
                        </template>
                        <template #copied-icon>
                          <DaIcon name="IconCheck" :size="20" />
                        </template>
                      </CopyButtonIcon>
                    </CopyButton>
                  </TooltipTrigger>
                  <TooltipContent>Copy name</TooltipContent>
                </Tooltip>
              </div>
              <DialogDescription as-child>
                <div class="mt-1.5 flex">
                  <!-- Hidden when the registry could not be reached at build time -->
                  <Badge
                    v-if="releases"
                    :variant="release ? 'secondary' : 'default'"
                    class="h-6 rounded-full px-2.5 text-[13px]"
                  >
                    {{ releaseLabel }}
                  </Badge>
                </div>
              </DialogDescription>
            </div>

            <!-- Customization: size, color, reset -->
            <div class="flex flex-wrap items-center gap-2">
              <Select :model-value="String(size)" @update:model-value="(value) => { if (value) { size = Number(value); sound.play('tap') } }">
                <SelectTrigger class="w-28" aria-label="Size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" :side-offset="6" class="p-1">
                  <SelectItem v-for="option in sizes" :key="option" :value="String(option)">
                    {{ option }}px
                  </SelectItem>
                </SelectContent>
              </Select>

              <ColorPicker v-model="color" />

              <Tooltip>
                <TooltipTrigger :disabled="!customized">
                  <Button
                    variant="outline"
                    size="icon"
                    :disabled="!customized"
                    aria-label="Reset size and color"
                    @click="reset"
                  >
                    <DaIcon name="IconRefresh" :size="20" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset</TooltipContent>
              </Tooltip>
            </div>

            <!-- Actions, using the customized SVG -->
            <div class="flex flex-wrap gap-2">
              <!-- A CopyButton with nothing to copy, for the same icon swap as the copy buttons -->
              <CopyButton
                content=""
                :copied="downloaded"
                :class="buttonVariants({ variant: 'secondary', size: 'lg' })"
                @click="download"
              >
                <CopyButtonIcon>
                  <template #icon>
                    <DaIcon name="IconDownload" :size="20" />
                  </template>
                  <template #copied-icon>
                    <DaIcon name="IconCheck" :size="20" />
                  </template>
                </CopyButtonIcon>
                Download SVG
              </CopyButton>
              <Button
                v-if="onIconify"
                as="a"
                variant="ghost"
                size="lg"
                :href="`https://icon-sets.iconify.design/codex/${shown.slug}/`"
                target="_blank"
                rel="noopener"
              >
                <DaIcon name="IconExternalLink" :size="20" />
                View on Iconify
              </Button>
            </div>
          </div>
        </div>

        <!-- Usage snippets -->
        <Tabs v-model="tab" class="gap-3 border-t bg-muted/40 px-6 pt-5 pb-6" @update:model-value="sound.play('tap')">
          <TabsList class="w-full sm:w-fit">
            <TabsTrigger v-for="snippet in snippets" :key="snippet.id" :value="snippet.id" class="px-4">
              {{ snippet.label }}
            </TabsTrigger>
          </TabsList>
          <TabsContent v-for="snippet in snippets" :key="snippet.id" :value="snippet.id">
            <CodeRow :code="snippet.code" :label="snippet.label" wrap class="min-h-24 bg-background" />
          </TabsContent>
        </Tabs>
      </template>
    </DialogContent>
  </Dialog>
</template>
