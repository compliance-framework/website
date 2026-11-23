# AGENTS.md

Website and blog for the Continuous Compliance Framework (CCF), served at
https://continuouscompliance.io. It is a static site built with VuePress 2
(Vite bundler, default theme) and TailwindCSS 4. It deploys to GitHub Pages.

The documentation is not in this repo. It lives at
https://compliance-framework.github.io/docs, and the "Docs" navbar item in
`config.js` links there. Docs changes go to that site, not here.

## Commands

- `npm install`: install dependencies (Node 20 matches CI).
- `make run`: install, build, then start the dev server with hot reload (`npm run dev`).
- `npm run dev`: start the dev server only (`vuepress dev src`).
- `make build` / `npm run build`: production build into `src/.vuepress/dist`.
- `make help`: list the Make targets.

There are no tests or linters. A change is checked when `npm run build`
succeeds without errors and the affected pages look right in `npm run dev`.

## Layout

- `src/posts/`: blog posts. Every Markdown file under `posts/` is picked up by
  the blog plugin and listed on `/posts/`. Post images go in `src/posts/img/`.
- `src/.vuepress/config.js`: site config, navbar, plugins, Yandex Metrica
  analytics snippet, and the custom pages (see below).
- `src/.vuepress/pages/`: marketing pages written as Vue components (`HomePage`,
  `FeaturesPage`, `PricingPage`, `VideosPage`, `IntegrationsPage`, `PostListPage`).
- `src/.vuepress/components/`: shared Vue components (`Hero`, `ContentBlock`,
  `ContentBlockWide`). These and the pages are registered automatically, so
  Markdown can use them by name.
- `src/.vuepress/layouts/`: `Base.vue` (the default `Layout`) and `Website.vue`
  (used by the marketing pages). They are registered in `src/.vuepress/client.js`.
- `src/.vuepress/styles/main.css`: Tailwind entry point (`@import "tailwindcss"`)
  and the dark-mode variant, which follows the theme's `data-theme=dark`.
- `src/.vuepress/public/`: static files served from `/` (for example `/img/logo.svg`).
- `demo-video/`: scripts that record the showcase demo video of the CCF UI,
  with a voiceover from `demo-video/narration.json` (`make demo-video`), and
  capture the Features page screenshots into `public/img/features/`
  (`make demo-screenshots`). See `demo-video/README.md`. Not part of the site build; the video goes to the
  gitignored `demo-video/out/` and voice clips to `demo-video/.cache/`.

`src/.vuepress/dist`, `.temp` and `.cache` are build output. They are
gitignored, so never edit them.

## Common changes

**Add a blog post.** Create `src/posts/<kebab-case-title>.md` with frontmatter
like this:

```yaml
---
title: Workflows - A Sneak Preview
description: One sentence shown in the post list.
date: 2025-09-11
author: Ian Miell (Container Solutions)
tags: [oscal, compliance]
canonicalUrl: https://blog.container-solutions.com/...   # only if cross-posted
---
```

If there is no `date`, the post falls back to the git creation time.

**Add a marketing page.** Create `src/.vuepress/pages/<Name>Page.vue` using
Tailwind classes. Register its route in the `onInitialized` hook in
`config.js` with `frontmatter: {layout: 'Website'}`. To link it from the top
bar, also add it to `navbar` in `config.js`.

## Conventions

- Markdown filenames use kebab-case, and each page has one H1.
- Style with Tailwind utility classes in Vue files and keep custom CSS in
  `main.css` to a minimum.
- Commit messages are short and imperative, e.g. `docs: add OSCAL overview`.
  Keep each PR to one kind of change (content, site or build). If you add a
  page to `config.js`, say so in the PR.

## Deployment

Every push to `main` triggers `.github/workflows/pages.yml`, which runs
`npm ci && npm run build` and publishes `src/.vuepress/dist` to GitHub Pages.
A merge to `main` therefore goes live, so make sure the build passes before
merging. The workflow does not run on PRs, so there is no CI build check:
run `npm run build` locally first. If the build fails on esbuild with a
wrong-architecture error, `node_modules` came from another machine; fix it
with `npm ci`. Dependabot PRs for npm dependencies are routine.

## Don'ts

- Don't commit secrets. Everything here is public.
- Don't add npm packages without a reason. Explain the reason in the PR and
  put build-only tools in `devDependencies`.
