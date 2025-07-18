import {viteBundler} from '@vuepress/bundler-vite'
import {defaultTheme} from '@vuepress/theme-default'
import {markdownImagePlugin} from '@vuepress/plugin-markdown-image'
import {blogPlugin} from '@vuepress/plugin-blog'
import {registerComponentsPlugin} from '@vuepress/plugin-register-components'
import {defineUserConfig} from 'vuepress'
import {getDirname, path} from 'vuepress/utils'
import tailwindcss from "@tailwindcss/vite";
import {createPage} from 'vuepress/core'

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
    blogPlugin({
      filter: ({filePathRelative, frontmatter}) => {
        // drop those pages which is NOT generated from file
        if (!filePathRelative) return false

        // drop those pages in `archives` directory
        if (!filePathRelative.startsWith('posts/')) return false

        return true
      },

      category: [
        {
          key: 'tags',
          getter: ({frontmatter}) => frontmatter.tags || [],
          // path: '/tag/',
          // layout: 'TagMap',

          frontmatter: () => ({title: 'Tag page'}),
          // itemPath: '/tag/:name/',
          // itemLayout: 'TagList',
          itemFrontmatter: (name) => ({title: `Tag ${name}`}),
        },
      ],

      getInfo: ({frontmatter, title, git = {}, data = {}}) => {
        // get page info
        return {
          title,
          description: frontmatter.description || '',
          author: frontmatter.author || '',
          categories: frontmatter.categories || [],
          date: frontmatter.date || git.createdTime || null,
          tags: frontmatter.tags || [],
          excerpt: data.excerpt || '',
        }
      },
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
    app.pages.push(await createPage(app, {
      path: '/posts/',
      content: `<PostListPage></PostListPage>`,
    }))
  },

  lang: 'en-US',
  title: 'The Continuous Compliance Framework',
  description: 'The Continuous Compliance Framework is a compliance monitoring, observability and reporting tool, designed for modern times.',
})
