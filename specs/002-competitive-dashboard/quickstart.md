# Quickstart Guide: Competitive Dashboard

**Feature**: 002-competitive-dashboard  
**For**: Developers implementing this feature  
**Last Updated**: February 15, 2026

## Overview

This guide helps you implement the competitive coding dashboard feature. Follow these steps in order for a smooth development experience.

---

## Prerequisites

### Required Knowledge
- React 19+ (Hooks, Context, component patterns)
- TypeScript 5+ (interfaces, generics, type guards)
- Browser Storage APIs (localStorage, sessionStorage)
- CSS Modules
- Vitest & React Testing Library

### Environment Setup
```bash
# Verify Node.js version
node --version  # Should be 18+ or 20+

# Install dependencies (if not already)
npm install

# Run development server
npm run dev

# Run tests
npm test
```

---

## Implementation Phases

### Phase 1: Core Data Layer (Priority: HIGH)
**Goal**: Set up data structures and external API integration

**Tasks**:
1. **Create Type Definitions**
   ```bash
   # Location: src/features/dashboard/types/
   - LeetCodeUser.ts
   - Friend.ts
   - ActivityEvent.ts
   - Badge.ts
   ```

2. **Implement LeetCode API Service**
   ```typescript
   // src/features/dashboard/services/leetcodeApi.ts
   
   export async function fetchUserStats(username: string): Promise<LeetCodeUser> {
     // 1. Check rate limit
     // 2. Check cache
     // 3. Fetch from API
     // 4. Transform response
     // 5. Cache result
     // 6. Return user data
   }
   ```

3. **Create Storage Manager**
   ```typescript
   // src/features/dashboard/services/storageManager.ts
   
   export const SessionStore = {
     getFriends(): Friend[]
     setFriends(friends: Friend[]): void
     getActivityFeed(): ActivityEvent[]
     // ... other session storage methods
   }
   
   export const LocalStore = {
     getTheme(): Theme
     setTheme(theme: Theme): void
     getCachedUser(username: string): LeetCodeUser | null
     // ... other local storage methods
   }
   ```

4. **Implement Points Calculator**
   ```typescript
   // src/features/dashboard/services/pointsCalculator.ts
   
   export function calculatePoints(
     user: LeetCodeUser,
     bestFriendTodaySolved: number = 0
   ): PointsBreakdown {
     // Implement formula from spec
   }
   
   export function calculateLeaderboard(friends: Friend[]): LeaderboardEntry[] {
     // Sort by points, assign ranks
   }
   ```

**Validation**: Write tests for each service function before moving to Phase 2

---

### Phase 2: Custom Hooks (Priority: HIGH)
**Goal**: Create React hooks that wrap data layer logic

**Tasks**:
1. **useUserStats Hook**
   ```typescript
   // src/features/dashboard/hooks/useUserStats.ts
   
   export function useUserStats(username: string) {
     const [user, setUser] = useState<LeetCodeUser | null>(null)
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState<string | null>(null)
     
     const fetchStats = useCallback(async () => {
       setLoading(true)
       try {
         const data = await fetchUserStats(username)
         setUser(data)
       } catch (err) {
         setError(err.message)
       } finally {
         setLoading(false)
       }
     }, [username])
     
     useEffect(() => {
       fetchStats()
     }, [fetchStats])
     
     return { user, loading, error, refetch: fetchStats }
   }
   ```

2. **useFriendsList Hook**
   ```typescript
   // src/features/dashboard/hooks/useFriendsList.ts
   
   export function useFriendsList() {
     const [friends, setFriends] = useState<Friend[]>(() => 
       SessionStore.getFriends()
     )
     
     const addFriend = useCallback((friend: Friend) => {
       setFriends(prev => {
         const updated = [...prev, friend]
         SessionStore.setFriends(updated)
         return updated
       })
     }, [])
     
     // ... other methods
     
     return { friends, addFriend, removeFriend, hasFriend }
   }
   ```

3. **useLeaderboard Hook** (calculate rankings from friends)
4. **useActivityFeed Hook** (detect and track changes)
5. **useTheme Hook** (manage theme preference)

**Validation**: Test hooks with @testing-library/react-hooks

---

### Phase 3: Shared UI Components (Priority: MEDIUM)
**Goal**: Build reusable UI components needed across dashboard

