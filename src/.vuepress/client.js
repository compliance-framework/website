import { defineClientConfig } from 'vuepress/client'
import Layout from './layouts/Base.vue'
import Website from './layouts/Website.vue'

import './styles/main.css'

export default defineClientConfig({
  layouts: {
    Layout,
    Website,
  },
})
