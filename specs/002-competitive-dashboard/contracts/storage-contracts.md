# Storage Contracts

**Feature**: 002-competitive-dashboard  
**Last Updated**: February 15, 2026

## Overview

This document defines the contract for client-side storage (Session Storage, Local Storage) including keys, schemas, and access patterns.

---

## Session Storage

**Lifetime**: Current browser session (cleared on page refresh, tab close)  
**Capacity**: ~5-10MB (browser-dependent)  
**Use Cases**: Temporary data that resets between sessions (friends list, activity feed)

### Storage Keys

#### `friends`
Stores the list of added friends with their stats and comparison metadata.

**Schema**:
```typescript
type StoredFriends = Friend[]

interface Friend extends LeetCodeUser {
  rankPosition: number
  previousRankPosition: number | null
  trendDirection: 'up' | 'down' | 'stable'
  isInactive: boolean
  isImproving: boolean
  lastActivityTimestamp: number
  addedAt: number
}
```

**Example**:
```json
[
  {
    "username": "aditya_raj",
    "totalSolved": 231,
    "easySolved": 124,
    "mediumSolved": 97,
    "hardSolved": 10,
    "ranking": 613761,
    "acceptanceRate": 61.09,
    "contributionPoints": 687,
    "reputation": 3,
    "submissionCalendar": { "1739836800": 2, ... },
    "currentStreak": 3,
    "todaySolved": 2,
    "weeklySolved": 10,
    "totalPoints": 1285,
    "lastFetched": 1708012800000,
    "cacheExpiry": 1708013100000,
    "rankPosition": 1,
    "previousRankPosition": 2,
    "trendDirection": "up",
    "isInactive": false,
    "isImproving": true,
    "lastActivityTimestamp": 1708012800000,
    "addedAt": 1708000000000
  }
]
```

**Access Pattern**:
```typescript
// Read
const friends: Friend[] = JSON.parse(sessionStorage.getItem('friends') || '[]')

// Write
sessionStorage.setItem('friends', JSON.stringify(friends))

// Clear
sessionStorage.removeItem('friends')
```

---

#### `previousStats`
Stores previous snapshot of user stats for activity detection.

**Schema**:
```typescript
type StoredPreviousStats = Record<string, LeetCodeUser>

// Key: username, Value: LeetCodeUser
```

**Example**:
```json
{
  "aditya_raj": {
    "username": "aditya_raj",
    "totalSolved": 229,
    "todaySolved": 0,
    "currentStreak": 3,
    ...
  },
  "rahul": {
    "username": "rahul",
    "totalSolved": 150,
    "todaySolved": 1,
    "currentStreak": 7,
    ...
  }
}
```

**Usage**: Compare with current stats to detect changes (problems solved, streak broken, rank changes)

---

#### `activityFeed`
Stores recent activity events for the activity feed display.

**Schema**:
```typescript
type StoredActivityFeed = ActivityEvent[]

interface ActivityEvent {
  id: string
  type: 'problems_solved' | 'streak_broken' | 'rank_changed' | 'streak_milestone' | 'achievement_unlocked'
  username: string
  timestamp: number
  message: string
  metadata?: Record<string, any>
}
```

**Example**:
```json
[
  {
    "id": "evt-1708012800-aditya",
    "type": "problems_solved",
    "username": "aditya_raj",
    "timestamp": 1708012800000,
    "message": "aditya_raj solved 3 problems today",
    "metadata": { "problemsSolved": 3 }
  },
  {
    "id": "evt-1708012750-rahul",
    "type": "streak_broken",
    "username": "rahul",
    "timestamp": 1708012750000,
    "message": "rahul broke 7-day streak",
    "metadata": { "streakDays": 7 }
  }
]
```

**Constraints**: Maximum 10 events, sorted by timestamp descending (most recent first)

---

#### `currentUser`
Stores the logged-in user's own LeetCode stats for the session.

**Schema**: `LeetCodeUser` (same as friends, but represents self)

**Example**:
```json
{
  "username": "myusername",
  "totalSolved": 250,
  "easySolved": 140,
  "mediumSolved": 90,
  "hardSolved": 20,
  ...
}
```

---

