<script setup lang="ts">
import type { SelectSeparatorProps } from '@animate-ui/vue/primitives/reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { cn } from 'cn'
import { SelectSeparator } from '@animate-ui/vue/primitives/reka-ui'

const props = defineProps<SelectSeparatorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <SelectSeparator
    data-slot="select-separator"
    v-bind="delegatedProps"
    :class="cn('bg-border -mx-1.5 my-1.5 h-px pointer-events-none', props.class)"
  />
</template>
