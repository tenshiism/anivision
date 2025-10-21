import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RNFS from 'react-native-fs';

/**
 * Species identification information
 */
export interface SpeciesIdentification {
  commonName: string;
  scientificName: string;
  confidence: number;
  family?: string;
  order?: string;
  class?: string;
}

/**
 * Scan result interface
 */
export interface ScanResult {
  species: SpeciesIdentification;
  summary: string;
  additionalSpecies?: Array<{
    commonName: string;
    scientificName: string;
    confidence: number;
  }>;
  details?: {
    habitat?: string;
    behavior?: string;
    conservation?: string;
    interestingFacts?: string[];
  };
  imageQuality?: {
    clarity: 'high' | 'medium' | 'low';
    lighting: 'good' | 'fair' | 'poor';
    angle: 'frontal' | 'side' | 'top' | 'obscured';
  };
  timestamp: number;
  imageUri: string;
}

/**
 * Image metadata interface
 */
export interface ImageMetadata {
  id: string;
  originalUri: string;
  thumbnailUri: string;
  fileName: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  timestamp: number;
  species: SpeciesIdentification;
  scanResult: ScanResult;
  tags: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  deviceInfo?: {
    platform: string;
    model: string;
    osVersion: string;
  };
}

/**
 * Return type for useImageStorage hook
 */
export interface UseImageStorageReturn {
  saveImage: (imageUri: string, metadata: Partial<ImageMetadata>) => Promise<string>;
  getImages: (filter?: ImageFilter) => Promise<ImageMetadata[]>;
  getImageById: (imageId: string) => Promise<ImageMetadata | null>;
  deleteImage: (imageId: string) => Promise<void>;
  organizeImages: () => Promise<void>;
  searchImages: (query: string) => Promise<ImageMetadata[]>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Image filter options
 */
export interface ImageFilter {
  species?: string;
  startDate?: Date;
  endDate?: Date;
  minConfidence?: number;
  tags?: string[];
}

/**
 * Storage paths
 */
const STORAGE_PATHS = {
  root: `${RNFS.DocumentDirectoryPath}/AniVision`,
  images: `${RNFS.DocumentDirectoryPath}/AniVision/images`,
  original: `${RNFS.DocumentDirectoryPath}/AniVision/images/original`,
  thumbnails: `${RNFS.DocumentDirectoryPath}/AniVision/images/thumbnails`,
  metadata: `${RNFS.DocumentDirectoryPath}/AniVision/images/metadata`,
  cache: `${RNFS.DocumentDirectoryPath}/AniVision/cache`,
  temp: `${RNFS.DocumentDirectoryPath}/AniVision/temp`,
};

/**
 * Custom hook for managing local image storage and retrieval
 *
 * Features:
 * - Save images with metadata
 * - Retrieve images with filtering
 * - Delete images
 * - Organize images by species
 * - Search images
 * - Generate thumbnails
 * - Manage storage cache
 *
 * @returns {UseImageStorageReturn} Image storage functionality and state
 *
 * @example
 * ```typescript
 * const {
 *   saveImage,
 *   getImages,
 *   deleteImage,
 *   organizeImages,
 *   searchImages,
 *   isLoading,
 *   error
 * } = useImageStorage();
 *
 * // Save an image
 * const imageId = await saveImage('file:///path/to/image.jpg', metadata);
 *
 * // Get all images
 * const images = await getImages();
 *
 * // Search images
 * const results = await searchImages('cat');
 *
 * // Delete image
 * await deleteImage(imageId);
 * ```
 */
export const useImageStorage = (): UseImageStorageReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  // Get cached images from Redux store
  const cachedImages = useSelector((state: any) => state.cache?.images || {});

  /**
   * Initialize storage directories
   */
  const initializeStorage = useCallback(async (): Promise<void> => {
    try {
      // Create all required directories
      for (const path of Object.values(STORAGE_PATHS)) {
        const exists = await RNFS.exists(path);
        if (!exists) {
          await RNFS.mkdir(path);
        }
      }
    } catch (err) {
      console.error('Failed to initialize storage:', err);
      throw new Error('Storage initialization failed');
    }
  }, []);

