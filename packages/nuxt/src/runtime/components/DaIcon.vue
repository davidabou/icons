<script setup lang="ts">
/**
 * @deprecated Former name of <CodeXIcon>, which takes kebab-case names ('heart' instead of 'IconHeart').
 * Kept so existing templates keep working.
 */
import { computed } from 'vue';
import * as icons from '@davidabou/icons-vue';
import type { DaIconName } from '../types';

const props = withDefaults(defineProps<{
  /**
   * Icon export name, for example: 'IconHeart'
   */
  name: DaIconName,

  /**
   * Optional size of icon, in pixels when a number, for example: 20
   */
  size?: number | string,
}>(), {
  size: 24
});

const icon = computed(() => icons[props.name]);
</script>

<template>
  <component :is="icon" :size="size" />
</template>
