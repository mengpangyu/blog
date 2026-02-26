# Deploy docs to GitHub Pages

This repo deploys the VitePress site under `docs/` to GitHub Pages via GitHub Actions.

## 1) One-time GitHub settings

In your GitHub repo:

- **Settings → Pages**
  - **Build and deployment**: select **GitHub Actions**

## 2) How it works

- Workflow: `.github/workflows/deploy-docs.yml`
- Output directory: `docs/.vitepress/dist`

## 3) Notes about base path

This is a **project pages** deployment (repo: `pangyu1997/blog`).

VitePress `base` is configured as:

- `base: '/blog/'`

So the site will be served at:

- `https://pangyu1997.github.io/blog/`

If you rename the repo, update `docs/.vitepress/config.mts` accordingly.
