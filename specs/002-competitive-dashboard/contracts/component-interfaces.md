# Component Interfaces

**Feature**: 002-competitive-dashboard  
**Last Updated**: February 15, 2026

## Overview

This document defines the prop interfaces for all React components in the competitive dashboard feature.

---

## Layout Components

### DashboardLayout

Main container component for the entire dashboard.

```typescript
interface DashboardLayoutProps {
  username: string                    // Current user's LeetCode username
  onUsernameChange?: (username: string) => void  // Optional: if user can change username
}
```

**Usage**:
```tsx
<DashboardLayout username="aditya_raj" />
```

---

## Navigation Components

### TopNavigation

Top navigation bar with logo, actions, and theme toggle.

```typescript
interface TopNavigationProps {
  onAddFriendClick: () => void        // Handler for "Add Friend" button
  todayPoints?: number                // Optional: Today's points for global stats
  theme: 'light' | 'dark'             // Current theme
  onThemeToggle: () => void           // Theme toggle handler
  username?: string                   // Current user's username for profile dropdown
}
```

---

## Hero Section Components

### HeroSection

Displays user's personal stats and 1v1 comparison.

```typescript
interface HeroSectionProps {
  user: LeetCodeUser                  // Current user's stats
  bestFriend?: Friend                 // Best friend for comparison (highest points)
  loading?: boolean                   // Loading state
  error?: string                      // Error message if any
}
```

### StreakDisplay

Shows current streak count with visual indicator.

```typescript
interface StreakDisplayProps {
  streakDays: number                  // Current streak count
  size?: 'small' | 'medium' | 'large'  // Visual size
  showLabel?: boolean                 // Show "day streak" label
}
```

### ComparisonTable

Side-by-side comparison between user and best friend.

```typescript
interface ComparisonTableProps {
  user: {
    username: string
    todaySolved: number
    weeklySolved: number
    totalPoints: number
  }
  friend: {
    username: string
    todaySolved: number
    weeklySolved: number
    totalPoints: number
  }
  pointDifference: number             // Positive if user ahead, negative if behind
}
```

---

## Friend Management Components

### AddFriendModal

Modal for adding new friends to leaderboard.

```typescript
interface AddFriendModalProps {
  isOpen: boolean                     // Modal visibility state
  onClose: () => void                 // Close modal handler
  onAddFriend: (friend: Friend) => void  // Callback when friend added successfully
  existingFriends: string[]           // Array of existing friend usernames (for duplicate check)
  currentUsername?: string            // Current user's username (to prevent self-add)
}
```

**Internal State**:
```typescript
interface AddFriendModalState {
  step: 'input' | 'preview' | 'loading' | 'error'
  username: string
  previewData?: LeetCodeUser
  error?: string
}
```

### FriendPreview

Shows preview of friend stats before adding.

```typescript
interface FriendPreviewProps {
  user: LeetCodeUser                  // Friend's stats to preview
  onAdd: () => void                   // Handler for "Add" button
  onCancel: () => void                // Handler for "Cancel" button
}
```

---

## Leaderboard Components

### Leaderboard

Main leaderboard display with ranked friend list.

```typescript
interface LeaderboardProps {
  entries: LeaderboardEntry[]         // Ranked friend entries
  currentUsername?: string            // Highlight current user's row
  loading?: boolean
  emptyMessage?: string               // Message when no friends added
}
```

### LeaderboardRow

Single row in the leaderboard table.

```typescript
interface LeaderboardRowProps {
  entry: LeaderboardEntry             // Friend data for this row
  isCurrentUser?: boolean             // Highlight if this is the logged-in user
  onClick?: () => void                // Optional: click handler for row
}
```

### TrendIndicator

Arrow indicator for rank changes.

```typescript
interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'stable'  // Trend direction
  size?: 'small' | 'medium'
  animated?: boolean                  // Animate on mount
}
```

---

## Activity Feed Components

### ActivityFeed

Displays recent friend activities.

