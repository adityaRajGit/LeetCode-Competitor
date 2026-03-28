# Quick Start Guide: React Project Foundation

**Feature**: React Project Foundation  
**Branch**: `001-react-skeleton-setup`  
**Last Updated**: February 14, 2026

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Comes bundled with Node.js (version 9.x or higher)
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest version)
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LeetCode-Competitor
```

### 2. Install Dependencies

```bash
npm install
```

**Expected time**: 2-3 minutes  
**Output**: Dependencies installed in `node_modules/`, lock file updated

### 3. Environment Configuration

Create your local environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your local settings (if needed):

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_LOG_LEVEL=debug
```

**Note**: `.env.local` is git-ignored and for local overrides only.

### 4. Verify Setup

Run the development server:

```bash
npm run dev
```

**Expected output**:
```
VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Open http://localhost:5173/ in your browser. You should see the welcome screen.

**Success Criteria**: Application loads without errors in under 30 seconds.

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

- Hot Module Replacement (HMR) enabled
- Changes reflect in browser within 2 seconds
- Development server runs on http://localhost:5173/

### Building for Production

```bash
npm run build
```

- Creates optimized production build in `dist/`
- TypeScript type checking included
- Expected completion time: < 3 minutes

### Preview Production Build

```bash
npm run preview
```

- Serves production build locally for testing
- Runs on http://localhost:4173/

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality Checks

```bash
# Lint code
npm run lint

# Fix auto-fixable linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type check
npm run type-check
```

## Project Structure Quick Reference

### Adding a New Component

**For shared components** (reusable across features):

```bash
src/shared/components/
├── YourComponent/
│   ├── YourComponent.tsx       # Component implementation
│   ├── YourComponent.test.tsx  # Component tests
│   ├── YourComponent.module.css # Component styles (if needed)
│   ├── types.ts                # Component-specific types
│   └── index.ts                # Barrel export
```

**For feature-specific components**:

```bash
src/features/yourfeature/
├── components/
│   └── YourComponent/
│       ├── YourComponent.tsx
│       ├── YourComponent.test.tsx
│       └── index.ts
```

**Component template**:

```typescript
// YourComponent.tsx
import React from 'react';
import styles from './YourComponent.module.css';

interface YourComponentProps {
  title: string;
  onClick?: () => void;
}

export const YourComponent: React.FC<YourComponentProps> = ({ title, onClick }) => {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <button onClick={onClick}>Click me</button>
    </div>
  );
};

// index.ts
export { YourComponent } from './YourComponent';
export type { YourComponentProps } from './YourComponent';
```

### Adding a New Feature

1. Create feature directory: `src/features/yourfeature/`
2. Add subdirectories: `components/`, `hooks/`, `services/`, `types/`
3. Create `index.ts` barrel export
4. Register routes in `src/core/router/`

### Adding Utility Functions

Place in `src/shared/utils/` with corresponding test file:

```bash
src/shared/utils/
├── yourUtil.ts
└── yourUtil.test.ts
```

### Adding Assets

- **Processed assets** (imported in code): `src/assets/`
- **Static assets** (public URLs): `public/`

## Common Tasks

### Task: Add a New Route

1. Create feature component in `src/features/yourfeature/`
2. Update `src/core/router/index.tsx`:

```typescript
import { YourFeature } from '@/features/yourfeature';

const routes: RouteConfig[] = [
  // ... existing routes
  {
    path: '/yourfeature',
    element: <YourFeature />,
  },
];
```

### Task: Add Global Styles

Edit `src/styles/index.css` for global styles or create theme files in `src/styles/themes/`.

### Task: Configure Environment Variable

1. Add to `.env.example` (for documentation)
2. Add to `.env.local` (for your local value)
3. Access in code: `import.meta.env.VITE_YOUR_VAR`
4. Add TypeScript definition if needed

### Task: Install New Dependency

```bash
# Production dependency
npm install package-name

# Development dependency
npm install -D package-name
```

Always commit the updated `package-lock.json`.

## Troubleshooting

### Port Already in Use

**Error**: `Port 5173 is already in use`

**Solution**:
```bash
# Find and kill process
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows

# Or use different port
npm run dev -- --port 3000
```

### Module Not Found After Install

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Type Errors After Dependency Update

**Solution**:
```bash
# Regenerate TypeScript declarations
npm run type-check
```

### HMR Not Working

**Solution**:
1. Check browser console for errors
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Hard refresh browser: `Ctrl+Shift+R` or `Cmd+Shift+R`

### Tests Failing After Setup

**Solution**:
```bash
# Clear test cache
npm test -- --clearCache

# Run tests with verbose output
npm test -- --verbose
```

## Performance Tips

- **Development**: Use `npm run dev` for fast HMR
- **Code Splitting**: Lazy load routes with `React.lazy()`
- **Build Analysis**: Run `npm run build -- --analyze` to see bundle size
- **Type Checking**: Run in separate terminal: `npm run type-check -- --watch`

## Getting Help

- **Documentation**: See `docs/` directory for detailed guides
- **Feature Specs**: See `specs/` for feature-specific documentation
- **Issues**: Check existing issues or create new one with reproduction steps
- **Code Standards**: Review ESLint and Prettier configs for style guidelines

## Next Steps

After completing initial setup:

1. ✅ Verify all commands run successfully
2. ✅ Explore the project structure
3. ✅ Review existing components in `src/shared/components/`
4. ✅ Read feature specifications in `specs/`
5. 🚀 Start building your first feature!

## Success Checklist

- [ ] Development server starts in < 30 seconds
- [ ] Changes reflect in browser in < 2 seconds
- [ ] Can locate component files in < 30 seconds
- [ ] All tests pass: `npm test`
- [ ] Lint check passes: `npm run lint`
- [ ] Production build completes in < 3 minutes
- [ ] Can create and render a new component successfully

**Target setup time from clone to running app**: < 10 minutes

---

**Need more help?** See full documentation in `docs/` or review the specification in `specs/001-react-skeleton-setup/spec.md`.
