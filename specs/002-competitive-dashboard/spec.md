# Feature Specification: Competitive Coding Dashboard

**Feature Branch**: `002-competitive-dashboard`  
**Created**: February 15, 2026  
**Status**: Draft  
**Input**: User description: "Homepage Structure (Dashboard-First Approach) with NeoBrutalism theme - Competitive Coding Control Center to help users become competitive with friends and strangers to solve more questions"  
**Architecture**: Fully client-side (no custom backend) - uses external LeetCode Stats API only

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Personal Coding Statistics (Priority: P1)

A user visits the homepage and immediately sees their LeetCode coding statistics including total problems solved, current streak, today's progress, and overall ranking. This provides instant motivation and progress tracking without any additional setup.

**Why this priority**: This is the core value proposition - users need to see their own stats before they care about competition. It validates the platform works and provides immediate value.

**Independent Test**: Can be fully tested by entering a LeetCode username and verifying all statistics display correctly from the LeetCode API. Delivers immediate value by showing user progress.

**Acceptance Scenarios**:

1. **Given** a user with a valid LeetCode account, **When** they enter their username, **Then** the system displays their total solved problems, difficulty breakdown (Easy/Medium/Hard), current ranking, and acceptance rate
2. **Given** a user viewing their dashboard, **When** they check the Hero Section, **Then** they see their current streak count, today's solved count, and weekly progress
3. **Given** a user with recent LeetCode activity, **When** their stats load, **Then** the submission calendar shows activity for the past 12 months with problem counts per day
4. **Given** a user's stats are displayed, **When** they refresh the page, **Then** the system fetches updated stats from LeetCode API

---

### User Story 2 - Add and Compare with Friends (Priority: P2)

A user wants to compete with their friends by adding them to their leaderboard. They click "Add Friend", enter a friend's LeetCode username, see a preview of their friend's stats, and add them to the comparison view. The dashboard now shows a ranked leaderboard of all added friends.

**Why this priority**: This enables the competitive element which is the unique selling point. Without this, it's just a stats viewer. This transforms the tool into a social competitive platform.

**Independent Test**: Can be tested by adding multiple LeetCode usernames and verifying they appear in a ranked leaderboard. Delivers the competitive comparison feature.

**Acceptance Scenarios**:

1. **Given** a user on the dashboard, **When** they click "Add Friend" button in navigation, **Then** a modal opens with an input field for LeetCode username and an "Add" button
2. **Given** the Add Friend modal is open, **When** they enter a valid LeetCode username, **Then** the system validates the username exists and shows a preview (total solved, ranking, today solved)
3. **Given** the preview is displayed, **When** the user clicks the "Add" button, **Then** the friend is saved to session storage and the modal closes
4. **Given** multiple friends added, **When** viewing the leaderboard, **Then** friends are ranked by total points with columns showing Rank, Username, Today Solved, Weekly Solved, Points, Streak, and Trend Arrow
5. **Given** a user adds a friend, **When** the friend is saved, **Then** an animation displays "New Rival Added ⚔️" and the leaderboard refreshes
6. **Given** the leaderboard is displayed, **When** a friend has improved their rank, **Then** an upward arrow (↑) appears, and a downward arrow (↓) if rank decreased
7. **Given** friends are stored in session, **When** the user refreshes the page, **Then** the friend list resets and the dashboard shows only the user's own stats

---

### User Story 3 - Head-to-Head Friend Comparison (Priority: P2)

A user wants quick insight into how they compare with their best friend or closest competitor. The Hero Section prominently displays a "You vs Best Friend" comparison table showing key metrics side-by-side with a motivational message about who's ahead or behind.

**Why this priority**: This provides emotional engagement and urgency. The direct comparison creates friendly competition and motivates users to solve more problems.

**Independent Test**: Can be tested by adding one friend and verifying the comparison table displays with accurate metrics and contextual messages.

**Acceptance Scenarios**:

