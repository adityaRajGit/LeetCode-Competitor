/**
 * WinRatioDisplay Component
 *
 * Displays the win ratio comparing user's performance against their best friend.
 */

import React from 'react';
import styles from './WinRatioDisplay.module.css';

interface WinRatioDisplayProps {
  winRatio: number | null; // null if no friend
  username: string;
  friendUsername?: string;
}

export const WinRatioDisplay: React.FC<WinRatioDisplayProps> = ({ winRatio, friendUsername }) => {
  if (winRatio === null || !friendUsername) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h3 className={styles.title}>Win Ratio</h3>
          <div className={styles.emptyState}>
            <p>Add a friend to see your win ratio</p>
          </div>
        </div>
      </div>
    );
  }

  const lossRatio = 100 - winRatio;
  const isWinning = winRatio >= 50;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>Win Ratio vs {friendUsername}</h3>

        <div className={styles.ratioBar}>
          <div
            className={`${styles.winSegment} ${isWinning ? styles.winning : ''}`}
            style={{ width: `${winRatio}%` }}
          >
            {winRatio > 15 && <span className={styles.segmentLabel}>{winRatio.toFixed(1)}%</span>}
          </div>
          <div
            className={`${styles.lossSegment} ${!isWinning ? styles.winning : ''}`}
            style={{ width: `${lossRatio}%` }}
          >
            {lossRatio > 15 && <span className={styles.segmentLabel}>{lossRatio.toFixed(1)}%</span>}
          </div>
        </div>

        <div className={styles.labels}>
          <span className={styles.youLabel}>You</span>
          <span className={styles.themLabel}>Them</span>
        </div>

        <div className={styles.verdict}>
          {winRatio > 50 && (
            <p className={styles.verdictWin}>🏆 You&apos;re leading! Keep it up!</p>
          )}
          {winRatio < 50 && (
            <p className={styles.verdictLoss}>💪 Time to catch up! You got this!</p>
          )}
          {winRatio === 50 && (
            <p className={styles.verdictTie}>🤝 Perfectly tied! Next solve breaks it!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WinRatioDisplay;
