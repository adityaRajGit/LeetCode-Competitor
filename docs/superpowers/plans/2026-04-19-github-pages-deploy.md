# GitHub Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the Vite + React app to GitHub Pages at `https://adityarajgit.github.io/LeetCode-Competitor/` with `/dashboard` as the default landing page and clean URLs that survive page refresh.

**Architecture:** Add a Vite `base` path so built assets resolve under the repo subpath, update `BrowserRouter` with a matching `basename`, add the rafgraph SPA 404 redirect shim so deep-links survive refresh on GitHub Pages' static host, and create a GitHub Actions workflow that builds and deploys on every push to `main`.

**Tech Stack:** Vite 5, React 19, react-router-dom v7, GitHub Actions (`actions/deploy-pages@v4`), Vitest + Testing Library

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `vite.config.ts` | Add `base: '/LeetCode-Competitor/'` |
| Modify | `src/App.tsx` | Add `basename="/LeetCode-Competitor"` to BrowserRouter |
| Modify | `src/core/router/index.tsx` | `/` → redirect to `/dashboard`; `/welcome` for WelcomeScreen |
| Create | `src/core/router/AppRouter.test.tsx` | Route redirect tests |
| Create | `public/404.html` | rafgraph SPA 404 redirect shim |
| Modify | `index.html` | Add rafgraph decoder script in `<head>` |
| Create | `.github/workflows/deploy.yml` | CI/CD: build + deploy to GitHub Pages |

---

## Task 1: Vite base path

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Add `base` to vite config**

In `vite.config.ts`, add `base: '/LeetCode-Competitor/'` to the `defineConfig` object:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/LeetCode-Competitor/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: 'localhost',
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/tests/setup.ts',
    css: true,
  },
})
```

- [ ] **Step 2: Verify build output has correct asset paths**

Run:
```bash
npm run build
grep -r 'src="/LeetCode-Competitor/' dist/index.html || grep 'assets' dist/index.html
```

Expected: `dist/index.html` references scripts/styles under `/LeetCode-Competitor/assets/...` not `/assets/...`.

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "feat: set Vite base path for GitHub Pages subpath"
```

---

## Task 2: Router changes + tests

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/core/router/index.tsx`
- Create: `src/core/router/AppRouter.test.tsx`

- [ ] **Step 1: Write failing router tests**

Create `src/core/router/AppRouter.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRouter } from './index'

// Mock heavy page components so tests don't need API calls / CSS modules
vi.mock('@/features/dashboard', () => ({
  DashboardLayout: () => <div data-testid="dashboard" />,
}))

vi.mock('@/features/welcome', () => ({
  WelcomeScreen: () => <div data-testid="welcome" />,
}))

describe('AppRouter', () => {
  it('redirects / to /dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>
    )
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    expect(screen.queryByTestId('welcome')).not.toBeInTheDocument()
  })

  it('renders DashboardLayout at /dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRouter />
      </MemoryRouter>
    )
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('renders WelcomeScreen at /welcome', () => {
    render(
      <MemoryRouter initialEntries={['/welcome']}>
        <AppRouter />
      </MemoryRouter>
    )
    expect(screen.getByTestId('welcome')).toBeInTheDocument()
  })

  it('redirects unknown paths to /dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/not-a-real-route']}>
        <AppRouter />
      </MemoryRouter>
    )
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    expect(screen.queryByTestId('welcome')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/core/router/AppRouter.test.tsx
```

Expected: FAIL — tests for `/welcome` and redirect-from-`/` fail because router still has old routes.

- [ ] **Step 3: Update `src/core/router/index.tsx`**

Replace the entire file with:

```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { WelcomeScreen } from '@/features/welcome'
import { DashboardLayout } from '@/features/dashboard'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardLayout />} />
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
```

- [ ] **Step 4: Update `src/App.tsx` — add basename**

Replace the entire file with:

```tsx
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './core/router'
import { useTheme } from './shared/hooks/useTheme'

function App() {
  useTheme();

  return (
    <BrowserRouter basename="/LeetCode-Competitor">
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 5: Run all tests to verify they pass**

```bash
npx vitest run
```

Expected: All tests pass, including the 4 new AppRouter tests.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/core/router/index.tsx src/core/router/AppRouter.test.tsx
git commit -m "feat: update router — /dashboard default, /welcome for WelcomeScreen, basename for Pages"
```

---

## Task 3: SPA 404 redirect shim

**Files:**
- Create: `public/404.html`
- Modify: `index.html`

- [ ] **Step 1: Create `public/404.html`**

Create the file with this exact content (rafgraph's canonical SPA shim, `pathSegmentsToKeep = 1` preserves the `/LeetCode-Competitor/` base):

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>LeetCode Competitor</title>
    <script>
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

- [ ] **Step 2: Add decoder script to `index.html`**

Insert the decoder `<script>` block as the **first child of `<head>`**, before any other tags. The full updated `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <script>
      (function(l) {
        if (l.search[1] === '/') {
          var decoded = l.search.slice(1).split('&').map(function(s) {
            return s.replace(/~and~/g, '&');
          }).join('?');
          window.history.replaceState(null, null,
            l.pathname.slice(0, -1) + decoded + l.hash
          );
        }
      }(window.location));
    </script>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LeetCode Competitor</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Verify 404.html is copied into dist after build**

```bash
npm run build && ls dist/404.html
```

Expected: `dist/404.html` exists.

- [ ] **Step 4: Commit**

```bash
git add public/404.html index.html
git commit -m "feat: add SPA 404 redirect shim for GitHub Pages deep-link support"
```

---

## Task 4: GitHub Actions deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml` with this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify workflow file is valid YAML**

```bash
npx js-yaml .github/workflows/deploy.yml && echo "YAML valid"
```

Expected: `YAML valid` (or no error — `js-yaml` may not be installed; if command fails, skip to step 3).

- [ ] **Step 3: Run all tests one final time to confirm nothing regressed**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 4: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions workflow for GitHub Pages deployment"
git push origin main
```

---

## Task 5: Enable GitHub Pages in repo settings (manual)

This step is done in the GitHub UI — cannot be automated.

- [ ] **Step 1: Open repo settings**

Go to: `https://github.com/adityaRajGit/LeetCode-Competitor/settings/pages`

- [ ] **Step 2: Set Source to GitHub Actions**

Under "Build and deployment" → Source → select **GitHub Actions**.

Save.

- [ ] **Step 3: Watch the workflow run**

Go to `https://github.com/adityaRajGit/LeetCode-Competitor/actions` and watch the "Deploy to GitHub Pages" workflow triggered by the push in Task 4, Step 4.

Wait for both `build` and `deploy` jobs to show green.

---

## Task 6: Verify deployment

- [ ] **Step 1: Visit root URL — should redirect to dashboard**

Open: `https://adityarajgit.github.io/LeetCode-Competitor/`

Expected: Redirects to `/LeetCode-Competitor/dashboard` and renders the Dashboard.

- [ ] **Step 2: Verify direct /welcome URL**

Open: `https://adityarajgit.github.io/LeetCode-Competitor/welcome`

Expected: Renders WelcomeScreen.

- [ ] **Step 3: Verify hard-refresh on /dashboard**

Navigate to `https://adityarajgit.github.io/LeetCode-Competitor/dashboard`, then press **Ctrl+Shift+R** (hard refresh).

Expected: Dashboard still renders (404 shim redirected correctly, not a blank page).

- [ ] **Step 4: Verify asset paths in DevTools**

Open DevTools → Network tab → reload page. Filter by JS/CSS.

Expected: All script/style URLs contain `/LeetCode-Competitor/assets/...`.