1. **Given** a user has added at least one friend, **When** viewing the Hero Section, **Then** a comparison table shows "You vs Best Friend" with metrics: Today Solved, Weekly Solved, Points
2. **Given** the comparison table is displayed, **When** the user is behind in points, **Then** a message displays "You're behind by [X] points"
3. **Given** the comparison table is displayed, **When** the user is leading in points, **Then** a message displays "You're leading by [X] points"
4. **Given** the user and friend have equal points, **When** viewing the comparison, **Then** a message displays "You're tied!"

---

### User Story 4 - View Friend Activity Feed (Priority: P3)

A user wants to see what their friends have been doing recently. The dashboard includes an activity feed showing recent achievements like "Aditya solved 3 problems today", "Rahul broke 7-day streak", "Ankit passed you in ranking". This creates a social, engaging experience.

**Why this priority**: Adds social engagement and keeps users coming back to check what friends are doing. Not critical for MVP but increases stickiness.

**Independent Test**: Can be tested by tracking friend stats over time and displaying activity updates when changes are detected.

**Acceptance Scenarios**:

1. **Given** friends have been added, **When** viewing the activity feed, **Then** recent activities display in chronological order
2. **Given** a friend solved problems today, **When** their stats update, **Then** the feed shows "[Username] solved [X] problems today"
3. **Given** a friend broke their streak, **When** the streak count becomes 0 after being positive, **Then** the feed shows "[Username] broke [X]-day streak"
4. **Given** a friend surpassed the user in ranking, **When** rank positions swap, **Then** the feed shows "[Username] passed you in ranking"

---

### User Story 5 - Understand Points and Scoring System (Priority: P3)

A user wants to understand how points are calculated and what determines winners. A dedicated Points System Card clearly shows the scoring formula: Easy = 5 pts, Medium = 10 pts, Hard = 20 pts, Daily streak bonus = +10, Beat friend in daily count = +15.

**Why this priority**: Transparency builds trust and helps users strategize. However, users can compete without fully understanding the formula initially.

**Independent Test**: Can be tested by displaying the points card and verifying all scoring rules are clearly explained.

**Acceptance Scenarios**:

1. **Given** a user viewing the dashboard, **When** they scroll to the Points System Card, **Then** all scoring rules are displayed with values
2. **Given** the points formula is displayed, **When** a user reads it, **Then** they understand: Easy problems = 5 pts, Medium = 10 pts, Hard = 20 pts
3. **Given** the points formula is displayed, **When** a user reads it, **Then** they understand bonus points: Daily streak = +10, Beat friend daily count = +15
4. **Given** a user has earned points, **When** they view their total, **Then** they can verify the calculation matches the displayed formula

---

### User Story 6 - Visual Performance Analytics (Priority: P3)

A user wants to analyze their coding performance over time through visual charts. The Performance Insights section shows daily solve trends, weekly comparison graphs, difficulty breakdown, and win ratio versus friends.

**Why this priority**: Valuable for engaged users who want deep insights, but not necessary for initial competitive experience.

**Independent Test**: Can be tested by generating charts from historical submission data and verifying accuracy.

**Acceptance Scenarios**:

1. **Given** a user has historical LeetCode data, **When** viewing Performance Insights, **Then** a daily solve trend chart displays problem count over the past 30 days
2. **Given** weekly data is available, **When** viewing the weekly comparison, **Then** a bar chart shows solved problems per week for the past 8 weeks
3. **Given** problems are solved across difficulties, **When** viewing difficulty breakdown, **Then** a chart shows percentage distribution: Easy / Medium / Hard
4. **Given** friends have been added, **When** viewing win ratio, **Then** a metric shows "Days Won" vs "Days Lost" compared to friends

---

### User Story 7 - View Achievement Badges (Priority: P3)

Users who achieve milestones earn status badges like "Grinder" (7-day streak), "Speed Coder" (10+ in a day), "Dominator" (1st rank 7 days straight). These badges appear on their profile card and create gamification incentives.

**Why this priority**: Gamification increases engagement and retention, but not critical for core comparative functionality.

**Independent Test**: Can be tested by simulating achievement conditions and verifying badges are awarded and displayed correctly.

**Acceptance Scenarios**:

