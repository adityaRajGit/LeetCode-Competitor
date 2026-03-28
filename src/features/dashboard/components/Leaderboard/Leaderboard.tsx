import { Card } from '@/shared/components/Card';
import EmptyState from '@/shared/components/EmptyState';
import { LeaderboardRow } from '../LeaderboardRow';
import type { LeaderboardEntry } from '@/features/dashboard/types';
import styles from './Leaderboard.module.css';

export interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUsername?: string;
  onRemoveFriend?: (username: string) => void;
  loading?: boolean;
}

/**
 * Leaderboard component
 * Displays ranked list of friends with their stats
 */
export function Leaderboard({ 
  entries, 
  currentUsername, 
  onRemoveFriend,
  loading = false 
}: LeaderboardProps) {
  // Empty state
  if (!loading && entries.length === 0) {
    return (
      <Card>
        <EmptyState
          icon="👥"
          title="No Friends Added Yet"
          description="Add friends to see how you compare on the leaderboard!"
        />
      </Card>
    );
  }

  return (
    <div className={styles.leaderboard}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.titleIcon}>🏆</span>
          Leaderboard
        </h2>
        <span className={styles.count}>
          {entries.length} {entries.length === 1 ? 'Friend' : 'Friends'}
        </span>
      </div>

      <div className={styles.list}>
        {entries.map((entry) => (
          <LeaderboardRow
            key={entry.username}
            entry={entry}
            isCurrentUser={entry.username === currentUsername}
            onRemove={onRemoveFriend}
          />
        ))}
      </div>
    </div>
  );
}
