# Image Storage and Management

## Overview
AniVision implements a robust local image storage system that intelligently organizes images based on species identification results. The system ensures efficient storage, quick retrieval, and automatic cleanup while maintaining data integrity and user privacy.

## Storage Architecture

### Directory Structure
```
AniVision/
├── images/
│   ├── original/
│   │   ├── 2024/
│   │   │   ├── 01/
│   │   │   │   ├── felis_catus_20240115_143022.jpg
│   │   │   │   ├── canis_lupus_20240115_144512.jpg
│   │   │   │   └── ...
│   │   │   └── ...
│   │   └── ...
│   ├── thumbnails/
│   │   ├── felis_catus_thumb_20240115_143022.jpg
│   │   ├── canis_lupus_thumb_20240115_144512.jpg
│   │   └── ...
│   └── metadata/
│       ├── felis_catus_20240115_143022.json
│       ├── canis_lupus_20240115_144512.json
│       └── ...
├── cache/
│   ├── api_responses/
│   └── processed_images/
└── temp/
    └── uploads/
```

### Storage Locations
- **Original Images**: High-resolution images for detailed viewing
- **Thumbnails**: Optimized previews for grid display
- **Metadata**: JSON files containing identification results and image data
- **Cache**: Temporary API responses and processed data
- **Temp**: Temporary files during upload/processing

## Image Management Service

### Core Service Class
```typescript
interface ImageMetadata {
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
  deviceInfo: {
    platform: string;
    model: string;
    osVersion: string;
  };
}

interface StorageConfig {
  maxStorageSize: number; // in bytes
  maxImageCount: number;
  thumbnailSize: {
    width: number;
    height: number;
    quality: number;
  };
  compressionQuality: number;
  autoCleanup: boolean;
  backupEnabled: boolean;
}

class ImageStorageService {
  private config: StorageConfig;
  private storageDirectory: string;
  private metadataCache: Map<string, ImageMetadata> = new Map();
  
  constructor(config: StorageConfig) {
    this.config = config;
    this.storageDirectory = `${FileSystem.documentDirectory}images/`;
    this.initializeStorage();
  }
  
  private async initializeStorage(): Promise<void> {
    try {
      // Create directory structure
      await this.ensureDirectoryExists(`${this.storageDirectory}original`);
      await this.ensureDirectoryExists(`${this.storageDirectory}thumbnails`);
      await this.ensureDirectoryExists(`${this.storageDirectory}metadata`);
      await this.ensureDirectoryExists(`${FileSystem.documentDirectory}cache`);
      await this.ensureDirectoryExists(`${FileSystem.documentDirectory}temp`);
      
      // Load existing metadata into cache
      await this.loadMetadataCache();
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw new Error('Storage initialization failed');
    }
  }
  
  private async ensureDirectoryExists(path: string): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(path);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(path, { intermediates: true });
    }
  }
}
```

