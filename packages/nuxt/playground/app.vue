<script setup lang="ts">
const open = ref(false);
</script>

<template>
  <div>
    <CodeXIcon name="IconHeart" />
    <code-x-icon name="IconSparkles" :size="32" style="color: #e11d48" />
    <button @click="open = !open">
      <CodeXIcon :name="open ? 'IconChevronUp' : 'IconChevronDown'" :size="16" aria-label="Toggle" />
    </button>
    <!-- Deprecated name, still registered -->
    <DaIcon name="IconLoader" />
  </div>
</template>
