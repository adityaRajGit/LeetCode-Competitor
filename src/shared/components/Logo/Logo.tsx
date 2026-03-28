import styles from './Logo.module.css';

export interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  onClick?: () => void;
}

/**
 * Logo component with NeoBrutalism styling
 */
export function Logo({ size = 'medium', showText = true, onClick }: LogoProps) {
  const sizeClass = styles[size];
  const interactive = onClick ? styles.interactive : '';

  return (
    <div 
      className={`${styles.logo} ${sizeClass} ${interactive}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className={styles.iconContainer}>
        <span className={styles.icon}>⚔️</span>
      </div>
      {showText && (
        <div className={styles.text}>
          <h1 className={styles.title}>LeetCode</h1>
          <span className={styles.subtitle}>Competitor</span>
        </div>
      )}
    </div>
  );
}
