import { useMemo } from 'react';
import type { SubmissionCalendar } from '@/features/dashboard/types';
import { calculateStreak } from '@/shared/utils/dateUtils';

/**
 * useStreakCalculator Hook
 * Calculates current streak from submission calendar
 */
export function useStreakCalculator(submissionCalendar: SubmissionCalendar | undefined): number {
  return useMemo(() => {
    if (!submissionCalendar) return 0;
    return calculateStreak(submissionCalendar);
  }, [submissionCalendar]);
}