### Image Storage Operations
```typescript
class ImageStorageService {
  async saveImage(
    imageUri: string,
    scanResult: ScanResult,
    metadata?: Partial<ImageMetadata>
  ): Promise<ImageMetadata> {
    try {
      // Generate unique filename based on species
      const fileName = this.generateFileName(scanResult.species);
      
      // Process and save original image
      const originalPath = await this.saveOriginalImage(imageUri, fileName);
      
      // Generate and save thumbnail
      const thumbnailPath = await this.generateThumbnail(originalPath, fileName);
      
      // Create metadata
      const imageMetadata: ImageMetadata = {
        id: this.generateId(),
        originalUri: originalPath,
        thumbnailUri: thumbnailPath,
        fileName,
        fileSize: await this.getFileSize(originalPath),
        dimensions: await this.getImageDimensions(originalPath),
        timestamp: Date.now(),
        species: scanResult.species,
        scanResult,
        tags: this.generateTags(scanResult),
        location: metadata?.location,
        deviceInfo: await this.getDeviceInfo(),
        ...metadata,
      };
      
      // Save metadata
      await this.saveMetadata(imageMetadata);
      
      // Update cache
      this.metadataCache.set(imageMetadata.id, imageMetadata);
      
      // Check storage limits and cleanup if needed
      await this.checkStorageLimits();
      
      return imageMetadata;
    } catch (error) {
      console.error('Failed to save image:', error);
      throw new Error(`Image save failed: ${error.message}`);
    }
  }
  
  private generateFileName(species: SpeciesIdentification): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const scientificName = species.scientificName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 50);
    
    return `${scientificName}_${timestamp}.jpg`;
  }
  
  private async saveOriginalImage(sourceUri: string, fileName: string): Promise<string> {
    const targetPath = `${this.storageDirectory}original/${this.getDatePath()}/${fileName}`;
    
    // Ensure date directory exists
    await this.ensureDirectoryExists(`${this.storageDirectory}original/${this.getDatePath()}`);
    
    // Copy image to storage
    await FileSystem.copyAsync({
      from: sourceUri,
      to: targetPath,
    });
    
    return targetPath;
  }
  
  private async generateThumbnail(originalPath: string, fileName: string): Promise<string> {
    const thumbnailFileName = `thumb_${fileName}`;
    const thumbnailPath = `${this.storageDirectory}thumbnails/${thumbnailFileName}`;
    
    // Resize and compress image
    const result = await ImageManipulator.manipulateAsync(
      originalPath,
      [
        {
          resize: {
            width: this.config.thumbnailSize.width,
            height: this.config.thumbnailSize.height,
          },
        },
      ],
      {
        compress: this.config.thumbnailSize.quality,
        format: ImageManipulator.FormatType.JPEG,
      }
    );
    
    // Move thumbnail to storage location
    await FileSystem.moveAsync({
      from: result.uri,
      to: thumbnailPath,
    });
    
    return thumbnailPath;
  }
  
  private getDatePath(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}/${month}`;
  }
}
```

### Image Retrieval Operations
```typescript
class ImageStorageService {
  async getAllImages(): Promise<ImageMetadata[]> {
    try {
      const images = Array.from(this.metadataCache.values());
      return images.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to get all images:', error);
      return [];
    }
  }
  
  async getImagesBySpecies(speciesName: string): Promise<ImageMetadata[]> {
    try {
      const images = Array.from(this.metadataCache.values());
      return images.filter(img => 
        img.species.commonName.toLowerCase().includes(speciesName.toLowerCase()) ||
        img.species.scientificName.toLowerCase().includes(speciesName.toLowerCase())
      );
    } catch (error) {
      console.error('Failed to get images by species:', error);
      return [];
    }
  }
  
  async getImagesByDateRange(startDate: Date, endDate: Date): Promise<ImageMetadata[]> {
    try {
      const images = Array.from(this.metadataCache.values());
      return images.filter(img => 
        img.timestamp >= startDate.getTime() && 
        img.timestamp <= endDate.getTime()
      );
    } catch (error) {
      console.error('Failed to get images by date range:', error);
      return [];
    }
  }
  
  async getImageById(id: string): Promise<ImageMetadata | null> {
    try {
      return this.metadataCache.get(id) || null;
    } catch (error) {
      console.error('Failed to get image by ID:', error);
      return null;
    }
  }
  
  async searchImages(query: string): Promise<ImageMetadata[]> {
    try {
      const images = Array.from(this.metadataCache.values());
      const lowercaseQuery = query.toLowerCase();
      
      return images.filter(img => 
        img.species.commonName.toLowerCase().includes(lowercaseQuery) ||
        img.species.scientificName.toLowerCase().includes(lowercaseQuery) ||
        img.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        img.scanResult.summary?.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Failed to search images:', error);
      return [];
    }
  }
}
```

### Image Organization
```typescript
class ImageStorageService {
  async organizeImagesBySpecies(): Promise<void> {
    try {
      const images = await this.getAllImages();
      const speciesGroups = new Map<string, ImageMetadata[]>();
      
      // Group images by species
      images.forEach(image => {
        const key = image.species.scientificName;
        if (!speciesGroups.has(key)) {
          speciesGroups.set(key, []);
        }
        speciesGroups.get(key)!.push(image);
      });
      
      // Create organized directory structure
      for (const [species, speciesImages] of speciesGroups) {
        const speciesDir = this.createSpeciesDirectory(species);
        
        // Move images to species-specific directories
        for (const image of speciesImages) {
          await this.moveImageToSpeciesDirectory(image, speciesDir);
        }
      }
      
      // Update metadata cache
      await this.loadMetadataCache();
    } catch (error) {
      console.error('Failed to organize images:', error);
      throw new Error('Image organization failed');
    }
  }
  
  private createSpeciesDirectory(species: string): string {
    const sanitizedSpecies = species
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 50);
    
