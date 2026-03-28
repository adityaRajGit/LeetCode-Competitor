# Phase 0: Research & Technical Decisions

**Feature**: Competitive Coding Dashboard  
**Date**: February 15, 2026  
**Status**: Complete

## Overview

This document captures research findings and technical decisions for implementing a fully client-side competitive coding dashboard. All unknowns from the Technical Context have been resolved through analysis of project requirements, existing codebase, and best practices.

## Technology Decisions

### 1. Client-Side Data Storage

**Decision**: Hybrid approach using Session Storage + Local Storage + (optional) IndexedDB

**Rationale**:
- **Session Storage** for friend list and activity feed (resets on page refresh per spec requirement)
- **Local Storage** for theme preferences and recent user stats cache (persists across sessions)
- **IndexedDB** as fallback for large submission calendar data if session storage limits hit

**Research Findings**:
- Session Storage: ~5-10MB limit per origin (browser-dependent), sufficient for 50 friends
- Local Storage: Same limits, synchronous API suitable for theme/small cache
- IndexedDB: Larger capacity (50MB+), but async API adds complexity
- Submission calendar for 12 months: ~365 entries × 2 fields = ~3KB per user
- 50 friends with full data: ~150KB, well within session storage limits

**Implementation Approach**:
```typescript
// Session Storage: Friends (resets on refresh)
sessionStorage.setItem('friends', JSON.stringify(friendsList))

// Local Storage: Theme + Recent Cache (persists)
localStorage.setItem('theme', 'dark')
localStorage.setItem(`user-cache-${username}`, JSON.stringify(userData))

// IndexedDB: Only if needed for performance optimization
// Defer unless session storage performance issues observed
```

---

### 2. LeetCode API Integration & Rate Limiting

**Decision**: Client-side API wrapper with exponential backoff and 60s rate limiting per user

**API Contract**:
```
Endpoint: https://leetcode-stats-api.herokuapp.com/<USERNAME>
Method: GET
CORS: Enabled
Headers: None required

Response (200 OK):
{
  "status": "success",
  "totalSolved": number,
  "easySolved": number,
  "mediumSolved": number,
  "hardSolved": number,
  "ranking": number,
  "acceptanceRate": number,
  "contributionPoints": number,
  "reputation": number,
  "submissionCalendar": {
    "1739836800": 2,  // Unix timestamp → count
    ...
  }
}

Error (404): Username not found
Error (429): Rate limit exceeded
Error (500+): Service unavailable
```

**Rate Limiting Strategy**:
- Client-side tracking: Last fetch timestamp per username in memory Map
- Cooldown: 60 seconds between requests for same username
- UI feedback: Display "Refreshing available in X seconds" if cooling down
- Cache fallback: Show cached data with timestamp if rate limited
- Exponential backoff: On 429/500+ errors, wait 1s, 2s, 4s, 8s before retry

**Error Handling**:
```typescript
try {
  const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
  if (!response.ok) {
    if (response.status === 404) throw new Error('Username not found')
    if (response.status === 429) throw new Error('Rate limit exceeded')
    throw new Error('Service unavailable')
  }
  return await response.json()
} catch (error) {
  // Return cached data if available + show error toast
}
```

---

### 3. Points Calculation Algorithm

**Decision**: Pure function with memoization for performance

**Formula** (from spec):
```
Base Points = (Easy × 5) + (Medium × 10) + (Hard × 20)
Streak Bonus = Current Streak ≥ 1 ? +10 : 0
Competition Bonus = Today Solved > Best Friend Today Solved ? +15 : 0
Total Points = Base + Streak Bonus + Competition Bonus
```

**Implementation**:
```typescript
function calculatePoints(user: LeetCodeUser, friends: Friend[]): number {
  const base = (user.easySolved * 5) + (user.mediumSolved * 10) + (user.hardSolved * 20)
  const streakBonus = user.currentStreak >= 1 ? 10 : 0
  
  const bestFriendTodaySolved = Math.max(...friends.map(f => f.todaySolved), 0)
  const competitionBonus = user.todaySolved > bestFriendTodaySolved ? 15 : 0
  
  return base + streakBonus + competitionBonus
}

// Memoization for leaderboard recalculation
const memoizedPoints = useMemo(() => 
  calculatePoints(user, friends), 
  [user.easySolved, user.mediumSolved, user.hardSolved, user.currentStreak, user.todaySolved, friends]
)
```

**Performance**: O(n) where n = number of friends, acceptable for n ≤ 50

---

### 4. Streak Calculation from Submission Calendar

**Decision**: Parse submission calendar backwards from today until gap found

