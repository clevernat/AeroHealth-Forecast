// Simple in-memory cache for API responses
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Set a value in the cache with TTL (time to live) in seconds
   */
  set<T>(key: string, data: T, ttlSeconds: number): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttlSeconds * 1000,
    };
    this.cache.set(key, entry);
  }

  /**
   * Get a value from the cache if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      // Entry has expired, remove it
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if a key exists and hasn't expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete a specific key from the cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all expired entries from the cache
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    keys: string[];
    expired: number;
  } {
    const now = Date.now();
    let expired = 0;
    const keys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      keys.push(key);
      if (now > entry.expiresAt) {
        expired++;
      }
    }

    return {
      size: this.cache.size,
      keys,
      expired,
    };
  }
}

// Export a singleton instance
export const cache = new SimpleCache();

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  AQI_GRID: 15 * 60, // 15 minutes - AQI changes slowly
  WIND: 30 * 60, // 30 minutes - Wind changes moderately
  POLLUTION_SOURCES: 24 * 60 * 60, // 24 hours - Infrastructure changes rarely
  WILDFIRES: 60 * 60, // 1 hour - Wildfires can change quickly
  POLLEN: 60 * 60, // 1 hour - Pollen levels change throughout the day
} as const;

// Helper function to generate cache keys
export function generateCacheKey(
  prefix: string,
  params: Record<string, string | number>
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return `${prefix}:${sortedParams}`;
}

// Periodically clear expired entries (every 5 minutes)
if (typeof window === "undefined") {
  // Only run on server
  setInterval(() => {
    cache.clearExpired();
  }, 5 * 60 * 1000);
}

