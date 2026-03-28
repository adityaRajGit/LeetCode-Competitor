# Development Guide

Comprehensive development documentation for LeetCode Competitor.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Build and Deployment](#build-and-deployment)

---

## Getting Started

### System Requirements

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: Latest stable version
- **OS**: Windows, macOS, or Linux

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd LeetCode-Competitor

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file from `.env.example`:

```bash
VITE_APP_TITLE=LeetCode Competitor
VITE_APP_VERSION=0.1.0
```

**Note**: Only variables prefixed with `VITE_` are exposed to the client.

---

## Project Architecture

### Directory Structure

```
src/
├── assets/           # Static assets (images, fonts, icons)
├── core/             # Application core
│   ├── api/         # API client and services
│   ├── config/      # Configuration management
│   └── router/      # Routing setup
├── features/         # Feature modules (domain-driven)
│   └── [feature]/   # Each feature is self-contained
│       ├── components/
│       ├── hooks/
│       ├── utils/
│       └── index.ts
├── shared/           # Shared/reusable code
│   ├── components/  # UI components
│   ├── hooks/       # Custom hooks
│   ├── utils/       # Utility functions
│   └── types/       # TypeScript types
├── styles/           # Global styles
└── tests/            # Test configuration
```

### Architecture Principles

1. **Feature-Based Organization**: Group by domain/feature, not by type
2. **Separation of Concerns**: Clear boundaries between features and shared code
3. **Dependency Direction**: Features can use shared code, but not vice versa
4. **Barrel Exports**: Use `index.ts` for clean public APIs

---

## Development Workflow

### Creating a New Feature

```bash
# Structure for a new feature
src/features/my-feature/
├── components/
│   └── MyComponent/
│       ├── MyComponent.tsx
│       ├── MyComponent.test.tsx
│       ├── MyComponent.module.css
│       └── index.ts
├── hooks/
├── utils/
└── index.ts
```

### Creating a Shared Component

```bash
# Structure for shared components
src/shared/components/Button/
├── Button.tsx               # Component implementation
├── Button.test.tsx          # Unit tests
├── Button.module.css        # CSS Modules styles
└── index.ts                 # Barrel export
```

### Path Aliases

Use `@/` prefix for absolute imports:

```typescript
import { Button } from '@/shared/components/Button'
import { config } from '@/core/config'
```

---

## Coding Standards

### TypeScript Guidelines

1. **Enable Strict Mode**: Always use strict TypeScript settings
2. **Explicit Types**: Prefer explicit return types for functions
3. **No `any`**: Avoid `any` type; use `unknown` if type is truly unknown
4. **Interface vs Type**: Use `interface` for object shapes, `type` for unions/intersections

```typescript
// ✅ Good
interface User {
  id: string
  name: string
}

function getUser(id: string): Promise<User> {
  // implementation
}

// ❌ Avoid
function getData(params: any) {
  // implementation
}
```

### React Best Practices

1. **Functional Components**: Use function components, not class components
2. **Hooks**: Follow Rules of Hooks
3. **Props Destructuring**: Destructure props in component signature
4. **TypeScript Props**: Always type your props

```typescript
// ✅ Good
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Functions/Variables**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Types/Interfaces**: PascalCase (e.g., `UserData`)
- **CSS Modules**: camelCase for class names

---

## Testing Guidelines

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button label="Click" onClick={handleClick} />)
    
    screen.getByText('Click').click()
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Coverage Goals

- **Components**: 80%+ coverage
- **Utilities**: 90%+ coverage
- **Critical paths**: 100% coverage

---

## Build and Deployment

### Production Build

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

Output will be in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Build Optimization

- Tree-shaking enabled by default
- Code splitting for routes
- Source maps for debugging
- Asset optimization (images, fonts)

---

## Code Quality Tools

### ESLint

Configuration in `eslint.config.js` (Flat config format)

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Prettier

Configuration in `prettier.config.js`

```bash
# Format all files
npm run format
```

### Pre-commit Hooks (Optional)

Consider adding Husky for pre-commit hooks:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

---

## Troubleshooting

### Common Issues

**Issue**: Module not found after creating new file
- **Solution**: Restart TypeScript server in VS Code (Cmd/Ctrl + Shift + P → "Restart TS Server")

**Issue**: ESLint errors not showing
- **Solution**: Ensure ESLint extension is installed and enabled

**Issue**: Tests failing with module errors
- **Solution**: Check `vite.config.ts` test configuration and setup file

---

## Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)

---

## Support

For questions or issues, please create an issue in the repository.
