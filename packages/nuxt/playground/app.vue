<script setup lang="ts">
const open = ref(false);
</script>

<template>
  <div>
    <CodeXIcon name="heart" />
    <code-x-icon name="sparkles" :size="32" style="color: #e11d48" />
    <button @click="open = !open">
      <CodeXIcon :name="open ? 'chevron-up' : 'chevron-down'" :size="16" aria-label="Toggle" />
    </button>
    <CodeXIcon name="h1" />
    <!-- Deprecated component, with the former names -->
    <DaIcon name="IconLoader" />
  </div>
</template>
