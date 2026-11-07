<script setup lang="ts">
const open = ref(false);
</script>

<template>
  <div>
    <DaIcon name="IconHeart" />
    <da-icon name="IconSparkles" :size="32" style="color: #e11d48" />
    <button @click="open = !open">
      <DaIcon :name="open ? 'IconChevronUp' : 'IconChevronDown'" :size="16" />
    </button>
  </div>
</template>
