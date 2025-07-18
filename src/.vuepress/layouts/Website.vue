<script setup>
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
</script>
<template>
  <div class="website">
    <ParentLayout>
    </ParentLayout>
  </div>
</template>
<style>
@reference '../styles/main.css';

.website .vp-page [vp-content] {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}

#content .content-block:nth-child(even) {
  @apply bg-blue-50;
}
</style>