    return `${this.storageDirectory}organized/${sanitizedSpecies}`;
  }
  
  private async moveImageToSpeciesDirectory(
    image: ImageMetadata,
    speciesDir: string
  ): Promise<void> {
    await this.ensureDirectoryExists(speciesDir);
    
    // Move original image
    const originalFileName = path.basename(image.originalUri);
    const newOriginalPath = `${speciesDir}/${originalFileName}`;
    
    if (image.originalUri !== newOriginalPath) {
      await FileSystem.moveAsync({
        from: image.originalUri,
        to: newOriginalPath,
      });
      image.originalUri = newOriginalPath;
    }
    
    // Move thumbnail
    const thumbnailFileName = path.basename(image.thumbnailUri);
    const newThumbnailPath = `${speciesDir}/${thumbnailFileName}`;
    
    if (image.thumbnailUri !== newThumbnailPath) {
      await FileSystem.moveAsync({
        from: image.thumbnailUri,
        to: newThumbnailPath,
      });
      image.thumbnailUri = newThumbnailPath;
    }
  }
}
```

## Storage Management

### Storage Monitoring
```typescript
class StorageManager {
  private storageService: ImageStorageService;
  private monitoringInterval: NodeJS.Timeout | null = null;
  
  constructor(storageService: ImageStorageService) {
    this.storageService = storageService;
  }
  
  startMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      this.checkStorageHealth();
    }, 60000); // Check every minute
  }
  
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
  
  private async checkStorageHealth(): Promise<void> {
    try {
      const storageInfo = await this.getStorageInfo();
      
      if (storageInfo.usagePercentage > 90) {
        console.warn('Storage usage critical:', storageInfo.usagePercentage);
        await this.performEmergencyCleanup();
      } else if (storageInfo.usagePercentage > 80) {
        console.warn('Storage usage high:', storageInfo.usagePercentage);
        await this.performRoutineCleanup();
      }
    } catch (error) {
      console.error('Storage health check failed:', error);
    }
  }
  
  async getStorageInfo(): Promise<StorageInfo> {
    const totalSpace = await this.getTotalStorageSpace();
    const usedSpace = await this.getUsedStorageSpace();
    const imageCount = await this.storageService.getImageCount();
    
    return {
      totalSpace,
      usedSpace,
      freeSpace: totalSpace - usedSpace,
      usagePercentage: (usedSpace / totalSpace) * 100,
      imageCount,
    };
  }
  
  private async getTotalStorageSpace(): Promise<number> {
    // Get device storage info
    const deviceInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory);
    return deviceInfo.size || 0;
  }
  
  private async getUsedStorageSpace(): Promise<number> {
    // Calculate used space by scanning image directories
    let totalSize = 0;
    
    const directories = [
      `${this.storageService.storageDirectory}original`,
      `${this.storageService.storageDirectory}thumbnails`,
      `${this.storageService.storageDirectory}metadata`,
    ];
    
    for (const dir of directories) {
      totalSize += await this.calculateDirectorySize(dir);
    }
    
    return totalSize;
  }
  
  private async calculateDirectorySize(directory: string): Promise<number> {
    try {
      const files = await FileSystem.readDirectoryAsync(directory);
      let totalSize = 0;
      
      for (const file of files) {
        const filePath = `${directory}/${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        
        if (fileInfo.isDirectory) {
          totalSize += await this.calculateDirectorySize(filePath);
        } else {
          totalSize += fileInfo.size || 0;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error(`Failed to calculate directory size for ${directory}:`, error);
      return 0;
    }
  }
}
```

### Cleanup Operations
```typescript
class ImageStorageService {
  async performRoutineCleanup(): Promise<void> {
    try {
      // Remove old temporary files
      await this.cleanupTempFiles();
      
      // Remove duplicate images
      await this.removeDuplicateImages();
      
      // Remove images with low confidence scores
      await this.removeLowConfidenceImages();
      
      // Compress large images
      await this.compressLargeImages();
    } catch (error) {
      console.error('Routine cleanup failed:', error);
    }
  }
  
  async performEmergencyCleanup(): Promise<void> {
    try {
      // Remove all temporary files
      await this.cleanupTempFiles();
      
      // Remove oldest images until usage is acceptable
      await this.removeOldestImages();
      
      // Clear cache
      await this.clearCache();
    } catch (error) {
      console.error('Emergency cleanup failed:', error);
    }
  }
  
  private async cleanupTempFiles(): Promise<void> {
    const tempDir = `${FileSystem.documentDirectory}temp`;
    
    try {
      const files = await FileSystem.readDirectoryAsync(tempDir);
      const now = Date.now();
      
      for (const file of files) {
        const filePath = `${tempDir}/${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        
        // Remove files older than 1 hour
        if (now - (fileInfo.modificationTime || 0) > 3600000) {
          await FileSystem.deleteAsync(filePath, { idempotent: true });
        }
      }
    } catch (error) {
      console.error('Failed to cleanup temp files:', error);
    }
  }
  
  private async removeDuplicateImages(): Promise<void> {
    const images = await this.getAllImages();
    const duplicates = new Map<string, ImageMetadata[]>();
    
    // Find potential duplicates based on species and timestamp
    images.forEach(image => {
      const key = `${image.species.scientificName}_${Math.floor(image.timestamp / 60000)}`; // Group by minute
      if (!duplicates.has(key)) {
        duplicates.set(key, []);
      }
      duplicates.get(key)!.push(image);
    });
    
    // Remove duplicates, keeping the highest confidence one
    for (const [_, duplicateGroup] of duplicates) {
      if (duplicateGroup.length > 1) {
        // Sort by confidence, keep the best one
        duplicateGroup.sort((a, b) => b.species.confidence - a.species.confidence);
        
        // Remove all but the first (best) one
        for (let i = 1; i < duplicateGroup.length; i++) {
          await this.deleteImage(duplicateGroup[i].id);
        }
      }
    }
  }
  
  private async removeLowConfidenceImages(): Promise<void> {
    const images = await this.getAllImages();
    const lowConfidenceImages = images.filter(img => img.species.confidence < 0.5);
    
    for (const image of lowConfidenceImages) {
      await this.deleteImage(image.id);
    }
  }
  
  private async removeOldestImages(): Promise<void> {
    const images = await this.getAllImages();
    const storageInfo = await this.getStorageInfo();
    
    if (storageInfo.usagePercentage < 85) return;
    
    // Sort by timestamp (oldest first)
    images.sort((a, b) => a.timestamp - b.timestamp);
    
    // Remove oldest images until usage is acceptable
    for (const image of images) {
      await this.deleteImage(image.id);
      
      const updatedInfo = await this.getStorageInfo();
      if (updatedInfo.usagePercentage < 85) break;
    }
  }
}
```

### Backup and Restore
```typescript
class BackupService {
  private storageService: ImageStorageService;
  
