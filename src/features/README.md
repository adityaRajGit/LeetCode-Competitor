# Features Directory

This directory contains feature modules organized by domain.

Each feature module should follow this structure:
```
feature-name/
├── components/     # Feature-specific components
├── hooks/          # Feature-specific hooks
├── utils/          # Feature-specific utilities
├── types/          # Feature-specific types
└── index.ts        # Public API barrel export
```

## Guidelines

- Keep features independent and self-contained
- Export only what's needed by other parts of the application
- Use barrel exports (index.ts) for clean imports
