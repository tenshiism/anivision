import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

/**
 * Image metadata interface
 */
export interface ImageMetadata {
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  species?: string;
  commonName?: string;
  scientificName?: string;
}

/**
 * Cached image interface
 */
export interface CachedImage {
  id: string;
  uri: string;
  timestamp: number;
  size: number;
  metadata: ImageMetadata;
  thumbnailUri?: string;
  lastAccessed: number;
}

/**
 * Scan result interface
 */
export interface ScanResult {
  imageId: string;
  timestamp: number;
  species: string;
  commonName: string;
  scientificName: string;
  confidence: number;
  description: string;
  characteristics: string[];
  habitat: string;
  distribution: string;
  conservationStatus?: string;
  additionalInfo?: Record<string, any>;
}

/**
 * Cache statistics interface
 */
export interface CacheStats {
  totalImages: number;
  totalScans: number;
  totalSize: number;
  oldestEntry: number | null;
  newestEntry: number | null;
  hitRate: number;
  missRate: number;
}

/**
 * Cache State Interface
 * Manages cached images and scan results
 */
export interface CacheState {
  images: Record<string, CachedImage>;
  scanResults: Record<string, ScanResult>;
  lastCleanup: number;
  maxSize: number; // in bytes
  currentSize: number; // in bytes
  stats: CacheStats;
  isCleaningUp: boolean;
}

/**
 * Initial state for cache slice
 */
const initialState: CacheState = {
  images: {},
  scanResults: {},
  lastCleanup: Date.now(),
  maxSize: 100 * 1024 * 1024, // 100MB default
  currentSize: 0,
  stats: {
    totalImages: 0,
    totalScans: 0,
    totalSize: 0,
    oldestEntry: null,
    newestEntry: null,
    hitRate: 0,
    missRate: 0,
  },
  isCleaningUp: false,
};

/**
 * Calculate cache statistics
 */
const calculateStats = (state: CacheState): CacheStats => {
  const imageTimestamps = Object.values(state.images).map((img) => img.timestamp);
  const scanTimestamps = Object.values(state.scanResults).map((scan) => scan.timestamp);
  const allTimestamps = [...imageTimestamps, ...scanTimestamps];

  return {
    totalImages: Object.keys(state.images).length,
    totalScans: Object.keys(state.scanResults).length,
    totalSize: state.currentSize,
    oldestEntry: allTimestamps.length > 0 ? Math.min(...allTimestamps) : null,
    newestEntry: allTimestamps.length > 0 ? Math.max(...allTimestamps) : null,
    hitRate: state.stats.hitRate,
    missRate: state.stats.missRate,
  };
};

/**
 * Async thunk to clean up old cache entries
 */
export const cleanupCache = createAsyncThunk<
  { removedImages: string[]; freedSize: number },
  void,
  { state: RootState }
>(
  'cache/cleanup',
  async (_, { getState }) => {
    const { cache } = getState();
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    const removedImages: string[] = [];
    let freedSize = 0;

    // Find images to remove (older than maxAge or least recently accessed)
    const imagesToRemove = Object.entries(cache.images)
      .filter(([_, img]) => {
        const age = now - img.timestamp;
        const lastAccessedAge = now - img.lastAccessed;
        return age > maxAge || lastAccessedAge > maxAge;
      })
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

    // Remove old images if cache is over 90% full
    const cacheUsage = cache.currentSize / cache.maxSize;
    const imagesToDelete = cacheUsage > 0.9
      ? imagesToRemove.slice(0, Math.ceil(imagesToRemove.length * 0.3))
      : imagesToRemove;

    imagesToDelete.forEach(([id, img]) => {
      removedImages.push(id);
      freedSize += img.size;
    });

    return { removedImages, freedSize };
  }
);

/**
 * Cache slice definition
 * Contains reducers for managing cached data
 */
