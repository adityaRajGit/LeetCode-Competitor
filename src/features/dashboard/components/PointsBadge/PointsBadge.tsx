import styles from './PointsBadge.module.css';

export interface PointsBadgeProps {
  points: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
  showLabel?: boolean;
}

export default function PointsBadge({
  points,
  size = 'medium',
  variant = 'primary',
  showLabel = true,
}: PointsBadgeProps) {
  const formattedPoints = points.toLocaleString();

  return (
    <div className={`${styles.badge} ${styles[size]} ${styles[variant]}`}>
      <span className={styles.value}>{formattedPoints}</span>
      {showLabel && <span className={styles.label}>pts</span>}
    </div>
  );
}