  constructor(storageService: ImageStorageService) {
    this.storageService = storageService;
  }
  
  async createBackup(): Promise<BackupData> {
    try {
      const images = await this.storageService.getAllImages();
      const metadata = images.map(img => ({
        ...img,
        // Exclude actual image URIs from backup metadata
        originalUri: img.fileName,
        thumbnailUri: `thumb_${img.fileName}`,
      }));
      
      const backup: BackupData = {
        version: '1.0',
        timestamp: Date.now(),
        imageCount: images.length,
        metadata,
        config: this.storageService.getConfig(),
      };
      
      // Save backup to file
      const backupPath = `${FileSystem.documentDirectory}backups/backup_${Date.now()}.json`;
      await this.ensureDirectoryExists(`${FileSystem.documentDirectory}backups`);
      await FileSystem.writeAsStringAsync(backupPath, JSON.stringify(backup, null, 2));
      
      return backup;
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw new Error('Backup failed');
    }
  }
  
  async restoreFromBackup(backupPath: string): Promise<void> {
    try {
      const backupData = await FileSystem.readAsStringAsync(backupPath);
      const backup: BackupData = JSON.parse(backupData);
      
      // Validate backup format
      if (!this.validateBackup(backup)) {
        throw new Error('Invalid backup format');
      }
      
      // Restore metadata
      for (const metadata of backup.metadata) {
        // Check if image files exist
        const originalPath = `${this.storageService.storageDirectory}original/${metadata.originalUri}`;
        const thumbnailPath = `${this.storageService.storageDirectory}thumbnails/${metadata.thumbnailUri}`;
        
        const originalExists = await FileSystem.getInfoAsync(originalPath);
        const thumbnailExists = await FileSystem.getInfoAsync(thumbnailPath);
        
        if (originalExists.exists && thumbnailExists.exists) {
          // Restore metadata to cache
          this.storageService.metadataCache.set(metadata.id, metadata);
        }
      }
    } catch (error) {
      console.error('Backup restore failed:', error);
      throw new Error('Restore failed');
    }
  }
  
