import type { LeetCodeUser, Friend, Badge } from '@/features/dashboard/types';
import StreakDisplay from '../StreakDisplay';
import ComparisonTable from '../ComparisonTable';
import { BadgeDisplay } from '../BadgeDisplay';
import { LoadingSpinner } from '@/shared/components/Loading';
import ErrorMessage from '@/shared/components/ErrorMessage';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  user: LeetCodeUser | null;
  bestFriend?: Friend;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  badges?: Badge[];
}

export default function HeroSection({
  user,
  bestFriend,
  loading,
  error,
  onRetry,
  badges = [],
}: HeroSectionProps) {
  if (loading) {
    return (
      <section className={styles.section} aria-busy="true" aria-label="Loading user statistics">
        <LoadingSpinner size="large" message="Loading your statistics..." />
      </section>
    );
  }

  if (error && !user) {
    return (
      <section className={styles.section} role="alert" aria-live="assertive">
        <ErrorMessage message={error} onRetry={onRetry} />
      </section>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="hero-title">
      {error && (
        <div className={styles.warningBanner} role="alert" aria-live="polite">
          ⚠️ {error}
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 id="hero-title" className={styles.title}>
            Your Progress
          </h1>
          <p className={styles.username} aria-label={`Username: ${user.username}`}>
            @{user.username}
          </p>
        </div>
        <StreakDisplay streakDays={user.currentStreak} size="large" />
      </div>

      <div className={styles.statsGrid} role="list" aria-label="Personal statistics">
        <div className="neo-card" role="listitem">
          <div className={styles.statLabel}>Today</div>
          <div
            className={styles.statValue}
            aria-label={`${user.todaySolved} problems solved today`}
          >
            {user.todaySolved}
          </div>
          <div className={styles.statSubtext}>problems solved</div>
        </div>

        <div className="neo-card" role="listitem">
          <div className={styles.statLabel}>This Week</div>
          <div
            className={styles.statValue}
            aria-label={`${user.weeklySolved} problems solved this week`}
          >
            {user.weeklySolved}
          </div>
          <div className={styles.statSubtext}>problems solved</div>
        </div>

        <div className="neo-card" role="listitem">
          <div className={styles.statLabel}>Total Solved</div>
          <div
            className={styles.statValue}
            aria-label={`${user.totalSolved} total problems solved`}
          >
            {user.totalSolved}
          </div>
          <div className={styles.statSubtext}>
            <span
              className={`neo-badge neo-difficulty-easy ${styles.difficultyBadge}`}
              aria-label={`${user.easySolved} easy problems`}
            >
              E: {user.easySolved}
            </span>
            <span
              className={`neo-badge neo-difficulty-medium ${styles.difficultyBadge}`}
              aria-label={`${user.mediumSolved} medium problems`}
            >
              M: {user.mediumSolved}
            </span>
            <span
              className={`neo-badge neo-difficulty-hard ${styles.difficultyBadge}`}
              aria-label={`${user.hardSolved} hard problems`}
            >
              H: {user.hardSolved}
            </span>
          </div>
        </div>

        <div className="neo-card" role="listitem">
          <div className={styles.statLabel}>Global Rank</div>
          <div
            className={styles.statValue}
            aria-label={`Global rank: ${user.ranking.toLocaleString()}`}
          >
            #{user.ranking.toLocaleString()}
          </div>
          <div className={styles.statSubtext}>{user.acceptanceRate.toFixed(1)}% acceptance</div>
        </div>
      </div>

      {badges.length > 0 && (
        <div className={styles.badgesSection}>
          <BadgeDisplay badges={badges} size="medium" title="🏆 Your Achievements" maxDisplay={8} />
        </div>
      )}

      {bestFriend && (
        <ComparisonTable
          user={{
            username: user.username,
            todaySolved: user.todaySolved,
            weeklySolved: user.weeklySolved,
            totalPoints: user.totalPoints,
          }}
          friend={{
            username: bestFriend.username,
            todaySolved: bestFriend.todaySolved,
            weeklySolved: bestFriend.weeklySolved,
            totalPoints: bestFriend.totalPoints,
          }}
          pointDifference={user.totalPoints - bestFriend.totalPoints}
        />
      )}
    </section>
  );
}
