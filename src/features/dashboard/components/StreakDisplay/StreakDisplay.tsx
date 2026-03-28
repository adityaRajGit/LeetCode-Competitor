import styles from './StreakDisplay.module.css';

interface StreakDisplayProps {
  streakDays: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export default function StreakDisplay({ streakDays, size = 'medium', showLabel = true }: StreakDisplayProps) {
  const sizeClass = styles[size];

  return (
    <div className={`${styles.container} ${sizeClass}`}>
      <div className={styles.icon}>🔥</div>
      <div className={styles.content}>
        <div className={styles.number}>{streakDays}</div>
        {showLabel && <div className={styles.label}>day streak</div>}
      </div>
    </div>
  );
}
