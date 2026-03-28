# Configuration Contract

**Version**: 1.0.0  
**Type**: Application Configuration  
**Purpose**: Define the contract for application configuration and environment variables

## Environment Variables Contract

### Required Variables

None required for initial setup. All variables have defaults.

### Optional Variables

| Variable | Type | Default | Description | Example |
|----------|------|---------|-------------|---------|
| `VITE_API_BASE_URL` | string (URL) | `/api` | Base URL for API requests | `http://localhost:3000/api` |
| `VITE_LOG_LEVEL` | enum | `info` | Application log level | `debug`, `info`, `warn`, `error` |
| `VITE_ENABLE_DEBUG_TOOLS` | boolean | `true` in dev | Enable React DevTools | `true`, `false` |

### Validation Rules

1. **VITE_API_BASE_URL**
   - Must be valid URL format if provided
   - Should not end with trailing slash
   - Protocol optional for relative paths

2. **VITE_LOG_LEVEL**
   - Must be one of: `debug`, `info`, `warn`, `error`
   - Case-insensitive
   - Defaults to `info` in production, `debug` in development

3. **VITE_ENABLE_DEBUG_TOOLS**
   - Must be parseable as boolean
   - Values: `true`, `false`, `1`, `0`, `yes`, `no`
   - Should be `false` in production builds

### TypeScript Interface

```typescript
interface EnvironmentVariables {
  VITE_API_BASE_URL?: string;
  VITE_LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
  VITE_ENABLE_DEBUG_TOOLS?: boolean;
}

interface ResolvedConfig {
  apiBaseUrl: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableDebugTools: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}
```

### Access Pattern

```typescript
// Reading environment variables
const apiUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

// Accessing resolved config
import { config } from '@/core/config';
console.log(config.apiBaseUrl);
```

### Error Handling

- **Missing Required Variables**: Application should fail fast on startup with clear error message
- **Invalid Format**: Log warning and use default value
- **Type Mismatch**: Coerce to expected type or use default

### Validation Timing

- Environment variables validated at application startup (`main.tsx`)
- Failed validation prevents application initialization
- Validation errors displayed in console with remediation instructions

## Build Configuration Contract

### Vite Configuration

**File**: `vite.config.ts`

**Required Settings**:
- `base`: Application base path (default: `/`)
- `plugins`: React plugin enabled
- `resolve.alias`: Path aliases configured (e.g., `@/` maps to `src/`)

**Optional Settings**:
- `server.port`: Development server port (default: `5173`)
- `server.host`: Development server host (default: `localhost`)
- `build.outDir`: Output directory (default: `dist`)
- `build.sourcemap`: Enable source maps (default: `true` in dev)

### TypeScript Configuration

**File**: `tsconfig.json`

**Required Settings**:
- `compilerOptions.strict`: `true`
- `compilerOptions.target`: `ES2020` or higher
- `compilerOptions.module`: `ESNext`
- `compilerOptions.jsx`: `react-jsx`
- `compilerOptions.moduleResolution`: `bundler`

**Path Mappings**:
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

## Package Scripts Contract

### Required Scripts

| Script | Command | Purpose | Expected Exit Code |
|--------|---------|---------|-------------------|
| `dev` | `vite` | Start development server | 0 (runs until stopped) |
| `build` | `tsc && vite build` | Production build | 0 on success |
| `preview` | `vite preview` | Preview production build | 0 (runs until stopped) |
| `test` | `vitest` | Run tests | 0 if all pass |
| `lint` | `eslint . --ext ts,tsx` | Lint code | 0 if no errors |
| `format` | `prettier --write .` | Format code | 0 on success |
| `type-check` | `tsc --noEmit` | Type checking | 0 if no errors |

### Script Behavior

- **dev**: Must start server in < 30 seconds, enable HMR
- **build**: Must complete in < 3 minutes for base project, produce optimized output
- **test**: Must run all tests, support watch mode with `--watch` flag
- **lint**: Must check all TypeScript/TSX files, support `--fix` for auto-fixes
- **format**: Must format all source files according to Prettier config

## Configuration File Locations

All configuration files at repository root:

```
├── .env.example          # Environment variable template
├── .env.local           # Local overrides (git-ignored)
├── eslint.config.js     # ESLint configuration
├── prettier.config.js   # Prettier configuration
├── tsconfig.json        # TypeScript config (app)
├── tsconfig.node.json   # TypeScript config (build scripts)
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies and scripts
```

## Versioning

- **Breaking Changes**: Require major version bump
  - Removing environment variables
  - Changing required configuration format
  - Removing package scripts
  
- **Non-Breaking Changes**: Minor version bump
  - Adding optional environment variables
  - Adding new package scripts
  - Enhancing validation rules (more permissive)

- **Patches**: Patch version bump
  - Fixing validation bugs
  - Updating default values
  - Documentation corrections

## Notes

- Configuration validated at build time and runtime
- Development and production modes have different defaults
- Configuration errors should provide actionable error messages
- All configuration files use JavaScript/TypeScript (no JSON for configs)
