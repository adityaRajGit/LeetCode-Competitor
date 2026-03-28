/**
 * DailySolveTrend Component
 *
 * Displays a line chart showing daily problem-solving activity over the last 30 days.
 */

import React from 'react';
import { LineChart } from '../../../../shared/components/Chart';
import styles from './DailySolveTrend.module.css';

interface DailySolveTrendProps {
  data: Array<{ label: string; value: number }>;
}

export const DailySolveTrend: React.FC<DailySolveTrendProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      <LineChart
        data={data}
        title="Daily Solve Trend"
        height={250}
        color="var(--color-primary)"
        yAxisLabel="Problems Solved"
        xAxisLabel="Last 30 Days"
      />
    </div>
  );
};

export default DailySolveTrend;
