<script setup>
</script>

<template>
  <div class="content-block even:bg-blue-50 dark:even:bg-zinc-900">
    <div class="content-block-content">
      <slot />
    </div>
  </div>
</template>

<style>
.content-block-content {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 2rem 2.5rem;
}
</style>
