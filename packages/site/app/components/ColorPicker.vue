<script setup lang="ts">
import type { Color, HSBColor } from 'reka-ui'
import { ColorAreaArea, ColorAreaRoot, ColorAreaThumb, ColorFieldInput, ColorFieldRoot, ColorSliderRoot, ColorSliderThumb, ColorSliderTrack, colorToString, convertToHsb, parseColor } from 'reka-ui'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'

const { play } = useSound()

const props = defineProps<{
  /** Hex color, or null for currentColor */
  modelValue: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const thumb = 'block size-4 rounded-full border-2 border-white shadow-md ring-1 ring-black/15 outline-none focus-visible:ring-3 focus-visible:ring-ring/50'

/** Starting point of the picker while the color is currentColor */
const FALLBACK = '#18181b'

/**
 * The picker works on an exact HSB color, never on the hex value: hex rounds each channel to
 * 0–255, so reading the area position back from it after a hue change would move the thumb
 * (a lot, on dark colors), and greys would lose their hue.
 */
const draft = ref<HSBColor>(convertToHsb(parseColor(props.modelValue ?? FALLBACK)))

/** Last hex sent to the dialog, to tell our own updates from outside ones (reset) */
let sent: string | null = null
let frame = 0

watch(() => props.modelValue, (value) => {
  if (value !== sent) {
    draft.value = convertToHsb(parseColor(value ?? FALLBACK))
  }
})

/**
 * The picker follows the pointer at once; the rest of the dialog (preview, snippets) is updated
 * at most once per frame, as pointer moves can fire more often than the screen refreshes.
 */
function update(color: HSBColor) {
  draft.value = color
  frame ||= requestAnimationFrame(() => {
    frame = 0
    sent = colorToString(draft.value, 'hex')
    emit('update:modelValue', sent)
  })
}

/** Hex typed in the field; greys keep the current hue */
function typed(hex: string) {
  // The field commits on every blur, even untouched: that must not turn currentColor into a hex
  if (hex.toLowerCase() === colorToString(draft.value, 'hex')) {
    return
  }
  const color = convertToHsb(parseColor(hex))

  update(color.s === 0 || color.b === 0 ? { ...color, h: draft.value.h } : color)
}

onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <Popover @update:open="(open: boolean) => open && play('tap')">
    <PopoverTrigger as-child>
      <!-- pl-2: same 8px gap on the left as above and below the 20px swatch (h-9) -->
      <button
        type="button"
        class="flex h-9 cursor-pointer items-center gap-2 rounded-3xl bg-input/50 pr-3 pl-2 text-sm transition-[color,box-shadow,background-color] outline-none hover:bg-input/80 focus-visible:ring-3 focus-visible:ring-ring/30 aria-expanded:bg-input/80"
        aria-label="Color"
      >
        <span class="size-5 rounded-full border" :style="{ background: modelValue ?? 'currentColor' }" />
        <span class="font-mono text-[13px]">{{ modelValue ?? 'currentColor' }}</span>
      </button>
    </PopoverTrigger>

    <PopoverContent align="start" :side-offset="6" class="w-64 gap-3 p-3">
      <!-- Saturation (x) and brightness (y) for the current hue -->
      <ColorAreaRoot
        v-slot="{ style }"
        :model-value="draft"
        color-space="hsb"
        x-channel="saturation"
        y-channel="brightness"
        @update:color="(value: Color) => update(convertToHsb(value))"
      >
        <ColorAreaArea class="relative h-36 w-full rounded-2xl" :style="style">
          <ColorAreaThumb :class="thumb" />
        </ColorAreaArea>
      </ColorAreaRoot>

      <!-- Hue, with its value above the slider -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between text-xs text-muted-foreground select-none">
          <span>Hue</span>
          <span class="font-mono tabular-nums">{{ Math.round(draft.h) }}°</span>
        </div>
        <ColorSliderRoot
          :model-value="draft"
          channel="hue"
          color-space="hsb"
          class="relative flex h-4 w-full touch-none items-center select-none"
          @update:color="(value: Color) => update({ ...draft, h: convertToHsb(value).h })"
        >
          <ColorSliderTrack class="relative h-3 w-full grow rounded-full" />
          <ColorSliderThumb :class="thumb" aria-label="Hue" />
        </ColorSliderRoot>
      </div>

      <ColorFieldRoot :model-value="draft" @update:model-value="typed">
        <ColorFieldInput
          class="h-9 w-full rounded-3xl bg-input/50 px-3 font-mono text-[13px] uppercase transition-[color,box-shadow,background-color] outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          aria-label="Hex color"
        />
      </ColorFieldRoot>
    </PopoverContent>
  </Popover>
</template>
