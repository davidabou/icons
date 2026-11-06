<script setup lang="ts">
import { TooltipTrigger } from '@animate-ui/vue/primitives/tooltip'

defineProps<{
  /** No tooltip, for a disabled button: the wrapper would still catch the hover */
  disabled?: boolean
}>()
</script>

<template>
  <!--
    Always a wrapper, never as-child: the trigger must resolve to an element to position the
    tooltip, and our Button and CopyButton render through fragments (motion config providers).
    Hover and focus still reach it from the button inside.
  -->
  <TooltipTrigger class="inline-flex" :class="disabled && 'pointer-events-none'">
    <slot />
  </TooltipTrigger>
</template>
