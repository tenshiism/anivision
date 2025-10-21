import { SpeciesIdentificationResult } from './api';

export interface ImageInfo {
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
  type?: string;
  fileName?: string;
}

export interface ImageMetadata {
  id: string;
  uri: string;
  thumbnailUri?: string;
  species: SpeciesIdentificationResult;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  tags?: string[];
}

export interface IdentifiedImage extends ImageMetadata {
  fileName: string;
  scientificName: string;
  commonName: string;
  confidence: number;
}

export type ImageSource = 'camera' | 'gallery';

export interface ImageProcessingOptions {
  maxSize: number;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
}
