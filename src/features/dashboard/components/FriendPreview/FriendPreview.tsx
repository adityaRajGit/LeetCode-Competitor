import { Card } from '@/shared/components/Card';
import type { LeetCodeUser } from '@/features/dashboard/types';
import { getTotalPoints } from '@/features/dashboard/services/pointsCalculator';
import styles from './FriendPreview.module.css';

export interface FriendPreviewProps {
  user: LeetCodeUser;
  onAdd: () => void;
  onCancel: () => void;
}

/**
 * Friend preview component
 * Shows friend stats before adding to leaderboard
 */
export function FriendPreview({ user, onAdd, onCancel }: FriendPreviewProps) {
  const totalPoints = getTotalPoints(user);

  return (
    <div className={styles.preview}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <h3 className={styles.username}>{user.username}</h3>
          <p className={styles.rank}>Rank #{user.ranking.toLocaleString()}</p>
        </div>
      </div>

      <div className={styles.stats}>
        <Card>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Solved</span>
              <span className={styles.statValue}>{user.totalSolved}</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Easy</span>
              <span className={`${styles.statValue} ${styles.easy}`}>
                {user.easySolved}
              </span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Medium</span>
              <span className={`${styles.statValue} ${styles.medium}`}>
                {user.mediumSolved}
              </span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Hard</span>
              <span className={`${styles.statValue} ${styles.hard}`}>
                {user.hardSolved}
              </span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Current Streak</span>
              <span className={styles.statValue}>
                🔥 {user.currentStreak} days
              </span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Points</span>
              <span className={`${styles.statValue} ${styles.points}`}>
                ⭐ {totalPoints}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.actions}>
        <button className={styles.secondaryButton} onClick={onCancel}>
          Cancel
        </button>
        <button className={styles.primaryButton} onClick={onAdd}>
          <span className={styles.buttonIcon}>⚔️</span>
          <span>Add to Leaderboard</span>
        </button>
      </div>
    </div>
  );
}
