import { SubmissionCalendar } from './SubmissionCalendar';

/**
 * LeetCode User Interface
 * Represents a LeetCode user with comprehensive statistics
 */
export interface LeetCodeUser {
  // Identity
  username: string;

  // Problem Statistics
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;

  // Platform Metrics
  ranking: number;
  acceptanceRate: number;
  contributionPoints: number;
  reputation: number;

  // Submission History
  submissionCalendar: SubmissionCalendar;

  // Derived Metrics (calculated client-side)
  currentStreak: number;
  todaySolved: number;
  weeklySolved: number;
  totalPoints: number;

  // Metadata
  lastFetched: number;        // Unix timestamp
  cacheExpiry: number;         // Unix timestamp
}
