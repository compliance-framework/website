<script setup>
</script>

<template>
  <div class="content-block even:bg-blue-50 dark:even:bg-zinc-900">
    <div class="content-block-content-wide">
      <slot />
    </div>
  </div>
  </template>

<style>
.content-block-content-wide {
  /* Falls back to ~1200px if theme variable is absent */
  max-width: var(--content-width-wide, 1200px);
  margin: 0 auto;
  padding: 2rem 2.5rem;
}
</style>

