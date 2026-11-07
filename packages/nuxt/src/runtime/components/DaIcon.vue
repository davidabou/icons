<script setup lang="ts">
import { computed } from 'vue';
import type { DaIconName } from '../types';
/**
 * Map with all icons
 */
import * as icons from '@davidabou/icons';

/**
 * Components properties
 */
const props = withDefaults(defineProps<{
  /**
   * Icon name, should be one of the names listed on https://github.com/davidabou/icons
   */
  name: DaIconName,

  /**
   * Optional size of icon, for example: 20
   */
  size?: number,
}>(), {
  size: 24
});

/**
 * Workaround SSR problem when "import * as icons from '@davidabou/icons'" wraps with { default: ... }
 */
const iconList: Record<DaIconName, string> = 'default' in icons
  ? (icons as unknown as { default: Record<DaIconName, string> }).default
  : icons;

/**
 * Icon svg code to be inserted, updated whenever the name changes
 */
const icon = computed(() => iconList[props.name]);

/**
 * Pass size variable to the CSS
 */
const style = computed(() => `--size: ${props.size}px`);
</script>

<template>
  <span
    class="da-icon"
    :style="style"
    v-html="icon"
  />
</template>

<style>
.da-icon {
  --size: 24px;

  display: inline-flex;
}

.da-icon svg {
  width: var(--size);
  height: var(--size);
}
</style>
