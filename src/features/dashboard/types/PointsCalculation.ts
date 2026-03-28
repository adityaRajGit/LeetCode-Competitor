/**
 * Points Breakdown Interface
 * Detailed breakdown of points calculation
 */
export interface PointsBreakdown {
  basePoints: number;           // (Easy × 5) + (Medium × 10) + (Hard × 20)
  streakBonus: number;          // +10 if currentStreak >= 1
  competitionBonus: number;     // +15 if todaySolved > best friend's todaySolved
  totalPoints: number;          // Sum of all bonuses
}

/**
 * Points Calculation
 * Alias for PointsBreakdown
 */
export type PointsCalculation = PointsBreakdown;
