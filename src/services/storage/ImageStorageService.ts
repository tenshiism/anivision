/**
 * ImageStorageService
 * Handles local image storage, thumbnail generation, and file management
 */

import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import type {
  ImageMetadata,
  ScanResult,
  StorageConfig,
  StorageInfo,
  CleanupResult,
} from '../../types/storage';

export class ImageStorageService {
  private config: StorageConfig;
  private storageDirectory: string;
  private readonly IMAGE_QUALITY = 0.8;
  private readonly THUMBNAIL_QUALITY = 0.7;

  constructor(config: StorageConfig) {
    this.config = config;
    this.storageDirectory = `${RNFS.DocumentDirectoryPath}/AniVision`;
    this.initializeStorage();
  }

  /**
   * Initialize storage directory structure
   */
  private async initializeStorage(): Promise<void> {
    try {
      const directories = [
        `${this.storageDirectory}/images/original`,
        `${this.storageDirectory}/images/thumbnails`,
        `${this.storageDirectory}/cache`,
        `${this.storageDirectory}/temp`,
      ];

      for (const dir of directories) {
        await this.ensureDirectoryExists(dir);
      }

      console.log('Storage initialized successfully');
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw new Error(`Storage initialization failed: ${error}`);
    }
  }

  /**
   * Ensure directory exists, create if not
   */
  private async ensureDirectoryExists(path: string): Promise<void> {
    const exists = await RNFS.exists(path);
    if (!exists) {
      await RNFS.mkdir(path);
    }
  }

  /**
   * Save image to local storage
   */
  async saveImage(
    imageUri: string,
    scanResult: ScanResult,
    metadata?: Partial<ImageMetadata>
  ): Promise<ImageMetadata> {
    try {
      // Generate filename based on scientific name
      const fileName = this.generateFileName(scanResult.species.scientificName);

      // Save original image
      const originalPath = await this.saveOriginalImage(imageUri, fileName);

      // Generate and save thumbnail
      const thumbnailPath = await this.generateThumbnail(originalPath, fileName);

      // Get image dimensions and file size
      const fileSize = await this.getFileSize(originalPath);
      const dimensions = await this.getImageDimensions(originalPath);

      // Create metadata
      const imageMetadata: ImageMetadata = {
        id: this.generateId(),
        originalUri: originalPath,
        thumbnailUri: thumbnailPath,
        fileName,
        fileSize,
        dimensions,
        timestamp: Date.now(),
        species: scanResult.species,
        scanResult,
        tags: this.generateTags(scanResult),
        location: metadata?.location,
        deviceInfo: await this.getDeviceInfo(),
        ...metadata,
      };

      // Check storage limits
      await this.checkStorageLimits();

      return imageMetadata;
    } catch (error) {
      console.error('Failed to save image:', error);
      throw new Error(`Image save failed: ${error}`);
    }
  }

  /**
   * Generate filename from scientific name and timestamp
   * Format: {scientific_name}_{timestamp}.jpg
   */
  private generateFileName(scientificName: string): string {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, '_')
      .substring(0, 15); // Format: YYYY_MM_DD_HH_mm

    // Sanitize scientific name: lowercase, replace spaces/special chars with underscore
    const sanitized = scientificName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .substring(0, 50); // Limit length

