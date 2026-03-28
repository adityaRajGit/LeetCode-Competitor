# Dashboard Feature

**Purpose**: Competitive coding dashboard with LeetCode statistics tracking, friend leaderboards, performance analytics, and achievement badges.

## Architecture

### Component Structure

```
dashboard/
├── components/          # React components
│   ├── DashboardLayout/ # Main container
│   ├── HeroSection/     # Personal stats & comparison
│   ├── Leaderboard/     # Friend rankings
│   ├── ActivityFeed/    # Recent friend activities
│   ├── PerformanceCharts/ # Analytics visualizations
│   ├── BadgeDisplay/    # Achievement badges
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useUserStats     # Fetch and manage user data
│   ├── useLeaderboard   # Calculate rankings
│   ├── useActivityFeed  # Track friend activities
│   └── usePerformanceData # Process submission data
├── services/            # Business logic
│   ├── leetcodeApi      # External API integration
│   ├── pointsCalculator # Scoring algorithm
│   ├── activityDetector # Activity tracking
│   ├── badgeAwarder     # Achievement system
│   └── storageManager   # Client-side persistence
└── types/               # TypeScript interfaces
```

### Data Flow

1. **User Stats**: `useUserStats` → LeetCode API → Cache → UI
2. **Friends**: Session Storage → `useFriendsList` → `useLeaderboard` → Ranked display
3. **Activities**: Friend stat changes → `activityDetector` → `useActivityFeed` → Timeline
4. **Badges**: User achievements → `badgeAwarder` → Local Storage → Badge display

## Features

### ✅ User Story 1: Personal Statistics (P1 - MVP)

- Display total solved, current streak, today/weekly progress
- Global rank and acceptance rate
- Real-time statistics from LeetCode API
- 60-second rate limiting with cache fallback

### ✅ User Story 2: Friend Leaderboard (P2)

- Add friends by LeetCode username
- Ranked comparison based on points system
- Remove friends from leaderboard
- Session-based storage (resets on refresh)

### ✅ User Story 3: Head-to-Head Comparison (P2)

- Direct comparison with best friend (rank 1)
- Side-by-side metrics table
- Point difference messages

### ✅ User Story 4: Activity Feed (P3)

- Track friend achievements
- Display problems solved, streak milestones, rank changes
- Relative timestamps
- Automatic activity detection

### ✅ User Story 5: Points System Explanation (P3)

- Formula breakdown card
- Bonus rules explanation
- Help users understand scoring

### ✅ User Story 6: Performance Analytics (P3)

- Daily solve trend (30 days)
- Weekly comparison chart
- Difficulty breakdown pie chart
- Win ratio vs best friend

### ✅ User Story 7: Achievement Badges (P3)

- 8 badge types (Grinder, Speed Coder, Dominator, etc.)
- Automatic awarding based on criteria
- Display in hero section and leaderboard

## Points System

```typescript
Points = (Easy * 10) + (Medium * 20) + (Hard * 40) + Bonuses

Bonuses:
- Current Streak: +5 per day
- Today Solved: +10 per problem
- Global Rank Multiplier: (10000 / rank) * 10
```

## API Integration

**Endpoint**: `https://leetcode-stats-api.herokuapp.com/:username`

**Response Caching**:

- Cache duration: 5 minutes
- Fallback to cached data on error
- Rate limiting: 60 seconds between fetches

## Storage

### Local Storage

- `leetcode-username`: Current user's username
- `leetcode-user-cache-{username}`: Cached user statistics
- `leetcode-badges`: Earned achievement badges
- `leetcode-theme`: UI theme preference

### Session Storage

- `leetcode-friends`: Friend list with stats
- `leetcode-activity-history`: Activity event timeline
- `leetcode-last-api-request-{username}`: Rate limit tracking

## Performance Optimizations

1. **React.memo**: LeaderboardRow, ActivityItem, Chart components
2. **useMemo**: Points calculation, leaderboard ranking, chart data processing
3. **useCallback**: Event handlers in DashboardLayout
4. **Code splitting**: Lazy loading for heavy components
5. **Cache strategy**: 5-minute cache with stale-while-revalidate

## Accessibility

- ARIA labels for statistics, navigation, and interactive elements
- Keyboard navigation support
- Screen reader announcements for dynamic content
- Focus management in modals
- Reduced motion support for animations

## Responsive Design

**Breakpoints**:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Optimizations**:

- Single column layout
- Reduced shadow effects
- Simplified navigation
- Touch-friendly buttons (min 44x44px)

## Error Handling

1. **API Failures**: Show cached data + error banner
2. **Network Issues**: Retry button with manual refresh
3. **Rate Limiting**: Countdown timer + cached data
4. **Invalid Username**: Validation before adding friend
5. **Component Errors**: ErrorBoundary with fallback UI

## Testing Strategy

### Unit Tests

- Service layer (pointsCalculator, activityDetector, badgeAwarder)
- Utility functions (dateUtils, cacheUtils, rateLimiter)
- Custom hooks (useUserStats, useLeaderboard, useActivityFeed)

### Integration Tests

- Full user flow: Add friend → View leaderboard → Check activities
- API mocking with error scenarios
- Storage persistence and cache invalidation

### E2E Tests

- Complete user journey from onboarding to dashboard
- Multiple friend additions and removals
- Theme switching and preference persistence

## Usage

```tsx
import { DashboardLayout } from '@/features/dashboard';

function App() {
  return <DashboardLayout username="john_doe" />;
}
```

## Dependencies

- **react**: ^19.2.4
- **react-router-dom**: ^7.13.0
- **TypeScript**: ^5.9.3

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

1. **Client-side only**: No backend, session data resets on refresh
2. **External API**: Dependent on leetcode-stats-api availability
3. **Rate limits**: 60-second cooldown per username
4. **Friend storage**: Session-based, not persistent
5. **Dominator badge**: Requires 7-day rank history (not yet tracked)

## Future Enhancements

1. Backend integration for persistent storage
2. Real-time WebSocket updates
3. Custom badge creation
4. Social features (comments, reactions)
5. Export statistics as PDF/CSV
6. Mobile app version
7. Historical trend analysis (6 months+)

## Contributing

When adding new features:

1. Follow the existing component structure
2. Add TypeScript interfaces in `types/`
3. Create custom hooks for data fetching logic
4. Use the NeoBrutalism design system
5. Write unit tests for business logic
6. Update this README with new features

## License

MIT License - See LICENSE file for details
