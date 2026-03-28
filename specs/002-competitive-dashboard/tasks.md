# Tasks: Competitive Coding Dashboard

**Input**: Design documents from `/specs/002-competitive-dashboard/`  
**Branch**: `002-competitive-dashboard`  
**Feature**: Fully client-side competitive coding dashboard with NeoBrutalism design

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Tests**: Not explicitly requested in spec - tests omitted from task list. Add test tasks if TDD is required.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create dashboard feature directory structure: src/features/dashboard/ with subdirectories (components/, hooks/, services/, types/)
- [x] T002 [P] Create NeoBrutalism design system in src/styles/neobrutalism.css with CSS custom properties for colors, borders, shadows
- [x] T003 [P] Update router configuration in src/core/router/index.tsx to add dashboard route ('/dashboard')
- [x] T004 [P] Create dashboard feature barrel export in src/features/dashboard/index.ts
- [x] T004a [P] Create initial username input modal in src/features/dashboard/components/UsernameSetup/ for first-time user onboarding

**Checkpoint**: Project structure ready for feature implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Core Type Definitions

- [x] T005 [P] Create LeetCodeUser interface in src/features/dashboard/types/LeetCodeUser.ts with all required fields
- [x] T006 [P] Create SubmissionCalendar type in src/features/dashboard/types/SubmissionCalendar.ts (Record<string, number>)
- [x] T007 [P] Create Friend interface in src/features/dashboard/types/Friend.ts extending LeetCodeUser with comparison metadata
- [x] T008 [P] Create PointsBreakdown interface in src/features/dashboard/types/PointsCalculation.ts
- [x] T009 [P] Create ActivityEvent type and interface in src/features/dashboard/types/ActivityEvent.ts
- [x] T010 [P] Create Badge type and interface in src/features/dashboard/types/Badge.ts
- [x] T011 [P] Create LeaderboardEntry interface in src/features/dashboard/types/LeaderboardEntry.ts
- [x] T012 [P] Create Theme type ('light' | 'dark') in src/features/dashboard/types/Theme.ts
- [x] T013 [P] Create barrel export for all types in src/features/dashboard/types/index.ts

### Shared Utilities

- [x] T014 [P] Create date utilities in src/shared/utils/dateUtils.ts (timezone handling, Unix timestamp conversions)
- [x] T015 [P] Create cache utilities in src/shared/utils/cacheUtils.ts (cache validation, expiry checks)
- [x] T016 [P] Create rate limiter utility in src/shared/utils/rateLimiter.ts (client-side 60s cooldown tracking)

### Shared Hooks

- [x] T017 [P] Create useLocalStorage hook in src/shared/hooks/useLocalStorage.ts with type-safe get/set operations
- [x] T018 [P] Create useSessionStorage hook in src/shared/hooks/useSessionStorage.ts with type-safe get/set operations
- [x] T019 Create useTheme hook in src/shared/hooks/useTheme.ts (depends on T017 for localStorage persistence)

### Shared Components

- [x] T020 [P] Create Modal component in src/shared/components/Modal/ with NeoBrutalism styling
- [x] T021 [P] Create LoadingSpinner component in src/shared/components/Loading/ with size and message props
- [x] T022 [P] Create ErrorMessage component in src/shared/components/ErrorMessage/ with retry and dismiss actions
- [x] T023 [P] Create EmptyState component in src/shared/components/EmptyState/ with icon, title, and action props

### Theme System

- [x] T024 Apply theme data attribute to HTML root in src/main.tsx based on useTheme hook (depends on T019)
- [x] T025 [P] Test theme toggle functionality and verify CSS variables update correctly

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Personal Coding Statistics (Priority: P1) 🎯 MVP

**Goal**: Display user's LeetCode statistics including total problems solved, current streak, today's progress, and overall ranking

**Independent Test**: Enter a valid LeetCode username and verify all statistics display correctly from the API

### Core Services for User Story 1