**Algorithm**:
```typescript
function calculateStreak(submissionCalendar: Record<string, number>): number {
  const today = Math.floor(Date.now() / 1000)
  const oneDaySeconds = 86400
  
  let streak = 0
  let currentDay = today
  
  // Normalize to start of day in user's timezone
  currentDay = Math.floor(currentDay / oneDaySeconds) * oneDaySeconds
  
  while (true) {
    const submissions = submissionCalendar[currentDay.toString()]
    if (!submissions || submissions === 0) break
    streak++
    currentDay -= oneDaySeconds // Go back one day
  }
  
  return streak
}
```

**Edge Cases**:
- Timezone handling: Use user's local timezone for "today"
- Sparse calendar: Missing dates treated as 0 submissions
- Today = 0: Breaks streak if yesterday also 0

---

### 5. NeoBrutalism Design System

**Decision**: CSS custom properties + utility classes for consistent theming

**Design Tokens**:
```css
/* neobrutalism.css */
:root {
  --neo-black: #000000;
  --neo-white: #ffffff;
  --neo-primary: #00ff00;    /* Neon green */
  --neo-secondary: #ff00ff;  /* Neon pink */
  --neo-accent: #00ffff;     /* Cyan */
  --neo-border: 4px;
  --neo-shadow: 4px 4px 0 var(--neo-black);
  --neo-radius: 0;           /* Sharp corners */
  --neo-transition: none;    /* No smooth transitions */
}

[data-theme="dark"] {
  --neo-bg: #000000;
  --neo-fg: #00ff00;
  --neo-card-bg: #111111;
}

[data-theme="light"] {
  --neo-bg: #ffffff;
  --neo-fg: #000000;
  --neo-card-bg: #f0f0f0;
}

.neo-card {
  border: var(--neo-border) solid var(--neo-black);
  box-shadow: var(--neo-shadow);
  background: var(--neo-card-bg);
  padding: 1.5rem;
}

.neo-button {
  border: var(--neo-border) solid var(--neo-black);
  background: var(--neo-primary);
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transform: translate(0, 0);
}

.neo-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--neo-black);
}

.neo-button:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--neo-black);
}
```

**Component Styling Strategy**:
- CSS Modules for component-specific styles (existing pattern)
- NeoBrutalism tokens imported globally
- Dark/light mode via `data-theme` attribute on `<html>`

---

### 6. Chart Rendering

**Decision**: Lightweight SVG-based charts without heavy library dependency

**Rationale**:
- Requirement: Simple line/bar charts for daily/weekly trends
- Existing deps: No charting library in package.json
- Complexity: Custom SVG sufficient for required chart types
- Performance: SVG renders faster than Canvas for < 500 datapoints
- Bundle size: Avoid adding Chart.js (~180KB) or Recharts (~400KB)

**Implementation Approach**:
```tsx
// Custom SVG line chart component
function LineChart({ data }: { data: Array<{x: number, y: number}> }) {
  const width = 600, height = 300
  const xScale = (x: number) => (x / maxX) * width
  const yScale = (y: number) => height - (y / maxY) * height
  
  const pathData = data
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${xScale(point.x)} ${yScale(point.y)}`)
    .join(' ')
  
  return (
    <svg width={width} height={height} className="neo-chart">
      <path d={pathData} stroke="var(--neo-primary)" fill="none" strokeWidth="3" />
      {/* Add axes, labels, etc. */}
    </svg>
  )
}
```

**Alternative Considered**: Recharts library - rejected due to bundle size and overkill for simple charts

---

### 7. Activity Feed Event Detection

**Decision**: Diff-based comparison on stat refresh, store previous snapshot

**Algorithm**:
```typescript
function detectActivities(
  previousStats: Map<string, LeetCodeUser>,
  currentStats: Map<string, LeetCodeUser>
): ActivityEvent[] {
  const events: ActivityEvent[] = []
  
  currentStats.forEach((current, username) => {
    const previous = previousStats.get(username)
    if (!previous) return // New friend, no activity yet
    
    // Detect problems solved today
    if (current.todaySolved > previous.todaySolved) {
      events.push({
        type: 'problems_solved',
        username,
        message: `${username} solved ${current.todaySolved - previous.todaySolved} problems today`,
        timestamp: Date.now()
      })
    }
    
    // Detect streak broken
    if (previous.currentStreak > 0 && current.currentStreak === 0) {
      events.push({
        type: 'streak_broken',
        username,
        message: `${username} broke ${previous.currentStreak}-day streak`,
        timestamp: Date.now()
      })
    }
    
    // Detect rank change (requires previous leaderboard calculation)
    // ... similar logic
  })
  
  return events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)
}
```

**Storage**: Activities stored in session storage, cleared on refresh

---

### 8. Testing Strategy

**Decision**: Component tests + Hook tests + Integration tests

**Test Coverage Areas**:
1. **Component Tests** (Vitest + React Testing Library):
   - User interactions (button clicks, modal open/close)
   - Conditional rendering (empty states, loaded states, error states)
   - Prop validation
   
2. **Hook Tests** (@testing-library/react-hooks):
   - `useUserStats`: Mock API responses
   - `useLeaderboard`: Test ranking logic with fixed datasets
   - `useStreakCalculator`: Test edge cases (timezone, sparse data)
   
3. **Integration Tests**:
   - Full Add Friend flow (input → validation → preview → add → leaderboard update)
   - Theme toggle (click toggle → localStorage updates → UI re-renders)
   - Cached data fallback (API fails → shows cached data with timestamp)

**Mock Strategy**:
```typescript
// Mock external API
vi.mock('../services/leetcodeApi', () => ({
  fetchUserStats: vi.fn().mockResolvedValue({
    totalSolved: 250,
    easySolved: 150,
    // ...
  })
}))