```typescript
interface ActivityFeedProps {
  events: ActivityEvent[]             // Activity events to display
  maxEvents?: number                  // Maximum events to show (default: 10)
  emptyMessage?: string               // Message when no activities
}
```

### ActivityItem

Single activity event item.

```typescript
interface ActivityItemProps {
  event: ActivityEvent                // Event to display
  showTimestamp?: boolean             // Show relative time ("2 minutes ago")
}
```

---

## Points & Scoring Components

### PointsSystemCard

Explains the points calculation formula.

```typescript
interface PointsSystemCardProps {
  showExamples?: boolean              // Show example calculations
}
```

### PointsBadge

Displays points with visual styling.

```typescript
interface PointsBadgeProps {
  points: number                      // Points to display
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary'   // Color scheme
  showLabel?: boolean                 // Show "points" label
}
```

---

## Badge Components

### BadgeDisplay

Shows earned achievement badges.

```typescript
interface BadgeDisplayProps {
  badges: BadgeId[]                   // Array of earned badge IDs
  size?: 'small' | 'medium' | 'large'
  layout?: 'horizontal' | 'vertical' | 'grid'
  showTooltip?: boolean               // Show badge description on hover
}
```

### BadgeIcon

Individual badge icon with tooltip.

```typescript
interface BadgeIconProps {
  badgeId: BadgeId                    // Badge identifier
  size?: 'small' | 'medium' | 'large'
  earned?: boolean                    // Greyed out if not earned
  tooltip?: string                    // Custom tooltip text
}
```

---

## Chart Components

### LineChart

Custom SVG line chart for trends.

```typescript
interface LineChartProps {
  data: Array<{ x: number, y: number }>  // Data points
  width?: number                      // Chart width in pixels
  height?: number                     // Chart height in pixels
  xLabel?: string                     // X-axis label
  yLabel?: string                     // Y-axis label
  color?: string                      // Line color (CSS color)
  showGrid?: boolean                  // Show grid lines
  showPoints?: boolean                // Show data point markers
}
```

### BarChart

Custom SVG bar chart for weekly comparisons.

```typescript
interface BarChartProps {
  data: Array<{ label: string, value: number }>  // Bar data
  width?: number
  height?: number
  xLabel?: string
  yLabel?: string
  color?: string                      // Bar color
  showValues?: boolean                // Show values on bars
}
```

### DifficultyPieChart

Pie chart for difficulty breakdown.

```typescript
interface DifficultyPieChartProps {
  easy: number                        // Easy problems count
  medium: number                      // Medium problems count
  hard: number                        // Hard problems count
  size?: number                       // Chart diameter in pixels
  showLegend?: boolean
  showPercentages?: boolean
}
```

---

## Performance Insights Components

### PerformanceCharts

Container for all performance visualizations.

```typescript
interface PerformanceChartsProps {
  user: LeetCodeUser                  // User data for charts
  friends?: Friend[]                  // Optional: for comparison charts
  period?: 'week' | 'month' | 'year'  // Time period selector
}
```

### DailySolveTrend

Chart showing daily problem-solving trend.

```typescript
interface DailySolveTrendProps {
  submissionCalendar: SubmissionCalendar  // User's submission history
  days?: number                       // Number of days to show (default: 30)
}
```

### WeeklyComparison

Bar chart comparing weekly performance.

```typescript
interface WeeklyComparisonProps {
  submissionCalendar: SubmissionCalendar
  weeks?: number                      // Number of weeks to show (default: 8)
}
```

### WinRatioDisplay

Shows win/loss ratio vs friends.

```typescript
interface WinRatioDisplayProps {
  user: LeetCodeUser
  friends: Friend[]
  metric: 'daily' | 'weekly'          // Which metric to compare
}
```

---

## Shared Components (Extended)

### Modal

Generic modal wrapper (extends existing if present).

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  children: React.ReactNode
}
```

### LoadingSpinner

Loading indicator.

```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
  message?: string                    // Optional loading message
}
```

### ErrorMessage

Error display component.

```typescript
interface ErrorMessageProps {
  message: string
  type?: 'error' | 'warning' | 'info'
  onRetry?: () => void                // Optional retry button
  onDismiss?: () => void              // Optional dismiss button
}
```

### EmptyState

Empty state placeholder.

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode              // Custom icon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}
```

