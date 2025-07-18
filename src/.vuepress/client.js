import { defineClientConfig } from 'vuepress/client'
import Website from './layouts/website.vue'

import './styles/main.css'

export default defineClientConfig({
  layouts: {
    Website,
  },
})
