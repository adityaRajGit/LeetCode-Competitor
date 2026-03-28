/**
 * BarChart Component
 *
 * A simple bar chart implementation with NeoBrutalism styling.
 * Used for displaying weekly comparisons and categorical data.
 */

import React from 'react';
import styles from './BarChart.module.css';

export interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
  title?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  showValues?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 300,
  title,
  yAxisLabel,
  xAxisLabel,
  showValues = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}

      {yAxisLabel && (
        <div className={styles.yAxisLabel}>
          <span>{yAxisLabel}</span>
        </div>
      )}

      <div className={styles.chartWrapper} style={{ height: `${height}px` }}>
        <div className={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 100;
            const barColor = item.color || 'var(--color-primary)';

            return (
              <div key={index} className={styles.barWrapper}>
                <div className={styles.barColumn}>
                  {showValues && item.value > 0 && (
                    <span className={styles.valueLabel}>{item.value}</span>
                  )}
                  <div
                    className={styles.bar}
                    style={{
                      height: `${barHeight}%`,
                      backgroundColor: barColor,
                    }}
                    role="img"
                    aria-label={`${item.label}: ${item.value}`}
                    title={`${item.label}: ${item.value}`}
                  >
                    <div className={styles.barBorder} />
                  </div>
                </div>
                <span className={styles.label}>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Y-axis grid lines */}
        <div className={styles.gridLines}>
          {[0, 25, 50, 75, 100].map((value) => (
            <div key={value} className={styles.gridLine} style={{ bottom: `${value}%` }} />
          ))}
        </div>
      </div>

      {xAxisLabel && <p className={styles.axisLabel}>{xAxisLabel}</p>}
    </div>
  );
};

export default BarChart;
