import React from 'react';
import type { ActivityEvent } from '@/features/dashboard/types';
import { getRelativeTime } from '@/features/dashboard/services/activityDetector';
import styles from './ActivityItem.module.css';

export interface ActivityItemProps {
  event: ActivityEvent;
  showTimestamp?: boolean;
}

const ActivityItemComponent = ({ event, showTimestamp = true }: ActivityItemProps) => {
  const getIcon = () => {
    switch (event.type) {
      case 'problems_solved':
        return '✅';
      case 'streak_broken':
        return '💔';
      case 'streak_milestone':
        return '🔥';
      case 'rank_changed':
        return '📊';
      case 'achievement_unlocked':
        return '🏆';
      default:
        return '📌';
    }
  };

  return (
    <div className={`${styles.item} ${styles[event.type]}`}>
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.content}>
        <p className={styles.message}>{event.message}</p>
        {showTimestamp && (
          <span className={styles.timestamp}>{getRelativeTime(event.timestamp)}</span>
        )}
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
const ActivityItem = React.memo(ActivityItemComponent);
export default ActivityItem;
