import {viteBundler} from '@vuepress/bundler-vite'
import {defaultTheme} from '@vuepress/theme-default'
import {markdownImagePlugin} from '@vuepress/plugin-markdown-image'
import {registerComponentsPlugin} from '@vuepress/plugin-register-components'
import {defineUserConfig} from 'vuepress'
import {getDirname, path} from 'vuepress/utils'
import tailwindcss from "@tailwindcss/vite";
import { createPage } from 'vuepress/core'

import docsSidebar from '../docs/sidebar.js'

const __dirname = import.meta.dirname || getDirname(import.meta.url)

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {
      plugins: [
        tailwindcss(),
      ]
    }
  }),

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
        text: 'Features',
        link: '/features',
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
      componentsDir: path.resolve(__dirname, './pages'),
    }),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
  ],

  async onInitialized(app) {
    app.pages.push(await createPage(app, {
      path: '/',
      frontmatter: {layout: 'Website'},
      content: `<HomePage></HomePage>`,
    }))
    app.pages.push(await createPage(app, {
      path: '/pricing.html',
      frontmatter: {layout: 'Website'},
      content: `<PricingPage></PricingPage>`,
    }))
    app.pages.push(await createPage(app, {
      path: '/integrations.html',
      frontmatter: {layout: 'Website'},
      content: `<IntegrationsPage></IntegrationsPage>`,
    }))
    app.pages.push(await createPage(app, {
      path: '/features.html',
      frontmatter: {layout: 'Website'},
      content: `<FeaturesPage></FeaturesPage>`,
    }))
  },

  lang: 'en-US',
  title: 'The Continuous Compliance Framework',
  description: 'The Continuous Compliance Framework is a compliance monitoring, observability and reporting tool, designed for modern times.',
})