---

## Custom Hooks

### useUserStats

Fetch and manage user LeetCode statistics.

```typescript
function useUserStats(username: string): {
  user: LeetCodeUser | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  canRefetch: boolean                 // False if rate limited
  secondsUntilRefetch: number         // Cooldown remaining
}
```

### useFriendsList

Manage friend list in session storage.

```typescript
function useFriendsList(): {
  friends: Friend[]
  addFriend: (friend: Friend) => void
  removeFriend: (username: string) => void
  getFriend: (username: string) => Friend | undefined
  hasFriend: (username: string) => boolean
  clearFriends: () => void
}
```

### useLeaderboard

Calculate leaderboard rankings and points.

```typescript
function useLeaderboard(friends: Friend[]): {
  leaderboard: LeaderboardEntry[]
  bestFriend: Friend | null           // Friend with most points
  currentUserRank: number | null      // If current user in list
  recalculate: () => void
}
```

### useActivityFeed

Track and generate activity events.

```typescript
function useActivityFeed(friends: Friend[]): {
  activities: ActivityEvent[]
  addActivity: (event: ActivityEvent) => void
  clearActivities: () => void
  detectActivities: (prevStats: Map<string, LeetCodeUser>) => void
}
```

### useTheme

Manage theme preference.

```typescript
function useTheme(): {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}
```

### useStreakCalculator

Calculate streak from submission calendar.

```typescript
function useStreakCalculator(submissionCalendar: SubmissionCalendar): {
  currentStreak: number
  longestStreak: number
  todaySolved: number
  weeklySolved: number
}
```

### usePerformanceData

Process data for performance charts.

```typescript
function usePerformanceData(
  user: LeetCodeUser,
  friends?: Friend[]
): {
  dailyTrend: Array<{ date: string, count: number }>
  weeklyTrend: Array<{ week: string, count: number }>
  difficultyBreakdown: { easy: number, medium: number, hard: number }
  winRatio: { won: number, lost: number, tied: number }
}
```

---

## Type Guards

Utility functions for type validation:

```typescript
function isLeetCodeUser(obj: any): obj is LeetCodeUser {
  return (
    typeof obj.username === 'string' &&
    typeof obj.totalSolved === 'number' &&
    typeof obj.submissionCalendar === 'object'
  )
}

function isFriend(obj: any): obj is Friend {
  return (
    isLeetCodeUser(obj) &&
    typeof obj.rankPosition === 'number' &&
    typeof obj.addedAt === 'number'
  )
}

function isActivityEvent(obj: any): obj is ActivityEvent {
  return (
    typeof obj.id === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.username === 'string' &&
    typeof obj.timestamp === 'number'
  )
}
```

---

## Event Handlers

Common event handler signatures:

```typescript
// Friend management
type OnAddFriendHandler = (friend: Friend) => void
type OnRemoveFriendHandler = (username: string) => void

// Theme
type OnThemeToggleHandler = () => void

// Stats refresh
type OnRefreshHandler = () => Promise<void>

// Navigation
type OnNavigateHandler = (route: string) => void

// Error handling
type OnErrorHandler = (error: Error) => void
```

---

## Component Testing Interfaces

Props for component test utilities:

```typescript
interface MockLeetCodeUser {
  username: string
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  // ... minimal required fields
}

interface MockFriend extends MockLeetCodeUser {
  rankPosition: number
  totalPoints: number
}

// Test utilities
function createMockUser(overrides?: Partial<LeetCodeUser>): LeetCodeUser
function createMockFriend(overrides?: Partial<Friend>): Friend
function createMockActivity(overrides?: Partial<ActivityEvent>): ActivityEvent
```

---

## Contract Version

**Version**: 1.0  
**Last Updated**: February 15, 2026  
**Framework**: React 19.2.4 + TypeScript 5.9.3  
**Breaking Changes**: None (initial version)
