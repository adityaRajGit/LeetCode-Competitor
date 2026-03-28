# Data Model: Competitive Coding Dashboard

**Feature**: 002-competitive-dashboard  
**Date**: February 15, 2026  
**Status**: Complete

## Overview

This document defines all data structures, entities, and their relationships for the competitive coding dashboard. All data is stored client-side (session/local storage) with no backend database.

---

## Core Entities

### 1. LeetCodeUser

Represents a LeetCode user (main user or friend) with comprehensive statistics.

```typescript
interface LeetCodeUser {
  // Identity
  username: string                    // LeetCode username (unique identifier)
  
  // Problem Statistics
  totalSolved: number                 // Total problems solved across all difficulties
  easySolved: number                  // Easy problems solved
  mediumSolved: number                // Medium problems solved  
  hardSolved: number                  // Hard problems solved
  
  // Platform Metrics
  ranking: number                     // Global LeetCode rank
  acceptanceRate: number              // Percentage (0-100)
  contributionPoints: number          // LeetCode contribution score
  reputation: number                  // LeetCode reputation score
  
  // Submission History
  submissionCalendar: SubmissionCalendar  // Daily submission counts
  
  // Derived Metrics (calculated client-side)
  currentStreak: number               // Consecutive days with submissions
  todaySolved: number                 // Problems solved today (from calendar)
  weeklySolved: number                // Problems solved in past 7 days
  totalPoints: number                 // Calculated score (see PointsCalculation)
  
  // Metadata
  lastFetched: number                 // Unix timestamp of last API fetch
  cacheExpiry: number                 // Unix timestamp when cache expires
}
```

**Storage**: Session storage for active session, local storage for recent cache

**Validation Rules**:
- `username`: Non-empty string, alphanumeric + hyphen/underscore
- All counts: Non-negative integers
- `acceptanceRate`: 0-100
- `lastFetched`, `cacheExpiry`: Valid Unix timestamps

---

### 2. SubmissionCalendar

Maps dates to submission counts for daily activity tracking.

```typescript
interface SubmissionCalendar {
  [unixTimestamp: string]: number   // "1739836800" → 2 (solved 2 problems)
}

// Example:
{
  "1739836800": 2,   // Date 1: 2 submissions
  "1752364800": 1,   // Date 2: 1 submission
  "1755216000": 5    // Date 3: 5 submissions
}
```

**Properties**:
- Keys: Unix timestamps as strings (seconds since epoch)
- Values: Non-negative integers representing submission count
- Sparse: Only dates with submissions are included
- Time Range: Can span multiple years

**Usage**:
- Calculate current streak
- Determine today's solved count
- Generate performance charts
- Calculate weekly/monthly statistics

---

### 3. Friend

Extends LeetCodeUser with comparison-specific metadata.

```typescript
interface Friend extends LeetCodeUser {
  // Comparison Metadata
  rankPosition: number                // Position in leaderboard (1 = first)
  previousRankPosition: number | null // Previous rank for trend calculation
  trendDirection: 'up' | 'down' | 'stable'  // Rank change indicator
  
  // Status Flags
  isInactive: boolean                 // True if no activity in past 7 days
  isImproving: boolean                // True if rank improved since last check
  
  // Activity Tracking
  lastActivityTimestamp: number       // Last time stats changed
  addedAt: number                     // When friend was added (Unix timestamp)
}
```

**Storage**: Session storage (resets on page refresh per spec)

**Derived Fields**:
- `trendDirection`: Calculated from `rankPosition` vs `previousRankPosition`
- `isInactive`: True if `lastActivityTimestamp` > 7 days ago
- `isImproving`: True if `rankPosition` < `previousRankPosition`

---

### 4. ActivityEvent

Represents a notable change in friend statistics displayed in activity feed.

```typescript
type ActivityEventType = 
  | 'problems_solved'
  | 'streak_broken'
  | 'rank_changed'
  | 'streak_milestone'
  | 'achievement_unlocked'

interface ActivityEvent {
  id: string                          // Unique identifier (UUID or timestamp-based)
  type: ActivityEventType             // Event type discriminator
  username: string                    // Friend username
  timestamp: number                   // Unix timestamp when event occurred
  message: string                     // Human-readable message for display
  
  // Type-specific metadata
  metadata?: {
    problemsSolved?: number           // For 'problems_solved'
    streakDays?: number               // For 'streak_broken' or 'streak_milestone'
    newRank?: number                  // For 'rank_changed'
    oldRank?: number                  // For 'rank_changed'
    badgeId?: string                  // For 'achievement_unlocked'
  }
}
```

