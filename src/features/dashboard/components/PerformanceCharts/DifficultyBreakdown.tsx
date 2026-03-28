/**
 * DifficultyBreakdown Component
 *
 * Displays a pie chart showing the distribution of problems solved by difficulty.
 */

import React from 'react';
import { DifficultyPieChart } from '../../../../shared/components/Chart';
import styles from './DifficultyBreakdown.module.css';

interface DifficultyBreakdownProps {
  easy: number;
  medium: number;
  hard: number;
}

export const DifficultyBreakdown: React.FC<DifficultyBreakdownProps> = ({ easy, medium, hard }) => {
  return (
    <div className={styles.container}>
      <DifficultyPieChart
        easy={easy}
        medium={medium}
        hard={hard}
        size={220}
        title="Difficulty Breakdown"
      />
    </div>
  );
};

export default DifficultyBreakdown;
