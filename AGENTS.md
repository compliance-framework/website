# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with VuePress content in `src/docs` (docs) and `src/posts` (blog). Sidebar config lives in `src/docs/sidebar.js`.
- Site tooling: VuePress 2 with Vite bundler and TailwindCSS. Pages/components for the website may live under `src/.vuepress/` when needed.
- Root files: `package.json`, `Makefile`, and this guide.

## Build, Test, and Development Commands
- `make run`: Installs deps and starts VuePress dev server at localhost (hot reload).
- `make build`: Builds the static site to `.vuepress/dist` (via `npm run build`).
- `npm run dev`: VuePress dev for `src/` directly (alternative to `make run`).
- `npm run build`: VuePress production build for `src/`.

## Coding Style & Naming Conventions
- Markdown: One H1 per page; use meaningful headings; prefer relative links within `src/docs`.
- Filenames: `kebab-case.md` for docs/posts; co-locate assets (images) near content.
- Frontmatter: Provide `title`, and optional `description`, `tags`, `sidebar` fields as needed by VuePress.
- Styling: Use TailwindCSS utility classes in Vue/VuePress components. Keep custom CSS minimal.

## Testing Guidelines
- Manual verification: Run `make run`, check navigation, sidebar entries, links, and code block rendering.
- Lint/format: Follow Markdown readability; keep lines reasonably short; ensure link targets exist.
- Broken links: Validate new/changed internal links before opening a PR.

## Commit & Pull Request Guidelines
- Commits: Use clear, imperative messages (e.g., "docs: add OSCAL overview", "site: fix sidebar link").
- PRs: Include a concise description, screenshots/GIFs for visual changes, and link related issues. Note any new pages added to `sidebar.js`.
- Scope: Keep PRs focused (docs, content, or build changes). Avoid mixing unrelated updates.

## Security & Configuration Tips
- No secrets: Do not commit credentials or API keys. Public site content only.
- Dependencies: If you add packages, explain why in the PR and ensure dev-only where possible.

