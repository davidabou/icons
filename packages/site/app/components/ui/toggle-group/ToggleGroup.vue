<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority'
import type { ToggleGroupRootEmits, ToggleGroupRootProps } from '@animate-ui/vue/primitives/reka-ui'
import type { HTMLAttributes } from 'vue'
import type { toggleVariants } from '@/components/ui/toggle'
import { reactiveOmit } from '@vueuse/core'
import { cn } from 'cn'
import { ToggleGroupRoot, useForwardPropsEmits } from '@animate-ui/vue/primitives/reka-ui'
import { provide } from 'vue'

type ToggleGroupVariants = VariantProps<typeof toggleVariants>

const props = withDefaults(defineProps<ToggleGroupRootProps & {
  class?: HTMLAttributes['class']
  variant?: ToggleGroupVariants['variant']
  size?: ToggleGroupVariants['size']
  spacing?: number
}>(), {
  spacing: 0,
  // Reka only sets data-orientation (used by the first/last item radius) when it is given
  orientation: 'horizontal',
})

const emits = defineEmits<ToggleGroupRootEmits>()

provide('toggleGroup', {
  variant: props.variant,
  size: props.size,
  spacing: props.spacing,
})

const delegatedProps = reactiveOmit(props, 'class', 'size', 'variant')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ToggleGroupRoot
    v-slot="slotProps"
    data-slot="toggle-group"
    :data-size="size"
    :data-variant="variant"
    :data-spacing="spacing"
    :style="{
      '--gap': spacing,
    }"
    v-bind="forwarded"
    :class="cn('data-[spacing=0]:data-[variant=outline]:rounded-3xl group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-vertical:flex-col data-vertical:items-stretch', props.class)"
  >
    <slot v-bind="slotProps" />
  </ToggleGroupRoot>
</template>