  private validateBackup(backup: BackupData): boolean {
    return (
      backup.version &&
      backup.timestamp &&
      backup.metadata &&
      Array.isArray(backup.metadata) &&
      backup.metadata.length > 0
    );
  }
}

interface BackupData {
  version: string;
  timestamp: number;
  imageCount: number;
  metadata: ImageMetadata[];
  config: StorageConfig;
}
```

## Performance Optimization

### Image Caching
```typescript
class ImageCache {
  private cache: Map<string, CachedImage> = new Map();
  private maxSize: number; // in bytes
  private currentSize: number = 0;
  
  constructor(maxSize: number = 100 * 1024 * 1024) { // 100MB default
    this.maxSize = maxSize;
  }
  
  async get(key: string): Promise<string | null> {
    const cached = this.cache.get(key);
    if (cached) {
      // Update access time
      cached.lastAccessed = Date.now();
      return cached.uri;
    }
    return null;
  }
  
  async set(key: string, uri: string, size: number): Promise<void> {
    // Remove old entries if needed
    while (this.currentSize + size > this.maxSize && this.cache.size > 0) {
      await this.removeOldest();
    }
    
    this.cache.set(key, {
      uri,
      size,
      lastAccessed: Date.now(),
    });
    this.currentSize += size;
  }
  
  private async removeOldest(): Promise<void> {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, cached] of this.cache) {
      if (cached.lastAccessed < oldestTime) {
        oldestTime = cached.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      const cached = this.cache.get(oldestKey);
      if (cached) {
        this.cache.delete(oldestKey);
        this.currentSize -= cached.size;
      }
    }
  }
  
  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
  }
}

interface CachedImage {
  uri: string;
  size: number;
  lastAccessed: number;
}
```

### Lazy Loading
```typescript
class LazyImageLoader {
  private imageCache: ImageCache;
  private loadingPromises: Map<string, Promise<string>> = new Map();
  
  constructor(imageCache: ImageCache) {
    this.imageCache = imageCache;
  }
  
  async loadImage(uri: string): Promise<string> {
    // Check cache first
    const cached = await this.imageCache.get(uri);
    if (cached) {
      return cached;
    }
    
    // Check if already loading
    if (this.loadingPromises.has(uri)) {
      return this.loadingPromises.get(uri)!;
    }
    
    // Load image
    const loadingPromise = this.loadImageFromStorage(uri);
    this.loadingPromises.set(uri, loadingPromise);
    
    try {
      const loadedUri = await loadingPromise;
      this.loadingPromises.delete(uri);
      return loadedUri;
    } catch (error) {
      this.loadingPromises.delete(uri);
      throw error;
    }
  }
  
  private async loadImageFromStorage(uri: string): Promise<string> {
    // Implement actual image loading logic
    // This could involve decompression, format conversion, etc.
    return uri;
  }
}
```

## Error Handling and Recovery

### Data Integrity Checks
```typescript
class DataIntegrityChecker {
  private storageService: ImageStorageService;
  
  constructor(storageService: ImageStorageService) {
    this.storageService = storageService;
  }
  
  async checkIntegrity(): Promise<IntegrityReport> {
    const images = await this.storageService.getAllImages();
    const issues: IntegrityIssue[] = [];
    
    for (const image of images) {
      // Check if original image exists
      const originalExists = await FileSystem.getInfoAsync(image.originalUri);
      if (!originalExists.exists) {
        issues.push({
          type: 'missing_original',
          imageId: image.id,
          message: 'Original image file is missing',
        });
      }
      
      // Check if thumbnail exists
      const thumbnailExists = await FileSystem.getInfoAsync(image.thumbnailUri);
      if (!thumbnailExists.exists) {
        issues.push({
          type: 'missing_thumbnail',
          imageId: image.id,
          message: 'Thumbnail file is missing',
        });
      }
      
      // Check metadata consistency
      if (image.fileSize !== originalExists.size) {
        issues.push({
          type: 'size_mismatch',
          imageId: image.id,
          message: 'File size mismatch in metadata',
        });
      }
    }
    
    return {
      totalImages: images.length,
      issueCount: issues.length,
      issues,
      isHealthy: issues.length === 0,
    };
  }
  
