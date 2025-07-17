import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme(),

  lang: 'en-US',
  title: 'The Continuous Compliance Framework',
  description: 'The Continuous Compliance Framework is a compliance monitoring, observability and reporting tool, designed for modern times.',
})
