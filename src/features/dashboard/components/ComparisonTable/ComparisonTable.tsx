import PointsBadge from '../PointsBadge';
import styles from './ComparisonTable.module.css';

export interface ComparisonTableProps {
  user: {
    username: string;
    todaySolved: number;
    weeklySolved: number;
    totalPoints: number;
  };
  friend: {
    username: string;
    todaySolved: number;
    weeklySolved: number;
    totalPoints: number;
  };
  pointDifference: number;
}

export default function ComparisonTable({ user, friend, pointDifference }: ComparisonTableProps) {
  // Generate point difference message
  const getDifferenceMessage = () => {
    if (pointDifference === 0) {
      return "🤝 You're tied!";
    } else if (pointDifference > 0) {
      return `💪 You're leading by ${Math.abs(pointDifference)} pts`;
    } else {
      return `🔥 You're behind by ${Math.abs(pointDifference)} pts`;
    }
  };

  const differenceClass = 
    pointDifference > 0 ? styles.leading : 
    pointDifference < 0 ? styles.trailing : 
    styles.tied;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>⚔️ You vs Best Friend</h3>
        <div className={`${styles.differenceMessage} ${differenceClass}`}>
          {getDifferenceMessage()}
        </div>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.metricColumn}></div>
          <div className={`${styles.userColumn} ${styles.currentUser}`}>
            <div className={styles.columnTitle}>You</div>
            <div className={styles.username}>@{user.username}</div>
          </div>
          <div className={styles.userColumn}>
            <div className={styles.columnTitle}>Best Friend</div>
            <div className={styles.username}>@{friend.username}</div>
          </div>
        </div>

        <div className={styles.tableBody}>
          {/* Today Solved Row */}
          <div className={styles.row}>
            <div className={styles.metricColumn}>
              <span className={styles.metricLabel}>Today</span>
            </div>
            <div className={`${styles.userColumn} ${styles.currentUser}`}>
              <span className={styles.metricValue}>{user.todaySolved}</span>
            </div>
            <div className={styles.userColumn}>
              <span className={styles.metricValue}>{friend.todaySolved}</span>
            </div>
          </div>

          {/* Weekly Solved Row */}
          <div className={styles.row}>
            <div className={styles.metricColumn}>
              <span className={styles.metricLabel}>This Week</span>
            </div>
            <div className={`${styles.userColumn} ${styles.currentUser}`}>
              <span className={styles.metricValue}>{user.weeklySolved}</span>
            </div>
            <div className={styles.userColumn}>
              <span className={styles.metricValue}>{friend.weeklySolved}</span>
            </div>
          </div>

          {/* Total Points Row */}
          <div className={`${styles.row} ${styles.pointsRow}`}>
            <div className={styles.metricColumn}>
              <span className={styles.metricLabel}>Total Points</span>
            </div>
            <div className={`${styles.userColumn} ${styles.currentUser}`}>
              <PointsBadge points={user.totalPoints} size="small" variant="primary" showLabel={false} />
            </div>
            <div className={styles.userColumn}>
              <PointsBadge points={friend.totalPoints} size="small" variant="secondary" showLabel={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
