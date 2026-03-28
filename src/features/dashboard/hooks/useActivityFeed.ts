import { useState, useEffect, useCallback } from 'react';
import type { ActivityEvent, Friend } from '@/features/dashboard/types';
import { SessionStore } from '@/features/dashboard/services/storageManager';
import { detectActivities, type FriendSnapshot } from '@/features/dashboard/services/activityDetector';

export interface UseActivityFeedOptions {
  friends: Friend[];
  maxEvents?: number;
  autoCleanup?: boolean;  // Auto-remove events older than 7 days
}

export interface UseActivityFeedReturn {
  activities: ActivityEvent[];
  loading: boolean;
  refresh: () => void;
  clearAll: () => void;
}

/**
 * Custom hook for managing activity feed
 * Tracks friend stat changes and generates activity events
 */
export function useActivityFeed({
  friends,
  maxEvents = 10,
  autoCleanup = true,
}: UseActivityFeedOptions): UseActivityFeedReturn {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Load activities from storage
   */
  const loadActivities = useCallback(() => {
    const feed = SessionStore.getActivityFeed();
    setActivities(feed.slice(0, maxEvents));
  }, [maxEvents]);

  /**
   * Refresh activities by detecting changes in friend stats
   */
  const refresh = useCallback(() => {
    setLoading(true);
    
    // Get previous stats snapshots
    const previousStats = SessionStore.getPreviousStats();
    
    // Detect changes for each friend
    friends.forEach((friend) => {
      const previous = previousStats[friend.username];
      
      if (previous) {
        // Create snapshot from previous stats (use stored rankPosition, not current)
        const oldSnapshot: FriendSnapshot = {
          username: previous.username,
          totalSolved: previous.totalSolved,
          currentStreak: previous.currentStreak,
          rankPosition: previous.rankPosition ?? friend.rankPosition,
          totalPoints: previous.totalPoints,
          lastFetched: previous.lastFetched,
        };
        
        // Detect activities
        const newEvents = detectActivities(oldSnapshot, friend);
        
        // Add new events to storage
        newEvents.forEach((event) => {
          SessionStore.addActivity(event);
        });
      }
    });
    
    // Update previous stats with current friend data
    const currentStats: Record<string, FriendSnapshot> = {};
    friends.forEach((friend) => {
      currentStats[friend.username] = {
        username: friend.username,
        totalSolved: friend.totalSolved,
        currentStreak: friend.currentStreak,
        rankPosition: friend.rankPosition,
        totalPoints: friend.totalPoints,
        lastFetched: friend.lastFetched,
      };
    });
    SessionStore.setPreviousStats(currentStats);
    
    // Reload activities
    loadActivities();
    setLoading(false);
  }, [friends, loadActivities]);

  /**
   * Clear all activities
   */
  const clearAll = useCallback(() => {
    SessionStore.setActivityFeed([]);
    setActivities([]);
  }, []);

  /**
   * Auto-cleanup old activities (7+ days old)
   */
  useEffect(() => {
    if (autoCleanup) {
      SessionStore.clearOldActivities();
      loadActivities();
    }
  }, [autoCleanup, loadActivities]);

  /**
   * Load activities on mount
   */
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return {
    activities,
    loading,
    refresh,
    clearAll,
  };
}
