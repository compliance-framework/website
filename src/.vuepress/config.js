import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { markdownImagePlugin } from '@vuepress/plugin-markdown-image'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'


import { defineUserConfig } from 'vuepress'

import docsSidebar from '../docs/sidebar.js'

import { getDirname, path } from 'vuepress/utils'

const __dirname = import.meta.dirname || getDirname(import.meta.url)

export default defineUserConfig({
  bundler: viteBundler(),

  theme: defaultTheme({
    sidebar: {
      '/docs/': docsSidebar,
      '/': false,
    },
    navbar: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'About',
        link: '/about',
      },
      {
        text: 'Integrations',
        link: '/integrations',
      },
      {
        text: 'Pricing',
        link: '/pricing',
      },
      {
        text: 'Blog',
        link: '/posts/',
      },
      {
        text: 'Docs',
        link: '/docs/',
      },
    ],
  }),

  plugins: [
    markdownImagePlugin({
      // Enable figure
      figure: true,
      // Enable image lazyload
      lazyload: true,
      // Enable image mark
      mark: true,
      // Enable image size
      size: true,
    }),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
  ],

  lang: 'en-US',
  title: 'The Continuous Compliance Framework',
  description: 'The Continuous Compliance Framework is a compliance monitoring, observability and reporting tool, designed for modern times.',
})
