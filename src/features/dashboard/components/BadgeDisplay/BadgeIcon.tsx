/**
 * BadgeIcon Component
 *
 * Displays a single badge icon with tooltip.
 * Used in HeroSection and LeaderboardRow to show earned achievements.
 */

import React, { useState } from 'react';
import styles from './BadgeIcon.module.css';
import type { Badge } from '../../types';

interface BadgeIconProps {
  badge: Badge;
  size?: 'small' | 'medium' | 'large';
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ badge, size = 'medium' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[size];

  return (
    <div
      className={`${styles.badgeIcon} ${sizeClass}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      role="img"
      aria-label={`${badge.name}: ${badge.description}`}
    >
      <span className={styles.icon}>{badge.icon}</span>

      {showTooltip && (
        <div className={styles.tooltip}>
          <div className={styles.tooltipTitle}>{badge.name}</div>
          <div className={styles.tooltipDescription}>{badge.description}</div>
          {badge.earnedAt && (
            <div className={styles.tooltipDate}>
              Earned: {new Date(badge.earnedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BadgeIcon;