1. **Given** a user maintains a 7-day streak, **When** they view their profile, **Then** a "🧠 Grinder" badge appears
2. **Given** a user solves 10+ problems in a single day, **When** viewing their profile, **Then** a "🚀 Speed Coder" badge appears
3. **Given** a user holds 1st rank for 7 consecutive days, **When** viewing their profile, **Then** a "👑 Dominator" badge appears
4. **Given** a user has earned badges, **When** viewing the leaderboard, **Then** their badges display next to their username

---

### Edge Cases

- What happens when a user enters an invalid or non-existent LeetCode username in Add Friend modal? System should display error message "Username not found" and prevent adding
- What happens when the data service is unavailable or returns an error? System should display a friendly error message "Unable to fetch stats. Please try again later" and use last known cached data if available
- What happens when a user has never solved any problems (all counts are 0)? System should still display the dashboard with 0 values and motivational message "Start your coding journey today!"
- What happens when two friends have identical points and stats? Leaderboard should show them as tied at the same rank, with next rank skipping appropriately
- What happens when a friend hasn't solved any problems today but had a streak yesterday? The streak should break and show 0, with activity feed noting the broken streak
- What happens when historical submission data is incomplete or corrupted? System should display available data and show "No data" for missing periods
- What happens when a user requests stat updates multiple times rapidly? System should limit update frequency and show "Please wait [X] seconds before refreshing again"
- What happens when a user tries to add themselves as a friend? System should prevent this and show message "You cannot add yourself as a friend"
- What happens when a user tries to add the same friend twice? System should detect duplicate and show message "This friend is already in your list"

## Requirements *(mandatory)*

### Functional Requirements

#### Navigation & Layout

- **FR-001**: System MUST display a top navigation bar containing brand logo, "Add Friend" button, global stats summary, profile dropdown, and theme toggle
- **FR-002**: System MUST render all dashboard components in a NeoBrutalism design aesthetic with bold borders, vibrant colors, and strong contrasts
- **FR-003**: System MUST provide dark mode and light mode theme options accessible via toggle in navigation bar
- **FR-004**: System MUST persist theme preference in browser local storage (client-side, survives page refresh)

#### Hero Section - Personal Stats

- **FR-005**: System MUST display current streak count calculated from consecutive days with problem submissions
- **FR-006**: System MUST display today's solved count by parsing submission calendar for current day
- **FR-007**: System MUST display user's overall rank among added friends based on total points
- **FR-008**: System MUST display "You vs Best Friend" comparison table when at least one friend is added, showing Today Solved, Weekly Solved, and Points for both
- **FR-009**: System MUST display contextual message indicating point difference: "You're behind by [X] points" when losing, "You're leading by [X] points" when winning, or "You're tied!" when equal

#### Add Friend Flow

- **FR-010**: System MUST open Add Friend modal when "Add Friend" button is clicked in navigation
- **FR-011**: System MUST provide input field for entering LeetCode username and an "Add" button in Add Friend modal
- **FR-012**: System MUST validate username exists by fetching user statistics from LeetCode data service when username is entered
- **FR-013**: System MUST display friend preview showing total solved, ranking, and today solved count after successful validation
- **FR-014**: System MUST save friend to session storage only when user clicks the "Add" button (not automatically on validation)
- **FR-015**: System MUST prevent adding duplicate friends by checking against existing friend list before saving
- **FR-016**: System MUST prevent users from adding themselves as a friend
- **FR-017**: System MUST store friend list in browser session storage (client-side only, no backend persistence)
- **FR-018**: System MUST display "New Rival Added ⚔️" animation when friend is successfully added via Add button
- **FR-019**: System MUST refresh leaderboard and recalculate ranks after adding friend using client-side calculations
- **FR-020**: System MUST clear friend list when page is refreshed, requiring users to re-add friends for new session

#### Leaderboard

- **FR-021**: System MUST display ranked leaderboard with columns: Rank, Username, Today Solved, Weekly Solved, Points, Streak, Trend Arrow
- **FR-022**: System MUST rank friends by total points in descending order
- **FR-023**: System MUST calculate weekly solved count by summing submissions from past 7 days using submission calendar
- **FR-024**: System MUST display trend arrow (↑) when friend's rank improved since last calculation, (↓) when decreased
- **FR-025**: System MUST apply visual effects: green glow for improving friends, red highlight for inactive friends (no activity in 7 days), fire icon (🔥) for streaks > 5 days
- **FR-026**: System MUST handle tied ranks by assigning same rank number and skipping subsequent ranks appropriately

