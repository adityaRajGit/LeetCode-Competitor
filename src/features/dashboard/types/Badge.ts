import type { LeetCodeUser } from './LeetCodeUser';

/**
 * Badge Type
 * Available achievement badge types
 */
export type BadgeType =
  | 'grinder'
  | 'speed-coder'
  | 'dominator'
  | 'century'
  | 'half-century'
  | 'hard-mode'
  | 'consistency'
  | 'early-bird';

/**
 * Badge Interface
 * Represents an achievement badge
 */
export interface Badge {
  id: string; // Unique identifier
  name: string; // Display name
  description: string; // Achievement criteria description
  icon: string; // Emoji icon
  earnedAt?: number; // Unix timestamp when earned (undefined if not earned)
  criteria: (user: LeetCodeUser, rankHistory?: number[]) => boolean; // Function to check if user qualifies
}
