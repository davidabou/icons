<script setup lang="ts">
import { computed } from 'vue';
import * as icons from '@davidabou/icons-vue';
import type { CodeXIconName } from '../types';

/**
 * Components properties
 */
const props = withDefaults(defineProps<{
  /**
   * Icon name, should be one of the names listed on https://github.com/davidabou/icons
   */
  name: CodeXIconName,

  /**
   * Optional size of icon, in pixels when a number, for example: 20
   */
  size?: number | string,
}>(), {
  size: 24
});

/**
 * Icon component, updated whenever the name changes.
 * Other attributes (class, style, aria-label…) fall through to its <svg>.
 */
const icon = computed(() => icons[props.name]);
</script>

<template>
  <component :is="icon" :size="size" />
</template>
