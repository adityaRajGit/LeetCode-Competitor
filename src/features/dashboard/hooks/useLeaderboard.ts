import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Friend, LeaderboardEntry, Badge } from '@/features/dashboard/types';
import { getBestFriend } from '@/features/dashboard/services/pointsCalculator';
import { checkBadges, getBadgeById } from '@/features/dashboard/services/badgeAwarder';
import { LocalStore } from '@/features/dashboard/services/storageManager';

export interface UseLeaderboardOptions {
  friends: Friend[];
  currentUsername?: string;
  autoUpdate?: boolean; // Auto-update rankings when friends change
}

export interface UseLeaderboardReturn {
  leaderboard: LeaderboardEntry[];
  bestFriend: Friend | null;
  currentUserRank: number | null;
  loading: boolean;
  refresh: () => void;
}

/**
 * Custom hook for managing leaderboard state and rankings
 * Calculates rankings, best friend, and provides refresh functionality
 */
export function useLeaderboard({
  friends,
  currentUsername,
  autoUpdate = true,
}: UseLeaderboardOptions): UseLeaderboardReturn {
  const [loading, setLoading] = useState(false);

  // Calculate leaderboard entries with memoization
  const leaderboard = useMemo<LeaderboardEntry[]>(() => {
    if (friends.length === 0) return [];

    // Sort a copy (Array.sort mutates in-place, which would corrupt React state)
    const ranked = [...friends].sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      return a.username.localeCompare(b.username);
    });

    // Assign ranks and trends
    let currentRank = 1;
    return ranked.map((friend, index) => {
      // Update rank
      if (index > 0 && friend.totalPoints !== ranked[index - 1].totalPoints) {
        currentRank = index + 1;
      }

      // Use persisted rank history to determine trend direction
      const rankHistory = LocalStore.getRankHistory(friend.username);
      const previousRank = rankHistory.length > 0 ? rankHistory[rankHistory.length - 1] : null;

      let trendDirection: 'up' | 'down' | 'stable' = 'stable';
      if (previousRank !== null) {
        if (currentRank < previousRank) {
          trendDirection = 'up';
        } else if (currentRank > previousRank) {
          trendDirection = 'down';
        }
      }

      // Persist current rank to history for future comparisons
      LocalStore.updateRankHistory(friend.username, currentRank);

      // Calculate badges earned by this friend
      const earnedBadgeIds = checkBadges(friend, rankHistory);
      const badges: Badge[] = earnedBadgeIds
        .map((badgeId) => {
          const badgeDef = getBadgeById(badgeId);
          return badgeDef ? ({ ...badgeDef, earnedAt: 0 } as Badge) : null;
        })
        .filter((b): b is Badge => b !== null);

      return {
        ...friend,
        rankPosition: currentRank,
        previousRankPosition: previousRank,
        trendDirection,
        isInactive: checkIfInactive(friend),
        isImproving: trendDirection === 'up',
        badges,
      } as LeaderboardEntry;
    });
  }, [friends]);

  // Get best friend (highest ranked)
  const bestFriend = useMemo<Friend | null>(() => {
    return getBestFriend(friends);
  }, [friends]);

  // Get current user's rank
  const currentUserRank = useMemo<number | null>(() => {
    if (!currentUsername) return null;

    const currentUserEntry = leaderboard.find((entry) => entry.username === currentUsername);

    return currentUserEntry ? currentUserEntry.rankPosition : null;
  }, [leaderboard, currentUsername]);

  /**
   * Force refresh leaderboard
   */
  const refresh = useCallback(() => {
    setLoading(true);
    // Trigger re-calculation by updating state
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  // Auto-refresh when friends change
  useEffect(() => {
    if (autoUpdate) {
      refresh();
    }
  }, [friends, autoUpdate, refresh]);

  return {
    leaderboard,
    bestFriend,
    currentUserRank,
    loading,
    refresh,
  };
}

/**
 * Check if a friend is inactive (no activity in past 7 days)
 */
function checkIfInactive(friend: Friend): boolean {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return friend.lastActivityTimestamp < sevenDaysAgo;
}
