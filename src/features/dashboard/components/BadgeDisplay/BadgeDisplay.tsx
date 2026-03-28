/**
 * BadgeDisplay Component
 *
 * Container component that displays a list of earned badges.
 * Shows badges in a horizontal scrollable list with add/remove animations.
 */

import React from 'react';
import { BadgeIcon } from './BadgeIcon';
import styles from './BadgeDisplay.module.css';
import type { Badge } from '../../types';

interface BadgeDisplayProps {
  badges: Badge[];
  size?: 'small' | 'medium' | 'large';
  title?: string;
  emptyMessage?: string;
  maxDisplay?: number; // Maximum number of badges to show
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badges,
  size = 'medium',
  title,
  emptyMessage = 'No badges earned yet',
  maxDisplay,
}) => {
  const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges;
  const hasMore = maxDisplay && badges.length > maxDisplay;

  if (badges.length === 0) {
    return (
      <div className={styles.container}>
        {title && <h3 className={styles.title}>{title}</h3>}
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🏆</span>
          <p className={styles.emptyMessage}>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}

      <div className={styles.badgeList}>
        {displayBadges.map((badge) => (
          <div key={badge.id} className={styles.badgeItem}>
            <BadgeIcon badge={badge} size={size} />
          </div>
        ))}

        {hasMore && (
          <div className={styles.moreIndicator}>
            <span className={styles.moreText}>+{badges.length - maxDisplay!} more</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeDisplay;
