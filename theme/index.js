import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)

export function ccfTheme (options) {
  return {
    name: 'vuepress-theme-ccf',

    // path to the client config of your theme
    clientConfigFile: path.resolve(__dirname, 'client.js'),

    // use plugins
    plugins: [
      // ...
    ],

    // other plugin APIs are also available
  }
}