// Mock storage
const mockSessionStorage = new Map()
global.sessionStorage = {
  getItem: (key) => mockSessionStorage.get(key),
  setItem: (key, value) => mockSessionStorage.set(key, value),
  // ...
}
```

---

## Implementation Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| External API downtime | Medium | High | Implement cache fallback + show data age + allow stale data usage |
| External API rate limiting | High | Medium | Client-side 60s cooldown + exponential backoff + clear user messaging |
| Session storage limits exceeded | Low | Medium | Monitor usage, implement IndexedDB fallback if approaching limits |
| Timezone edge cases in streak calc | Medium | Low | Comprehensive test cases covering timezone boundaries + DST transitions |
| Performance with 50 friends | Low | Low | Memoization + lazy loading + virtual scrolling for leaderboard if needed |
| Browser compatibility | Low | Medium | Target modern browsers only (ES2020+), document requirements |

---

## Best Practices Applied

### React 19 Best Practices
- Use `useMemo` for expensive calculations (points, rankings)
- Use `useCallback` for event handlers passed to children
- Implement proper cleanup in `useEffect` (abort controllers for fetch)
- Use concurrent features where appropriate (useTransition for non-urgent updates)

### TypeScript Best Practices
- Strict mode enabled
- Define interfaces for all API responses
- Use discriminated unions for activity event types
- Avoid `any`, prefer `unknown` with type guards

### Performance Best Practices
- Code splitting: Lazy load chart components
- Debounce API calls in search inputs
- Virtual scrolling for leaderboard if > 20 friends
- Optimize re-renders with React.memo for pure components

### Accessibility Best Practices
- Semantic HTML (nav, main, section, article)
- ARIA labels for icon buttons
- Keyboard navigation support (Tab, Enter, Escape)
- Focus management in modal
- Color contrast meeting WCAG AA standards

---

## Dependencies To Add

```json
{
  "dependencies": {
    // Already present - no new dependencies required
  },
  "devDependencies": {
    // Consider if IndexedDB needed:
    // "idb": "^8.0.0"  // Optional IndexedDB wrapper
  }
}
```

**Decision**: Avoid adding charting libraries, work with vanilla SVG + CSS

---

## Deployment Considerations

**Build Process**:
- Vite production build creates optimized bundle
- Code splitting for dashboard route
- Environment variable for API endpoint (optional override)

**Environment Variables**:
```env
VITE_LEETCODE_API_BASE=https://leetcode-stats-api.herokuapp.com
VITE_API_RATE_LIMIT_MS=60000
```

**Browser Support**:
- Chrome 90+ (May 2021)
- Firefox 88+ (April 2021)
- Safari 14+ (September 2020)
- Edge 90+ (April 2021)

**Bundle Size Target**: < 300KB gzipped (React + Router + Dashboard code)

---

## Open Questions Resolved

1. **Q**: How to handle initial user setup? **A**: Not specified in this iteration - will be addressed in separate user story
2. **Q**: Should we cache friend stats? **A**: Yes, in session storage alongside friend list
3. **Q**: What happens if API changes format? **A**: Add version detection + schema validation + graceful degradation
4. **Q**: How to test time-dependent features (streaks, "today" logic)? **A**: Mock Date.now() in tests, use dependency injection for clock

---

## Research Complete

All technical unknowns from Technical Context have been addressed. Ready to proceed to Phase 1: Data Model & Contracts Design.

**Validation**: ✅ All "NEEDS CLARIFICATION" markers resolved  
**Next Phase**: Phase 1 - Data Model & Contracts