**Examples**:
```typescript
{
  id: "evt-1708012800-user1",
  type: "problems_solved",
  username: "aditya_raj",
  timestamp: 1708012800,
  message: "aditya_raj solved 3 problems today",
  metadata: { problemsSolved: 3 }
}

{
  id: "evt-1708012801-user2",
  type: "streak_broken",
  username: "rahul",
  timestamp: 1708012801,
  message: "rahul broke 7-day streak",
  metadata: { streakDays: 7 }
}

{
  id: "evt-1708012802-user3",
  type: "rank_changed",
  username: "ankit",
  timestamp: 1708012802,
  message: "ankit passed you in ranking",
  metadata: { newRank: 2, oldRank: 3 }
}
```

**Storage**: Session storage, limited to 10 most recent events

**Generation Logic**: Compare previous stats snapshot with current stats, create events for significant changes

---

### 5. Badge

Represents an achievement badge earned by user.

```typescript
type BadgeId = 'grinder' | 'speed_coder' | 'dominator'

interface Badge {
  id: BadgeId                         // Unique badge identifier
  name: string                        // Display name
  icon: string                        // Emoji or icon identifier
  description: string                 // Criteria description
  criteriaCheck: (user: LeetCodeUser | Friend, history?: any) => boolean
  earnedAt: number | null             // Unix timestamp when earned, null if not earned
}
```

**Badge Definitions**:
```typescript
const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'grinder',
    name: 'Grinder',
    icon: '🧠',
    description: 'Maintain 7+ day streak',
    criteriaCheck: (user) => user.currentStreak >= 7,
    earnedAt: null
  },
  {
    id: 'speed_coder',
    name: 'Speed Coder',
    icon: '🚀',
    description: 'Solve 10+ problems in a single day',
    criteriaCheck: (user) => user.todaySolved >= 10,
    earnedAt: null
  },
  {
    id: 'dominator',
    name: 'Dominator',
    icon: '👑',
    description: 'Hold 1st rank for 7 consecutive days',
    criteriaCheck: (user, history) => {
      // Requires historical rank tracking
      return history?.consecutiveDaysAtRank1 >= 7
    },
    earnedAt: null
  }
]
```

**Storage**: Session storage alongside user data

**Awarding Logic**: Check criteria on stat updates, set `earnedAt` timestamp when criteria met

---

### 6. LeaderboardEntry

Represents a single row in the leaderboard display.

```typescript
interface LeaderboardEntry {
  rank: number                        // Position (1 = first, ties share same rank)
  user: Friend                        // Reference to friend data
  
  // Display Columns
  username: string                    // Display name
  todaySolved: number                 // Today's problem count
  weeklySolved: number                // Past 7 days count
  totalPoints: number                 // Calculated score
  currentStreak: number               // Streak days
  trendIndicator: '↑' | '↓' | '→'    // Trend arrow
  
  // Visual Effects
  shouldGlow: boolean                 // Green glow if improving
  shouldHighlight: boolean            // Red highlight if inactive
  hasFireIcon: boolean                // Fire icon if streak > 5
  badges: BadgeId[]                   // List of earned badge IDs
}
```

**Derivation**: Generated from `Friend[]` by sorting by `totalPoints` descending and assigning ranks

**Tied Ranks**: Multiple entries can share same rank, next rank skips appropriately
```typescript
// Example: Two users tied at rank 2
[
  { rank: 1, totalPoints: 500, ... },
  { rank: 2, totalPoints: 400, ... },  // Tied
  { rank: 2, totalPoints: 400, ... },  // Tied
  { rank: 4, totalPoints: 300, ... }   // Skips rank 3
]
```

---

### 7. PointsCalculation

Not a stored entity but a critical derived value.

```typescript
interface PointsBreakdown {
  basePoints: number                  // (Easy × 5) + (Medium × 10) + (Hard × 20)
  streakBonus: number                 // +10 if currentStreak >= 1, else 0
  competitionBonus: number            // +15 if todaySolved > bestFriendTodaySolved, else 0
  totalPoints: number                 // Sum of above
}

function calculatePoints(
  user: LeetCodeUser,
  bestFriendTodaySolved: number = 0
): PointsBreakdown {
  const basePoints = 
    (user.easySolved * 5) +
    (user.mediumSolved * 10) +
    (user.hardSolved * 20)
  
  const streakBonus = user.currentStreak >= 1 ? 10 : 0
  
  const competitionBonus = user.todaySolved > bestFriendTodaySolved ? 15 : 0
  
  return {
    basePoints,
    streakBonus,
    competitionBonus,
    totalPoints: basePoints + streakBonus + competitionBonus
  }
}
```

**Immutability**: Pure function, no side effects, memoizable

---

### 8. ThemePreference

Simple enum for UI theme setting.

```typescript
type Theme = 'light' | 'dark'

interface ThemePreference {
  current: Theme                      // Current active theme
  lastChanged: number                 // Unix timestamp of last change
}
```

**Storage**: Local storage (persists across sessions)

**Default**: 'dark'

---

## Storage Schemas

### Session Storage Keys

