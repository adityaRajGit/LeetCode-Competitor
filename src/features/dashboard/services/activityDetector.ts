import type { Friend, ActivityEvent } from '@/features/dashboard/types';

/**
 * Activity Detection Service
 * Compares previous and current friend stats to detect significant changes
 */

export interface FriendSnapshot {
  username: string;
  totalSolved: number;
  currentStreak: number;
  rankPosition: number;
  totalPoints: number;
  lastFetched: number;
}

/**
 * Detect activities by comparing old and new friend stats
 * Returns an array of activity events for significant changes
 */
export function detectActivities(
  oldSnapshot: FriendSnapshot,
  newFriend: Friend
): ActivityEvent[] {
  const events: ActivityEvent[] = [];
  const now = Date.now();

  // Detect problems solved (if total increased)
  if (newFriend.totalSolved > oldSnapshot.totalSolved) {
    const problemsSolved = newFriend.totalSolved - oldSnapshot.totalSolved;
    events.push({
      id: `evt-${now}-${newFriend.username}-problems`,
      type: 'problems_solved',
      username: newFriend.username,
      timestamp: now,
      message: `${newFriend.username} solved ${problemsSolved} problem${problemsSolved > 1 ? 's' : ''}`,
      metadata: { problemsSolved },
    });
  }

  // Detect streak broken (if streak went from >0 to 0 or decreased significantly)
  if (oldSnapshot.currentStreak > 0 && newFriend.currentStreak === 0) {
    events.push({
      id: `evt-${now}-${newFriend.username}-streak-broken`,
      type: 'streak_broken',
      username: newFriend.username,
      timestamp: now,
      message: `${newFriend.username} broke their ${oldSnapshot.currentStreak}-day streak`,
      metadata: { streakDays: oldSnapshot.currentStreak },
    });
  }

  // Detect streak milestone (7-day, 14-day, 30-day, etc.)
  if (newFriend.currentStreak > oldSnapshot.currentStreak) {
    const milestones = [7, 14, 21, 30, 60, 90, 100];
    const reachedMilestone = milestones.find(
      (m) => newFriend.currentStreak >= m && oldSnapshot.currentStreak < m
    );
    
    if (reachedMilestone) {
      events.push({
        id: `evt-${now}-${newFriend.username}-streak-milestone`,
        type: 'streak_milestone',
        username: newFriend.username,
        timestamp: now,
        message: `${newFriend.username} reached a ${reachedMilestone}-day streak! 🔥`,
        metadata: { streakDays: reachedMilestone },
      });
    }
  }

  // Detect rank changed (if leaderboard position changed)
  if (oldSnapshot.rankPosition !== newFriend.rankPosition) {
    const direction = newFriend.rankPosition < oldSnapshot.rankPosition ? 'improved' : 'dropped';
    events.push({
      id: `evt-${now}-${newFriend.username}-rank`,
      type: 'rank_changed',
      username: newFriend.username,
      timestamp: now,
      message: `${newFriend.username} ${direction} to rank #${newFriend.rankPosition}`,
      metadata: {
        newRank: newFriend.rankPosition,
        oldRank: oldSnapshot.rankPosition,
      },
    });
  }

  return events;
}

/**
 * Create a snapshot of friend's current stats for future comparison
 */
export function createSnapshot(friend: Friend): FriendSnapshot {
  return {
    username: friend.username,
    totalSolved: friend.totalSolved,
    currentStreak: friend.currentStreak,
    rankPosition: friend.rankPosition,
    totalPoints: friend.totalPoints,
    lastFetched: friend.lastFetched,
  };
}

/**
 * Generate a human-readable relative time string
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
}
