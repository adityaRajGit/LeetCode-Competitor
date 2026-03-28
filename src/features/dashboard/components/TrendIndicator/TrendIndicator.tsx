import styles from './TrendIndicator.module.css';

export interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'stable';
  size?: 'small' | 'medium' | 'large';
}

/**
 * Trend indicator component
 * Shows rank change direction with visual arrow
 */
export function TrendIndicator({ trend, size = 'medium' }: TrendIndicatorProps) {
  const sizeClass = styles[size];

  if (trend === 'stable') {
    return (
      <span 
        className={`${styles.indicator} ${styles.stable} ${sizeClass}`}
        aria-label="Rank unchanged"
        title="Rank unchanged"
      >
        ▬
      </span>
    );
  }

  if (trend === 'up') {
    return (
      <span 
        className={`${styles.indicator} ${styles.up} ${sizeClass}`}
        aria-label="Rank improved"
        title="Rank improved"
      >
        ▲
      </span>
    );
  }

  return (
    <span 
      className={`${styles.indicator} ${styles.down} ${sizeClass}`}
      aria-label="Rank decreased"
      title="Rank decreased"
    >
      ▼
    </span>
  );
}
