export const STORAGE_PATHS = {
  IMAGES: 'anivision/images',
  THUMBNAILS: 'anivision/thumbnails',
  CACHE: 'anivision/cache',
};

export const FILE_NAMING = {
  MAX_LENGTH: 100,
  EXTENSION: '.jpg',
  THUMBNAIL_SUFFIX: '_thumb',
};

export const CACHE_LIMITS = {
  MAX_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
  MAX_ENTRIES: 500,
};

export const IMAGE_PROCESSING = {
  MAX_SIZE: 1024,
  QUALITY: 0.8,
  THUMBNAIL_SIZE: 200,
};