**Tasks**:
1. **Modal Component** (if not exists)
   ```typescript
   // src/shared/components/Modal/Modal.tsx
   
   export function Modal({ isOpen, onClose, children, title }: ModalProps) {
     // Implement modal with:
     // - Overlay click to close
     // - ESC key to close
     // - Focus trap
     // - ARIA attributes
   }
   ```

2. **LoadingSpinner Component**
3. **ErrorMessage Component**
4. **EmptyState Component**

**Styling**: Use NeoBrutalism design tokens
```css
/* src/styles/neobrutalism.css */
:root {
  --neo-border: 4px solid #000;
  --neo-shadow: 4px 4px 0 #000;
  /* ... other tokens */
}
```

---

### Phase 4: Dashboard Components (Priority: HIGH)
**Goal**: Build dashboard-specific components

**Implementation Order**:

1. **TopNavigation** (highest priority - needed for everything)
   ```tsx
   // src/features/dashboard/components/TopNavigation/TopNavigation.tsx
   
   export function TopNavigation({
     onAddFriendClick,
     theme,
     onThemeToggle
   }: TopNavigationProps) {
     return (
       <nav className="neo-nav">
         <div className="nav-logo">LeetCode Competitor</div>
         <button onClick={onAddFriendClick} className="neo-button">
           Add Friend
         </button>
         <button onClick={onThemeToggle}>
           {theme === 'dark' ? '☀️' : '🌙'}
         </button>
       </nav>
     )
   }
   ```

2. **AddFriendModal** (critical for core functionality)
   - Input field with validation
   - Preview section
   - Add button
   - Error handling

3. **HeroSection** (shows user stats)
   - Streak display
   - Today solved
   - Weekly progress
   - 1v1 comparison table

4. **Leaderboard** (ranked friend list)
   - Table with sortable columns
   - Trend indicators
   - Visual effects (glow, highlight, fire icon)

5. **ActivityFeed** (friend activities)
6. **PointsSystemCard** (scoring explanation)
7. **PerformanceCharts** (analytics visualizations)
8. **BadgeDisplay** (achievement badges)

**Component Testing**:
```typescript
// Example: HeroSection.test.tsx
describe('HeroSection', () => {
  it('displays user streak correctly', () => {
    const user = createMockUser({ currentStreak: 5 })
    render(<HeroSection user={user} />)
    expect(screen.getByText(/5.*streak/i)).toBeInTheDocument()
  })
  
  it('shows comparison when friend provided', () => {
    const user = createMockUser({ totalPoints: 500 })
    const friend = createMockFriend({ totalPoints: 400 })
    render(<HeroSection user={user} bestFriend={friend} />)
    expect(screen.getByText(/You're leading by 100 points/i)).toBeInTheDocument()
  })
})
```

---

### Phase 5: Main Dashboard Layout (Priority: HIGH)
**Goal**: Assemble all components into cohesive layout

```tsx
// src/features/dashboard/components/DashboardLayout/DashboardLayout.tsx

export function DashboardLayout({ username }: DashboardLayoutProps) {
  const { user, loading, error } = useUserStats(username)
  const { friends, addFriend } = useFriendsList()
  const { leaderboard, bestFriend } = useLeaderboard(friends)
  const { activities } = useActivityFeed(friends)
  const { theme, toggleTheme } = useTheme()
  const [showAddModal, setShowAddModal] = useState(false)
  
  return (
    <div className="dashboard-layout" data-theme={theme}>
      <TopNavigation
        onAddFriendClick={() => setShowAddModal(true)}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      
      <main className="dashboard-main">
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        
        {user && (
          <>
            <HeroSection user={user} bestFriend={bestFriend} />
            <Leaderboard entries={leaderboard} />
            <ActivityFeed events={activities} />
            <PointsSystemCard />
            <PerformanceCharts user={user} friends={friends} />
            <BadgeDisplay badges={user.badges} />
          </>
        )}
      </main>
      
      <AddFriendModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddFriend={addFriend}
        existingFriends={friends.map(f => f.username)}
      />
    </div>
  )
}
```

---

### Phase 6: Chart Components (Priority: LOW)
**Goal**: Create custom SVG charts (can be deferred if time-constrained)

Start with simple implementations:

```tsx
// src/features/dashboard/components/PerformanceCharts/LineChart.tsx

export function LineChart({ data, width = 600, height = 300 }: LineChartProps) {
  // 1. Calculate scales (xScale, yScale)
  // 2. Generate SVG path from data points
  // 3. Add axes and labels
  // 4. Apply NeoBrutalism styling
  
  return (
    <svg width={width} height={height} className="neo-chart">
      <path d={pathData} stroke="var(--neo-primary)" fill="none" />
      {/* axes, grid, labels */}
    </svg>
  )
}
```

**Alternative**: If charts are too complex, use placeholder "Charts coming soon" message initially

---

### Phase 7: Integration & Polish (Priority: MEDIUM)
**Goal**: Connect to router, add refinements

1. **Add Dashboard Route**
   ```typescript
   // src/core/router/index.tsx
   
   import { DashboardLayout } from '@/features/dashboard'
   
   const router = createBrowserRouter([
     {
       path: '/',
       element: <DashboardLayout username="demo-user" />
     },
     // ... other routes
   ])
   ```

2. **Add Loading States** (skeleton screens)
3. **Add Error Boundaries**
4. **Add Animations** (NeoBrutalism button hover effects, etc.)
5. **Responsive Design** (mobile breakpoints)
6. **Accessibility Improvements** (ARIA labels, keyboard navigation)

---

## Testing Strategy

### Unit Tests
**Location**: `tests/features/dashboard/`

**What to Test**:
- [ ] Points calculation logic
- [ ] Streak calculation from submission calendar
- [ ] Activity event detection
- [ ] Badge criteria checking
- [ ] Leaderboard ranking algorithm
- [ ] Storage utilities (get/set/validate)

**Example**:
```typescript
// tests/features/dashboard/services/pointsCalculator.test.ts

describe('calculatePoints', () => {
  it('calculates base points correctly', () => {
    const user = createMockUser({
      easySolved: 10,
      mediumSolved: 5,
      hardSolved: 2
    })
    const result = calculatePoints(user)
    expect(result.basePoints).toBe(10*5 + 5*10 + 2*20)  // 50 + 50 + 40 = 140
  })
  
  it('adds streak bonus when streak >= 1', () => {
    const user = createMockUser({ currentStreak: 5 })
    const result = calculatePoints(user)
    expect(result.streakBonus).toBe(10)
  })
  
  it('adds competition bonus when user ahead of friend', () => {
    const user = createMockUser({ todaySolved: 5 })
    const result = calculatePoints(user, 3)  // Friend solved 3
    expect(result.competitionBonus).toBe(15)
  })
})
```

### Component Tests
**What to Test**:
- [ ] Component renders without crashing
- [ ] Correct data displayed from props
- [ ] User interactions (button clicks, form inputs)
- [ ] Conditional rendering (empty states, loading, errors)
- [ ] Event handlers called with correct arguments

**Example**:
```typescript
// tests/features/dashboard/components/Leaderboard.test.tsx

describe('Leaderboard', () => {
  it('displays all friends in rank order', () => {
    const entries = [
      createMockLeaderboardEntry({ rank: 1, username: 'alice', totalPoints: 500 }),
      createMockLeaderboardEntry({ rank: 2, username: 'bob', totalPoints: 400 })
    ]
    render(<Leaderboard entries={entries} />)
    
    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('alice')
    expect(rows[2]).toHaveTextContent('bob')
  })
  
  it('shows empty state when no friends', () => {
    render(<Leaderboard entries={[]} emptyMessage="No friends added" />)
    expect(screen.getByText('No friends added')).toBeInTheDocument()
  })
})
```

### Integration Tests
**What to Test**:
- [ ] Full Add Friend flow (input → validate → preview → add → leaderboard update)
- [ ] Theme toggle (click → storage update → UI re-renders)
- [ ] Stats refresh with rate limiting
- [ ] Activity detection when friend stats change

**Example**:
```typescript
// tests/integration/dashboard-flow.test.tsx

describe('Add Friend Flow', () => {
  it('completes full add friend workflow', async () => {
    const { user } = renderWithProviders(<DashboardLayout username="me" />)
    
    // Click Add Friend button
    await user.click(screen.getByText(/add friend/i))
    
    // Modal opens
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    
    // Enter username
    await user.type(screen.getByLabelText(/username/i), 'test-friend')
    
    // Wait for validation (API call mocked)
    await waitFor(() => {
      expect(screen.getByText(/total solved/i)).toBeInTheDocument()
    })
    
    // Click Add button
    await user.click(screen.getByText(/^add$/i))
    
    // Modal closes, friend appears in leaderboard
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByText('test-friend')).toBeInTheDocument()
    })
  })
})
```

