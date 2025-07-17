import { defineClientConfig } from 'vuepress/client'
import Layout from './layouts/main.vue'
import NotFound from './layouts/not-found.vue'

export default defineClientConfig({
  layouts: {
    Layout,
    NotFound,
  },
})