#### `badges`
Tracks which badges each user has earned.

**Schema**:
```typescript
type StoredBadges = Record<string, BadgeId[]>

type BadgeId = 'grinder' | 'speed_coder' | 'dominator'
```

**Example**:
```json
{
  "aditya_raj": ["grinder", "speed_coder"],
  "rahul": ["dominator"],
  "ankit": []
}
```

---

#### `rankHistory`
Stores historical rank positions for Dominator badge tracking.

**Schema**:
```typescript
type StoredRankHistory = Record<string, RankHistoryEntry[]>

interface RankHistoryEntry {
  date: string        // ISO date string (YYYY-MM-DD)
  rank: number        // Rank position on that date
}
```

**Example**:
```json
{
  "aditya_raj": [
    { "date": "2026-02-15", "rank": 1 },
    { "date": "2026-02-14", "rank": 1 },
    { "date": "2026-02-13", "rank": 1 }
  ]
}
```

**Usage**: Check if user held rank 1 for 7 consecutive days

---

## Local Storage

**Lifetime**: Persists across browser sessions until manually cleared  
**Capacity**: ~5-10MB (browser-dependent)  
**Use Cases**: Long-lived preferences and cached data

### Storage Keys

#### `theme`
User's preferred UI theme.

**Schema**:
```typescript
type StoredTheme = 'light' | 'dark'
```

**Example**:
```json
"dark"
```

**Access Pattern**:
```typescript
// Read (with default)
const theme: Theme = (localStorage.getItem('theme') as Theme) || 'dark'

// Write
localStorage.setItem('theme', 'dark')
```

---

#### `user-cache-<username>`
Cached user statistics to minimize API calls. Key is prefixed with username.

**Schema**: Same as `LeetCodeUser`

**Example Key**: `user-cache-aditya_raj`

**Example Value**:
```json
{
  "username": "aditya_raj",
  "totalSolved": 231,
  "lastFetched": 1708012800000,
  "cacheExpiry": 1708013100000,
  ...
}
```

**Cache Strategy**:
```typescript
function getCachedUser(username: string): LeetCodeUser | null {
  const key = `user-cache-${username}`
  const cached = localStorage.getItem(key)
  if (!cached) return null
  
  const user: LeetCodeUser = JSON.parse(cached)
  
  // Check if cache expired
  if (Date.now() > user.cacheExpiry) {
    localStorage.removeItem(key)
    return null
  }
  
  return user
}

function setCachedUser(user: LeetCodeUser): void {
  const key = `user-cache-${user.username}`
  localStorage.setItem(key, JSON.stringify(user))
}
```

**Expiry**: 5 minutes (300,000ms)

---

#### `api-last-fetch-<username>`
Timestamp of last API fetch for rate limiting. Key is prefixed with username.

**Schema**:
```typescript
type StoredTimestamp = string  // Unix timestamp in milliseconds as string
```

**Example Key**: `api-last-fetch-aditya_raj`  
**Example Value**: `"1708012800000"`

**Usage**:
```typescript
function canFetchUser(username: string): boolean {
  const key = `api-last-fetch-${username}`
  const lastFetch = localStorage.getItem(key)
  if (!lastFetch) return true
  
  const elapsed = Date.now() - parseInt(lastFetch, 10)
  return elapsed >= 60000  // 60 seconds cooldown
}

function recordFetch(username: string): void {
  const key = `api-last-fetch-${username}`
  localStorage.setItem(key, Date.now().toString())
}
```

---

#### `myUsername`
(Optional) User's own LeetCode username if they want to persist it.

**Schema**:
```typescript
type StoredUsername = string
```

**Example**: `"aditya_raj"`

**Note**: This is optional. User setup flow is not defined in current specification.

---

## Storage Utilities

### Generic Storage Wrapper

