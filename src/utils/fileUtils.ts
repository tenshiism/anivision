export const sanitizeFileName = (name: string): string => {
  return name
    .replace(/[^a-z0-9\s\-_]/gi, '')
    .replace(/\s+/g, '_')
    .toLowerCase()
    .substring(0, 100);
};

export const createFileNameFromSpecies = (scientificName: string, timestamp?: number): string => {
  const sanitized = sanitizeFileName(scientificName);
  const time = timestamp || Date.now();
  return `${sanitized}_${time}`;
};

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
};

export const getFileName = (filepath: string): string => {
  const parts = filepath.split('/');
  return parts[parts.length - 1] || '';
};
