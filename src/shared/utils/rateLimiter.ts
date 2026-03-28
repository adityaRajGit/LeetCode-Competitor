/**
 * Rate Limiter Utility
 * Client-side rate limiting with cooldown tracking
 */

interface RateLimitEntry {
  lastRequestTime: number;      // Unix timestamp (milliseconds)
  cooldownMs: number;           // Cooldown duration
}

/**
 * In-memory rate limit tracking
 */
const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Default cooldown duration (60 seconds)
 */
export const DEFAULT_COOLDOWN_MS = 60 * 1000;

/**
 * Check if a request is rate limited
 * @param key - Unique identifier for the rate limit (e.g., username)
 * @param cooldownMs - Cooldown duration in milliseconds
 * @returns true if rate limited, false if allowed
 */
export function isRateLimited(key: string, cooldownMs: number = DEFAULT_COOLDOWN_MS): boolean {
  const entry = rateLimitMap.get(key);
  
  if (!entry) {
    return false;  // No previous request
  }

  const timeSinceLastRequest = Date.now() - entry.lastRequestTime;
  return timeSinceLastRequest < cooldownMs;
}

/**
 * Get remaining cooldown time in milliseconds
 * @param key - Unique identifier for the rate limit
 * @returns Remaining cooldown time in ms, or 0 if not rate limited
 */
export function getRemainingCooldown(key: string): number {
  const entry = rateLimitMap.get(key);
  
  if (!entry) {
    return 0;
  }

  const timeSinceLastRequest = Date.now() - entry.lastRequestTime;
  const remaining = entry.cooldownMs - timeSinceLastRequest;
  
  return Math.max(0, remaining);
}

/**
 * Record a request for rate limiting
 * @param key - Unique identifier for the rate limit
 * @param cooldownMs - Cooldown duration in milliseconds
 */
export function recordRequest(key: string, cooldownMs: number = DEFAULT_COOLDOWN_MS): void {
  rateLimitMap.set(key, {
    lastRequestTime: Date.now(),
    cooldownMs,
  });
}

/**
 * Clear rate limit for a specific key
 * @param key - Unique identifier for the rate limit
 */
export function clearRateLimit(key: string): void {
  rateLimitMap.delete(key);
}

/**
 * Clear all rate limits
 */
export function clearAllRateLimits(): void {
  rateLimitMap.clear();
}

/**
 * Execute a function with rate limiting
 * @param key - Unique identifier for the rate limit
 * @param fn - Function to execute
 * @param cooldownMs - Cooldown duration in milliseconds
 * @returns Promise with result or rejection if rate limited
 */
export async function withRateLimit<T>(
  key: string,
  fn: () => Promise<T>,
  cooldownMs: number = DEFAULT_COOLDOWN_MS
): Promise<T> {
  if (isRateLimited(key, cooldownMs)) {
    const remaining = getRemainingCooldown(key);
    throw new Error(`Rate limited. Try again in ${Math.ceil(remaining / 1000)} seconds.`);
  }

  recordRequest(key, cooldownMs);
  return await fn();
}
