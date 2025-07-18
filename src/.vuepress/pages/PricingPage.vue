<script setup>
import ContentBlock from "../components/ContentBlock.vue";
</script>

<template>
  <div class="flex items-start justify-between gap-x-4 py-8 mx-auto max-w-5xl">
    <div v-for="item in [{name: 'basic'}, {name: 'premium'}, {name: 'plus'}]"
     class="rounded-lg text-center w-full border border-gray-300 overflow-hidden">
      <div class="bg-blue-500 text-white">
        {{ item.name }}
      </div>
      <div class="bg-white">
        Some pricing details
      </div>
    </div>
  </div>
</template>
