<!--
  /icons/<slug>: the grid with this icon's dialog open (both live in app.vue).
  A page per icon gives each one its own title, description and preview for search engines.
-->
<script setup lang="ts">
definePageMeta({
  // Unknown slugs get a real 404
  validate: route => useIcons().some(icon => icon.slug === route.params.slug)
});
</script>

<template>
  <span hidden />
</template>
