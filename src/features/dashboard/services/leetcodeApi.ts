import type { LeetCodeUser, SubmissionCalendar } from '@/features/dashboard/types';
import { calculateCacheExpiry } from '@/shared/utils/cacheUtils';
import {
  calculateStreak,
  calculateTodaySolved,
  calculateWeeklySolved
} from '@/shared/utils/dateUtils';
import { calculatePoints } from '@/features/dashboard/services/pointsCalculator';

/**
 * LeetCode API Service
 * External API integration for fetching user statistics
 */

const API_BASE_URL = 'https://leetcode-stats-api.herokuapp.com';

interface LeetCodeAPIResponse {
  status: string;
  message?: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: SubmissionCalendar;
}

/**
 * Fetch user statistics from LeetCode API
 * @param username - LeetCode username
 * @returns Promise<LeetCodeUser> - User statistics with calculated metrics
 * @throws Error if username not found or API error
 */
export async function fetchUserStats(username: string): Promise<LeetCodeUser> {
  if (!username || username.trim() === '') {
    throw new Error('Username is required');
  }

  const url = `${API_BASE_URL}/${encodeURIComponent(username.trim())}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Username "${username}" not found on LeetCode`);
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status >= 500) {
        throw new Error('LeetCode API service unavailable. Please try again later.');
      }
      throw new Error(`Failed to fetch user stats: ${response.statusText}`);
    }

    const data: LeetCodeAPIResponse = await response.json();

    // Validate response
    if (data.status === 'error') {
      throw new Error(data.message || 'Failed to fetch user statistics');
    }

    // Transform API response to LeetCodeUser
    return transformApiResponse(username, data);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error: Failed to connect to LeetCode API');
  }
}

/**
 * Transform API response to LeetCodeUser with calculated metrics
 */
function transformApiResponse(username: string, data: LeetCodeAPIResponse): LeetCodeUser {
  const submissionCalendar = data.submissionCalendar || {};
  
  // Calculate derived metrics
  const currentStreak = calculateStreak(submissionCalendar);
  const todaySolved = calculateTodaySolved(submissionCalendar);
  const weeklySolved = calculateWeeklySolved(submissionCalendar);

  const userWithoutPoints: LeetCodeUser = {
    username,
    totalSolved: data.totalSolved || 0,
    easySolved: data.easySolved || 0,
    mediumSolved: data.mediumSolved || 0,
    hardSolved: data.hardSolved || 0,
    ranking: data.ranking || 0,
    acceptanceRate: data.acceptanceRate || 0,
    contributionPoints: data.contributionPoints || 0,
    reputation: data.reputation || 0,
    submissionCalendar,
    currentStreak,
    todaySolved,
    weeklySolved,
    totalPoints: 0,
    lastFetched: Date.now(),
    cacheExpiry: calculateCacheExpiry(),
  };

  // Calculate actual points based on stats
  const { totalPoints } = calculatePoints(userWithoutPoints);
  return { ...userWithoutPoints, totalPoints };
}

/**
 * Validate username format
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  const trimmed = username.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Username cannot be empty' };
  }

  if (trimmed.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (trimmed.length > 30) {
    return { valid: false, error: 'Username must be less than 30 characters' };
  }

  // LeetCode usernames: alphanumeric, hyphens, underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
  }

  return { valid: true };
}
