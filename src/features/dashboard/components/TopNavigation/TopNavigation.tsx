import { Logo } from '@/shared/components/Logo';
import { GlobalStatsWidget } from '../GlobalStatsWidget';
import { ProfileDropdown } from '../ProfileDropdown';
import styles from './TopNavigation.module.css';

export interface TopNavigationProps {
  username: string;
  todaySolved: number;
  currentStreak: number;
  totalPoints: number;
  theme: 'light' | 'dark';
  onAddFriendClick: () => void;
  onThemeToggle: () => void;
  onChangeUsername?: () => void;
  onClearData?: () => void;
}

/**
 * Top navigation bar component
 * Includes logo, global stats, add friend button, theme toggle, and profile dropdown
 */
export function TopNavigation({
  username,
  todaySolved,
  currentStreak,
  totalPoints,
  theme,
  onAddFriendClick,
  onThemeToggle,
  onChangeUsername,
  onClearData,
}: TopNavigationProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Left section: Logo */}
        <div className={styles.left}>
          <Logo size="small" showText={true} />
        </div>

        {/* Center section: Global stats widget */}
        <div className={styles.center}>
          <GlobalStatsWidget
            todaySolved={todaySolved}
            currentStreak={currentStreak}
            totalPoints={totalPoints}
          />
        </div>

        {/* Right section: Actions */}
        <div className={styles.right}>
          <button
            className={styles.addFriendButton}
            onClick={onAddFriendClick}
            aria-label="Add Friend"
          >
            <span className={styles.buttonIcon}>➕</span>
            <span className={styles.buttonText}>Add Friend</span>
          </button>

          <button
            className={styles.themeToggle}
            onClick={onThemeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <ProfileDropdown
            username={username}
            onChangeUsername={onChangeUsername}
            onClearData={onClearData}
          />
        </div>
      </div>
    </nav>
  );
}