```typescript
// Friend list
'friends': JSON<Friend[]>

// Previous stats snapshot for activity detection
'previousStats': JSON<Record<username, LeetCodeUser>>

// Activity feed
'activityFeed': JSON<ActivityEvent[]>

// User's own stats for current session
'currentUser': JSON<LeetCodeUser>

// Badge tracking
'badges': JSON<Record<username, BadgeId[]>>

// Rank history for Dominator badge
'rankHistory': JSON<Record<username, Array<{ date: string, rank: number }>>>
```

### Local Storage Keys

```typescript
// Theme preference
'theme': Theme  // 'light' | 'dark'

// User stats cache (per username)
'user-cache-<username>': JSON<LeetCodeUser>

// Last API fetch timestamp (per username, for rate limiting)
'api-last-fetch-<username>': string  // Unix timestamp

// User's own username (if they want to persist it)
'myUsername': string
```

---

## Data Flow Diagrams

### User Stats Fetch Flow
```
User enters username
     ↓
Check local cache (is fresh?)
     ↓ (cache miss or stale)
Check rate limit (last fetch > 60s ago?)
     ↓ (rate limit passed)
Fetch from API: https://leetcode-stats-api.herokuapp.com/<username>
     ↓ (success)
Parse response → LeetCodeUser
     ↓
Calculate derived fields (streak, today, weekly, points)
     ↓
Store in session storage & local cache
     ↓
Update UI
```

### Friend Addition Flow
```
User clicks "Add Friend"
     ↓
Modal opens
     ↓
User enters username
     ↓
Validate username (fetch stats via flow above)
     ↓ (validation success)
Display preview (stats summary)
     ↓
User clicks "Add" button
     ↓
Check for duplicates (already in friends list?)
     ↓ (no duplicates)
Create Friend object from LeetCodeUser
     ↓
Add to friends array in session storage
     ↓
Recalculate leaderboard
     ↓
Show "New Rival Added ⚔️" animation
     ↓
Close modal & update UI
```

### Activity Detection Flow
```
Stats refresh triggered (manual or periodic)
     ↓
Fetch current stats for all friends
     ↓
Load previousStats from session storage
     ↓
For each friend:
  Compare current vs previous
  If todaySolved increased → create 'problems_solved' event
  If streak went from >0 to 0 → create 'streak_broken' event
  If rank position changed → create 'rank_changed' event
     ↓
Collect all new events
     ↓
Prepend to activityFeed (keep most recent 10)
     ↓
Store updated activityFeed in session storage
     ↓
Store current stats as new previousStats
     ↓
Update activity feed UI
```

---

## Calculated Fields

### Streak Calculation
```typescript
function calculateStreak(submissionCalendar: SubmissionCalendar): number {
  const now = Date.now()
  const oneDayMs = 86400000
  const todayStart = Math.floor(now / oneDayMs) * oneDayMs / 1000  // Unix seconds
  
  let streak = 0
  let currentDay = todayStart
  
  while (true) {
    const count = submissionCalendar[currentDay.toString()]
    if (!count || count === 0) break
    streak++
    currentDay -= 86400  // Go back one day (86400 seconds)
  }
  
  return streak
}
```

### Today Solved Calculation
```typescript
function getTodaySolved(submissionCalendar: SubmissionCalendar): number {
  const now = Date.now()
  const oneDayMs = 86400000
  const todayStart = Math.floor(now / oneDayMs) * oneDayMs / 1000  // Unix seconds
  
  return submissionCalendar[todayStart.toString()] || 0
}
```

### Weekly Solved Calculation
```typescript
function getWeeklySolved(submissionCalendar: SubmissionCalendar): number {
  const now = Date.now()
  const oneDayMs = 86400000
  const todayStart = Math.floor(now / oneDayMs) * oneDayMs / 1000
  const sevenDaysAgo = todayStart - (7 * 86400)
  
  let total = 0
  for (let day = sevenDaysAgo; day <= todayStart; day += 86400) {
    total += submissionCalendar[day.toString()] || 0
  }
  
  return total
}
```

---

## Data Validation

### API Response Validation
```typescript
function validateLeetCodeAPIResponse(data: any): LeetCodeUser | null {
  if (data.status !== 'success') return null
  
  if (typeof data.totalSolved !== 'number' || data.totalSolved < 0) return null
  if (typeof data.easySolved !== 'number' || data.easySolved < 0) return null
  if (typeof data.mediumSolved !== 'number' || data.mediumSolved < 0) return null
  if (typeof data.hardSolved !== 'number' || data.hardSolved < 0) return null
  if (typeof data.ranking !== 'number' || data.ranking < 0) return null
  if (typeof data.submissionCalendar !== 'object') return null
  
  // Validation passed, construct user object
  return {
    username: '...',  // Provided separately
    totalSolved: data.totalSolved,
    easySolved: data.easySolved,
    // ... etc
  }
}
```

---

## Data Model Complete

All entities, relationships, and storage schemas defined. Ready for Phase 1 contracts and quickstart documentation.

**Next Artifact**: contracts/ directory with API contracts and component interfaces
