/**
 * LineChart Component
 *
 * A simple line chart implementation with NeoBrutalism styling.
 * Used for displaying daily solve trends and time-series data.
 * Optimized with React.memo and useMemo for performance.
 */

import React, { useMemo } from 'react';
import styles from './LineChart.module.css';

export interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  height?: number;
  color?: string;
  title?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
}

const LineChartComponent: React.FC<LineChartProps> = ({
  data,
  height = 200,
  color = 'var(--color-primary)',
  title,
  yAxisLabel,
  xAxisLabel,
}) => {
  // Use a wider SVG coordinate space so data points are properly spaced
  const svgWidth = 800;

  // Memoize chart calculations
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    // Calculate min/max for scaling
    const values = data.map((d) => d.value);
    const maxValue = Math.max(...values, 1);
    const minValue = Math.min(...values, 0);
    const range = maxValue - minValue || 1;

    // Calculate points for the polyline
    const padding = 40;
    const chartWidth = svgWidth - padding * 2;
    const chartHeight = height - padding * 2;
    const stepX = chartWidth / (data.length - 1 || 1);

    const points = data
      .map((point, index) => {
        const x = padding + stepX * index;
        const normalizedValue = (point.value - minValue) / range;
        const y = height - padding - normalizedValue * chartHeight;
        return `${x},${y}`;
      })
      .join(' ');

    return {
      points,
      maxValue,
      minValue,
      range,
      padding,
      chartWidth,
      chartHeight,
      stepX,
    };
  }, [data, height]);

  if (!chartData) {
    return (
      <div className={styles.emptyState}>
        <p>No data available</p>
      </div>
    );
  }

  const { points, minValue, range, padding, chartHeight, stepX } = chartData;

  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}

      <div className={styles.chartWrapper}>
        <svg
          viewBox={`0 0 ${svgWidth} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className={styles.svg}
          role="img"
          aria-label={title || 'Line chart'}
        >
          {/* Grid lines */}
          <g className={styles.gridLines}>
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1={padding}
                y1={(y * height) / 100}
                x2={svgWidth - padding}
                y2={(y * height) / 100}
                stroke="var(--color-border)"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}
          </g>

          {/* Area fill under line */}
          <polygon
            points={`${padding},${height - padding} ${points} ${padding + stepX * (data.length - 1)},${height - padding}`}
            fill={color}
            opacity="0.1"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.line}
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = padding + stepX * index;
            const normalizedValue = (point.value - minValue) / range;
            const y = height - padding - normalizedValue * chartHeight;

            return (
              <g key={index}>
                <circle cx={x} cy={y} r="4" fill={color} className={styles.point} />
                <title>{`${point.label}: ${point.value}`}</title>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Axis labels */}
      <div className={styles.labels}>
        <div className={styles.xAxis}>
          {data.map((point, index) => {
            // Show only every nth label to avoid crowding
            const showLabel = data.length <= 7 || index % Math.ceil(data.length / 7) === 0;
            return showLabel ? (
              <span key={index} className={styles.xLabel}>
                {point.label}
              </span>
            ) : null;
          })}
        </div>
        {xAxisLabel && <p className={styles.axisLabel}>{xAxisLabel}</p>}
      </div>

      {yAxisLabel && (
        <div className={styles.yAxisLabel}>
          <span>{yAxisLabel}</span>
        </div>
      )}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export const LineChart = React.memo(LineChartComponent);
export default LineChart;
