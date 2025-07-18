<script setup>
import { useBlogCategory } from '@vuepress/plugin-blog/client'

const categoryMap = useBlogCategory('tags')
const reduced = {};
Object.entries(categoryMap.value.map).forEach(([key, value]) => {
  value.items.forEach(item => {
    reduced[item.path] = {
      ...item.info,
      path: item.path,
    }
  })
})
const blogs = Object.values(reduced)
console.log(blogs)
</script>

<template>
  <div>
    <h1>Articles</h1>
    <div v-for="blog in blogs" :key="blog.path" class="my-4">
        <RouteLink :key="blog.title" :to="blog.path" class="text-lg">{{ blog.title }}</RouteLink>
        <p v-if="blog.description">{{ blog.description }}</p>
        <p v-else v-html="blog.excerpt"></p>
    </div>
  </div>
</template>
