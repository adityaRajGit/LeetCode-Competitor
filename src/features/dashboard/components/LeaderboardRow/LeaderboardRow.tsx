import React from 'react';
import { TrendIndicator } from '../TrendIndicator';
import { BadgeIcon } from '../BadgeDisplay';
import type { LeaderboardEntry } from '@/features/dashboard/types';
import styles from './LeaderboardRow.module.css';

export interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
  onRemove?: (_username: string) => void;
}

/**
 * Leaderboard row component
 * Displays a single friend's stats in the leaderboard
 * Optimized with React.memo to prevent unnecessary re-renders
 */
const LeaderboardRowComponent = ({
  entry,
  isCurrentUser = false,
  onRemove,
}: LeaderboardRowProps) => {
  const {
    rankPosition,
    username,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    currentStreak,
    todaySolved,
    totalPoints,
    trendDirection,
    badges = [],
  } = entry;

  const rowClass = `${styles.row} ${isCurrentUser ? styles.currentUser : ''} ${
    rankPosition === 1 ? styles.firstPlace : ''
  }`;

  return (
    <div className={rowClass}>
      {/* Rank */}
      <div className={styles.rank}>
        {rankPosition === 1 && <span className={styles.crown}>👑</span>}
        <span className={styles.rankNumber}>#{rankPosition}</span>
      </div>

      {/* Trend */}
      <div className={styles.trend}>
        <TrendIndicator trend={trendDirection} size="small" />
      </div>

      {/* User info */}
      <div className={styles.userInfo}>
        <div className={styles.avatar}>{username.charAt(0).toUpperCase()}</div>
        <div className={styles.userDetails}>
          <span className={styles.username}>{username}</span>
          {isCurrentUser && <span className={styles.youBadge}>YOU</span>}
          {badges.length > 0 && (
            <div className={styles.badges}>
              {badges.slice(0, 3).map((badge) => (
                <BadgeIcon key={badge.id} badge={badge} size="small" />
              ))}
              {badges.length > 3 && <span className={styles.moreBadges}>+{badges.length - 3}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total</span>
          <span className={styles.statValue}>{totalSolved}</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statLabel}>Easy</span>
          <span className={`${styles.statValue} ${styles.easy}`}>{easySolved}</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statLabel}>Med</span>
          <span className={`${styles.statValue} ${styles.medium}`}>{mediumSolved}</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statLabel}>Hard</span>
          <span className={`${styles.statValue} ${styles.hard}`}>{hardSolved}</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statLabel}>Streak</span>
          <span className={styles.statValue}>🔥 {currentStreak}</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statLabel}>Today</span>
          <span className={styles.statValue}>✅ {todaySolved}</span>
        </div>
      </div>

      {/* Points */}
      <div className={styles.points}>
        <span className={styles.pointsValue}>⭐ {totalPoints}</span>
      </div>

      {/* Actions */}
      {onRemove && !isCurrentUser && (
        <div className={styles.actions}>
          <button
            className={styles.removeButton}
            onClick={() => onRemove(username)}
            aria-label={`Remove ${username}`}
            title={`Remove ${username}`}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export const LeaderboardRow = React.memo(LeaderboardRowComponent);