```typescript
// Session Storage wrapper
export const SessionStore = {
  get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`[SessionStore] Error reading key "${key}":`, error)
      return null
    }
  },
  
  set<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`[SessionStore] Error writing key "${key}":`, error)
      // Handle quota exceeded
      if (error.name === 'QuotaExceededError') {
        // Clear old entries or notify user
      }
    }
  },
  
  remove(key: string): void {
    sessionStorage.removeItem(key)
  },
  
  clear(): void {
    sessionStorage.clear()
  }
}

// Local Storage wrapper (similar structure)
export const LocalStore = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : (defaultValue || null)
    } catch (error) {
      console.error(`[LocalStore] Error reading key "${key}":`, error)
      return defaultValue || null
    }
  },
  
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`[LocalStore] Error writing key "${key}":`, error)
      if (error.name === 'QuotaExceededError') {
        // Handle quota exceeded
      }
    }
  },
  
  remove(key: string): void {
    localStorage.removeItem(key)
  },
  
  clear(): void {
    localStorage.clear()
  }
}
```

---

## Storage Limits & Quota Management

### Monitoring Storage Usage

```typescript
function getStorageSize(storage: Storage): number {
  let size = 0
  for (let key in storage) {
    if (storage.hasOwnProperty(key)) {
      size += key.length + (storage[key]?.length || 0)
    }
  }
  return size  // Size in characters (roughly bytes for ASCII)
}

function getStorageUsage(): {
  session: { used: number, percentage: number },
  local: { used: number, percentage: number }
} {
  const ESTIMATED_LIMIT = 5 * 1024 * 1024  // 5MB estimate
  
  const sessionUsed = getStorageSize(sessionStorage)
  const localUsed = getStorageSize(localStorage)
  
  return {
    session: {
      used: sessionUsed,
      percentage: (sessionUsed / ESTIMATED_LIMIT) * 100
    },
    local: {
      used: localUsed,
      percentage: (localUsed / ESTIMATED_LIMIT) * 100
    }
  }
}
```

### Quota Exceeded Handling

```typescript
function handleQuotaExceeded(storageType: 'session' | 'local'): void {
  const storage = storageType === 'session' ? sessionStorage : localStorage
  
  if (storageType === 'session') {
    // Clear activity feed (least important data)
    SessionStore.remove('activityFeed')
    
    // Clear previous stats if still over quota
    if (getStorageSize(sessionStorage) > 4.5 * 1024 * 1024) {
      SessionStore.remove('previousStats')
    }
  } else {
    // Clear old user caches
    const keys = Object.keys(localStorage)
    const cacheKeys = keys.filter(k => k.startsWith('user-cache-'))
    
    // Remove oldest caches
    cacheKeys.forEach(key => {
      const user = LocalStore.get<LeetCodeUser>(key)
      if (user && user.lastFetched < Date.now() - 86400000) {  // Older than 1 day
        LocalStore.remove(key)
      }
    })
  }
}
```

---

## Data Migration

If storage schema changes in future versions:

```typescript
const STORAGE_VERSION = 1

interface StorageMigration {
  version: number
  migrate: () => void
}

const migrations: StorageMigration[] = [
  {
    version: 1,
    migrate: () => {
      // Initial version, no migration needed
    }
  }
  // Future migrations added here
]

function runMigrations(): void {
  const currentVersion = parseInt(localStorage.getItem('storageVersion') || '0', 10)
  
  migrations.forEach(migration => {
    if (migration.version > currentVersion) {
      migration.migrate()
      localStorage.setItem('storageVersion', migration.version.toString())
    }
  })
}
```

---

## Security Considerations

**Data Sensitivity**: Low (public LeetCode statistics)  
**XSS Protection**: Always use `JSON.parse()` and `JSON.stringify()` (never `eval()`)  
**Data Validation**: Validate all data read from storage before use

```typescript
function validateStoredFriends(data: any): boolean {
  if (!Array.isArray(data)) return false
  
  return data.every(friend => 
    typeof friend.username === 'string' &&
    typeof friend.totalSolved === 'number' &&
    typeof friend.rankPosition === 'number'
  )
}

// Usage
const rawFriends = SessionStore.get<Friend[]>('friends')
if (rawFriends && validateStoredFriends(rawFriends)) {
  // Safe to use
} else {
  // Invalid data, clear and reset
  SessionStore.remove('friends')
}
```

---

## Contract Version

**Version**: 1.0  
**Last Updated**: February 15, 2026  
**Breaking Changes**: None  
**Migration Path**: N/A (initial version)
