import styles from './GlobalStatsWidget.module.css';

export interface GlobalStatsWidgetProps {
  todaySolved: number;
  currentStreak: number;
  totalPoints: number;
}

/**
 * Global stats widget for the top navigation
 * Shows today's progress, streak, and total points
 */
export function GlobalStatsWidget({ 
  todaySolved, 
  currentStreak, 
  totalPoints 
}: GlobalStatsWidgetProps) {
  return (
    <div className={styles.widget}>
      <div className={styles.stat}>
        <span className={styles.icon}>✅</span>
        <div className={styles.statContent}>
          <span className={styles.value}>{todaySolved}</span>
          <span className={styles.label}>Today</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.stat}>
        <span className={styles.icon}>🔥</span>
        <div className={styles.statContent}>
          <span className={styles.value}>{currentStreak}</span>
          <span className={styles.label}>Streak</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.stat}>
        <span className={styles.icon}>⭐</span>
        <div className={styles.statContent}>
          <span className={styles.value}>{totalPoints}</span>
          <span className={styles.label}>Points</span>
        </div>
      </div>
    </div>
  );
}
