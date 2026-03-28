/**
 * Activity Event Types
 */
export type ActivityEventType =
  | 'problems_solved'
  | 'streak_broken'
  | 'rank_changed'
  | 'streak_milestone'
  | 'achievement_unlocked';

/**
 * Activity Event Interface
 * Represents a notable change in friend statistics
 */
export interface ActivityEvent {
  id: string;                   // Unique identifier
  type: ActivityEventType;
  username: string;
  timestamp: number;            // Unix timestamp
  message: string;              // Human-readable message for display

  // Type-specific metadata
  metadata?: {
    problemsSolved?: number;
    streakDays?: number;
    newRank?: number;
    oldRank?: number;
    badgeId?: string;
  };
}