- [x] T026 [P] [US1] Create LeetCode API service in src/features/dashboard/services/leetcodeApi.ts with fetchUserStats function
- [x] T027 [P] [US1] Implement API response validation and transformation in src/features/dashboard/services/leetcodeApi.ts
- [x] T028 [P] [US1] Implement error handling (404, 429, 500+) with appropriate error messages in leetcodeApi.ts
- [x] T029 [US1] Create storage manager service in src/features/dashboard/services/storageManager.ts with SessionStore and LocalStore objects (depends on T017, T018)
- [x] T030 [P] [US1] Implement streak calculation algorithm in src/shared/utils/dateUtils.ts (calculateStreak function)
- [x] T031 [P] [US1] Implement today/weekly solved calculation utilities in src/shared/utils/dateUtils.ts

### Hooks for User Story 1

- [x] T032 [US1] Create useUserStats hook in src/features/dashboard/hooks/useUserStats.ts (depends on T026, T029)
- [x] T033 [P] [US1] Create useStreakCalculator hook in src/features/dashboard/hooks/useStreakCalculator.ts (depends on T030)
- [x] T034 [US1] Add rate limiting logic to useUserStats hook using rateLimiter utility (depends on T016, T032)
- [x] T035 [US1] Add cache fallback logic to useUserStats hook when API fails (depends on T029, T032)

### Components for User Story 1

- [x] T036 [P] [US1] Create DashboardLayout component in src/features/dashboard/components/DashboardLayout/ with basic container structure
- [x] T037 [P] [US1] Create StreakDisplay component in src/features/dashboard/components/StreakDisplay/ with fire icon and streak count
- [x] T038 [US1] Create HeroSection component in src/features/dashboard/components/HeroSection/ showing personal stats only (depends on T032, T033, T037)
- [x] T039 [US1] Update DashboardLayout to integrate HeroSection (depends on T036, T038)
- [x] T040 [US1] Connect dashboard route to DashboardLayout component in src/core/router/index.tsx (depends on T039)

**Checkpoint**: User Story 1 complete - users can view their personal LeetCode statistics

---

## Phase 4: User Story 2 - Add and Compare with Friends (Priority: P2)

**Goal**: Allow users to add friends by LeetCode username, see friend stats preview, save to leaderboard, and view ranked comparison

**Independent Test**: Add multiple LeetCode usernames and verify they appear in a ranked leaderboard sorted by points

### Services for User Story 2

- [x] T041 [P] [US2] Create points calculator service in src/features/dashboard/services/pointsCalculator.ts with calculatePoints function
- [x] T042 [P] [US2] Implement leaderboard ranking logic in pointsCalculator.ts (calculateLeaderboard function with tie handling)
- [x] T043 [US2] Extend storageManager with friend management methods (addFriend, removeFriend, getFriends) in src/features/dashboard/services/storageManager.ts (depends on T029)

### Hooks for User Story 2

- [x] T044 [US2] Create useFriendsList hook in src/features/dashboard/hooks/useFriendsList.ts (depends on T043)
- [x] T045 [US2] Create useLeaderboard hook in src/features/dashboard/hooks/useLeaderboard.ts (depends on T041, T042, T044)

### Navigation Components for User Story 2

- [x] T046 [P] [US2] Create TopNavigation component in src/features/dashboard/components/TopNavigation/ with Add Friend button and theme toggle
- [x] T046a [P] [US2] Create Logo component in src/shared/components/Logo/ with brand styling
- [x] T046b [US2] Create GlobalStatsWidget component in src/features/dashboard/components/GlobalStatsWidget/ showing summary stats (depends on T032)
- [x] T046c [P] [US2] Create ProfileDropdown component in src/features/dashboard/components/ProfileDropdown/ with user menu options
- [x] T046d [US2] Integrate Logo, GlobalStatsWidget, and ProfileDropdown into TopNavigation (depends on T046, T046a, T046b, T046c)
- [x] T047 [US2] Connect TopNavigation to theme toggle using useTheme hook (depends on T019, T046d)
- [x] T048 [US2] Update DashboardLayout to include TopNavigation (depends on T039, T046d)

### Friend Addition Components for User Story 2

- [x] T049 [P] [US2] Create AddFriendModal component in src/features/dashboard/components/AddFriendModal/ with input field and validation
- [x] T050 [US2] Implement username validation in AddFriendModal using fetchUserStats (depends on T026, T049)
- [x] T051 [P] [US2] Create FriendPreview component in src/features/dashboard/components/FriendPreview/ showing stats summary
- [x] T052 [US2] Integrate FriendPreview into AddFriendModal preview step (depends on T049, T051)
- [x] T053 [US2] Implement Add button logic to save friend to session storage (depends on T044, T052)
- [x] T054 [US2] Add duplicate check and self-add prevention in AddFriendModal (depends on T044, T049)
- [x] T055 [US2] Connect TopNavigation Add Friend button to open AddFriendModal (depends on T046d, T049)
- [x] T056 [P] [US2] Create "New Rival Added ⚔️" toast animation component in src/shared/components/Toast/