  async repairIssues(issues: IntegrityIssue[]): Promise<void> {
    for (const issue of issues) {
      try {
        switch (issue.type) {
          case 'missing_thumbnail':
            await this.regenerateThumbnail(issue.imageId);
            break;
          case 'size_mismatch':
            await this.updateMetadata(issue.imageId);
            break;
          case 'missing_original':
            // Cannot repair missing original files
            console.warn(`Cannot repair missing original for image ${issue.imageId}`);
            break;
        }
      } catch (error) {
        console.error(`Failed to repair issue for image ${issue.imageId}:`, error);
      }
    }
  }
  
  private async regenerateThumbnail(imageId: string): Promise<void> {
    const image = await this.storageService.getImageById(imageId);
    if (image) {
      const thumbnailPath = await this.storageService.generateThumbnail(
        image.originalUri,
        image.fileName
      );
      image.thumbnailUri = thumbnailPath;
      await this.storageService.saveMetadata(image);
    }
  }
  
  private async updateMetadata(imageId: string): Promise<void> {
    const image = await this.storageService.getImageById(imageId);
    if (image) {
      const fileInfo = await FileSystem.getInfoAsync(image.originalUri);
      image.fileSize = fileInfo.size || 0;
      await this.storageService.saveMetadata(image);
    }
  }
}

interface IntegrityReport {
  totalImages: number;
  issueCount: number;
  issues: IntegrityIssue[];
  isHealthy: boolean;
}

interface IntegrityIssue {
  type: 'missing_original' | 'missing_thumbnail' | 'size_mismatch' | 'corruption';
  imageId: string;
  message: string;
}
```

## Testing Strategy

### Mock Storage Service
```typescript
export class MockImageStorageService {
  private images: ImageMetadata[] = [];
  private nextId = 1;
  
  async saveImage(imageUri: string, scanResult: ScanResult): Promise<ImageMetadata> {
    const metadata: ImageMetadata = {
      id: `mock_${this.nextId++}`,
      originalUri: imageUri,
      thumbnailUri: `${imageUri}_thumb`,
      fileName: `mock_image_${Date.now()}.jpg`,
      fileSize: 1024 * 1024, // 1MB
      dimensions: { width: 1920, height: 1080 },
      timestamp: Date.now(),
      species: scanResult.species,
      scanResult,
      tags: ['mock'],
    };
    
    this.images.push(metadata);
    return metadata;
  }
  
  async getAllImages(): Promise<ImageMetadata[]> {
    return [...this.images];
  }
  
  async getImageById(id: string): Promise<ImageMetadata | null> {
    return this.images.find(img => img.id === id) || null;
  }
  
  async deleteImage(id: string): Promise<void> {
    this.images = this.images.filter(img => img.id !== id);
  }
  
  async searchImages(query: string): Promise<ImageMetadata[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.images.filter(img => 
      img.species.commonName.toLowerCase().includes(lowercaseQuery) ||
      img.species.scientificName.toLowerCase().includes(lowercaseQuery)
    );
  }
}
```

### Unit Tests
```typescript
describe('ImageStorageService', () => {
  let storageService: ImageStorageService;
  let mockConfig: StorageConfig;
  
  beforeEach(() => {
    mockConfig = {
      maxStorageSize: 100 * 1024 * 1024, // 100MB
      maxImageCount: 1000,
      thumbnailSize: { width: 200, height: 200, quality: 0.8 },
      compressionQuality: 0.8,
      autoCleanup: true,
      backupEnabled: true,
    };
    
    storageService = new ImageStorageService(mockConfig);
  });
  
  test('should save image with correct metadata', async () => {
    const mockScanResult: ScanResult = {
      species: {
        commonName: 'Test Species',
        scientificName: 'Testus scientificus',
        confidence: 0.9,
      },
      summary: 'Test summary',
    };
    
    const metadata = await storageService.saveImage('test-image.jpg', mockScanResult);
    
    expect(metadata.species.commonName).toBe('Test Species');
    expect(metadata.species.scientificName).toBe('Testus scientificus');
    expect(metadata.fileName).toContain('testus_scientificus');
  });
  
  test('should organize images by species', async () => {
    // Mock implementation
    const organizeSpy = jest.spyOn(storageService, 'organizeImagesBySpecies');
    
    await storageService.organizeImagesBySpecies();
    
    expect(organizeSpy).toHaveBeenCalled();
  });
});