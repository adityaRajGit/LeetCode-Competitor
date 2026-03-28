import { LeetCodeUser } from './LeetCodeUser';

/**
 * Friend Interface
 * Extends LeetCodeUser with comparison-specific metadata
 */
export interface Friend extends LeetCodeUser {
  // Comparison Metadata
  rankPosition: number;
  previousRankPosition: number | null;
  trendDirection: 'up' | 'down' | 'stable';

  // Status Flags
  isInactive: boolean;          // True if no activity in past 7 days
  isImproving: boolean;         // True if rank improved since last check

  // Activity Tracking
  lastActivityTimestamp: number;
  addedAt: number;              // When friend was added (Unix timestamp)
}
