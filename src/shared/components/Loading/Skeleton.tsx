/**
 * Skeleton Component
 *
 * Loading skeleton for content placeholders.
 * Creates animated placeholder elements while content is loading.
 */

import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
}) => {
  const variantClass = {
    text: styles.text,
    rectangular: styles.rectangular,
    circular: styles.circular,
    rounded: styles.rounded,
  }[variant];

  const animationClass = {
    pulse: styles.pulse,
    wave: styles.wave,
    none: '',
  }[animation];

  const style: React.CSSProperties = {};
  if (width) {
    style.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <div
      className={`${styles.skeleton} ${variantClass} ${animationClass} ${className}`}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  );
};

/**
 * SkeletonGroup Component
 *
 * Container for multiple skeleton elements with consistent spacing.
 */
interface SkeletonGroupProps {
  children: React.ReactNode;
  spacing?: number;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({ children, spacing = 12 }) => {
  return (
    <div className={styles.group} style={{ gap: `${spacing}px` }}>
      {children}
    </div>
  );
};

export default Skeleton;