const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    /**
     * Cache an image
     */
    cacheImage: (state, action: PayloadAction<CachedImage>) => {
      const image = action.payload;
      state.images[image.id] = {
        ...image,
        lastAccessed: Date.now(),
      };
      state.currentSize += image.size;
      state.stats = calculateStats(state);
    },

    /**
     * Remove a cached image
     */
    removeCachedImage: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const image = state.images[id];
      if (image) {
        state.currentSize -= image.size;
        delete state.images[id];
        // Also remove associated scan result
        delete state.scanResults[id];
        state.stats = calculateStats(state);
      }
    },

    /**
     * Update image last accessed time
     */
    updateImageAccess: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.images[id]) {
        state.images[id].lastAccessed = Date.now();
        state.stats.hitRate += 1;
      } else {
        state.stats.missRate += 1;
      }
    },

    /**
     * Cache a scan result
     */
    cacheScanResult: (state, action: PayloadAction<ScanResult>) => {
      const result = action.payload;
      state.scanResults[result.imageId] = result;
      state.stats = calculateStats(state);
    },

    /**
     * Remove a scan result
     */
    removeScanResult: (state, action: PayloadAction<string>) => {
      const imageId = action.payload;
      delete state.scanResults[imageId];
      state.stats = calculateStats(state);
    },

    /**
     * Get scan result by image ID
     */
    getScanResult: (state, action: PayloadAction<string>) => {
      const imageId = action.payload;
      if (state.scanResults[imageId]) {
        state.stats.hitRate += 1;
      } else {
        state.stats.missRate += 1;
      }
    },

    /**
     * Update cache max size
     */
    setMaxCacheSize: (state, action: PayloadAction<number>) => {
      state.maxSize = action.payload;
    },

    /**
     * Clear all cached images
     */
    clearImageCache: (state) => {
      state.images = {};
      state.currentSize = 0;
      state.stats = calculateStats(state);
    },

    /**
     * Clear all scan results
     */
    clearScanResults: (state) => {
      state.scanResults = {};
      state.stats = calculateStats(state);
    },

    /**
     * Clear entire cache
     */
    clearCache: (state) => {
      state.images = {};
      state.scanResults = {};
      state.currentSize = 0;
      state.lastCleanup = Date.now();
      state.stats = {
        totalImages: 0,
        totalScans: 0,
        totalSize: 0,
        oldestEntry: null,
        newestEntry: null,
        hitRate: 0,
        missRate: 0,
      };
    },

    /**
     * Update cache statistics
     */
    updateCacheStats: (state) => {
      state.stats = calculateStats(state);
    },

    /**
     * Reset cache state
     */
    resetCache: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Cleanup cache pending
      .addCase(cleanupCache.pending, (state) => {
        state.isCleaningUp = true;
      })
      // Cleanup cache fulfilled
      .addCase(cleanupCache.fulfilled, (state, action) => {
        const { removedImages, freedSize } = action.payload;

        // Remove images
        removedImages.forEach((id) => {
          delete state.images[id];
          delete state.scanResults[id];
        });

        state.currentSize -= freedSize;
        state.lastCleanup = Date.now();
        state.isCleaningUp = false;
        state.stats = calculateStats(state);
      })
      // Cleanup cache rejected
      .addCase(cleanupCache.rejected, (state) => {
        state.isCleaningUp = false;
      });
  },
});

// Export actions
export const {
  cacheImage,
  removeCachedImage,
  updateImageAccess,
  cacheScanResult,
  removeScanResult,
  getScanResult,
  setMaxCacheSize,
  clearImageCache,
  clearScanResults,
  clearCache,
  updateCacheStats,
  resetCache,
} = cacheSlice.actions;

// Export reducer
export default cacheSlice.reducer;

// Selectors
export const selectCachedImages = (state: RootState) => state.cache.images;
export const selectScanResults = (state: RootState) => state.cache.scanResults;
export const selectCacheSize = (state: RootState) => state.cache.currentSize;
export const selectMaxCacheSize = (state: RootState) => state.cache.maxSize;
export const selectCacheStats = (state: RootState) => state.cache.stats;
export const selectIsCleaningUp = (state: RootState) => state.cache.isCleaningUp;
export const selectCachedImage = (id: string) => (state: RootState) => state.cache.images[id];
export const selectScanResultByImageId = (imageId: string) => (state: RootState) =>
  state.cache.scanResults[imageId];
export const selectCacheUsagePercentage = (state: RootState) =>
  (state.cache.currentSize / state.cache.maxSize) * 100;
