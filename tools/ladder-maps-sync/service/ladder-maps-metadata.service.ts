import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import type { LadderMapsMetadataFile, LadderMapMetadata } from '../interface/ladder-maps-metadata.interface.js';

/**
 * Service for managing ladder maps metadata
 * This metadata helps mpmaps-updater distinguish ladder maps from user/custom maps
 */
export class LadderMapsMetadataService {
  private readonly metadataPath: string;
  private metadata: LadderMapsMetadataFile | null = null;

  constructor(packageDir: string) {
    // Store metadata in tools/ladder-maps-sync/ directory
    this.metadataPath = join(packageDir, '..', 'tools', 'ladder-maps-sync', 'ladder-maps-metadata.json');
  }

  /**
   * Load metadata from file, or create empty metadata if file doesn't exist
   */
  async load(): Promise<LadderMapsMetadataFile> {
    if (this.metadata) {
      return this.metadata;
    }

    if (existsSync(this.metadataPath)) {
      const content = await readFile(this.metadataPath, 'utf-8');
      this.metadata = JSON.parse(content);
    } else {
      this.metadata = this.createEmptyMetadata();
    }

    return this.metadata;
  }

  /**
   * Save metadata to file
   */
  async save(): Promise<void> {
    if (!this.metadata) {
      throw new Error('No metadata to save. Call load() first.');
    }

    // Update lastSync timestamp
    this.metadata.lastSync = new Date().toISOString();

    // Ensure directory exists
    await mkdir(dirname(this.metadataPath), { recursive: true });

    // Write with pretty formatting for readability
    const content = JSON.stringify(this.metadata, null, 2);
    await writeFile(this.metadataPath, content, 'utf-8');
  }

  /**
   * Add or update a map entry
   */
  async addOrUpdateMap(
    filename: string,
    hash: string,
    mapId: number,
    gameMode: string,
    ladder: string,
    originalName?: string
  ): Promise<void> {
    const metadata = await this.load();

    // Remove .map extension if present
    const mapKey = filename.replace(/\.map$/i, '');

    metadata.maps[mapKey] = {
      hash,
      mapId,
      gameMode,
      ladder,
      downloadedAt: new Date().toISOString(),
      originalName,
    };
  }

  /**
   * Remove a map entry
   */
  async removeMap(filename: string): Promise<void> {
    const metadata = await this.load();
    const mapKey = filename.replace(/\.map$/i, '');
    delete metadata.maps[mapKey];
  }

  /**
   * Get metadata for a specific map
   */
  async getMapMetadata(filename: string): Promise<LadderMapMetadata | null> {
    const metadata = await this.load();
    const mapKey = filename.replace(/\.map$/i, '');
    return metadata.maps[mapKey] || null;
  }

  /**
   * Get all maps for a specific ladder
   */
  async getMapsForLadder(ladder: string): Promise<Record<string, LadderMapMetadata>> {
    const metadata = await this.load();
    const result: Record<string, LadderMapMetadata> = {};

    for (const [key, mapMeta] of Object.entries(metadata.maps)) {
      if (mapMeta.ladder === ladder) {
        result[key] = mapMeta;
      }
    }

    return result;
  }

  /**
   * Check if a map is tracked as a ladder map
   */
  async isLadderMap(filename: string): Promise<boolean> {
    const mapMeta = await this.getMapMetadata(filename);
    return mapMeta !== null;
  }

  /**
   * Find map filename by mapId
   */
  async findMapByMapId(mapId: number): Promise<string | null> {
    const metadata = await this.load();

    for (const [filename, mapMeta] of Object.entries(metadata.maps)) {
      if (mapMeta.mapId === mapId) {
        return filename;
      }
    }

    return null;
  }

  /**
   * Check if map metadata exists (for deletion safety)
   */
  hasMap(filename: string): boolean {
    if (!this.metadata) {
      return false;
    }
    const mapKey = filename.replace(/\.map$/i, '');
    return mapKey in this.metadata.maps;
  }

  /**
   * Get the path to the metadata file (for reference)
   */
  getMetadataPath(): string {
    return this.metadataPath;
  }

  /**
   * Create empty metadata structure
   */
  private createEmptyMetadata(): LadderMapsMetadataFile {
    return {
      version: '1.0',
      lastSync: new Date().toISOString(),
      maps: {},
    };
  }
}
