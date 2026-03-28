import { SubmissionCalendar } from '@/features/dashboard/types';

/**
 * Date Utilities
 * Timezone handling and date calculations
 */

/**
 * Get the start of today in Unix timestamp (seconds)
 * Normalized to start of day (00:00:00) in user's timezone
 */
export function getStartOfToday(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor(now.getTime() / 1000);
}

/**
 * Get Unix timestamp for a specific number of days ago
 * @param daysAgo - Number of days in the past
 */
export function getDaysAgo(daysAgo: number): number {
  const oneDaySeconds = 86400;
  return getStartOfToday() - (daysAgo * oneDaySeconds);
}

/**
 * Convert Unix timestamp (seconds) to Date object
 */
export function unixToDate(unixTimestamp: number): Date {
  return new Date(unixTimestamp * 1000);
}

/**
 * Check if a Unix timestamp is today
 */
export function isToday(unixTimestamp: number): boolean {
  const today = getStartOfToday();
  const tomorrow = today + 86400;
  return unixTimestamp >= today && unixTimestamp < tomorrow;
}

/**
 * Check if a Unix timestamp is within the past N days
 */
export function isWithinDays(unixTimestamp: number, days: number): boolean {
  const cutoff = getDaysAgo(days);
  return unixTimestamp >= cutoff;
}

/**
 * Calculate current streak from submission calendar
 * Counts consecutive days with submissions working backwards from today
 */
export function calculateStreak(submissionCalendar: SubmissionCalendar): number {
  const oneDaySeconds = 86400;
  let currentDay = getStartOfToday();
  let streak = 0;

  // Check if there's a submission today or yesterday (grace period)
  const todayKey = String(currentDay);
  const yesterdayKey = String(currentDay - oneDaySeconds);
  
  const hasToday = submissionCalendar[todayKey] && submissionCalendar[todayKey] > 0;
  const hasYesterday = submissionCalendar[yesterdayKey] && submissionCalendar[yesterdayKey] > 0;

  if (!hasToday && !hasYesterday) {
    return 0;  // Streak broken
  }

  // Start from yesterday if no submission today
  if (!hasToday && hasYesterday) {
    currentDay -= oneDaySeconds;
  }

  // Count backwards
  while (submissionCalendar[String(currentDay)] && submissionCalendar[String(currentDay)] > 0) {
    streak++;
    currentDay -= oneDaySeconds;
  }

  return streak;
}

/**
 * Calculate problems solved today from submission calendar
 */
export function calculateTodaySolved(submissionCalendar: SubmissionCalendar): number {
  const todayKey = String(getStartOfToday());
  return submissionCalendar[todayKey] || 0;
}

/**
 * Calculate problems solved in the past 7 days
 */
export function calculateWeeklySolved(submissionCalendar: SubmissionCalendar): number {
  const sevenDaysAgo = getDaysAgo(7);
  const oneDaySeconds = 86400;
  let total = 0;

  for (let day = sevenDaysAgo; day <= getStartOfToday(); day += oneDaySeconds) {
    const key = String(day);
    total += submissionCalendar[key] || 0;
  }

  return total;
}

/**
 * Format Unix timestamp to human-readable string
 */
export function formatTimestamp(unixTimestamp: number): string {
  const date = unixToDate(unixTimestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
