/**
 * CacheService
 * Implements LRU (Least Recently Used) cache for API responses and processed data
 */

import RNFS from 'react-native-fs';
import type { CachedItem, CacheConfig, CleanupResult } from '../../types/storage';

export class CacheService {
  private cache: Map<string, CachedItem> = new Map();
  private config: CacheConfig;
  private currentSize: number = 0;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private cacheDirectory: string;

  constructor(config: CacheConfig) {
    this.config = config;
    this.cacheDirectory = `${RNFS.DocumentDirectoryPath}/AniVision/cache`;
    this.initialize();
  }

  /**
   * Initialize cache service
   */
  private async initialize(): Promise<void> {
    try {
      // Ensure cache directory exists
      const exists = await RNFS.exists(this.cacheDirectory);
      if (!exists) {
        await RNFS.mkdir(this.cacheDirectory);
      }

      // Load cache index from disk
      await this.loadCacheIndex();

      // Start cleanup interval
      this.startCleanupInterval();

      console.log('Cache service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize cache service:', error);
    }
  }

  /**
   * Get item from cache
   */
  async get<T = any>(key: string): Promise<T | null> {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      await this.delete(key);
      return null;
    }

    // Update access statistics
    cached.accessCount++;
    cached.lastAccessed = Date.now();
    this.cache.set(key, cached);

    // Load value from disk or memory
    if (typeof cached.value === 'string' && cached.value.startsWith('file://')) {
      // Value is stored on disk
      return await this.loadFromDisk<T>(cached.value);
    }

