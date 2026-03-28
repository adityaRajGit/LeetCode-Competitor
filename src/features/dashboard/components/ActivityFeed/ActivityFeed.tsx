import type { ActivityEvent } from '@/features/dashboard/types';
import ActivityItem from '../ActivityItem';
import EmptyState from '@/shared/components/EmptyState';
import { LoadingSpinner } from '@/shared/components/Loading';
import styles from './ActivityFeed.module.css';

export interface ActivityFeedProps {
  events: ActivityEvent[];
  maxEvents?: number;
  emptyMessage?: string;
  loading?: boolean;
}

export default function ActivityFeed({
  events,
  maxEvents = 10,
  emptyMessage = 'No recent activity. Add friends to see their progress!',
  loading = false,
}: ActivityFeedProps) {
  const displayEvents = events.slice(0, maxEvents);

  if (loading) {
    return (
      <section className={styles.section}>
        <LoadingSpinner size="medium" message="Loading activity feed..." />
      </section>
    );
  }

  if (displayEvents.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>📰 Activity Feed</h2>
        <EmptyState
          icon="📭"
          title="No Activity Yet"
          description={emptyMessage}
        />
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>📰 Activity Feed</h2>
        <span className={styles.badge}>{displayEvents.length} event{displayEvents.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className={styles.feed}>
        {displayEvents.map((event) => (
          <ActivityItem key={event.id} event={event} showTimestamp />
        ))}
      </div>

      {events.length > maxEvents && (
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Showing {maxEvents} of {events.length} events
          </p>
        </div>
      )}
    </section>
  );
}
