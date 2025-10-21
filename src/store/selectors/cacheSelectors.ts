import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

/**
 * Cache Selectors
 * Memoized selectors for cache state
 */

// Base selectors
const selectCacheState = (state: RootState) => state.cache;

/**
 * Select all cached images
 */
export const selectCachedImages = createSelector(
  [selectCacheState],
  (cache) => cache.images
);

/**
 * Select cached images as array
 */
export const selectCachedImagesArray = createSelector(
  [selectCachedImages],
  (images) => Object.values(images)
);

/**
 * Select specific cached image by ID
 */
export const selectCachedImageById = (id: string) =>
  createSelector([selectCachedImages], (images) => images[id] || null);

/**
 * Select all scan results
 */
export const selectScanResults = createSelector(
  [selectCacheState],
  (cache) => cache.scanResults
);

/**
 * Select scan results as array
 */
export const selectScanResultsArray = createSelector(
  [selectScanResults],
  (scanResults) => Object.values(scanResults)
);

/**
 * Select scan result by image ID
 */
export const selectScanResultByImageId = (imageId: string) =>
  createSelector([selectScanResults], (scanResults) => scanResults[imageId] || null);

/**
 * Select current cache size
 */
export const selectCacheSize = createSelector(
  [selectCacheState],
  (cache) => cache.currentSize
);

/**
 * Select max cache size
 */
export const selectMaxCacheSize = createSelector(
  [selectCacheState],
  (cache) => cache.maxSize
);

/**
 * Select cache usage percentage
 */
export const selectCacheUsagePercentage = createSelector(
  [selectCacheSize, selectMaxCacheSize],
  (currentSize, maxSize) => {
    if (maxSize === 0) return 0;
    return (currentSize / maxSize) * 100;
  }
);

/**
 * Select if cache is nearly full (>90%)
 */
export const selectIsCacheNearlyFull = createSelector(
  [selectCacheUsagePercentage],
  (usagePercentage) => usagePercentage > 90
);

/**
 * Select cache statistics
 */
export const selectCacheStats = createSelector(
  [selectCacheState],
  (cache) => cache.stats
);

/**
 * Select total cached images count
 */
export const selectCachedImagesCount = createSelector(
  [selectCacheStats],
  (stats) => stats.totalImages
);

/**
 * Select total scan results count
 */
export const selectScanResultsCount = createSelector(
  [selectCacheStats],
  (stats) => stats.totalScans
);

/**
 * Select cache hit rate
 */
export const selectCacheHitRate = createSelector(
  [selectCacheStats],
  (stats) => {
    const total = stats.hitRate + stats.missRate;
    if (total === 0) return 0;
    return (stats.hitRate / total) * 100;
  }
);

/**
 * Select if cache cleanup is in progress
 */
export const selectIsCleaningUp = createSelector(
  [selectCacheState],
  (cache) => cache.isCleaningUp
);

/**
 * Select last cleanup time
 */
export const selectLastCleanupTime = createSelector(
  [selectCacheState],
  (cache) => cache.lastCleanup
);

/**
 * Select time since last cleanup (in milliseconds)
 */
export const selectTimeSinceLastCleanup = createSelector(
  [selectLastCleanupTime],
  (lastCleanup) => Date.now() - lastCleanup
);

/**
 * Select if cleanup is needed (more than 24 hours since last cleanup)
 */
export const selectNeedsCleanup = createSelector(
  [selectTimeSinceLastCleanup, selectIsCacheNearlyFull],
  (timeSinceCleanup, isNearlyFull) => {
    const dayInMs = 24 * 60 * 60 * 1000;
    return timeSinceCleanup > dayInMs || isNearlyFull;
  }
);

/**
 * Select cached images sorted by timestamp (newest first)
 */
export const selectCachedImagesSortedByDate = createSelector(
  [selectCachedImagesArray],
  (images) => [...images].sort((a, b) => b.timestamp - a.timestamp)
);

/**
 * Select cached images sorted by last accessed (most recent first)
 */
export const selectCachedImagesSortedByAccess = createSelector(
  [selectCachedImagesArray],
  (images) => [...images].sort((a, b) => b.lastAccessed - a.lastAccessed)
);

/**
 * Select cached images by species
 */
export const selectCachedImagesBySpecies = (species: string) =>
  createSelector([selectCachedImagesArray], (images) =>
    images.filter((img) => img.metadata.species === species)
  );

/**
 * Select scan results sorted by confidence (highest first)
 */
export const selectScanResultsSortedByConfidence = createSelector(
  [selectScanResultsArray],
  (scanResults) => [...scanResults].sort((a, b) => b.confidence - a.confidence)
);

/**
 * Select scan results by species
 */
export const selectScanResultsBySpecies = (species: string) =>
  createSelector([selectScanResultsArray], (scanResults) =>
    scanResults.filter((result) => result.species === species)
  );

/**
 * Select unique species from scan results
 */
export const selectUniqueSpecies = createSelector(
  [selectScanResultsArray],
  (scanResults) => {
    const speciesSet = new Set(scanResults.map((result) => result.species));
    return Array.from(speciesSet);
  }
);

/**
 * Select species statistics (count per species)
 */
export const selectSpeciesStatistics = createSelector(
  [selectScanResultsArray],
  (scanResults) => {
    const stats: Record<string, number> = {};

    scanResults.forEach((result) => {
      stats[result.species] = (stats[result.species] || 0) + 1;
    });

    return Object.entries(stats)
      .map(([species, count]) => ({ species, count }))
      .sort((a, b) => b.count - a.count);
  }
);

/**
 * Select oldest cached image
 */
export const selectOldestCachedImage = createSelector(
  [selectCachedImagesArray],
  (images) => {
    if (images.length === 0) return null;
    return images.reduce((oldest, img) =>
      img.timestamp < oldest.timestamp ? img : oldest
    );
  }
);

/**
 * Select newest cached image
 */
export const selectNewestCachedImage = createSelector(
  [selectCachedImagesArray],
  (images) => {
    if (images.length === 0) return null;
    return images.reduce((newest, img) =>
      img.timestamp > newest.timestamp ? img : newest
    );
  }
);

/**
 * Select available cache space (in bytes)
 */
export const selectAvailableCacheSpace = createSelector(
  [selectCacheSize, selectMaxCacheSize],
  (currentSize, maxSize) => maxSize - currentSize
);

/**
 * Select cache size in human-readable format
 */
export const selectCacheSizeFormatted = createSelector(
  [selectCacheSize],
  (size) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let formattedSize = size;

    while (formattedSize >= 1024 && unitIndex < units.length - 1) {
      formattedSize /= 1024;
      unitIndex++;
    }

    return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
  }
);
