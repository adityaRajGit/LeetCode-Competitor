# API Directory

API client configuration and service modules.

## Structure

Place API service modules here organized by domain.

Example:
```typescript
// userService.ts
export const userService = {
  getUser: async (id: string) => { /* ... */ },
  updateUser: async (id: string, data: UserData) => { /* ... */ },
}
```
