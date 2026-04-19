# GitHub Pages Deployment — Design

**Date:** 2026-04-19
**Repo:** `adityaRajGit/LeetCode-Competitor`
**Final URL:** `https://adityarajgit.github.io/LeetCode-Competitor/`

## Goal

Build and deploy the Vite + React + TypeScript app to GitHub Pages, automated via GitHub Actions on every push to `main`. Keep clean URLs (no `#`), with `/dashboard` as the default landing page.

## Constraints

- GitHub Pages serves static files only — no server-side routing.
- Project is served from the repo subpath `/LeetCode-Competitor/`, not the domain root.
- App uses `react-router-dom` v7 `BrowserRouter`, so deep-links must survive page refresh.

## Changes

### 1. Vite base path

`vite.config.ts` — add `base: '/LeetCode-Competitor/'` so built asset URLs (`/assets/*.js`, etc.) resolve correctly under the subpath.

### 2. Router

`src/App.tsx`
- `<BrowserRouter>` → `<BrowserRouter basename="/LeetCode-Competitor">`

`src/core/router/index.tsx`
- `/` → `<Navigate to="/dashboard" replace />` (default landing page is dashboard)
- `/dashboard` → `<DashboardLayout />` (unchanged)
- `/welcome` → `<WelcomeScreen />` (moved from `/`, still reachable)
- `*` → `<Navigate to="/dashboard" replace />` (fallback redirects to dashboard instead of welcome)

`src/features/welcome/components/WelcomeScreen/WelcomeScreen.test.tsx`
- Tests render under `BrowserRouter`; no `basename` needed in tests (test env has no subpath). Leave as-is unless test breaks on the route change.

### 3. SPA 404 redirect shim (rafgraph trick)

Problem: `BrowserRouter` URLs like `/LeetCode-Competitor/dashboard` 404 on refresh because GitHub Pages has no `dashboard.html`.

Solution:
- `public/404.html` — small HTML file GH Pages serves on any unknown path. It encodes the requested path as a query string and redirects to `index.html`. Configured for 1 path segment (`pathSegmentsToKeep = 1`) so the `/LeetCode-Competitor/` base is preserved.
- `index.html` — add a small inline `<script>` in `<head>` (before app bundle) that detects the encoded `?/path` query, decodes it, and restores the real path using `history.replaceState`. Then React Router sees the correct URL.

Both files use the canonical rafgraph `spa-github-pages` implementation.

### 4. GitHub Actions workflow

`.github/workflows/deploy.yml`:

- **Trigger:** `push` to `main` only. Also `workflow_dispatch` for manual re-runs.
- **Permissions:** `contents: read`, `pages: write`, `id-token: write`.
- **Concurrency:** group `pages`, cancel-in-progress false (avoid interrupting live deploy).
- **Jobs:**
  - `build`:
    - `actions/checkout@v4`
    - `actions/setup-node@v4` (node 20, cache npm)
    - `npm ci`
    - `npm run build` (Vite copies `public/404.html` → `dist/404.html` automatically)
    - `actions/upload-pages-artifact@v3` with `path: dist`
  - `deploy` (needs: build, environment: `github-pages`):
    - `actions/deploy-pages@v4`

### 5. Repo settings (manual, one-time)

User must do this once in GitHub UI:
- Settings → Pages → **Source: GitHub Actions**

No `gh-pages` branch, no `gh-pages` npm package.

## Out of scope

- Custom domain / CNAME.
- Preview deployments for PRs.
- Removing WelcomeScreen — kept at `/welcome` for future use.
- Running tests in CI before deploy — can be added later; current goal is deployment setup.

## Verification

After first successful workflow run:
1. Visit `https://adityarajgit.github.io/LeetCode-Competitor/` — should redirect to `/dashboard` and render `DashboardLayout`.
2. Visit `https://adityarajgit.github.io/LeetCode-Competitor/welcome` — should render `WelcomeScreen`.
3. Hard-refresh on `/dashboard` — should still render dashboard (404 shim working).
4. Asset URLs in devtools should all be under `/LeetCode-Competitor/assets/...`.
