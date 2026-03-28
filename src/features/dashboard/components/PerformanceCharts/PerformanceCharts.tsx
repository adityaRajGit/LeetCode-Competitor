/**
 * PerformanceCharts Container Component
 *
 * Combines all performance visualizations:
 * - Daily solve trend
 * - Weekly comparison
 * - Difficulty breakdown
 * - Win ratio display
 */

import React from 'react';
import { usePerformanceData } from '../../hooks/usePerformanceData';
import { DailySolveTrend } from './DailySolveTrend';
import { WeeklyComparison } from './WeeklyComparison';
import { DifficultyBreakdown } from './DifficultyBreakdown';
import { WinRatioDisplay } from './WinRatioDisplay';
import styles from './PerformanceCharts.module.css';
import type { LeetCodeUser } from '../../types';

interface PerformanceChartsProps {
  user: LeetCodeUser;
  bestFriend?: LeetCodeUser | null;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ user, bestFriend }) => {
  const performanceData = usePerformanceData({
    submissionCalendar: user.submissionCalendar,
    easySolved: user.easySolved,
    mediumSolved: user.mediumSolved,
    hardSolved: user.hardSolved,
    friendTotalSolved: bestFriend?.totalSolved,
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>📊 Performance Analytics</h2>

      <div className={styles.grid}>
        {/* Daily Trend - Full Width */}
        <div className={styles.fullWidth}>
          <DailySolveTrend data={performanceData.dailyTrend} />
        </div>

        {/* Weekly Comparison - Half Width */}
        <div className={styles.halfWidth}>
          <WeeklyComparison
            thisWeek={performanceData.weeklyComparison.thisWeek}
            lastWeek={performanceData.weeklyComparison.lastWeek}
          />
        </div>

        {/* Difficulty Breakdown - Half Width */}
        <div className={styles.halfWidth}>
          <DifficultyBreakdown
            easy={performanceData.difficultyBreakdown.easy}
            medium={performanceData.difficultyBreakdown.medium}
            hard={performanceData.difficultyBreakdown.hard}
          />
        </div>

        {/* Win Ratio - Full Width (if friend exists) */}
        {bestFriend && (
          <div className={styles.fullWidth}>
            <WinRatioDisplay
              winRatio={performanceData.winRatio}
              username={user.username}
              friendUsername={bestFriend.username}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceCharts;