#### Activity Feed

- **FR-027**: System MUST track friend statistics changes by comparing current stats with previously cached stats stored in session storage (client-side)
- **FR-028**: System MUST generate activity feed entries using client-side logic when significant changes detected: problems solved today, streak broken, rank position changes
- **FR-029**: System MUST display activity messages in format: "[Username] solved [X] problems today", "[Username] broke [X]-day streak", "[Username] passed you in ranking"
- **FR-030**: System MUST display activity feed in reverse chronological order with most recent activities first
- **FR-031**: System MUST limit activity feed to most recent 10 activities stored in session storage to prevent UI clutter

#### Points System

- **FR-032**: System MUST calculate points using client-side formula: Easy solved × 5 + Medium solved × 10 + Hard solved × 20
- **FR-033**: System MUST calculate and award daily streak bonus of +10 points when user has solved at least 1 problem per day for consecutive days (client-side calculation)
- **FR-034**: System MUST calculate and award daily competition bonus of +15 points when user's today solved count exceeds best friend's today solved count (client-side comparison)
- **FR-035**: System MUST display Points System Card explaining all scoring rules: problem difficulty values, streak bonus, competition bonus
- **FR-036**: System MUST recalculate points client-side for all users whenever friend list changes or stats are refreshed

#### Winner Logic

- **FR-037**: System MUST determine daily winner as friend with highest today solved count
- **FR-038**: System MUST determine weekly winner as friend with highest sum of points earned in past 7 days
- **FR-039**: System MUST determine overall winner as friend with highest lifetime total points

#### Badges & Achievements

- **FR-040**: System MUST award "🧠 Grinder" badge when user maintains 7+ day streak
- **FR-041**: System MUST award "🚀 Speed Coder" badge when user solves 10+ problems in a single day
- **FR-042**: System MUST award "👑 Dominator" badge when user holds 1st rank for 7 consecutive days
- **FR-043**: System MUST display earned badges on user profile card and in leaderboard

#### Performance Insights

- **FR-044**: System MUST generate daily solve trend chart showing problem count per day for past 30 days
- **FR-045**: System MUST generate weekly comparison chart showing total problems per week for past 8 weeks
- **FR-046**: System MUST calculate difficulty breakdown percentage: (Easy solved / Total solved × 100), same for Medium and Hard
- **FR-047**: System MUST calculate win ratio by counting days where user had higher today solved than best friend, expressed as "Days Won" vs "Days Lost"

#### Data Management

- **FR-048**: System MUST fetch LeetCode statistics from external API endpoint `https://leetcode-stats-api.herokuapp.com/<USERNAME>` (no custom backend required)
- **FR-049**: System MUST parse API response JSON extracting: totalSolved, easySolved, mediumSolved, hardSolved, ranking, acceptanceRate, contributionPoints, reputation, submissionCalendar
- **FR-050**: System MUST process submissionCalendar object (Unix timestamp keys → submission count values) to calculate daily/weekly patterns
- **FR-051**: System MUST cache fetched statistics in session/local storage to minimize repeated API calls
- **FR-052**: System MUST provide manual refresh mechanism that clears cache and re-fetches stats from API
- **FR-053**: System MUST implement client-side rate limiting to prevent excessive API requests (maximum 1 request per user per 60 seconds)

#### Error Handling

- **FR-054**: System MUST display user-friendly error message when LeetCode username not found: "Username not found. Please check spelling."
- **FR-055**: System MUST display error message when data service is unavailable: "Unable to fetch stats. Please try again later."
- **FR-056**: System MUST display error message when connection fails: "Connection error. Please check your internet."
- **FR-057**: System MUST fallback to cached data from session/local storage when API fetch fails, displaying data age: "Showing data from [time] ago"
- **FR-058**: System MUST handle zero values gracefully, displaying motivational messages for new users: "Start your coding journey today!"
- **FR-059**: System MUST perform all calculations (points, rankings, streaks, trends) entirely in browser using JavaScript (no server-side computation)

