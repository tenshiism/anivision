/**
 * Storage Services Barrel Export
 * Exports all storage-related services and utilities
 */

export { ImageStorageService } from './ImageStorageService';
export { MetadataService } from './MetadataService';
export { CacheService, ApiResponseCache } from './CacheService';

// Re-export types for convenience
export type {
  ImageMetadata,
  SpeciesIdentification,
  ScanResult,
  StorageConfig,
  StorageInfo,
  CachedItem,
  CacheConfig,
  QueryOptions,
  IntegrityReport,
  IntegrityIssue,
  BackupData,
  CleanupResult,
  StorageEventType,
  StorageEvent,
} from '../../types/storage';

/**
 * Default storage configuration
 */
export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  maxStorageSize: 500 * 1024 * 1024, // 500MB
  maxImageCount: 1000,
  thumbnailSize: {
    width: 300,
    height: 300,
    quality: 0.7,
  },
  compressionQuality: 0.8,
  autoCleanup: true,
  backupEnabled: false,
  cacheTTL: 3600000, // 1 hour
  maxCacheSize: 50 * 1024 * 1024, // 50MB
};

/**
 * Default cache configuration
 */
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  maxSize: 50 * 1024 * 1024, // 50MB
  maxItems: 500,
  ttl: 3600000, // 1 hour
  cleanupInterval: 300000, // 5 minutes
};

// Import types from storage.ts
import type { StorageConfig, CacheConfig } from '../../types/storage';
