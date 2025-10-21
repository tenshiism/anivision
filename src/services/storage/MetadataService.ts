/**
 * MetadataService
 * Manages image metadata storage using SQLite database
 */

import SQLite from 'react-native-sqlite-storage';
import type {
  ImageMetadata,
  ScanResult,
  SpeciesIdentification,
  QueryOptions,
  ImageTable,
  ScanResultTable,
  SpeciesTable,
} from '../../types/storage';

// Enable promise API
SQLite.enablePromise(true);

export class MetadataService {
  private db: SQLite.SQLiteDatabase | null = null;
  private readonly DB_NAME = 'anivision.db';
  private readonly DB_VERSION = 1;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize database and create tables
   */
  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: this.DB_NAME,
        location: 'default',
      });

      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error(`Database initialization failed: ${error}`);
    }
  }

  /**
   * Create database tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const queries = [
      // Images table
      `CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        fileName TEXT NOT NULL,
        originalUri TEXT NOT NULL,
        thumbnailUri TEXT NOT NULL,
        fileSize INTEGER NOT NULL,
        width INTEGER NOT NULL,
        height INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        locationLatitude REAL,
        locationLongitude REAL,
        locationAddress TEXT,
        devicePlatform TEXT,
        deviceModel TEXT,
        deviceOsVersion TEXT,
        tags TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      )`,

      // Scan results table
      `CREATE TABLE IF NOT EXISTS scanResults (
        id TEXT PRIMARY KEY,
        imageId TEXT NOT NULL,
        summary TEXT NOT NULL,
        details TEXT,
        confidence REAL NOT NULL,
        processingTime INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        FOREIGN KEY (imageId) REFERENCES images(id) ON DELETE CASCADE
      )`,

      // Species table
      `CREATE TABLE IF NOT EXISTS species (
        id TEXT PRIMARY KEY,
        scanResultId TEXT NOT NULL,
        commonName TEXT NOT NULL,
        scientificName TEXT NOT NULL,
        confidence REAL NOT NULL,
        isPrimary INTEGER NOT NULL DEFAULT 1,
        taxonomyKingdom TEXT,
        taxonomyPhylum TEXT,
        taxonomyClass TEXT,
        taxonomyOrder TEXT,
        taxonomyFamily TEXT,
        taxonomyGenus TEXT,
        taxonomySpecies TEXT,
        createdAt INTEGER NOT NULL,
        FOREIGN KEY (scanResultId) REFERENCES scanResults(id) ON DELETE CASCADE
      )`,

      // Indexes for better query performance
      `CREATE INDEX IF NOT EXISTS idx_images_timestamp ON images(timestamp DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_images_fileName ON images(fileName)`,
      `CREATE INDEX IF NOT EXISTS idx_scanResults_imageId ON scanResults(imageId)`,
      `CREATE INDEX IF NOT EXISTS idx_species_scanResultId ON species(scanResultId)`,
      `CREATE INDEX IF NOT EXISTS idx_species_scientificName ON species(scientificName)`,
      `CREATE INDEX IF NOT EXISTS idx_species_commonName ON species(commonName)`,
    ];

    for (const query of queries) {
      await this.db.executeSql(query);
    }
  }

  /**
   * Save image metadata to database
   */
  async saveMetadata(metadata: ImageMetadata): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const now = Date.now();

      // Start transaction
      await this.db.transaction(async tx => {
        // Insert image
        await tx.executeSql(
          `INSERT OR REPLACE INTO images (
            id, fileName, originalUri, thumbnailUri, fileSize, width, height,
            timestamp, locationLatitude, locationLongitude, locationAddress,
            devicePlatform, deviceModel, deviceOsVersion, tags, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            metadata.id,
            metadata.fileName,
            metadata.originalUri,
            metadata.thumbnailUri,
            metadata.fileSize,
            metadata.dimensions.width,
            metadata.dimensions.height,
            metadata.timestamp,
            metadata.location?.latitude || null,
            metadata.location?.longitude || null,
            metadata.location?.address || null,
            metadata.deviceInfo.platform,
            metadata.deviceInfo.model,
            metadata.deviceInfo.osVersion,
            JSON.stringify(metadata.tags),
            now,
            now,
          ]
        );

        // Insert scan result
        const scanResultId = `scan_${metadata.id}`;
        await tx.executeSql(
          `INSERT OR REPLACE INTO scanResults (
            id, imageId, summary, details, confidence, processingTime, timestamp, createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            scanResultId,
            metadata.id,
            metadata.scanResult.summary,
            metadata.scanResult.details || '',
            metadata.scanResult.confidence,
            metadata.scanResult.processingTime,
            metadata.scanResult.timestamp,
            now,
          ]
        );

        // Insert primary species
        await this.insertSpecies(tx, scanResultId, metadata.species, true);

        // Insert additional species if available
        if (metadata.scanResult.additionalSpecies) {
          for (const species of metadata.scanResult.additionalSpecies) {
            await this.insertSpecies(tx, scanResultId, species, false);
          }
        }
      });

      console.log(`Saved metadata for image: ${metadata.id}`);
    } catch (error) {
      console.error('Failed to save metadata:', error);
      throw new Error(`Metadata save failed: ${error}`);
    }
  }

  /**
   * Insert species into database
   */
  private async insertSpecies(
    tx: SQLite.Transaction,
    scanResultId: string,
    species: SpeciesIdentification,
    isPrimary: boolean
  ): Promise<void> {
    const speciesId = `species_${scanResultId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    await tx.executeSql(
      `INSERT INTO species (
        id, scanResultId, commonName, scientificName, confidence, isPrimary,
        taxonomyKingdom, taxonomyPhylum, taxonomyClass, taxonomyOrder,
        taxonomyFamily, taxonomyGenus, taxonomySpecies, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        speciesId,
        scanResultId,
        species.commonName,
        species.scientificName,
        species.confidence,
        isPrimary ? 1 : 0,
        species.taxonomy?.kingdom || null,
        species.taxonomy?.phylum || null,
        species.taxonomy?.class || null,
        species.taxonomy?.order || null,
        species.taxonomy?.family || null,
        species.taxonomy?.genus || null,
        species.taxonomy?.species || null,
        now,
      ]
    );
  }

  /**
   * Get all images metadata
   */
  async getAllMetadata(options?: QueryOptions): Promise<ImageMetadata[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const limit = options?.limit || 100;
      const offset = options?.offset || 0;
      const orderBy = options?.orderBy || 'timestamp';
      const orderDirection = options?.orderDirection || 'DESC';

      const query = `
        SELECT * FROM images
        ORDER BY ${orderBy} ${orderDirection}
        LIMIT ? OFFSET ?
      `;

      const [results] = await this.db.executeSql(query, [limit, offset]);
      const images: ImageMetadata[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        const metadata = await this.buildMetadataFromRow(row);
        images.push(metadata);
      }

      return images;
    } catch (error) {
      console.error('Failed to get all metadata:', error);
      return [];
    }
  }

  /**
   * Get metadata by ID
   */
  async getMetadataById(id: string): Promise<ImageMetadata | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const [results] = await this.db.executeSql('SELECT * FROM images WHERE id = ?', [id]);

      if (results.rows.length === 0) return null;

      const row = results.rows.item(0);
      return await this.buildMetadataFromRow(row);
    } catch (error) {
      console.error('Failed to get metadata by ID:', error);
      return null;
    }
  }

  /**
   * Get metadata by species
   */
  async getMetadataBySpecies(speciesName: string): Promise<ImageMetadata[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const query = `
        SELECT DISTINCT i.* FROM images i
        JOIN scanResults sr ON i.id = sr.imageId
        JOIN species sp ON sr.id = sp.scanResultId
        WHERE sp.commonName LIKE ? OR sp.scientificName LIKE ?
        ORDER BY i.timestamp DESC
      `;

      const searchTerm = `%${speciesName}%`;
      const [results] = await this.db.executeSql(query, [searchTerm, searchTerm]);
      const images: ImageMetadata[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        const metadata = await this.buildMetadataFromRow(row);
        images.push(metadata);
      }

      return images;
    } catch (error) {
      console.error('Failed to get metadata by species:', error);
      return [];
    }
  }

  /**
   * Get metadata by date range
   */
  async getMetadataByDateRange(startDate: Date, endDate: Date): Promise<ImageMetadata[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const query = `
        SELECT * FROM images
        WHERE timestamp >= ? AND timestamp <= ?
        ORDER BY timestamp DESC
      `;

      const [results] = await this.db.executeSql(query, [
        startDate.getTime(),
        endDate.getTime(),
      ]);
      const images: ImageMetadata[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        const metadata = await this.buildMetadataFromRow(row);
        images.push(metadata);
      }

      return images;
    } catch (error) {
      console.error('Failed to get metadata by date range:', error);
      return [];
    }
  }

  /**
   * Search images by query
   */
  async searchMetadata(query: string): Promise<ImageMetadata[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const searchQuery = `
        SELECT DISTINCT i.* FROM images i
        LEFT JOIN scanResults sr ON i.id = sr.imageId
        LEFT JOIN species sp ON sr.id = sp.scanResultId
        WHERE sp.commonName LIKE ?
           OR sp.scientificName LIKE ?
           OR sr.summary LIKE ?
           OR sr.details LIKE ?
           OR i.tags LIKE ?
        ORDER BY i.timestamp DESC
      `;

      const searchTerm = `%${query}%`;
      const [results] = await this.db.executeSql(searchQuery, [
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
      ]);
      const images: ImageMetadata[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        const metadata = await this.buildMetadataFromRow(row);
        images.push(metadata);
      }

      return images;
    } catch (error) {
      console.error('Failed to search metadata:', error);
      return [];
    }
  }

  /**
   * Update metadata
   */
  async updateMetadata(id: string, updates: Partial<ImageMetadata>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const now = Date.now();
      const fields: string[] = [];
      const values: any[] = [];

      // Build dynamic update query
      if (updates.tags) {
        fields.push('tags = ?');
        values.push(JSON.stringify(updates.tags));
      }

      if (updates.location) {
        fields.push('locationLatitude = ?, locationLongitude = ?, locationAddress = ?');
        values.push(
          updates.location.latitude,
          updates.location.longitude,
          updates.location.address || null
        );
      }

      fields.push('updatedAt = ?');
      values.push(now);
      values.push(id);

      const query = `UPDATE images SET ${fields.join(', ')} WHERE id = ?`;
      await this.db.executeSql(query, values);

      console.log(`Updated metadata for image: ${id}`);
    } catch (error) {
      console.error('Failed to update metadata:', error);
      throw new Error(`Metadata update failed: ${error}`);
    }
  }

  /**
   * Delete metadata
   */
  async deleteMetadata(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Delete will cascade to scanResults and species tables
      await this.db.executeSql('DELETE FROM images WHERE id = ?', [id]);
      console.log(`Deleted metadata for image: ${id}`);
    } catch (error) {
      console.error('Failed to delete metadata:', error);
      throw new Error(`Metadata deletion failed: ${error}`);
    }
  }

  /**
   * Get metadata count
   */
  async getMetadataCount(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const [results] = await this.db.executeSql('SELECT COUNT(*) as count FROM images');
      return results.rows.item(0).count;
    } catch (error) {
      console.error('Failed to get metadata count:', error);
      return 0;
    }
  }

  /**
   * Get species statistics
   */
  async getSpeciesStats(): Promise<Array<{ species: string; count: number }>> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const query = `
        SELECT scientificName as species, COUNT(*) as count
        FROM species
        WHERE isPrimary = 1
        GROUP BY scientificName
        ORDER BY count DESC
      `;

      const [results] = await this.db.executeSql(query);
      const stats: Array<{ species: string; count: number }> = [];

      for (let i = 0; i < results.rows.length; i++) {
        stats.push(results.rows.item(i));
      }

      return stats;
    } catch (error) {
      console.error('Failed to get species stats:', error);
      return [];
    }
  }

  /**
   * Build ImageMetadata from database row
   */
  private async buildMetadataFromRow(row: any): Promise<ImageMetadata> {
    if (!this.db) throw new Error('Database not initialized');

    // Get scan result
    const [scanResults] = await this.db.executeSql(
      'SELECT * FROM scanResults WHERE imageId = ?',
      [row.id]
    );
    const scanResult = scanResults.rows.item(0);

    // Get primary species
    const [primarySpeciesResults] = await this.db.executeSql(
      'SELECT * FROM species WHERE scanResultId = ? AND isPrimary = 1',
      [scanResult.id]
    );
    const primarySpecies = primarySpeciesResults.rows.item(0);

    // Get additional species
    const [additionalSpeciesResults] = await this.db.executeSql(
      'SELECT * FROM species WHERE scanResultId = ? AND isPrimary = 0',
      [scanResult.id]
    );
    const additionalSpecies: SpeciesIdentification[] = [];
    for (let i = 0; i < additionalSpeciesResults.rows.length; i++) {
      additionalSpecies.push(this.buildSpeciesFromRow(additionalSpeciesResults.rows.item(i)));
    }

    const metadata: ImageMetadata = {
      id: row.id,
      originalUri: row.originalUri,
      thumbnailUri: row.thumbnailUri,
      fileName: row.fileName,
      fileSize: row.fileSize,
      dimensions: {
        width: row.width,
        height: row.height,
      },
      timestamp: row.timestamp,
      species: this.buildSpeciesFromRow(primarySpecies),
      scanResult: {
        id: scanResult.id,
        imageId: scanResult.imageId,
        species: this.buildSpeciesFromRow(primarySpecies),
        summary: scanResult.summary,
        details: scanResult.details,
        additionalSpecies: additionalSpecies.length > 0 ? additionalSpecies : undefined,
        timestamp: scanResult.timestamp,
        confidence: scanResult.confidence,
        processingTime: scanResult.processingTime,
      },
      tags: JSON.parse(row.tags || '[]'),
      location:
        row.locationLatitude && row.locationLongitude
          ? {
              latitude: row.locationLatitude,
              longitude: row.locationLongitude,
              address: row.locationAddress,
            }
          : undefined,
      deviceInfo: {
        platform: row.devicePlatform,
        model: row.deviceModel,
        osVersion: row.deviceOsVersion,
      },
    };

    return metadata;
  }

  /**
   * Build SpeciesIdentification from database row
   */
  private buildSpeciesFromRow(row: any): SpeciesIdentification {
    return {
      commonName: row.commonName,
      scientificName: row.scientificName,
      confidence: row.confidence,
      taxonomy: {
        kingdom: row.taxonomyKingdom,
        phylum: row.taxonomyPhylum,
        class: row.taxonomyClass,
        order: row.taxonomyOrder,
        family: row.taxonomyFamily,
        genus: row.taxonomyGenus,
        species: row.taxonomySpecies,
      },
    };
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log('Database closed');
    }
  }

  /**
   * Clear all data (for testing/development)
   */
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.transaction(async tx => {
        await tx.executeSql('DELETE FROM species');
        await tx.executeSql('DELETE FROM scanResults');
        await tx.executeSql('DELETE FROM images');
      });
      console.log('All data cleared');
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }
}

export default MetadataService;