  // Initialize storage on mount
  useEffect(() => {
    initializeStorage().catch((err) => {
      setError(err.message);
    });
  }, [initializeStorage]);

  /**
   * Generate unique ID for image
   */
  const generateId = (): string => {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Generate filename from species name
   */
  const generateFileName = (species: SpeciesIdentification): string => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const scientificName = species.scientificName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 50);

    return `${scientificName}_${timestamp}.jpg`;
  };

  /**
   * Get date-based subdirectory path
   */
  const getDatePath = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}/${month}`;
  };

  /**
   * Generate thumbnail from original image
   */
  const generateThumbnail = async (
    originalPath: string,
    fileName: string
  ): Promise<string> => {
    // Note: In a real implementation, this would use an image manipulation library
    // like react-native-image-resizer or similar
    const thumbnailFileName = `thumb_${fileName}`;
    const thumbnailPath = `${STORAGE_PATHS.thumbnails}/${thumbnailFileName}`;

    try {
      // For now, just copy the original (in production, would resize)
      await RNFS.copyFile(originalPath, thumbnailPath);
      return thumbnailPath;
    } catch (err) {
      console.error('Failed to generate thumbnail:', err);
      throw new Error('Thumbnail generation failed');
    }
  };

  /**
   * Save metadata to JSON file
   */
  const saveMetadataFile = async (metadata: ImageMetadata): Promise<void> => {
    const metadataPath = `${STORAGE_PATHS.metadata}/${metadata.id}.json`;
    await RNFS.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
  };

  /**
   * Load metadata from JSON file
   */
  const loadMetadataFile = async (imageId: string): Promise<ImageMetadata | null> => {
    try {
      const metadataPath = `${STORAGE_PATHS.metadata}/${imageId}.json`;
      const exists = await RNFS.exists(metadataPath);

      if (!exists) {
        return null;
      }

      const content = await RNFS.readFile(metadataPath, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Failed to load metadata:', err);
      return null;
    }
  };

  /**
   * Save image with metadata
   */
  const saveImage = useCallback(
    async (imageUri: string, metadata: Partial<ImageMetadata>): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        // Ensure storage is initialized
        await initializeStorage();

        // Generate ID and filename
        const id = generateId();
        const fileName = metadata.species
          ? generateFileName(metadata.species)
          : `image_${Date.now()}.jpg`;

        // Create date-based subdirectory
        const datePath = getDatePath();
        const dateDir = `${STORAGE_PATHS.original}/${datePath}`;
        const exists = await RNFS.exists(dateDir);
        if (!exists) {
          await RNFS.mkdir(dateDir);
        }

        // Copy original image
        const originalPath = `${dateDir}/${fileName}`;
        await RNFS.copyFile(imageUri, originalPath);

        // Generate thumbnail
        const thumbnailPath = await generateThumbnail(originalPath, fileName);

        // Get file size
        const stat = await RNFS.stat(originalPath);

        // Create full metadata
        const fullMetadata: ImageMetadata = {
          id,
          originalUri: originalPath,
          thumbnailUri: thumbnailPath,
          fileName,
          fileSize: stat.size,
          dimensions: metadata.dimensions || { width: 0, height: 0 },
          timestamp: Date.now(),
          species: metadata.species || {
            commonName: 'Unknown',
            scientificName: 'Unknown',
            confidence: 0,
          },
          scanResult: metadata.scanResult || ({} as any),
          tags: metadata.tags || [],
          location: metadata.location,
          deviceInfo: metadata.deviceInfo,
        };

        // Save metadata file
        await saveMetadataFile(fullMetadata);

        // Cache in Redux
        dispatch({
          type: 'cache/cacheImage',
          payload: {
            id,
            image: {
              uri: originalPath,
              timestamp: fullMetadata.timestamp,
              size: fullMetadata.fileSize,
              metadata: fullMetadata,
            },
          },
        });

        return id;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save image';
        setError(errorMessage);
        console.error('Image save error:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, initializeStorage]
  );

  /**
   * Get all metadata files
   */
  const getAllMetadata = async (): Promise<ImageMetadata[]> => {
    try {
      const exists = await RNFS.exists(STORAGE_PATHS.metadata);
      if (!exists) {
        return [];
      }

      const files = await RNFS.readDir(STORAGE_PATHS.metadata);
      const metadataFiles = files.filter((file) => file.name.endsWith('.json'));

      const metadata = await Promise.all(
        metadataFiles.map(async (file) => {
          const content = await RNFS.readFile(file.path, 'utf8');
          return JSON.parse(content) as ImageMetadata;
        })
      );

      return metadata.sort((a, b) => b.timestamp - a.timestamp);
    } catch (err) {
      console.error('Failed to get all metadata:', err);
      return [];
    }
  };

  /**
   * Get images with optional filtering
   */
  const getImages = useCallback(
    async (filter?: ImageFilter): Promise<ImageMetadata[]> => {
      setIsLoading(true);
      setError(null);

      try {
        let images = await getAllMetadata();

        // Apply filters
        if (filter) {
          if (filter.species) {
            const speciesLower = filter.species.toLowerCase();
            images = images.filter(
              (img) =>
                img.species.commonName.toLowerCase().includes(speciesLower) ||
                img.species.scientificName.toLowerCase().includes(speciesLower)
            );
          }

          if (filter.startDate) {
            images = images.filter((img) => img.timestamp >= filter.startDate!.getTime());
          }

          if (filter.endDate) {
            images = images.filter((img) => img.timestamp <= filter.endDate!.getTime());
          }

          if (filter.minConfidence !== undefined) {
            images = images.filter((img) => img.species.confidence >= filter.minConfidence!);
          }

          if (filter.tags && filter.tags.length > 0) {
            images = images.filter((img) =>
              filter.tags!.some((tag) => img.tags.includes(tag))
            );
          }
        }

        return images;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get images';
        setError(errorMessage);
        console.error('Get images error:', err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Get image by ID
   */
  const getImageById = useCallback(async (imageId: string): Promise<ImageMetadata | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await loadMetadataFile(imageId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get image';
      setError(errorMessage);
      console.error('Get image by ID error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete image and its metadata
   */
  const deleteImage = useCallback(
    async (imageId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // Load metadata
        const metadata = await loadMetadataFile(imageId);

        if (metadata) {
          // Delete original image
          const originalExists = await RNFS.exists(metadata.originalUri);
          if (originalExists) {
            await RNFS.unlink(metadata.originalUri);
          }

          // Delete thumbnail
          const thumbnailExists = await RNFS.exists(metadata.thumbnailUri);
          if (thumbnailExists) {
            await RNFS.unlink(metadata.thumbnailUri);
          }

          // Delete metadata file
          const metadataPath = `${STORAGE_PATHS.metadata}/${imageId}.json`;
          const metadataExists = await RNFS.exists(metadataPath);
          if (metadataExists) {
            await RNFS.unlink(metadataPath);
          }

          // Remove from Redux cache
          dispatch({
            type: 'cache/removeCachedImage',
            payload: imageId,
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete image';
        setError(errorMessage);
        console.error('Delete image error:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  /**
   * Organize images by species
   */
  const organizeImages = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const images = await getAllMetadata();
      const speciesGroups = new Map<string, ImageMetadata[]>();

      // Group by species
      images.forEach((image) => {
        const key = image.species.scientificName;
        if (!speciesGroups.has(key)) {
          speciesGroups.set(key, []);
        }
        speciesGroups.get(key)!.push(image);
      });

      // Log organization results
      console.log(`Organized ${images.length} images into ${speciesGroups.size} species groups`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to organize images';
      setError(errorMessage);
      console.error('Organize images error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Search images by query
   */
  const searchImages = useCallback(async (query: string): Promise<ImageMetadata[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const images = await getAllMetadata();
      const lowercaseQuery = query.toLowerCase();

      return images.filter(
        (img) =>
          img.species.commonName.toLowerCase().includes(lowercaseQuery) ||
          img.species.scientificName.toLowerCase().includes(lowercaseQuery) ||
          img.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
          img.scanResult.summary?.toLowerCase().includes(lowercaseQuery)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search images';
      setError(errorMessage);
      console.error('Search images error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    saveImage,
    getImages,
    getImageById,
    deleteImage,
    organizeImages,
    searchImages,
    isLoading,
    error,
    clearError,
  };
};

export default useImageStorage;
