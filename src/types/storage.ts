import { ImageMetadata } from './image';

export interface StorageInfo {
  totalSize: number;
  usedSize: number;
  availableSize: number;
  imageCount: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
}

export interface DatabaseSchema {
  images: ImageMetadata[];
}
