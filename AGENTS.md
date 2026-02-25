# AGENTS.md

## Project overview

This repository is a **pnpm workspace monorepo** for a personal blog / knowledge base plus runnable demo apps.

- **Docs site**: VitePress in `docs/` (`@docs/site`)
- **Apps**:
  - `apps/react/` — Vite + React + TS (`@apps/react`)
  - `apps/vue/` — Vite + Vue + TS (`@apps/vue`)
- **Workspace**: `pnpm-workspace.yaml`

Primary use-case: write interview notes in `docs/` while being able to **run/verify code** in isolated React/Vue projects (and optionally vanilla JS apps) under `apps/`.

## Workspace layout

```text
.
├─ docs/                 # VitePress site (Markdown + theme config)
│  ├─ .vitepress/
│  └─ package.json       # @docs/site
├─ apps/
│  ├─ react/             # @apps/react (Vite React TS)
│  └─ vue/               # @apps/vue (Vite Vue TS)
├─ package.json          # workspace root scripts
├─ pnpm-workspace.yaml
├─ pnpm-lock.yaml
└─ .npmrc
```

## Install

```bash
pnpm install
```

## Run (dev)

From repo root:

```bash
# docs (vitepress)
pnpm run docs:dev

# react app
pnpm run react:dev

# vue app
pnpm run vue:dev

# run all packages that have a dev script (in parallel)
pnpm run dev
```

## Build / preview

```bash
# build everything
pnpm run build

# build only docs / react / vue
pnpm run docs:build
pnpm run react:build
pnpm run vue:build

# preview servers
pnpm run docs:preview
pnpm run react:preview
pnpm run vue:preview
```

## Development conventions

### Docs authoring

- Put all notes/articles under `docs/`.
- Update navigation / sidebar in `docs/.vitepress/config.mts`.

### Runnable code for interview notes

- Prefer placing runnable code in `apps/react` or `apps/vue` when you need:
  - component rendering verification
  - DOM interaction
  - hooks/reactivity experiments
- For pure algorithm / utility “handwritten code”, you can still keep snippets in Markdown; if you need executable verification, consider adding a small `apps/vanilla/` (Vite vanilla-ts) later.

### Package management

- Use **pnpm** only. The repo uses `pnpm-lock.yaml` and `pnpm-workspace.yaml`.
- Avoid adding new tooling unless it’s already present in the relevant package.

## Notes for automation agents

- Keep changes scoped to the correct workspace package (`docs/`, `apps/react`, `apps/vue`).
- When adding deps, add them to the **package that needs them** (e.g., `pnpm --filter @apps/react add xxx`).
- Root scripts should remain thin wrappers around workspace package scripts.
