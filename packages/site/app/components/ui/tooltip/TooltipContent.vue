<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from 'cn'
import { TooltipArrow, TooltipContent } from '@animate-ui/vue/primitives/tooltip'

/**
 * Animate UI's tooltip primitive (not Reka's): the content is rendered in the provider's shared
 * popup, which springs in and moves between triggers. Styled like the Luma tooltip.
 */
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <TooltipContent
    :class="cn('inline-flex w-fit max-w-xs items-center gap-1.5 rounded-xl bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:rounded-lg', props.class)"
  >
    <!-- Pushed 1px into the bubble: placed edge to edge, a hairline seam shows between them -->
    <TooltipArrow class="fill-foreground data-[side=bottom]:translate-y-px data-[side=left]:-translate-x-px data-[side=right]:translate-x-px data-[side=top]:-translate-y-px" />
    <slot />
  </TooltipContent>
</template>
