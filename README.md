# Website for the Continuous Compliance Framework

Hosts the website, blog and docs for the Continuous Compliance Framework

The website is built using [VuePress](https://vuepress.github.io/), and utilises a customised version of the [default theme](https://ecosystem.vuejs.press/themes/default/).

It also utilises [TailwindCSS](https://tailwindcss.com/) for styling. 

## Installation

```shell
npm install
# That's it
```

## Usage

```shell
make help # For common commands

make run # Runs the website locally
make build # Builds the website for distribution
```

## Contributing

* `src/docs` hosts all of the CCF documentation.
* `src/docs/sidebar.js` controls the sidebar links for the documentation.  
* `src/posts` hosts all of the CCF blog content.

Have a look around in the markdown files to see how to contribute your own. To learn more about frontmatter, components and markdown features have a look at the VuePress documentation for the most up to date content.

## Advanced

The pages for the website are VueJS Components with TailwindCSS styling. They are stored in `src/.vuepress/pages`.

To register a new page, you must register the page in `src/.vuepress/config.js`.

To add the page to the navigation bar, you must also register it in `src/.vuepress/config.js`.