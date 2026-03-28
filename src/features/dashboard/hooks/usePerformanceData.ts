/**
 * usePerformanceData Hook
 *
 * Processes submission calendar data to generate performance insights:
 * - Daily solve trends (last 30 days)
 * - Weekly comparison (this week vs last week)
 * - Difficulty breakdown
 * - Win ratio against best friend
 */

import { useMemo } from 'react';
import { SubmissionCalendar } from '../types';

interface PerformanceData {
  dailyTrend: Array<{ label: string; value: number }>;
  weeklyComparison: {
    thisWeek: number;
    lastWeek: number;
  };
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
  winRatio: number | null; // null if no friend to compare
}

interface UsePerformanceDataProps {
  submissionCalendar?: SubmissionCalendar;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  friendTotalSolved?: number; // For win ratio calculation
}

export const usePerformanceData = ({
  submissionCalendar = {},
  easySolved,
  mediumSolved,
  hardSolved,
  friendTotalSolved,
}: UsePerformanceDataProps): PerformanceData => {
  return useMemo(() => {
    // Get current date at midnight UTC
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Calculate daily trend (last 30 days)
    const dailyTrend: Array<{ label: string; value: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const timestamp = Math.floor(date.getTime() / 1000).toString();

      const value = submissionCalendar[timestamp] || 0;
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      dailyTrend.push({ label, value });
    }

    // Calculate weekly comparison
    let thisWeek = 0;
    let lastWeek = 0;

    for (let i = 0; i < 7; i++) {
      const thisWeekDate = new Date(now);
      thisWeekDate.setDate(thisWeekDate.getDate() - i);
      const thisWeekTimestamp = Math.floor(thisWeekDate.getTime() / 1000).toString();
      thisWeek += submissionCalendar[thisWeekTimestamp] || 0;

      const lastWeekDate = new Date(now);
      lastWeekDate.setDate(lastWeekDate.getDate() - (i + 7));
      const lastWeekTimestamp = Math.floor(lastWeekDate.getTime() / 1000).toString();
      lastWeek += submissionCalendar[lastWeekTimestamp] || 0;
    }

    // Difficulty breakdown
    const difficultyBreakdown = {
      easy: easySolved,
      medium: mediumSolved,
      hard: hardSolved,
    };

    // Win ratio calculation
    const totalSolved = easySolved + mediumSolved + hardSolved;
    let winRatio: number | null = null;

    if (friendTotalSolved !== undefined && totalSolved + friendTotalSolved > 0) {
      winRatio = (totalSolved / (totalSolved + friendTotalSolved)) * 100;
    }

    return {
      dailyTrend,
      weeklyComparison: { thisWeek, lastWeek },
      difficultyBreakdown,
      winRatio,
    };
  }, [submissionCalendar, easySolved, mediumSolved, hardSolved, friendTotalSolved]);
};

export default usePerformanceData;
