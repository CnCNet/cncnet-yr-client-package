import AdmZip from 'adm-zip';
import { readFile, copyFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { parse as parseIni } from 'js-ini';
import type { LadderPoolConfig } from '../interface/config.interface.js';
import type { MapDownloadService } from './map-download.service.js';
import type { MapHashService } from './map-hash.service.js';

export class MapExtractionService {
  constructor(
    private readonly downloadService: MapDownloadService,
    private readonly hashService: MapHashService,
    private readonly mapDatabaseUrl: string,
    private readonly mapImageBaseUrl: string,
    private readonly tempDirectory: string,
    private readonly mapsDirectory: string,
    private readonly maxRetries: number,
    private readonly retryDelayMs: number,
    private readonly timeoutMs: number,
    private readonly dryRun: boolean = false
  ) {}

  async extractAndNameMap(
    hash: string,
    mapName: string,
    imageHash: string,
    ladderPool: LadderPoolConfig
  ): Promise<string> {
    if (this.dryRun) {
      // In dry-run mode, just simulate the operation
      const extractedName = this.extractMapName(mapName);
      let sanitizedName = this.sanitizeMapName(extractedName);

      // Additional check: if sanitized name starts with a number followed by underscore, remove it
      if (/^\d+_/.test(sanitizedName)) {
        sanitizedName = sanitizedName.replace(/^\d+_/, '');
      }

      const finalFileName = this.generateFileName(
        ladderPool.fileNamePattern,
        2, // Default to 2 players for dry-run
        sanitizedName
      );

      console.log(`    [DRY RUN] Would download ZIP: ${this.mapDatabaseUrl}/${hash}.zip`);
      console.log(`    [DRY RUN] Would extract and process map file`);
      console.log(`    [DRY RUN] Final filename: ${finalFileName}.map`);
      console.log(`    [DRY RUN] Would copy to: ${join(this.mapsDirectory, finalFileName + '.map')}`);

      if (imageHash) {
        console.log(`    [DRY RUN] Would download image: ${this.mapImageBaseUrl}/${imageHash}.png`);
      }

      return finalFileName;
    }

    const tempDownloadsDir = join(this.tempDirectory, 'downloads');
    const tempExtractedDir = join(this.tempDirectory, 'extracted', hash);

    // Create temp directories
    await mkdir(tempDownloadsDir, { recursive: true });
    await mkdir(tempExtractedDir, { recursive: true });

    // 1. Download ZIP to temp
    const zipPath = join(tempDownloadsDir, `${hash}.zip`);
    const zipUrl = `${this.mapDatabaseUrl}/${hash}.zip`;

    console.log(`    Downloading ZIP: ${zipUrl}`);
    await this.downloadService.downloadFile(
      zipUrl,
      zipPath,
      this.maxRetries,
      this.retryDelayMs,
      this.timeoutMs
    );

    // 2. Extract ZIP to temp
    console.log(`    Extracting to: ${tempExtractedDir}`);
    const extractedFiles = await this.extractZip(zipPath, tempExtractedDir);
    const mapFile = extractedFiles.find((f) => f.endsWith('.map'));

    if (!mapFile) {
      throw new Error(`No .map file found in ZIP for hash ${hash}`);
    }

    console.log(`    Original filename: ${mapFile.split(/[\\/]/).pop()}`);

    // 3. Verify extracted file hash
    const extractedHash = await this.hashService.computeFileHash(mapFile);
    if (extractedHash !== hash) {
      throw new Error(`Hash mismatch for ${mapName}: expected ${hash}, got ${extractedHash}`);
    }

    // 4. Parse map file
    const mapContent = await readFile(mapFile, 'utf-8');
    const mapIni = parseIni(mapContent);

    // 5. Extract player count
    const playerCount = this.extractPlayerCount(mapIni);

    // 6. Extract and sanitize map name
    const rawMapName = mapIni.Basic?.Name || mapName;
    const extractedName = this.extractMapName(rawMapName);
    let sanitizedName = this.sanitizeMapName(extractedName);

    // Additional check: if sanitized name starts with a number followed by underscore,
    // it means the extraction didn't catch it - remove it now
    if (/^\d+_/.test(sanitizedName)) {
      sanitizedName = sanitizedName.replace(/^\d+_/, '');
    }

    // 7. Generate final filename
    const finalFileName = this.generateFileName(
      ladderPool.fileNamePattern,
      playerCount,
      sanitizedName
    );

    console.log(`    Final filename: ${finalFileName}.map`);

    // 8. Copy to maps directory
    const destPath = join(this.mapsDirectory, `${finalFileName}.map`);
    await copyFile(mapFile, destPath);
    console.log(`    Copied to: ${destPath}`);

    // 9. Download preview image
    if (imageHash) {
      try {
        const imageUrl = `${this.mapImageBaseUrl}/${imageHash}.png`;
        const imagePath = join(this.mapsDirectory, `${finalFileName}.png`);

        console.log(`    Downloading image: ${imageUrl}`);
        await this.downloadService.downloadFile(
          imageUrl,
          imagePath,
          this.maxRetries,
          this.retryDelayMs,
          this.timeoutMs
        );
        console.log(`    Saved image to: ${imagePath}`);
      } catch (error) {
        console.warn(
          `    [WARN] Failed to download preview image for ${mapName}:`,
          error instanceof Error ? error.message : String(error)
        );
      }
    }

    // 10. Log temp directories
    console.log(`    Temp download: ${zipPath}`);
    console.log(`    Temp extract: ${tempExtractedDir}`);

    return finalFileName;
  }

  private async extractZip(zipPath: string, destDir: string): Promise<string[]> {
    const zip = new AdmZip(zipPath);
    const extractedFiles: string[] = [];

    zip.extractAllTo(destDir, true);

    const zipEntries = zip.getEntries();
    for (const entry of zipEntries) {
      extractedFiles.push(join(destDir, entry.entryName));
    }

    return extractedFiles;
  }

  private extractPlayerCount(mapIni: any): number {
    // Try Header->NumberStartingPoints first
    const fromHeader = mapIni.Header?.NumberStartingPoints;
    if (fromHeader) {
      return parseInt(String(fromHeader), 10);
    }

    // Fallback to Basic->MaxPlayer
    const fromBasic = mapIni.Basic?.MaxPlayer;
    if (fromBasic) {
      return parseInt(String(fromBasic), 10);
    }

    throw new Error('Could not determine player count from map file');
  }

  private extractMapName(rawName: string): string {
    // Remove player count prefix in various formats:
    // [2] Map Name, (4) Map Name, 2 - Map Name, 2_map_name, etc.
    let cleaned = rawName;

    // Remove patterns like: [2], (2), [2] -, (2) -, 2-, 2), 2], etc.
    cleaned = cleaned.replace(/^[\[\(]?\d+[\]\)\-\s:]+\s*/g, '');

    // Remove number at start followed by underscore (e.g., "2_map_name" -> "map_name")
    cleaned = cleaned.replace(/^\d+_/, '');

    // If there's still a number at the start followed by space, remove it
    cleaned = cleaned.replace(/^\d+\s+/, '');

    return cleaned.trim();
  }

  private sanitizeMapName(mapName: string): string {
    let cleaned = mapName.toLowerCase();

    // Remove all occurrences of "blitz" (will be added as prefix by pattern)
    cleaned = cleaned.replace(/[\s\-_]*blitz[\s\-_]*/gi, ' ');

    // Remove all occurrences of "2v2" (will be added as suffix for 2v2 maps)
    cleaned = cleaned.replace(/[\s\-_]*2v2[\s\-_]*/gi, ' ');

    // Remove version annotations (v1, v2, v11.3, v12.8, etc.)
    cleaned = cleaned.replace(/[\s\-_]*v\d+(\.\d+)*[\s\-_]*/gi, ' ');

    // Trim and collapse whitespace
    cleaned = cleaned.trim();

    // Standard sanitization
    return (
      cleaned
        .replace(/\s+/g, '_') // Spaces to underscores
        .replace(/[^a-z0-9_\-\.]/g, '') // Remove special chars
        .replace(/_+/g, '_') // Collapse multiple underscores
        .replace(/^_+|_+$/g, '') // Trim underscores from edges
        .replace(/^-+|-+$/g, '') // Trim dashes from edges
    );
  }

  private generateFileName(
    pattern: string,
    playerCount: number,
    sanitizedMapName: string
  ): string {
    return pattern
      .replace('{players}', playerCount.toString())
      .replace('{mapname}', sanitizedMapName);
  }
}
