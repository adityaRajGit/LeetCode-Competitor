# Research: React Project Foundation

**Feature**: React Project Foundation  
**Branch**: `001-react-skeleton-setup`  
**Date**: February 14, 2026

## Research Overview

This document consolidates research findings for establishing a modern React project structure with best-practice tooling and organization patterns.

## Build Tool & Project Setup

### Decision: Vite

**Rationale**: Vite is the de facto standard for modern React applications in 2026, officially recommended by the React team for single-page applications. Key advantages include:
- Lightning-fast Hot Module Replacement (HMR) with instant feedback
- Native ESM support for better performance
- Sub-second server start times
- Excellent TypeScript support out of the box
- Strong ecosystem and plugin support
- Optimized production builds

**Alternatives Considered**:
- **Create React App (CRA)**: Officially deprecated and removed from React documentation. No longer maintained.
- **Next.js**: Excellent for production applications requiring server-side rendering, static site generation, or full-stack capabilities. However, adds unnecessary complexity for simple SPAs or learning projects. Best reserved for applications that need routing, API routes, or server-side features.

**Impact on Success Criteria**: Direct support for SC-002 (2-second change reflection) and SC-007 (build completion under 3 minutes).

---

## Type System

### Decision: TypeScript

**Rationale**: TypeScript has become the industry standard in 2026, with compelling benefits:
- Catch errors at compile time rather than runtime
- Superior IDE support with autocomplete and inline documentation
- Enhanced refactoring capabilities across large codebases
- Self-documenting code through type annotations
- Better maintainability for growing codebases
- Most React libraries ship with TypeScript types by default

**Alternatives Considered**: Plain JavaScript is simpler for small projects but lacks the safety and tooling benefits that scale with project growth.

**Impact on Success Criteria**: Supports FR-008 (clear error messages) and FR-005 (consistent coding standards).

---

## Testing Framework

### Decision: Vitest + React Testing Library

**Rationale**: Vitest has emerged as the preferred testing framework for Vite-based projects:
- **Vitest** (test runner): Native ESM support, Jest-compatible API, significantly faster execution, built-in TypeScript support, better watch mode
- **React Testing Library** (component testing): Industry standard for testing React components, encourages testing user behavior over implementation details
- **Playwright** (E2E testing): Modern choice for end-to-end testing, faster and more reliable than alternatives

**Stack Components**:
- Test Runner: Vitest
- Component Testing: React Testing Library
- E2E Testing: Playwright (for future expansion)
- Coverage: Vitest with c8 or Istanbul

**Alternatives Considered**: Jest was the previous standard but Vitest offers better integration with Vite, faster execution, and maintains API compatibility for easy migration.

**Impact on Success Criteria**: Directly enables FR-009 (testing infrastructure) and SC-004 (quality check accuracy).

---

## Code Quality Tools

### Decision: ESLint + Prettier + TypeScript

**Rationale**: The standard trio for React projects provides comprehensive quality assurance:
- **ESLint**: Code quality and bug detection with React-specific plugins
  - `eslint-plugin-react` for React best practices
  - `eslint-plugin-react-hooks` for hooks rules
  - `@typescript-eslint/parser` and plugins for TypeScript
- **Prettier**: Automated code formatting eliminates style debates
- **TypeScript**: Compile-time type checking

**Configuration Recommendations**:
- Use ESLint flat config format (modern standard)
- Configure Prettier to run through ESLint
- Enable strict TypeScript checking

**Alternatives Considered**: Biome is emerging as a faster all-in-one alternative to ESLint + Prettier, but ESLint + Prettier remains more mature with better ecosystem support.

**Impact on Success Criteria**: Enables FR-005 (code quality tools) and SC-004 (100% accuracy identifying issues).

---

## Package Manager

### Decision: npm

**Rationale**: npm is the standard package manager that comes bundled with Node.js:
- **Universal Availability**: Pre-installed with Node.js, no additional setup required
- **Stability**: Mature and battle-tested with excellent reliability
- **Wide Compatibility**: Works seamlessly with all Node.js projects and tools
- **Standard Choice**: Most widely used and documented package manager
- **Simple Setup**: No additional installation steps needed

**Alternatives Considered**:
- **pnpm**: Offers better disk efficiency and speed, but requires separate installation
- **yarn**: Has lost momentum and less commonly recommended in 2026

**Impact on Success Criteria**: Supports SC-001 (10-minute setup) by eliminating package manager installation step and SC-005 (setup success on clean environments).

