import type { LeetCodeUser, Friend, PointsBreakdown } from '@/features/dashboard/types';

/**
 * Points Calculator Service
 * Calculate points and generate leaderboard rankings
 */

/**
 * Calculate points for a user based on their stats
 * 
 * @param user - LeetCode user stats
 * @param bestFriendTodaySolved - Best friend's today solved count (for competition bonus)
 * @returns Points breakdown with base, streak, competition bonuses
 */
export function calculatePoints(
  user: LeetCodeUser,
  bestFriendTodaySolved: number = 0
): PointsBreakdown {
  // Base points: Easy × 5 + Medium × 10 + Hard × 20
  const basePoints = 
    (user.easySolved * 5) +
    (user.mediumSolved * 10) +
    (user.hardSolved * 20);
  
  // Streak bonus: +10 if current streak >= 1
  const streakBonus = user.currentStreak >= 1 ? 10 : 0;
  
  // Competition bonus: +15 if solved more problems today than best friend
  const competitionBonus = user.todaySolved > bestFriendTodaySolved ? 15 : 0;
  
  return {
    basePoints,
    streakBonus,
    competitionBonus,
    totalPoints: basePoints + streakBonus + competitionBonus,
  };
}

/**
 * Calculate total points for a user (convenience function)
 * 
 * @param user - LeetCode user stats
 * @param bestFriendTodaySolved - Best friend's today solved count
 * @returns Total points
 */
export function getTotalPoints(
  user: LeetCodeUser,
  bestFriendTodaySolved: number = 0
): number {
  return calculatePoints(user, bestFriendTodaySolved).totalPoints;
}

/**
 * Get best friend (highest points) from friends list
 * 
 * @param friends - List of friends
 * @returns Friend with highest points, or null if no friends
 */
export function getBestFriend(friends: Friend[]): Friend | null {
  if (friends.length === 0) return null;

  // Use the pre-calculated totalPoints stored on each friend,
  // rather than recalculating (which requires bestFriendTodaySolved — circular).
  return friends.reduce((best, current) => {
    return current.totalPoints > best.totalPoints ? current : best;
  }, friends[0]);
}

/**
 * Get point difference between two users
 * Positive = user1 is ahead, Negative = user2 is ahead
 * 
 * @param user1 - First user
 * @param user2 - Second user
 * @returns Point difference
 */
export function getPointDifference(
  user1: LeetCodeUser,
  user2: LeetCodeUser
): number {
  const user1Points = getTotalPoints(user1);
  const user2Points = getTotalPoints(user2);
  return user1Points - user2Points;
}
