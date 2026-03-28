import { useState, useEffect, useCallback } from 'react';
import type { Friend } from '@/features/dashboard/types';
import { SessionStore } from '@/features/dashboard/services/storageManager';
import { fetchUserStats } from '@/features/dashboard/services/leetcodeApi';

/**
 * Custom hook for managing friends list
 * Handles adding, removing, and updating friends from session storage
 */
export function useFriendsList() {
  // Initialize friends from session storage
  const [friends, setFriends] = useState<Friend[]>(() => {
    return SessionStore.getFriends();
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync friends to session storage whenever they change
  useEffect(() => {
    SessionStore.setFriends(friends);
  }, [friends]);

  /**
   * Add a new friend by username
   */
  const addFriend = useCallback(
    async (username: string): Promise<Friend | null> => {
      setLoading(true);
      setError(null);

      try {
        // Check if friend already exists
        const existingFriend = friends.find((f) => f.username === username);
        if (existingFriend) {
          setError('Friend already added');
          setLoading(false);
          return null;
        }

        // Fetch user stats from API
        const userStats = await fetchUserStats(username);

        // Convert LeetCodeUser to Friend
        const newFriend: Friend = {
          ...userStats,
          rankPosition: friends.length + 1, // Temporary, will be recalculated by leaderboard
          previousRankPosition: null,
          trendDirection: 'stable',
          isInactive: false,
          isImproving: false,
          lastActivityTimestamp: Date.now(),
          addedAt: Date.now(),
        };

        // Add to friends list
        setFriends((prev) => [...prev, newFriend]);
        setLoading(false);
        return newFriend;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add friend';
        setError(errorMessage);
        setLoading(false);
        return null;
      }
    },
    [friends]
  );

  /**
   * Remove a friend by username
   */
  const removeFriend = useCallback((username: string) => {
    setFriends((prev) => prev.filter((f) => f.username !== username));
  }, []);

  /**
   * Update a friend's data
   */
  const updateFriend = useCallback((username: string, updates: Partial<Friend>) => {
    setFriends((prev) => prev.map((f) => (f.username === username ? { ...f, ...updates } : f)));
  }, []);

  /**
   * Refresh a friend's stats from API
   */
  const refreshFriend = useCallback(
    async (username: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const userStats = await fetchUserStats(username);

        updateFriend(username, {
          ...userStats,
          lastActivityTimestamp: Date.now(),
        });

        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to refresh friend stats';
        setError(errorMessage);
        setLoading(false);
      }
    },
    [updateFriend]
  );

  /**
   * Refresh all friends' stats
   */
  const refreshAllFriends = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Use functional updater to avoid stale closure over `friends`
      const currentFriends = SessionStore.getFriends();

      const refreshPromises = currentFriends.map(async (friend) => {
        try {
          const userStats = await fetchUserStats(friend.username);
          return {
            ...friend,
            ...userStats,
            lastActivityTimestamp: Date.now(),
          };
        } catch (err) {
          console.error(`Failed to refresh ${friend.username}:`, err);
          return friend; // Keep old data if refresh fails
        }
      });

      const refreshedFriends = await Promise.all(refreshPromises);
      setFriends(refreshedFriends);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh friends';
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  /**
   * Clear all friends
   */
  const clearFriends = useCallback(() => {
    setFriends([]);
  }, []);

  /**
   * Get a specific friend by username
   */
  const getFriend = useCallback(
    (username: string): Friend | undefined => {
      return friends.find((f) => f.username === username);
    },
    [friends]
  );

  return {
    friends,
    loading,
    error,
    addFriend,
    removeFriend,
    updateFriend,
    refreshFriend,
    refreshAllFriends,
    clearFriends,
    getFriend,
  };
}
