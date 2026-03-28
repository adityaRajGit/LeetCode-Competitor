/**
 * Badge Awarder Service
 *
 * Defines achievement badges and logic for awarding them based on user performance.
 */

import type { Badge, LeetCodeUser } from '../types';

/**
 * Badge Definitions
 *
 * Each badge has:
 * - id: Unique identifier
 * - name: Display name
 * - description: What the badge represents
 * - icon: Emoji icon
 * - criteria: Function that checks if user qualifies for the badge
 */
export const BADGE_DEFINITIONS: Array<Omit<Badge, 'earnedAt'>> = [
  {
    id: 'grinder',
    name: '7-Day Grinder',
    description: 'Maintained a 7-day solving streak',
    icon: '🔥',
    criteria: (user: LeetCodeUser) => user.currentStreak >= 7,
  },
  {
    id: 'speed-coder',
    name: 'Speed Coder',
    description: 'Solved 10+ problems in a single day',
    icon: '⚡',
    criteria: (user: LeetCodeUser) => {
      // Check submission calendar for any day with 10+ submissions
      const submissions = Object.values(user.submissionCalendar || {});
      return submissions.some((count) => count >= 10);
    },
  },
  {
    id: 'dominator',
    name: 'Dominator',
    description: 'Held rank #1 for 7 consecutive days',
    icon: '👑',
    criteria: (_user: LeetCodeUser, rankHistory?: number[]) => {
      // rankHistory should be an array of the last 7 days' ranks
      // This badge is tracked separately since it requires historical data
      if (!rankHistory || rankHistory.length < 7) return false;
      return rankHistory.every((rank) => rank === 1);
    },
  },
  {
    id: 'century',
    name: 'Century',
    description: 'Solved 100+ total problems',
    icon: '💯',
    criteria: (user: LeetCodeUser) => user.totalSolved >= 100,
  },
  {
    id: 'half-century',
    name: 'Half Century',
    description: 'Solved 50+ total problems',
    icon: '🎯',
    criteria: (user: LeetCodeUser) => user.totalSolved >= 50,
  },
  {
    id: 'hard-mode',
    name: 'Hard Mode',
    description: 'Solved 10+ hard problems',
    icon: '💪',
    criteria: (user: LeetCodeUser) => user.hardSolved >= 10,
  },
  {
    id: 'consistency',
    name: 'Consistency King',
    description: 'Solved problems for 30 consecutive days',
    icon: '📅',
    criteria: (user: LeetCodeUser) => user.currentStreak >= 30,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Solved 5+ problems today',
    icon: '🌅',
    criteria: (user: LeetCodeUser) => (user.todaySolved || 0) >= 5,
  },
];

/**
 * Check which badges a user has earned
 *
 * @param user - The user to check badges for
 * @param rankHistory - Optional rank history for time-based badges (last 7 days)
 * @returns Array of badge IDs that the user has earned
 */
export const checkBadges = (user: LeetCodeUser, rankHistory?: number[]): string[] => {
  const earnedBadgeIds: string[] = [];

  for (const badge of BADGE_DEFINITIONS) {
    try {
      if (badge.criteria(user, rankHistory)) {
        earnedBadgeIds.push(badge.id);
      }
    } catch (error) {
      console.error(`Error checking badge ${badge.id}:`, error);
    }
  }

  return earnedBadgeIds;
};

/**
 * Get badge definition by ID
 */
export const getBadgeById = (badgeId: string): Omit<Badge, 'earnedAt'> | undefined => {
  return BADGE_DEFINITIONS.find((badge) => badge.id === badgeId);
};

/**
 * Award new badges to a user
 *
 * @param user - The user to check
 * @param existingBadges - Badges the user already has
 * @param rankHistory - Optional rank history for time-based badges
 * @returns Array of newly earned badges (full Badge objects with earnedAt timestamps)
 */
export const awardNewBadges = (
  user: LeetCodeUser,
  existingBadges: Badge[],
  rankHistory?: number[]
): Badge[] => {
  const earnedBadgeIds = checkBadges(user, rankHistory);
  const existingBadgeIds = new Set(existingBadges.map((b) => b.id));
  const newlyEarnedIds = earnedBadgeIds.filter((id) => !existingBadgeIds.has(id));

  const newBadges: Badge[] = [];
  const now = Date.now();

  for (const badgeId of newlyEarnedIds) {
    const badgeDefinition = getBadgeById(badgeId);
    if (badgeDefinition) {
      newBadges.push({
        ...badgeDefinition,
        earnedAt: now,
        criteria: badgeDefinition.criteria, // Ensure criteria is included
      });
    }
  }

  return newBadges;
};

export default {
  BADGE_DEFINITIONS,
  checkBadges,
  getBadgeById,
  awardNewBadges,
};
