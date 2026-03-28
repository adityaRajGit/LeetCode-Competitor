/**
 * Cache Utilities
 * Cache validation and expiry management
 */

/**
 * Default cache duration in milliseconds (5 minutes)
 */
export const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

/**
 * Check if cached data is still valid
 * @param cacheExpiry - Unix timestamp (milliseconds) when cache expires
 */
export function isCacheValid(cacheExpiry: number): boolean {
  return Date.now() < cacheExpiry;
}

/**
 * Calculate cache expiry timestamp
 * @param duration - Duration in milliseconds (default: 5 minutes)
 */
export function calculateCacheExpiry(duration: number = DEFAULT_CACHE_DURATION): number {
  return Date.now() + duration;
}

/**
 * Check if data needs refresh based on last fetched time
 * @param lastFetched - Unix timestamp (milliseconds) of last fetch
 * @param maxAge - Maximum age in milliseconds
 */
export function needsRefresh(lastFetched: number, maxAge: number = DEFAULT_CACHE_DURATION): boolean {
  return Date.now() - lastFetched > maxAge;
}

/**
 * Get cached item from storage with validation
 */
export function getCachedItem<T>(key: string, storage: Storage = localStorage): T | null {
  try {
    const item = storage.getItem(key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    
    // Check if cache has expiry field
    if (parsed.cacheExpiry && !isCacheValid(parsed.cacheExpiry)) {
      storage.removeItem(key);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error(`Error reading cached item ${key}:`, error);
    return null;
  }
}

/**
 * Set cached item in storage with expiry
 */
export function setCachedItem<T>(
  key: string,
  data: T,
  duration: number = DEFAULT_CACHE_DURATION,
  storage: Storage = localStorage
): void {
  try {
    const cacheData = {
      ...data,
      lastFetched: Date.now(),
      cacheExpiry: calculateCacheExpiry(duration),
    };
    storage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error(`Error setting cached item ${key}:`, error);
  }
}

/**
 * Clear all cached items matching a pattern
 */
export function clearCachedItems(pattern: RegExp, storage: Storage = localStorage): void {
  try {
    const keys = Object.keys(storage);
    keys.forEach((key) => {
      if (pattern.test(key)) {
        storage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing cached items:', error);
  }
}