    return `${sanitized}_${timestamp}.jpg`;
  }

  /**
   * Save original image to storage with date-based directory structure
   */
  private async saveOriginalImage(sourceUri: string, fileName: string): Promise<string> {
    const datePath = this.getDatePath();
    const targetDir = `${this.storageDirectory}/images/original/${datePath}`;

    // Ensure date directory exists
    await this.ensureDirectoryExists(targetDir);

    const targetPath = `${targetDir}/${fileName}`;

    // Copy image to storage
    await RNFS.copyFile(sourceUri, targetPath);

    return targetPath;
  }

  /**
   * Generate thumbnail for image
   */
  private async generateThumbnail(originalPath: string, fileName: string): Promise<string> {
    const thumbnailFileName = `thumb_${fileName}`;
    const thumbnailPath = `${this.storageDirectory}/images/thumbnails/${thumbnailFileName}`;

    try {
      // For React Native, we'll use a simple copy for now
      // In production, integrate with react-native-image-resizer
      // Example:
      // const result = await ImageResizer.createResizedImage(
      //   originalPath,
      //   this.config.thumbnailSize.width,
      //   this.config.thumbnailSize.height,
      //   'JPEG',
      //   this.config.thumbnailSize.quality * 100,
      //   0
      // );
      // await RNFS.moveFile(result.uri, thumbnailPath);

      // Placeholder: copy file (replace with actual resizing in production)
      await RNFS.copyFile(originalPath, thumbnailPath);

      return thumbnailPath;
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
      // Fallback: use original image as thumbnail
      return originalPath;
    }
  }

  /**
   * Get date-based path for organizing images
   * Format: YYYY/MM
   */
  private getDatePath(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}/${month}`;
  }

  /**
   * Get file size in bytes
   */
  private async getFileSize(path: string): Promise<number> {
    try {
      const stat = await RNFS.stat(path);
      return parseInt(stat.size, 10);
    } catch (error) {
      console.error('Failed to get file size:', error);
      return 0;
    }
  }

  /**
   * Get image dimensions
   * Note: In production, use react-native-image-size or similar
   */
  private async getImageDimensions(path: string): Promise<{ width: number; height: number }> {
    // Placeholder - integrate with actual image dimension library
    // Example: const size = await Image.getSize(path);
    return { width: 1920, height: 1080 };
  }

  /**
   * Generate tags from scan result
   */
  private generateTags(scanResult: ScanResult): string[] {
    const tags: string[] = [];

    // Add common name as tag
    if (scanResult.species.commonName) {
      tags.push(scanResult.species.commonName.toLowerCase());
    }

    // Add scientific name parts
    if (scanResult.species.scientificName) {
      const parts = scanResult.species.scientificName.toLowerCase().split(' ');
      tags.push(...parts);
    }

    // Add taxonomy if available
    const taxonomy = scanResult.species.taxonomy;
    if (taxonomy) {
      if (taxonomy.family) tags.push(taxonomy.family.toLowerCase());
      if (taxonomy.order) tags.push(taxonomy.order.toLowerCase());
      if (taxonomy.class) tags.push(taxonomy.class.toLowerCase());
    }

    // Remove duplicates
    return [...new Set(tags)];
  }

  /**
   * Get device information
   */
  private async getDeviceInfo(): Promise<{ platform: string; model: string; osVersion: string }> {
    // In production, use react-native-device-info
    return {
      platform: Platform.OS,
      model: 'Unknown',
      osVersion: Platform.Version.toString(),
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delete image and associated files
   */
  async deleteImage(metadata: ImageMetadata): Promise<void> {
    try {
      // Delete original image
      if (await RNFS.exists(metadata.originalUri)) {
        await RNFS.unlink(metadata.originalUri);
      }

      // Delete thumbnail
      if (await RNFS.exists(metadata.thumbnailUri)) {
        await RNFS.unlink(metadata.thumbnailUri);
      }

      console.log(`Deleted image: ${metadata.id}`);
    } catch (error) {
      console.error('Failed to delete image:', error);
      throw new Error(`Image deletion failed: ${error}`);
    }
  }

  /**
   * Get storage information
   */
  async getStorageInfo(): Promise<StorageInfo> {
    try {
      const usedSpace = await this.calculateUsedSpace();
      const freeSpace = await this.getFreeSpace();
      const totalSpace = usedSpace + freeSpace;

      return {
        totalSpace,
        usedSpace,
        freeSpace,
        usagePercentage: totalSpace > 0 ? (usedSpace / totalSpace) * 100 : 0,
        imageCount: await this.getImageCount(),
        cacheSize: await this.getCacheSize(),
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      throw error;
    }
  }

  /**
   * Calculate used storage space
   */
  private async calculateUsedSpace(): Promise<number> {
    try {
      let totalSize = 0;
      const directories = [
        `${this.storageDirectory}/images/original`,
        `${this.storageDirectory}/images/thumbnails`,
      ];

      for (const dir of directories) {
        totalSize += await this.calculateDirectorySize(dir);
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to calculate used space:', error);
      return 0;
    }
  }

  /**
   * Calculate directory size recursively
   */
  private async calculateDirectorySize(directory: string): Promise<number> {
    try {
      const exists = await RNFS.exists(directory);
      if (!exists) return 0;

      const files = await RNFS.readDir(directory);
      let totalSize = 0;

      for (const file of files) {
        if (file.isDirectory()) {
          totalSize += await this.calculateDirectorySize(file.path);
        } else {
          totalSize += parseInt(file.size, 10);
        }
      }

      return totalSize;
    } catch (error) {
      console.error(`Failed to calculate directory size: ${directory}`, error);
      return 0;
    }
  }

  /**
   * Get free space on device
   */
  private async getFreeSpace(): Promise<number> {
    try {
      const freeSpace = await RNFS.getFSInfo();
      return freeSpace.freeSpace;
    } catch (error) {
      console.error('Failed to get free space:', error);
      return 0;
    }
  }

  /**
   * Get image count (placeholder - should be implemented with MetadataService)
   */
  private async getImageCount(): Promise<number> {
    try {
      const dir = `${this.storageDirectory}/images/original`;
      const exists = await RNFS.exists(dir);
      if (!exists) return 0;

      const files = await RNFS.readDirAssets(dir);
      return files.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get cache size
   */
  private async getCacheSize(): Promise<number> {
    try {
      return await this.calculateDirectorySize(`${this.storageDirectory}/cache`);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Check storage limits and cleanup if needed
   */
  private async checkStorageLimits(): Promise<void> {
    const storageInfo = await this.getStorageInfo();

    if (storageInfo.usagePercentage > 90) {
      console.warn('Storage usage critical:', storageInfo.usagePercentage);
      await this.performEmergencyCleanup();
    } else if (storageInfo.usagePercentage > 80) {
      console.warn('Storage usage high:', storageInfo.usagePercentage);
      await this.performRoutineCleanup();
    }
  }

  /**
   * Perform routine cleanup
   */
  async performRoutineCleanup(): Promise<CleanupResult> {
    const startTime = Date.now();
    let itemsRemoved = 0;
    let spaceFreed = 0;
    const errors: string[] = [];

    try {
      // Clean temp files
      const tempResult = await this.cleanupTempFiles();
      itemsRemoved += tempResult.itemsRemoved;
      spaceFreed += tempResult.spaceFreed;
    } catch (error) {
      errors.push(`Temp cleanup failed: ${error}`);
    }

    return {
      itemsRemoved,
      spaceFreed,
      duration: Date.now() - startTime,
      errors,
    };
  }

  /**
   * Perform emergency cleanup
   */
  async performEmergencyCleanup(): Promise<CleanupResult> {
    const startTime = Date.now();
    let itemsRemoved = 0;
    let spaceFreed = 0;
    const errors: string[] = [];

    try {
      // Clean all temporary files
      const tempResult = await this.cleanupTempFiles();
      itemsRemoved += tempResult.itemsRemoved;
      spaceFreed += tempResult.spaceFreed;

      // Clear cache
      const cacheResult = await this.clearCache();
      itemsRemoved += cacheResult.itemsRemoved;
      spaceFreed += cacheResult.spaceFreed;
    } catch (error) {
      errors.push(`Emergency cleanup failed: ${error}`);
    }

    return {
      itemsRemoved,
      spaceFreed,
      duration: Date.now() - startTime,
      errors,
    };
  }

  /**
   * Cleanup temporary files
   */
  private async cleanupTempFiles(): Promise<CleanupResult> {
    const tempDir = `${this.storageDirectory}/temp`;
    let itemsRemoved = 0;
    let spaceFreed = 0;

    try {
      const exists = await RNFS.exists(tempDir);
      if (!exists) return { itemsRemoved: 0, spaceFreed: 0, duration: 0, errors: [] };

      const files = await RNFS.readDir(tempDir);
      const now = Date.now();
      const oneHour = 3600000;

      for (const file of files) {
        // Remove files older than 1 hour
        if (now - file.mtime.getTime() > oneHour) {
          const size = parseInt(file.size, 10);
          await RNFS.unlink(file.path);
          itemsRemoved++;
          spaceFreed += size;
        }
      }
    } catch (error) {
      console.error('Failed to cleanup temp files:', error);
    }

    return { itemsRemoved, spaceFreed, duration: 0, errors: [] };
  }

  /**
   * Clear cache
   */
  private async clearCache(): Promise<CleanupResult> {
    const cacheDir = `${this.storageDirectory}/cache`;
    let itemsRemoved = 0;
    let spaceFreed = 0;

    try {
      const exists = await RNFS.exists(cacheDir);
      if (!exists) return { itemsRemoved: 0, spaceFreed: 0, duration: 0, errors: [] };

      const size = await this.calculateDirectorySize(cacheDir);
      await RNFS.unlink(cacheDir);
      await RNFS.mkdir(cacheDir);

      itemsRemoved = 1;
      spaceFreed = size;
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }

    return { itemsRemoved, spaceFreed, duration: 0, errors: [] };
  }

  /**
   * Organize images by species
   */
  async organizeBySpecies(images: ImageMetadata[]): Promise<void> {
    try {
      const speciesGroups = new Map<string, ImageMetadata[]>();

      // Group images by scientific name
      images.forEach(image => {
        const key = image.species.scientificName;
        if (!speciesGroups.has(key)) {
          speciesGroups.set(key, []);
        }
        speciesGroups.get(key)!.push(image);
      });

      console.log(`Organized ${images.length} images into ${speciesGroups.size} species groups`);
    } catch (error) {
      console.error('Failed to organize images:', error);
      throw error;
    }
  }

  /**
   * Get storage directory path
   */
  getStorageDirectory(): string {
    return this.storageDirectory;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<StorageConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): StorageConfig {
    return { ...this.config };
  }
}

export default ImageStorageService;
