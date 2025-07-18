<script setup>
</script>

<template>
  <div class="content-block">
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