### Leaderboard Components for User Story 2

- [x] T057 [P] [US2] Create TrendIndicator component in src/features/dashboard/components/TrendIndicator/ with up/down/stable arrows
- [x] T058 [P] [US2] Create LeaderboardRow component in src/features/dashboard/components/LeaderboardRow/ with all columns and visual effects
- [x] T059 [US2] Create Leaderboard component in src/features/dashboard/components/Leaderboard/ container (depends on T045, T057, T058)
- [x] T060 [US2] Integrate Leaderboard into DashboardLayout below HeroSection (depends on T039, T059)

**Checkpoint**: User Story 2 complete - users can add friends and see ranked leaderboard

---

## Phase 5: User Story 3 - Head-to-Head Friend Comparison (Priority: P2)

**Goal**: Display "You vs Best Friend" comparison table in Hero Section with side-by-side metrics and contextual messaging

**Independent Test**: Add one friend and verify comparison table shows with accurate metrics and point difference message

### Components for User Story 3

- [x] T061 [P] [US3] Create PointsBadge component in src/features/dashboard/components/PointsBadge/ with size and variant props
- [x] T062 [P] [US3] Create ComparisonTable component in src/features/dashboard/components/ComparisonTable/ showing You vs Best Friend metrics
- [x] T063 [US3] Implement point difference message logic in ComparisonTable ("You're behind by X", "You're leading by X", "You're tied!") (depends on T062)
- [x] T064 [US3] Update HeroSection to show ComparisonTable when friends exist (depends on T038, T062, T063)
- [x] T065 [US3] Update HeroSection to determine best friend from leaderboard hook (depends on T045, T064)

**Checkpoint**: User Story 3 complete - users see head-to-head comparison with their best friend

---

## Phase 6: User Story 4 - View Friend Activity Feed (Priority: P3)

**Goal**: Display activity feed showing recent friend achievements like problems solved, streaks broken, and rank changes

**Independent Test**: Track friend stats over time and verify activity updates appear when changes are detected

### Services for User Story 4

- [x] T066 [P] [US4] Create activity detection service in src/features/dashboard/services/activityDetector.ts with detectActivities function
- [x] T067 [P] [US4] Implement event generation logic for problems_solved, streak_broken, rank_changed events in activityDetector.ts
- [x] T068 [US4] Extend storageManager with activity feed methods (getActivityFeed, addActivity, clearOldActivities) in src/features/dashboard/services/storageManager.ts (depends on T029)

### Hooks for User Story 4

- [x] T069 [US4] Create useActivityFeed hook in src/features/dashboard/hooks/useActivityFeed.ts (depends on T066, T068)

### Components for User Story 4

- [x] T070 [P] [US4] Create ActivityItem component in src/features/dashboard/components/ActivityItem/ with event message and timestamp
- [x] T071 [US4] Create ActivityFeed component in src/features/dashboard/components/ActivityFeed/ (depends on T069, T070)
- [x] T072 [US4] Integrate ActivityFeed into DashboardLayout (depends on T039, T071)
- [x] T073 [US4] Connect activity detection to friend stats refresh in useLeaderboard (depends on T045, T069)

**Checkpoint**: User Story 4 complete - users see friend activity feed with recent updates

---

## Phase 7: User Story 5 - Understand Points and Scoring System (Priority: P3)

**Goal**: Display Points System Card explaining scoring formula and bonus rules

**Independent Test**: Display the points card and verify all scoring rules are clearly explained

### Components for User Story 5

- [x] T074 [P] [US5] Create PointsSystemCard component in src/features/dashboard/components/PointsSystemCard/ with formula breakdown
- [x] T075 [US5] Integrate PointsSystemCard into DashboardLayout (depends on T039, T074)

**Checkpoint**: User Story 5 complete - users understand how points are calculated

---

## Phase 8: User Story 6 - Visual Performance Analytics (Priority: P3)