    return cached.value as T;
  }

  /**
   * Set item in cache
   */
  async set<T = any>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const itemTTL = ttl || this.config.ttl;
      const now = Date.now();
      const valueStr = JSON.stringify(value);
      const size = new Blob([valueStr]).size;

      // Check if we need to make space
      while (this.currentSize + size > this.config.maxSize && this.cache.size > 0) {
        await this.evictLRU();
      }

      // Check if we exceed max items
      while (this.cache.size >= this.config.maxItems && this.cache.size > 0) {
        await this.evictLRU();
      }

      // For large items, store on disk
      let finalValue: any = value;
      if (size > 50000) {
        // > 50KB
        const filePath = await this.saveToDisk(key, value);
        finalValue = filePath;
      }

      const cachedItem: CachedItem<T> = {
        key,
        value: finalValue,
        size,
        timestamp: now,
        expiresAt: now + itemTTL,
        accessCount: 0,
        lastAccessed: now,
      };

      // Remove old item if exists
      if (this.cache.has(key)) {
        const oldItem = this.cache.get(key)!;
        this.currentSize -= oldItem.size;
      }

      this.cache.set(key, cachedItem);
      this.currentSize += size;

      // Persist cache index
      await this.saveCacheIndex();
    } catch (error) {
      console.error('Failed to set cache item:', error);
      throw error;
    }
  }

  /**
   * Delete item from cache
   */
  async delete(key: string): Promise<boolean> {
    const cached = this.cache.get(key);
    if (!cached) {
      return false;
    }

    // Delete from disk if file-backed
    if (typeof cached.value === 'string' && cached.value.startsWith('file://')) {
      try {
        await RNFS.unlink(cached.value.replace('file://', ''));
      } catch (error) {
        console.error('Failed to delete cache file:', error);
      }
    }

    this.currentSize -= cached.size;
    this.cache.delete(key);

    await this.saveCacheIndex();
    return true;
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) {
      return false;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      // Delete all file-backed items
      for (const [key, cached] of this.cache) {
        if (typeof cached.value === 'string' && cached.value.startsWith('file://')) {
          try {
            await RNFS.unlink(cached.value.replace('file://', ''));
          } catch (error) {
            // Ignore errors
          }
        }
      }

      this.cache.clear();
      this.currentSize = 0;

      // Clear cache directory
      const exists = await RNFS.exists(this.cacheDirectory);
      if (exists) {
        await RNFS.unlink(this.cacheDirectory);
        await RNFS.mkdir(this.cacheDirectory);
      }

      await this.saveCacheIndex();
      console.log('Cache cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  }

  /**
   * Evict least recently used item
   */
  private async evictLRU(): Promise<void> {
    let lruKey: string | null = null;
    let lruTime = Date.now();

    // Find least recently used item
    for (const [key, cached] of this.cache) {
      if (cached.lastAccessed < lruTime) {
        lruTime = cached.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      await this.delete(lruKey);
      console.log(`Evicted LRU item: ${lruKey}`);
    }
  }

  /**
   * Remove expired items
   */
  async removeExpired(): Promise<CleanupResult> {
    const startTime = Date.now();
    let itemsRemoved = 0;
    let spaceFreed = 0;
    const errors: string[] = [];

    try {
      const now = Date.now();
      const expiredKeys: string[] = [];

      // Find expired items
      for (const [key, cached] of this.cache) {
        if (now > cached.expiresAt) {
          expiredKeys.push(key);
        }
      }

      // Remove expired items
      for (const key of expiredKeys) {
        const cached = this.cache.get(key);
        if (cached) {
          spaceFreed += cached.size;
          await this.delete(key);
          itemsRemoved++;
        }
      }

      if (itemsRemoved > 0) {
        console.log(`Removed ${itemsRemoved} expired items, freed ${spaceFreed} bytes`);
      }
    } catch (error) {
      errors.push(`Failed to remove expired items: ${error}`);
    }

    return {
      itemsRemoved,
      spaceFreed,
      duration: Date.now() - startTime,
      errors,
    };
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    count: number;
    maxSize: number;
    maxItems: number;
    utilizationPercent: number;
  } {
    return {
      size: this.currentSize,
      count: this.cache.size,
      maxSize: this.config.maxSize,
      maxItems: this.config.maxItems,
      utilizationPercent: (this.currentSize / this.config.maxSize) * 100,
    };
  }

  /**
   * Get all cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache items by pattern
   */
  async getByPattern<T = any>(pattern: string): Promise<Map<string, T>> {
    const results = new Map<string, T>();
    const regex = new RegExp(pattern);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        const value = await this.get<T>(key);
        if (value !== null) {
          results.set(key, value);
        }
      }
    }

    return results;
  }

  /**
   * Delete cache items by pattern
   */
  async deleteByPattern(pattern: string): Promise<number> {
    const regex = new RegExp(pattern);
    let count = 0;

    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      const deleted = await this.delete(key);
      if (deleted) count++;
    }

    return count;
  }

  /**
   * Save large values to disk
   */
  private async saveToDisk<T>(key: string, value: T): Promise<string> {
    const fileName = `${key.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.json`;
    const filePath = `${this.cacheDirectory}/${fileName}`;

    await RNFS.writeFile(filePath, JSON.stringify(value), 'utf8');

    return `file://${filePath}`;
  }

  /**
   * Load value from disk
   */
  private async loadFromDisk<T>(filePath: string): Promise<T | null> {
    try {
      const path = filePath.replace('file://', '');
      const content = await RNFS.readFile(path, 'utf8');
      return JSON.parse(content) as T;
    } catch (error) {
      console.error('Failed to load from disk:', error);
      return null;
    }
  }

  /**
   * Save cache index to disk
   */
  private async saveCacheIndex(): Promise<void> {
    try {
      const indexPath = `${this.cacheDirectory}/cache_index.json`;
      const index = {
        version: 1,
        timestamp: Date.now(),
        items: Array.from(this.cache.entries()).map(([key, item]) => ({
          key,
          size: item.size,
          timestamp: item.timestamp,
          expiresAt: item.expiresAt,
          accessCount: item.accessCount,
          lastAccessed: item.lastAccessed,
          isFileBacked: typeof item.value === 'string' && item.value.startsWith('file://'),
          filePath: typeof item.value === 'string' && item.value.startsWith('file://')
            ? item.value
            : null,
        })),
      };

      await RNFS.writeFile(indexPath, JSON.stringify(index), 'utf8');
    } catch (error) {
      console.error('Failed to save cache index:', error);
    }
  }

  /**
   * Load cache index from disk
   */
  private async loadCacheIndex(): Promise<void> {
    try {
      const indexPath = `${this.cacheDirectory}/cache_index.json`;
      const exists = await RNFS.exists(indexPath);

      if (!exists) {
        return;
      }

      const content = await RNFS.readFile(indexPath, 'utf8');
      const index = JSON.parse(content);

      // Restore cache items
      for (const item of index.items) {
        // Skip expired items
        if (Date.now() > item.expiresAt) {
          continue;
        }

        const cachedItem: CachedItem = {
          key: item.key,
          value: item.isFileBacked ? item.filePath : null,
          size: item.size,
          timestamp: item.timestamp,
          expiresAt: item.expiresAt,
          accessCount: item.accessCount,
          lastAccessed: item.lastAccessed,
        };

        this.cache.set(item.key, cachedItem);
        this.currentSize += item.size;
      }

      console.log(`Loaded ${this.cache.size} items from cache index`);
    } catch (error) {
      console.error('Failed to load cache index:', error);
    }
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.removeExpired();
    }, this.config.cleanupInterval);
  }

  /**
   * Stop cleanup interval
   */
  private stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Update cache configuration
   */
  updateConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };

    // Restart cleanup interval if changed
    if (config.cleanupInterval) {
      this.stopCleanupInterval();
      this.startCleanupInterval();
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): CacheConfig {
    return { ...this.config };
  }

  /**
   * Dispose cache service
   */
  async dispose(): Promise<void> {
    this.stopCleanupInterval();
    await this.saveCacheIndex();
    console.log('Cache service disposed');
  }
}

/**
 * API Response Cache Service
 * Specialized cache for API responses
 */
export class ApiResponseCache extends CacheService {
  constructor(config?: Partial<CacheConfig>) {
    const defaultConfig: CacheConfig = {
      maxSize: 10 * 1024 * 1024, // 10MB
      maxItems: 100,
      ttl: 3600000, // 1 hour
      cleanupInterval: 300000, // 5 minutes
      ...config,
    };
    super(defaultConfig);
  }

  /**
   * Cache API response with automatic key generation
   */
  async cacheResponse<T>(
    endpoint: string,
    params: Record<string, any>,
    response: T,
    ttl?: number
  ): Promise<void> {
    const key = this.generateCacheKey(endpoint, params);
    await this.set(key, response, ttl);
  }

  /**
   * Get cached API response
   */
  async getCachedResponse<T>(endpoint: string, params: Record<string, any>): Promise<T | null> {
    const key = this.generateCacheKey(endpoint, params);
    return await this.get<T>(key);
  }

  /**
   * Generate cache key from endpoint and parameters
   */
  private generateCacheKey(endpoint: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, any>);

    return `api_${endpoint}_${JSON.stringify(sortedParams)}`;
  }

  /**
   * Invalidate cache for endpoint
   */
  async invalidateEndpoint(endpoint: string): Promise<number> {
    const pattern = `^api_${endpoint}_`;
    return await this.deleteByPattern(pattern);
  }
}

export default CacheService;