## Clarifications

### Session 2026-02-15

- Q: How should the Add Friend flow save friends - automatically or with explicit user action? → A: Explicit Add button required. Friends saved only when user clicks Add button after preview, not auto-saved on validation.
- Q: What happens to friend data on page refresh? → A: Friend list stored in session storage resets on page refresh, requiring users to re-add friends for each new session.
- Q: Should this feature have a custom backend? → A: No custom backend. Feature is entirely client-side except for fetching LeetCode statistics from external API (`https://leetcode-stats-api.herokuapp.com/<USERNAME>`).

### Assumptions

- **No Custom Backend**: This feature is fully client-side with no server-side components, databases, or custom APIs
- **Single External Dependency**: Only external dependency is the LeetCode Stats API at `https://leetcode-stats-api.herokuapp.com/<USERNAME>` for fetching user statistics
- **Client-Side Storage**: All data (user stats, friend list, theme preferences, activity history) stored in browser session/local storage
- **Stateless Architecture**: Each page load is independent; no server maintains user sessions or persistent data
- Users accessing the dashboard provide their LeetCode username via client-side input (initial user setup flow not detailed in this spec)
- Historical submission data includes daily problem-solving activity over an extended time period
- "Today" is determined by the user's local timezone
- Streak calculation assumes solving at least 1 problem on a given day continues the streak
- "Best friend" for Hero Section comparison is determined as the friend with the highest total points
- Theme preference (dark/light mode) stored in browser local storage and applies consistently to all dashboard components

### Key Entities

- **User**: Represents a LeetCode user (either the main user or a friend). Attributes: username, total solved problems, difficulty breakdown (easy/medium/hard solved), overall ranking, acceptance rate, contribution points, reputation, historical submission activity, current streak days, today's solved count, weekly solved count, total points, earned badges
- **Friend**: Represents another LeetCode user added for comparison. Same attributes as User, plus: trend direction (up/down/stable), rank position among friends, last activity timestamp
- **Activity Event**: Represents a notable change in friend stats. Attributes: friend username, event type (problems solved, streak broken, rank change), timestamp, display message
- **Badge**: Represents an achievement earned by user. Attributes: badge name, icon/emoji, criteria description, date earned
- **Points Calculation**: Not an entity but a derived value. Calculated from: (Easy × 5) + (Medium × 10) + (Hard × 20) + (Streak Bonus) + (Competition Bonus). Results stored in a PointsBreakdown interface for display purposes.
- **Leaderboard Entry**: Represents a row in the leaderboard. Attributes: rank position, user/friend reference, today solved, weekly solved, total points, streak count, trend indicator
- **Theme Preference**: User's UI theme selection. Values: light or dark mode

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view their complete LeetCode statistics (total solved, difficulty breakdown, ranking, streak) within 3 seconds of page load
- **SC-002**: Users can add a friend and see them appear in the leaderboard within 5 seconds of entering username
- **SC-003**: The leaderboard correctly ranks all friends with accurate point calculations with 100% accuracy
- **SC-004**: 95% of valid LeetCode usernames are successfully validated and added on first attempt
- **SC-005**: Users can identify who is winning (themselves vs best friend) within 2 seconds of viewing Hero Section
- **SC-006**: All charts and performance insights render completely within 4 seconds for users with up to 12 months of submission data
- **SC-007**: The activity feed displays relevant friend activities with no more than 5-minute delay after stat changes
- **SC-008**: Users can toggle between dark and light themes with instant visual feedback (< 0.5 seconds)
- **SC-009**: The Points System Card makes the scoring formula understandable to 90% of users without external explanation
- **SC-010**: The dashboard remains functional and displays previously cached data even when the external data service is temporarily unavailable
- **SC-011**: Users with 0 problems solved still see a complete, motivational dashboard encouraging them to start
- **SC-012**: All visual elements follow NeoBrutalism design principles consistently across all screen sizes (responsive design)
- **SC-013**: Badge awards are correctly triggered when achievement criteria are met with 100% accuracy