---

## Directory Structure Pattern

### Decision: Feature-based with Type-based at Feature Level (Hybrid)

**Rationale**: The React community has moved away from pure type-based structures (all components together, all hooks together) in favor of feature-based organization:
- Improves scalability for large applications
- Reduces cognitive load by co-locating related files
- Makes refactoring and maintenance easier
- Aligns with component-driven development principles
- Better supports team collaboration with clear ownership boundaries

**Structure**:
```
src/
├── features/           # Feature modules (domain-driven)
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   └── dashboard/
├── shared/            # Shared across features
│   ├── components/    # Reusable UI components
│   ├── hooks/
│   ├── utils/
│   └── types/
├── core/             # App-wide concerns
│   ├── api/
│   ├── config/
│   └── router/
├── assets/           # Build-processed assets
├── styles/           # Global styles
└── App.tsx
```

**Alternatives Considered**: Pure type-based structures (all components in one folder) don't scale well and create navigation overhead as projects grow.

**Impact on Success Criteria**: Directly enables SC-003 (locate files within 30 seconds) and supports FR-001 (clear directory structure).

---

## Component Organization

### Decision: Feature-based with Component Co-location

**Rationale**:
- Co-locating components with tests, styles, and related files reduces navigation overhead
- Each component folder contains everything needed for that component
- Barrel exports (index.ts) provide clean import paths
- Feature-specific components live within feature directories
- Truly reusable components go in `shared/components`

**Pattern**:
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── ComponentName.module.css
├── types.ts
└── index.ts
```

**Alternatives Considered**: Atomic design hierarchy (atoms/molecules/organisms) as folder structure creates artificial categorization overhead; better used as conceptual guidance.

**Impact on Success Criteria**: Supports FR-007 (demonstrates proper component organization) and SC-003 (quick file location).

---

## Asset Management

### Decision: Dual-location Strategy

**Rationale**: Separate assets based on processing needs:
- **`public/`**: Assets served as-is without build processing (favicons, robots.txt, manifest.json, large media)
- **`src/assets/`**: Assets processed, optimized, and bundled by build tool (component images, fonts, SVG icons)

**Organization**:
```
public/
├── favicon.ico
└── robots.txt

src/assets/
├── images/
├── fonts/
└── icons/
```

**Benefits**: Build tools can optimize, hash, and tree-shake assets in `src/assets` for better performance and caching, while public assets remain at predictable URLs.

**Impact on Success Criteria**: Supports FR-010 (organize static assets) and FR-001 (clear directory structure).

---

## Configuration Files

### Decision: Root-level with Framework-specific Conventions

**Key Files**:
- `package.json`: Dependencies, scripts, project metadata
- `tsconfig.json`: TypeScript configuration (strict checking enabled)
- `vite.config.ts`: Vite build tool configuration
- `eslint.config.js`: Linting rules (flat config format)
- `prettier.config.js`: Code formatting rules
- `.gitignore`: Version control exclusions
- `README.md`: Project documentation and setup instructions

**Rationale**: Root-level placement is universal convention, makes configs discoverable, and expected by tooling.

**Impact on Success Criteria**: Supports FR-006 (environment-specific configuration) and SC-001 (10-minute setup).

---

## Environment Variables

### Decision: Vite Environment Files with `VITE_` Prefix

**Rationale**: Use framework-specific naming conventions for type-safe environment management:
- `VITE_` prefix for client-side accessible variables in Vite projects
- Separate files for different environments

**Best Practices**:
```
.env                 # Default values (safe to commit)
.env.local          # Local overrides (never commit)
.env.development    # Development environment
.env.production     # Production environment
.env.example        # Template documenting required variables
```

**Security**:
- Never commit `.env.local` or files containing secrets
- Document required variables in `.env.example`
- Validate environment variables at app startup
- Consider type-safe access via Zod or similar validation

**Impact on Success Criteria**: Supports FR-006 (environment-specific configuration) and FR-008 (clear error messages when setup requirements not met).

---

## Implementation Notes

All research findings align with the functional requirements in the feature specification and provide clear paths to achieving the success criteria. The selected technologies and patterns represent current industry best practices as of 2026, balancing developer experience, performance, and maintainability.

**Key Decisions Summary**:
- Build Tool: Vite
- Language: TypeScript
- Testing: Vitest + React Testing Library
- Code Quality: ESLint + Prettier
- Package Manager: npm
- Structure: Feature-based hybrid
- Components: Co-location with feature organization