**Goal**: Display performance charts showing daily solve trends, weekly comparisons, difficulty breakdown, and win ratio

**Independent Test**: Generate charts from historical submission data and verify accuracy

### Shared Chart Components for User Story 6

- [x] T076 [P] [US6] Create LineChart component in src/shared/components/Chart/LineChart.tsx with NeoBrutalism styling
- [x] T077 [P] [US6] Create BarChart component in src/shared/components/Chart/BarChart.tsx with NeoBrutalism styling
- [x] T078 [P] [US6] Create DifficultyPieChart component in src/shared/components/Chart/DifficultyPieChart.tsx

### Hooks for User Story 6

- [x] T079 [P] [US6] Create usePerformanceData hook in src/features/dashboard/hooks/usePerformanceData.ts to process submission calendar data

### Performance Components for User Story 6

- [x] T080 [US6] Create DailySolveTrend component in src/features/dashboard/components/PerformanceCharts/DailySolveTrend.tsx (depends on T076, T079)
- [x] T081 [US6] Create WeeklyComparison component in src/features/dashboard/components/PerformanceCharts/WeeklyComparison.tsx (depends on T077, T079)
- [x] T082 [US6] Create DifficultyBreakdown component in src/features/dashboard/components/PerformanceCharts/DifficultyBreakdown.tsx (depends on T078, T079)
- [x] T083 [US6] Create WinRatioDisplay component in src/features/dashboard/components/PerformanceCharts/WinRatioDisplay.tsx (depends on T079)
- [x] T084 [US6] Create PerformanceCharts container component in src/features/dashboard/components/PerformanceCharts/ (depends on T080-T083)
- [x] T085 [US6] Integrate PerformanceCharts into DashboardLayout (depends on T039, T084)

**Checkpoint**: User Story 6 complete - users see visual performance analytics

---

## Phase 9: User Story 7 - View Achievement Badges (Priority: P3)

**Goal**: Award and display achievement badges for milestones like 7-day streak, 10+ problems in a day, and 7 days at rank 1

**Independent Test**: Simulate achievement conditions and verify badges are awarded and displayed correctly

### Services for User Story 7

- [x] T086 [P] [US7] Define badge definitions array in src/features/dashboard/services/badgeAwarder.ts (Grinder, Speed Coder, Dominator)
- [x] T087 [P] [US7] Implement badge criteria checking logic in badgeAwarder.ts (checkBadges function)
- [x] T088 [US7] Extend storageManager with badge tracking methods (getBadges, awardBadge) in src/features/dashboard/services/storageManager.ts (depends on T029)

### Components for User Story 7

- [x] T089 [P] [US7] Create BadgeIcon component in src/features/dashboard/components/BadgeDisplay/BadgeIcon.tsx with tooltip
- [x] T090 [US7] Create BadgeDisplay component in src/features/dashboard/components/BadgeDisplay/ (depends on T089)
- [x] T091 [US7] Integrate BadgeDisplay into HeroSection for user's own badges (depends on T038, T090)
- [x] T092 [US7] Integrate badge icons into LeaderboardRow for friend badges (depends on T058, T089)
- [x] T093 [US7] Connect badge awarding logic to stats refresh in useUserStats (depends on T032, T087)

**Checkpoint**: User Story 7 complete - users earn and see achievement badges

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, optimization, and production readiness

**⚠️ Note**: These tasks improve quality but are not blocking for user story functionality

- [x] T094 [P] Create error boundary component in src/shared/components/ErrorBoundary/ for graceful error handling
- [x] T095 [P] Add loading skeleton components for all major sections (HeroSection, Leaderboard, ActivityFeed, PerformanceCharts)
- [x] T096 [P] Implement responsive design breakpoints for mobile, tablet, and desktop in neobrutalism.css
- [x] T097 [P] Add CSS animations for rank changes, new friends added, and badge unlocks
- [x] T098 [P] Optimize React re-renders with React.memo for LeaderboardRow, ActivityItem, and chart components
- [x] T099 [P] Add useMemo to expensive calculations (points, leaderboard ranking, performance data processing)
- [x] T100 [P] Add useCallback to event handlers to prevent unnecessary re-renders
- [x] T101 [P] Add ARIA labels and keyboard navigation support for accessibility (navigation, modals, buttons)
- [x] T102 [P] Test with screen readers and ensure proper focus management
- [ ] T103 Implement comprehensive error fallback states for all API failure scenarios (depends on T094)
- [ ] T104 [P] Create README.md for dashboard feature in src/features/dashboard/ documenting architecture and usage
- [ ] T105 [P] Update main docs/README.md with dashboard feature information
- [ ] T106 Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] T107 Performance audit with React DevTools Profiler and optimize critical paths
- [ ] T108 Test with various network conditions (slow 3G, offline) and verify cache fallbacks work
- [ ] T109 Manual QA testing of all user stories end-to-end

