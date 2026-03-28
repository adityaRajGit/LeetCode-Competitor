/**
 * WeeklyComparison Component
 *
 * Displays a bar chart comparing this week's performance with last week.
 */

import React from 'react';
import { BarChart } from '../../../../shared/components/Chart';
import styles from './WeeklyComparison.module.css';

interface WeeklyComparisonProps {
  thisWeek: number;
  lastWeek: number;
}

export const WeeklyComparison: React.FC<WeeklyComparisonProps> = ({ thisWeek, lastWeek }) => {
  const data = [
    {
      label: 'Last Week',
      value: lastWeek,
      color: 'var(--color-text-secondary)',
    },
    {
      label: 'This Week',
      value: thisWeek,
      color: 'var(--color-primary)',
    },
  ];

  const difference = thisWeek - lastWeek;
  const percentChange =
    lastWeek > 0 ? ((difference / lastWeek) * 100).toFixed(1) : thisWeek > 0 ? '∞' : '0';

  return (
    <div className={styles.container}>
      <BarChart
        data={data}
        title="Weekly Comparison"
        height={250}
        yAxisLabel="Problems"
        showValues
      />

      <div className={styles.summary}>
        {difference > 0 && (
          <p className={styles.positive}>
            📈 Up {difference} problem{difference !== 1 ? 's' : ''} ({percentChange}%)
          </p>
        )}
        {difference < 0 && (
          <p className={styles.negative}>
            📉 Down {Math.abs(difference)} problem{difference !== -1 ? 's' : ''} ({percentChange}%)
          </p>
        )}
        {difference === 0 && <p className={styles.neutral}>➡️ Same pace as last week</p>}
      </div>
    </div>
  );
};

export default WeeklyComparison;
