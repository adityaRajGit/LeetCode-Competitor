import { Friend } from './Friend';
import { Badge } from './Badge';

/**
 * Leaderboard Entry Interface
 * Represents a single entry in the ranked leaderboard
 */
export interface LeaderboardEntry extends Friend {
  // Inherited from Friend:
  // - All LeetCodeUser fields
  // - rankPosition, previousRankPosition, trendDirection
  // - isInactive, isImproving
  // - lastActivityTimestamp, addedAt

  // Calculated badges for display
  badges?: Badge[];
}