**Final Checkpoint**: Dashboard feature production-ready with optimizations and polish

---

## User Story Dependency Graph

Visual representation of what blocks what:

```
Setup (Phase 1) → Foundational (Phase 2) → All User Stories can proceed

User Story Dependencies:
├─ US1 (P1) ─────────────────────┐
│                                 │
├─ US2 (P2) ─────────────────────┤
│                                 ├──→ US3 (P2) [needs US1 + US2]
│                                 │
├─ US4 (P3) [needs US2 for friend tracking]
│
├─ US5 (P3) [independent, just displays formula]
│
├─ US6 (P3) [needs US1 for submission data]
│
└─ US7 (P3) [needs US1 for user stats, US2 for friend badges]
```

**Parallelization Strategy**:

- After Foundational phase: US1 can start immediately
- After US1 complete: US2, US5, US6 can run in parallel
- After US2 complete: US3, US4, US7 can run in parallel
- US3 requires both US1 and US2 complete
- Polish tasks can run anytime after respective user stories complete

---

## Parallel Execution Examples

### Phase 3 (US1) - Can parallelize type and component creation:

- T026-T028 (API service) + T030-T031 (utilities) + T037 (StreakDisplay) can all run simultaneously
- Then T032-T035 (hooks) depend on services
- Then T036-T040 (components) can partially parallelize

### Phase 4 (US2) - High parallelization potential:

- T041-T042 (points calculator) + T049-T051 (modal components) + T057-T058 (leaderboard components) all independent
- After hooks ready (T044-T045), integration tasks can proceed

### Phase 8 (US6) - Chart components fully parallel:

- T076-T078 (chart components) fully independent
- T080-T083 (performance components) can run in parallel after T079 (hook) complete

---

## Task Summary

**Total Tasks**: 114
**Setup**: 5 tasks (includes user onboarding)
**Foundational**: 21 tasks
**User Story 1 (P1)**: 15 tasks
**User Story 2 (P2)**: 24 tasks (includes navigation components)
**User Story 3 (P2)**: 5 tasks
**User Story 4 (P3)**: 8 tasks
**User Story 5 (P3)**: 2 tasks
**User Story 6 (P3)**: 10 tasks
**User Story 7 (P3)**: 8 tasks
**Polish**: 16 tasks

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (US1 only) = 41 tasks
**Full P1+P2 Delivery**: Through Phase 5 (US1+US2+US3) = 70 tasks
**Complete Feature**: All 114 tasks

---

## Implementation Strategy

1. **MVP First**: Complete Setup → Foundational → US1 (41 tasks)
   - Delivers core value: view personal LeetCode stats
   - Includes essential user onboarding flow
   - Validates API integration and data layer
   - Establishes design system and patterns

2. **Competitive Layer**: Add US2 → US3 (29 tasks)
   - Enables friend comparison and leaderboard
   - Includes complete navigation with logo, stats widget, profile
   - Core competitive features functional

3. **Engagement Layer**: Add US4 → US5 → US6 → US7 (28 tasks)
   - Activity feed, points explanation, charts, badges
   - Increases user engagement and retention

4. **Polish**: Complete Phase 10 (16 tasks)
   - Production-ready refinements
   - Performance and accessibility

**Incremental Delivery**: Each phase delivers testable, valuable functionality independently

---

## Next Steps

1. Checkout branch: `git checkout 002-competitive-dashboard`
2. Start with Phase 1 (Setup) - 5 tasks including user onboarding
3. Move to Phase 2 (Foundational) - critical for all features
4. Begin User Story 1 implementation - delivers MVP
5. Mark tasks complete as you go: `- [x] T001 ...`
6. Test each user story independently before moving to next

**Ready to implement!** All design artifacts complete, dependencies mapped, tasks sequenced for optimal parallel execution.