---

## Common Pitfalls & Solutions

### Problem 1: CORS Errors with LeetCode API
**Symptom**: `Access to fetch blocked by CORS policy`  
**Solution**: 
- Check if API has CORS enabled
- Use browser extension (dev only)
- Consider CORS proxy in development
- Document this limitation in README

### Problem 2: Session Storage Quota Exceeded
**Symptom**: `QuotaExceededError` when adding friends  
**Solution**:
- Implement storage size monitoring
- Clear activity feed when approaching limit
- Limit friend list to 50 users max
- Show warning to user when nearing quota

### Problem 3: Timezone Issues in Streak Calculation
**Symptom**: Streak breaks incorrectly at midnight  
**Solution**:
- Always convert Unix timestamps to user's local timezone
- Test with different timezones
- Mock Date.now() in tests

### Problem 4: React Re-render Performance
**Symptom**: Dashboard lags when updating friend stats  
**Solution**:
- Use `useMemo` for points calculations
- Use `React.memo` for LeaderboardRow components
- Debounce stats refresh
- Virtual scrolling for large friend lists

---

## Development Checklist

### Before Starting
- [ ] Read spec.md completely
- [ ] Read all contracts (API, storage, components)
- [ ] Review existing codebase structure
- [ ] Set up test environment

### Phase 1 Complete
- [ ] All type definitions created
- [ ] LeetCode API integration working
- [ ] Storage manager implemented
- [ ] Points calculator tested
- [ ] Unit tests passing (>80% coverage)

### Phase 2 Complete
- [ ] All custom hooks implemented
- [ ] Hook tests passing
- [ ] Hooks handle edge cases (loading, errors, empty)

### Phase 3 Complete
- [ ] Shared components created
- [ ] NeoBrutalism styles applied
- [ ] Components accessible (ARIA, keyboard)

### Phase 4 Complete
- [ ] All dashboard components built
- [ ] Component tests passing
- [ ] Visual QA in both themes

### Phase 5 Complete
- [ ] Dashboard layout assembled
- [ ] All features working together
- [ ] Integration tests passing

### Phase 6 Complete
- [ ] Charts implemented (or placeholder)
- [ ] Performance acceptable

### Phase 7 Complete
- [ ] Dashboard accessible via route
- [ ] Error boundaries added
- [ ] Responsive design working
- [ ] Accessibility checklist complete

### Ready for Review
- [ ] All tests passing (`npm test`)
- [ ] No console errors/warnings
- [ ] README updated with dashboard info
- [ ] Demo recorded (optional)

---

## Quick Reference

### Key Files
| File | Purpose |
|------|---------|
| `src/features/dashboard/index.ts` | Feature entry point |
| `src/features/dashboard/types/` | TypeScript definitions |
| `src/features/dashboard/services/leetcodeApi.ts` | External API integration |
| `src/features/dashboard/hooks/useUserStats.ts` | User stats hook |
| `src/features/dashboard/components/DashboardLayout/` | Main layout |
| `src/styles/neobrutalism.css` | Design system tokens |
| `tests/features/dashboard/` | All tests |

### Commands
```bash
# Development
npm run dev              # Start dev server
npm run test:watch       # Run tests in watch mode
npm run lint             # Check code style
npm run type-check       # TypeScript validation

# Testing specific file
npm test -- HeroSection.test.tsx

# Build production
npm run build
npm run preview          # Preview production build
```

### Useful Links
- [Spec Document](./spec.md)
- [Data Model](./data-model.md)
- [API Contract](./contracts/api-contracts.md)
- [Component Interfaces](./contracts/component-interfaces.md)
- [Research Notes](./research.md)

---

## Getting Help

**Questions about**:
- Spec clarity → Check spec.md clarifications section
- Data structures → See data-model.md
- Component props → See contracts/component-interfaces.md
- API format → See contracts/api-contracts.md
- Implementation approach → See research.md

**Still stuck?** Document your blocker and create a GitHub issue or team discussion.

---

## Next Steps After Quickstart

Once dashboard is working:
1. Run full test suite and fix any failures
2. Perform visual QA in both themes
3. Test on different browsers (Chrome, Firefox, Safari)
4. Test on mobile devices
5. Gather feedback from users
6. Create follow-up tasks for improvements

Happy coding! 🚀
