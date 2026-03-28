import styles from './PointsSystemCard.module.css';

export interface PointsSystemCardProps {
  showExamples?: boolean;
}

export default function PointsSystemCard({ showExamples = false }: PointsSystemCardProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>🏆 Points System</h2>
        <p className={styles.subtitle}>Understanding the scoring formula</p>
      </div>

      <div className={styles.content}>
        {/* Base Points */}
        <div className="neo-card">
          <h3 className={styles.cardTitle}>📊 Base Points</h3>
          <div className={styles.formula}>
            <div className={styles.formulaItem}>
              <span className="neo-badge neo-difficulty-easy">Easy</span>
              <span className={styles.operator}>×</span>
              <span className={styles.value}>5</span>
              <span className={styles.label}>points</span>
            </div>
            <div className={styles.formulaItem}>
              <span className="neo-badge neo-difficulty-medium">Medium</span>
              <span className={styles.operator}>×</span>
              <span className={styles.value}>10</span>
              <span className={styles.label}>points</span>
            </div>
            <div className={styles.formulaItem}>
              <span className="neo-badge neo-difficulty-hard">Hard</span>
              <span className={styles.operator}>×</span>
              <span className={styles.value}>20</span>
              <span className={styles.label}>points</span>
            </div>
          </div>
          {showExamples && (
            <div className={styles.example}>
              <strong>Example:</strong> 10 Easy + 5 Medium + 2 Hard = (10×5) + (5×10) + (2×20) = 50 + 50 + 40 = <strong>140 pts</strong>
            </div>
          )}
        </div>

        {/* Bonus Points */}
        <div className="neo-card">
          <h3 className={styles.cardTitle}>⚡ Bonus Points</h3>
          <div className={styles.bonuses}>
            <div className={styles.bonusItem}>
              <div className={styles.bonusIcon}>🔥</div>
              <div className={styles.bonusDetails}>
                <div className={styles.bonusTitle}>Daily Streak</div>
                <div className={styles.bonusValue}>+10 points</div>
                <div className={styles.bonusDescription}>Active if you solved at least 1 problem today</div>
              </div>
            </div>
            <div className={styles.bonusItem}>
              <div className={styles.bonusIcon}>⚔️</div>
              <div className={styles.bonusDetails}>
                <div className={styles.bonusTitle}>Competition Bonus</div>
                <div className={styles.bonusValue}>+15 points</div>
                <div className={styles.bonusDescription}>Earned when you solve more problems today than your best friend</div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Calculation */}
        <div className={`neo-card ${styles.totalCard}`}>
          <h3 className={styles.cardTitle}>🎯 Total Points</h3>
          <div className={styles.totalFormula}>
            <div className={styles.totalFormulaText}>
              Base Points <span className={styles.operator}>+</span> Streak Bonus <span className={styles.operator}>+</span> Competition Bonus
            </div>
            <div className={styles.totalFormulaExample}>
              = Your Total Leaderboard Score
            </div>
          </div>
          {showExamples && (
            <div className={styles.example}>
              <strong>Example:</strong> 140 (base) + 10 (streak) + 15 (competition) = <strong>165 pts</strong>
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerNote}>
          💡 <strong>Pro Tip:</strong> Focus on hard problems for maximum points, maintain daily streaks, and compete with friends for bonus points!
        </p>
      </div>
    </section>
  );
}
