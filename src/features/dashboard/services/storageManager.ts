import type { Friend, LeetCodeUser, ActivityEvent } from '@/features/dashboard/types';
import type { FriendSnapshot } from '@/features/dashboard/services/activityDetector';

/**
 * Storage Manager Service
 * Session and Local storage abstraction
 */

// ===== Session Storage (Temporary Data) =====

const SESSION_KEYS = {
  FRIENDS: 'leetcode-friends',
  PREVIOUS_STATS: 'leetcode-previous-stats',
  ACTIVITY_FEED: 'leetcode-activity-feed',
} as const;

/**
 * Session Store - Temporary data (resets on page refresh)
 */
export const SessionStore = {
  /**
   * Get friends list from session storage
   */
  getFriends(): Friend[] {
    try {
      const data = sessionStorage.getItem(SESSION_KEYS.FRIENDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading friends from session storage:', error);
      return [];
    }
  },

  /**
   * Set friends list in session storage
   */
  setFriends(friends: Friend[]): void {
    try {
      sessionStorage.setItem(SESSION_KEYS.FRIENDS, JSON.stringify(friends));
    } catch (error) {
      console.error('Error saving friends to session storage:', error);
    }
  },

  /**
   * Add a friend to session storage
   */
  addFriend(friend: Friend): void {
    const friends = this.getFriends();
    // Check for duplicates
    if (!friends.find((f) => f.username === friend.username)) {
      friends.push(friend);
      this.setFriends(friends);
    }
  },

  /**
   * Remove a friend from session storage
   */
  removeFriend(username: string): void {
    const friends = this.getFriends();
    const filtered = friends.filter((f) => f.username !== username);
    this.setFriends(filtered);
  },

  /**
   * Get a specific friend by username
   */
  getFriend(username: string): Friend | null {
    const friends = this.getFriends();
    return friends.find((f) => f.username === username) || null;
  },

  /**
   * Update a friend's data
   */
  updateFriend(username: string, updates: Partial<Friend>): void {
    const friends = this.getFriends();
    const index = friends.findIndex((f) => f.username === username);
    if (index !== -1) {
      friends[index] = { ...friends[index], ...updates };
      this.setFriends(friends);
    }
  },

  /**
   * Get previous stats snapshot
   */
  getPreviousStats(): Record<string, FriendSnapshot> {
    try {
      const data = sessionStorage.getItem(SESSION_KEYS.PREVIOUS_STATS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading previous stats from session storage:', error);
      return {};
    }
  },

  /**
   * Set previous stats snapshot
   */
  setPreviousStats(stats: Record<string, FriendSnapshot>): void {
    try {
      sessionStorage.setItem(SESSION_KEYS.PREVIOUS_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving previous stats to session storage:', error);
    }
  },

  /**
   * Get activity feed
   */
  getActivityFeed(): ActivityEvent[] {
    try {
      const data = sessionStorage.getItem(SESSION_KEYS.ACTIVITY_FEED);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading activity feed from session storage:', error);
      return [];
    }
  },

  /**
   * Set activity feed
   */
  setActivityFeed(events: ActivityEvent[]): void {
    try {
      sessionStorage.setItem(SESSION_KEYS.ACTIVITY_FEED, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving activity feed to session storage:', error);
    }
  },

  /**
   * Add activity event
   */
  addActivity(event: ActivityEvent): void {
    const feed = this.getActivityFeed();
    feed.unshift(event); // Add to beginning
    // Keep only last 50 events
    const trimmed = feed.slice(0, 50);
    this.setActivityFeed(trimmed);
  },

  /**
   * Clear old activities (older than 7 days)
   */
  clearOldActivities(): void {
    const feed = this.getActivityFeed();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const filtered = feed.filter((event) => event.timestamp > sevenDaysAgo);
    this.setActivityFeed(filtered);
  },

  /**
   * Clear all session storage data
   */
  clear(): void {
    Object.values(SESSION_KEYS).forEach((key) => {
      sessionStorage.removeItem(key);
    });
  },
};

// ===== Local Storage (Persistent Data) =====

const LOCAL_KEYS = {
  THEME: 'theme',
  USERNAME: 'leetcode-username',
  USER_CACHE: 'leetcode-user-cache-', // Prefix for user caches
  BADGES: 'leetcode-badges',
  RANK_HISTORY: 'leetcode-rank-history-', // Prefix for rank history tracking
} as const;

/**
 * Local Store - Persistent data across sessions
 */
export const LocalStore = {
  /**
   * Get theme
   */
  getTheme(): 'light' | 'dark' {
    try {
      const theme = localStorage.getItem(LOCAL_KEYS.THEME);
      return theme === 'dark' ? 'dark' : 'light';
    } catch (error) {
      console.error('Error reading theme from local storage:', error);
      return 'light';
    }
  },

  /**
   * Set theme
   */
  setTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem(LOCAL_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error saving theme to local storage:', error);
    }
  },

  /**
   * Get current username
   */
  getUsername(): string | null {
    try {
      return localStorage.getItem(LOCAL_KEYS.USERNAME);
    } catch (error) {
      console.error('Error reading username from local storage:', error);
      return null;
    }
  },

  /**
   * Set current username
   */
  setUsername(username: string): void {
    try {
      localStorage.setItem(LOCAL_KEYS.USERNAME, username);
    } catch (error) {
      console.error('Error saving username to local storage:', error);
    }
  },

  /**
   * Get cached user data
   */
  getCachedUser(username: string): LeetCodeUser | null {
    try {
      const key = LOCAL_KEYS.USER_CACHE + username;
      const data = localStorage.getItem(key);
      if (!data) return null;

      const user: LeetCodeUser = JSON.parse(data);

      // Check cache validity
      if (user.cacheExpiry && Date.now() < user.cacheExpiry) {
        return user;
      }

      // Cache expired
      localStorage.removeItem(key);
      return null;
    } catch (error) {
      console.error(`Error reading cached user ${username}:`, error);
      return null;
    }
  },

  /**
   * Set cached user data
   */
  setCachedUser(user: LeetCodeUser): void {
    try {
      const key = LOCAL_KEYS.USER_CACHE + user.username;
      localStorage.setItem(key, JSON.stringify(user));
    } catch (error) {
      console.error(`Error caching user ${user.username}:`, error);
    }
  },

  /**
   * Clear all user caches
   */
  clearUserCaches(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(LOCAL_KEYS.USER_CACHE)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing user caches:', error);
    }
  },

  /**
   * Get badges
   */
  getBadges(): Record<string, number> {
    try {
      const data = localStorage.getItem(LOCAL_KEYS.BADGES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading badges from local storage:', error);
      return {};
    }
  },

  /**
   * Award a badge
   */
  awardBadge(badgeId: string): void {
    try {
      const badges = this.getBadges();
      if (!badges[badgeId]) {
        badges[badgeId] = Date.now();
        localStorage.setItem(LOCAL_KEYS.BADGES, JSON.stringify(badges));
      }
    } catch (error) {
      console.error(`Error awarding badge ${badgeId}:`, error);
    }
  },

  /**
   * Check if badge is earned
   */
  hasBadge(badgeId: string): boolean {
    const badges = this.getBadges();
    return !!badges[badgeId];
  },

  /**
   * Get all earned badges as an array
   * Returns array of { id, earnedAt } objects
   */
  getEarnedBadges(): Array<{ id: string; earnedAt: number }> {
    try {
      const badges = this.getBadges();
      return Object.entries(badges).map(([id, earnedAt]) => ({ id, earnedAt }));
    } catch (error) {
      console.error('Error getting earned badges:', error);
      return [];
    }
  },

  /**
   * Award multiple badges at once
   */
  awardBadges(badgeIds: string[]): void {
    try {
      const badges = this.getBadges();
      const now = Date.now();
      let updated = false;

      badgeIds.forEach((badgeId) => {
        if (!badges[badgeId]) {
          badges[badgeId] = now;
          updated = true;
        }
      });

      if (updated) {
        localStorage.setItem(LOCAL_KEYS.BADGES, JSON.stringify(badges));
      }
    } catch (error) {
      console.error('Error awarding badges:', error);
    }
  },

  /**
   * Get rank history for a user (last 7 days)
   */
  getRankHistory(username: string): number[] {
    try {
      const key = LOCAL_KEYS.RANK_HISTORY + username;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading rank history for ${username}:`, error);
      return [];
    }
  },

  /**
   * Update rank history for a user
   * Keeps only last 7 days of rank data
   */
  updateRankHistory(username: string, rank: number): void {
    try {
      const key = LOCAL_KEYS.RANK_HISTORY + username;
      const history = this.getRankHistory(username);

      // Add new rank at the end
      history.push(rank);

      // Keep only last 7 entries
      const trimmed = history.slice(-7);

      localStorage.setItem(key, JSON.stringify(trimmed));
    } catch (error) {
      console.error(`Error updating rank history for ${username}:`, error);
    }
  },

  /**
   * Clear rank history for a user
   */
  clearRankHistory(username: string): void {
    try {
      const key = LOCAL_KEYS.RANK_HISTORY + username;
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing rank history for ${username}:`, error);
    }
  },
};
