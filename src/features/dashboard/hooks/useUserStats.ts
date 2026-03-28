import { useState, useEffect, useCallback } from 'react';
import type { LeetCodeUser, Badge } from '@/features/dashboard/types';
import { fetchUserStats } from '@/features/dashboard/services/leetcodeApi';
import { LocalStore } from '@/features/dashboard/services/storageManager';
import { isRateLimited, getRemainingCooldown, recordRequest } from '@/shared/utils/rateLimiter';
import { isCacheValid } from '@/shared/utils/cacheUtils';
import { awardNewBadges, getBadgeById } from '@/features/dashboard/services/badgeAwarder';

interface UseUserStatsResult {
  user: LeetCodeUser | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  cooldownRemaining: number;
  badges: Badge[];
  newBadges: Badge[];
}

/**
 * useUserStats Hook
 * Fetch and manage user LeetCode statistics with rate limiting and caching
 * Also manages badge awarding based on user achievements
 */
export function useUserStats(username: string | null): UseUserStatsResult {
  const [user, setUser] = useState<LeetCodeUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  // Load user stats
  const loadUserStats = useCallback(
    async (forceRefresh: boolean = false) => {
      if (!username) {
        setUser(null);
        setError(null);
        return;
      }

      // Check rate limiting
      if (isRateLimited(username) && !forceRefresh) {
        const remaining = getRemainingCooldown(username);
        setCooldownRemaining(Math.ceil(remaining / 1000));

        // Try to load from cache
        const cachedUser = LocalStore.getCachedUser(username);
        if (cachedUser) {
          setUser(cachedUser);
          setError(
            `Rate limited. Using cached data. Refresh available in ${Math.ceil(remaining / 1000)}s`
          );
        } else {
          setError(
            `Rate limited. Please wait ${Math.ceil(remaining / 1000)} seconds before refreshing.`
          );
        }
        return;
      }

      // Check cache first
      if (!forceRefresh) {
        const cachedUser = LocalStore.getCachedUser(username);
        if (cachedUser && isCacheValid(cachedUser.cacheExpiry)) {
          setUser(cachedUser);
          setError(null);
          setCooldownRemaining(0);
          return;
        }
      }

      // Fetch from API
      setLoading(true);
      setError(null);
      setCooldownRemaining(0);

      try {
        const userData = await fetchUserStats(username);
        setUser(userData);
        setError(null);

        // Cache the result
        LocalStore.setCachedUser(userData);

        // Record request for rate limiting
        recordRequest(username);

        // Check and award new badges
        const badgeData = LocalStore.getBadges();
        const existingBadges: Badge[] = Object.entries(badgeData)
          .map(([badgeId, earnedAt]) => {
            const badgeDef = getBadgeById(badgeId);
            return badgeDef ? ({ ...badgeDef, earnedAt } as Badge) : null;
          })
          .filter((b): b is Badge => b !== null);

        const newlyEarnedBadges = awardNewBadges(userData, existingBadges);

        // Save newly earned badges to storage
        newlyEarnedBadges.forEach((badge) => {
          LocalStore.awardBadge(badge.id);
        });

        // Update badge state
        setBadges([...existingBadges, ...newlyEarnedBadges]);
        setNewBadges(newlyEarnedBadges);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user statistics';
        setError(errorMessage);

        // Try to load from cache as fallback
        const cachedUser = LocalStore.getCachedUser(username);
        if (cachedUser) {
          setUser(cachedUser);
          setError(`${errorMessage}. Showing cached data.`);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    },
    [username]
  );

  // Initial load
  useEffect(() => {
    loadUserStats();
  }, [loadUserStats]);

  // Load badges from storage
  useEffect(() => {
    if (username) {
      const badgeData = LocalStore.getBadges();
      const existingBadges: Badge[] = Object.entries(badgeData)
        .map(([badgeId, earnedAt]) => {
          const badgeDef = getBadgeById(badgeId);
          return badgeDef ? ({ ...badgeDef, earnedAt } as Badge) : null;
        })
        .filter((b): b is Badge => b !== null);
      setBadges(existingBadges);
    } else {
      setBadges([]);
    }
  }, [username]);

  // Update cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setInterval(() => {
        if (username && isRateLimited(username)) {
          const remaining = getRemainingCooldown(username);
          setCooldownRemaining(Math.ceil(remaining / 1000));
        } else {
          setCooldownRemaining(0);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [cooldownRemaining, username]);

  // Refresh function
  const refresh = useCallback(async () => {
    await loadUserStats(true);
  }, [loadUserStats]);

  return {
    user,
    loading,
    error,
    refresh,
    cooldownRemaining,
    badges,
    newBadges,
  };
}
