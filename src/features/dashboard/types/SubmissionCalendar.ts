/**
 * Submission Calendar Type
 * Maps Unix timestamps (as strings) to submission counts
 */
export interface SubmissionCalendar {
  [unixTimestamp: string]: number;  // "1739836800" → 2 (solved 2 problems)
}
