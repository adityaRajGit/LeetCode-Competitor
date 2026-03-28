/**
 * DifficultyPieChart Component
 *
 * A donut chart for displaying problem difficulty breakdown.
 * Styled with NeoBrutalism design principles.
 */

import React from 'react';
import styles from './DifficultyPieChart.module.css';

export interface DifficultyPieChartProps {
  easy: number;
  medium: number;
  hard: number;
  size?: number;
  title?: string;
}

export const DifficultyPieChart: React.FC<DifficultyPieChartProps> = ({
  easy,
  medium,
  hard,
  size = 200,
  title,
}) => {
  const total = easy + medium + hard;

  if (total === 0) {
    return (
      <div className={styles.container}>
        {title && <h3 className={styles.title}>{title}</h3>}
        <div className={styles.emptyState}>
          <p>No problems solved yet</p>
        </div>
      </div>
    );
  }

  // Calculate percentages
  const easyPercent = (easy / total) * 100;
  const mediumPercent = (medium / total) * 100;
  const hardPercent = (hard / total) * 100;

  // SVG circle properties
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 20;

  // Calculate stroke dash offsets for each segment
  const easyDash = (easyPercent / 100) * circumference;
  const mediumDash = (mediumPercent / 100) * circumference;
  const hardDash = (hardPercent / 100) * circumference;

  // Starting positions (rotate to start at top)
  const easyOffset = 0;
  const mediumOffset = easyDash;
  const hardOffset = easyDash + mediumDash;

  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}

      <div className={styles.chartWrapper}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={styles.svg}
          role="img"
          aria-label={`Difficulty breakdown: ${easyPercent.toFixed(1)}% easy, ${mediumPercent.toFixed(1)}% medium, ${hardPercent.toFixed(1)}% hard`}
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--color-surface)"
            strokeWidth={strokeWidth}
          />

          {/* Rotate to start at top (-90 degrees) */}
          <g transform="rotate(-90 50 50)">
            {/* Easy segment (green) */}
            {easy > 0 && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="var(--color-success, #10b981)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${easyDash} ${circumference}`}
                strokeDashoffset={-easyOffset}
                strokeLinecap="butt"
                className={styles.segment}
              >
                <title>
                  Easy: {easy} ({easyPercent.toFixed(1)}%)
                </title>
              </circle>
            )}

            {/* Medium segment (yellow) */}
            {medium > 0 && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="var(--color-warning, #f59e0b)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${mediumDash} ${circumference}`}
                strokeDashoffset={-mediumOffset}
                strokeLinecap="butt"
                className={styles.segment}
              >
                <title>
                  Medium: {medium} ({mediumPercent.toFixed(1)}%)
                </title>
              </circle>
            )}

            {/* Hard segment (red) */}
            {hard > 0 && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="var(--color-danger, #ef4444)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${hardDash} ${circumference}`}
                strokeDashoffset={-hardOffset}
                strokeLinecap="butt"
                className={styles.segment}
              >
                <title>
                  Hard: {hard} ({hardPercent.toFixed(1)}%)
                </title>
              </circle>
            )}
          </g>

          {/* Center text - total count */}
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
            className={styles.centerText}
          >
            <tspan fontSize="20" fontWeight="900">
              {total}
            </tspan>
            <tspan x="50" dy="12" fontSize="8" fontWeight="700">
              SOLVED
            </tspan>
          </text>
        </svg>

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: 'var(--color-success, #10b981)' }}
            />
            <span className={styles.legendLabel}>
              Easy: <strong>{easy}</strong> ({easyPercent.toFixed(1)}%)
            </span>
          </div>
          <div className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: 'var(--color-warning, #f59e0b)' }}
            />
            <span className={styles.legendLabel}>
              Medium: <strong>{medium}</strong> ({mediumPercent.toFixed(1)}%)
            </span>
          </div>
          <div className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: 'var(--color-danger, #ef4444)' }}
            />
            <span className={styles.legendLabel}>
              Hard: <strong>{hard}</strong> ({hardPercent.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultyPieChart;
