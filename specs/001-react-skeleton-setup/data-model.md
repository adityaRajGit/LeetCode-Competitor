# Data Model: React Project Foundation

**Feature**: React Project Foundation  
**Branch**: `001-react-skeleton-setup`  
**Date**: February 14, 2026

## Overview

This feature focuses on project infrastructure rather than business data models. The data structures documented here represent configuration, environment settings, and foundational type definitions that support the project setup.

## Configuration Models

### Environment Configuration

Represents environment-specific settings for the application.

**Attributes**:
- `mode`: Environment mode (development, production, test)
- `apiBaseUrl`: Base URL for API calls (future use)
- `enableDebugTools`: Flag to enable React Developer Tools
- `logLevel`: Logging verbosity (error, warn, info, debug)

**TypeScript Definition**:
```typescript
interface EnvironmentConfig {
  mode: 'development' | 'production' | 'test';
  apiBaseUrl?: string;
  enableDebugTools: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}
```

**Validation Rules**:
- `mode` is required and must be one of the allowed values
- `apiBaseUrl` must be a valid URL format when provided
- `enableDebugTools` should be `false` in production
- `logLevel` defaults to 'info' in production, 'debug' in development

**Usage**: Loaded from environment variables at application startup, validated, and made available throughout the application.

---

### Build Configuration

Represents Vite build tool configuration settings.

**Attributes**:
- `port`: Development server port
- `host`: Development server host
- `sourcemap`: Enable source maps
- `outDir`: Build output directory
- `assetsDir`: Assets directory within build output

**TypeScript Definition**:
```typescript
interface BuildConfig {
  port: number;
  host: string;
  sourcemap: boolean;
  outDir: string;
  assetsDir: string;
}
```

**Validation Rules**:
- `port` must be between 1024 and 65535
- `host` must be valid hostname or IP address
- `outDir` must be valid directory path
- `assetsDir` must be relative path

**Usage**: Configured in `vite.config.ts`, affects development server and production builds.

---

### Component Props Pattern

Represents the standard pattern for component property definitions.

**Attributes**:
- Common props: `className`, `style`, `children`
- Component-specific props documented per component
- Event handlers follow `onEventName` convention

**TypeScript Pattern**:
```typescript
interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Component-specific props extend base
interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

**Validation Rules**:
- All props should be typed (no `any`)
- Optional props use `?` suffix
- Event handlers accept appropriate event types
- Props should be read-only (React convention)

**Usage**: Pattern template for all component definitions in the project.

---

## Type Definitions

### Route Configuration

Represents application routing structure.

**Attributes**:
- `path`: URL path pattern
- `element`: Component to render
- `children`: Nested routes (optional)
- `loader`: Data loading function (optional)
- `errorElement`: Error boundary component (optional)

**TypeScript Definition**:
```typescript
interface RouteConfig {
  path: string;
  element: React.ComponentType;
  children?: RouteConfig[];
  loader?: () => Promise<unknown>;
  errorElement?: React.ComponentType;
}
```

**Validation Rules**:
- `path` must start with `/` for root routes
- `element` must be valid React component
- `children` enables nested routing
- `loader` enables data fetching before render

**Usage**: Configured in `core/router` to define application navigation.

---

## State Management Patterns

### Local Component State

For component-specific state that doesn't need sharing.

**Pattern**:
```typescript
const [state, setState] = useState<StateType>(initialValue);
```

**Usage Guidelines**:
- Use for UI state (toggles, form inputs, local visibility)
- Keep state as close to where it's used as possible
- Lift state up only when needed by multiple components

---

### Shared State (Context)

For state shared across multiple components in a feature.

**Pattern**:
```typescript
interface FeatureContextValue {
  data: DataType;
  loading: boolean;
  error: Error | null;
  actions: {
    fetchData: () => Promise<void>;
    resetData: () => void;
  };
}

const FeatureContext = createContext<FeatureContextValue | null>(null);
```

**Usage Guidelines**:
- Use for feature-level state that crosses component boundaries
- Provide context at feature module level
- Include both data and actions in context value
- Always provide default value or ensure non-null usage

---

## Relationships

```text
EnvironmentConfig
    ↓ configures
BuildConfig
    ↓ affects
Application Runtime
    ↓ renders
Components (using ComponentProps pattern)
    ↓ navigate via
RouteConfig
    ↓ may use
State Management (local or context)
```

## Notes

- **No Backend Integration**: This feature establishes frontend infrastructure only; API integration models will be defined in future features
- **Extensibility**: Type definitions follow React and TypeScript best practices to support future expansion
- **Validation**: Consider adding runtime validation using Zod or similar library for environment variables and external data
- **Documentation**: Each type should be documented with JSDoc comments in actual code

## Future Considerations

- API response types (when backend integration added)
- User authentication state models
- Problem/contest data models for LeetCode competitor features
- Caching and persistence patterns (localStorage, IndexedDB)
- Error handling and logging types
