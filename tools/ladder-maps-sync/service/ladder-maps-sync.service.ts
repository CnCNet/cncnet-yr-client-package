import { readdir, readFile, unlink, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { parse as parseIni } from 'js-ini';
import { execSync } from 'child_process';
import type { LadderMap } from '../interface/ladder-map.interface.js';
import type { LocalMapFile } from '../interface/local-map-file.interface.js';
import type { SyncResult } from '../interface/sync-result.interface.js';
import type { LadderPoolConfig, LadderMapsConfig } from '../interface/config.interface.js';
import { LadderApiService } from './ladder-api.service.js';
import { MapDownloadService } from './map-download.service.js';
import { MapHashService } from './map-hash.service.js';
import { MapExtractionService } from './map-extraction.service.js';
import { ConfigService } from './config.service.js';

export class LadderMapsSyncService {
  private readonly ladderApiService: LadderApiService;
  private readonly mapDownloadService: MapDownloadService;
  private readonly mapHashService: MapHashService;
  private readonly configService: ConfigService;
  private readonly dryRun: boolean;

  constructor(dryRun: boolean = false) {
    this.ladderApiService = new LadderApiService();
    this.mapDownloadService = new MapDownloadService(dryRun);
    this.mapHashService = new MapHashService();
    this.configService = new ConfigService();
    this.dryRun = dryRun;
  }

  async syncAllLadders(ladderFilter: string | null = null): Promise<Map<string, SyncResult>> {
    const config = await this.configService.loadConfig();
    const results = new Map<string, SyncResult>();

    let enabledLadders = this.configService.getEnabledLadderPools(config);

    // Filter by ladder name if specified
    if (ladderFilter) {
      const filteredLadders = enabledLadders.filter(
        (pool) => pool.name.toLowerCase() === ladderFilter.toLowerCase()
      );

      if (filteredLadders.length === 0) {
        const availableLadders = enabledLadders.map((p) => p.name).join(', ');
        throw new Error(
          `Ladder '${ladderFilter}' not found or not enabled. Available ladders: ${availableLadders}`
        );
      }

      enabledLadders = filteredLadders;
      console.log(`Filtering to specific ladder: ${ladderFilter}\n`);
    }

    console.log('\n=== Ladder Maps Sync ===\n');
    console.log(`Found ${enabledLadders.length} enabled ladder pool(s)\n`);

    for (const ladderPool of enabledLadders) {
      console.log(`\n--- Syncing ladder: ${ladderPool.name} (GameMode: ${ladderPool.gameMode}) ---`);
      const result = await this.syncLadder(ladderPool, config);
      results.set(ladderPool.name, result);

      this.printSyncResult(ladderPool.name, result);
    }

    // Run MPMaps updater once after all ladders are synced
    if (!this.dryRun) {
      console.log('\n--- Running MPMaps updater ---');
      await this.runMpMapsUpdater();
    } else {
      console.log('\n--- MPMaps updater ---');
      console.log('  [DRY RUN] Would run: npm run mpmaps-updater');
    }

    console.log('\n=== Sync Complete ===\n');

    return results;
  }

  private async syncLadder(
    ladderPool: LadderPoolConfig,
    config: LadderMapsConfig
  ): Promise<SyncResult> {
    const result: SyncResult = {
      totalMapsInLadder: 0,
      existingMaps: 0,
      downloadedMaps: 0,
      updatedMaps: 0,
      deletedMaps: 0,
      failedDownloads: [],
      errors: [],
    };

    try {
      // 1. Fetch ladder maps from API
      console.log(`  Fetching maps from API...`);
      const ladderMaps = await this.ladderApiService.fetchLadderMaps(
        ladderPool.apiEndpoint,
        config.settings.download.maxRetries,
        config.settings.download.retryDelayMs,
        config.settings.download.timeoutMs
      );
      result.totalMapsInLadder = ladderMaps.length;

      // 2. Get local map files
      const mapsDir = join(process.cwd(), '..', '..', config.settings.mapsDirectory);
      const localMaps = await this.getLocalMapFiles(mapsDir);

      // 3. Load MPMaps.ini and get maps for this game mode
      const mpMapsIniPath = join(process.cwd(), '..', '..', config.settings.mpMapsIniPath);
      const mpMapsIni = await this.loadMPMapsIni(mpMapsIniPath);
      const ladderManagedMaps = this.getMapsForGameMode(mpMapsIni, ladderPool.gameMode);

      console.log(`  Found ${Object.keys(ladderManagedMaps).length} existing ${ladderPool.gameMode} maps`);

      // Create map extraction service
      const tempDir = join(process.cwd(), '..', '..', config.settings.tempDirectory);
      const mapExtractionService = new MapExtractionService(
        this.mapDownloadService,
        this.mapHashService,
        config.settings.mapDatabaseUrl,
        config.settings.mapImageBaseUrl,
        tempDir,
        mapsDir,
        config.settings.download.maxRetries,
        config.settings.download.retryDelayMs,
        config.settings.download.timeoutMs,
        this.dryRun
      );

      // Create set of ladder map hashes for quick lookup
      const ladderMapHashes = new Set(ladderMaps.map((m) => m.hash));

      // 4. Process each ladder map
      console.log(`  Processing ${ladderMaps.length} ladder maps...`);
      for (const ladderMap of ladderMaps) {
        const localMap = await this.findLocalMapByHash(
          ladderMap.hash,
          localMaps,
          this.mapHashService
        );

        if (localMap && localMap.hash === ladderMap.hash) {
          // Map exists and hash matches - up to date
          result.existingMaps++;
        } else if (localMap && localMap.hash !== ladderMap.hash) {
          // Hash mismatch - map was updated
          const logPrefix = this.dryRun ? '[DRY RUN] Would update' : '[UPDATE]';
          console.log(
            `  ${logPrefix} ${ladderMap.map.name} (${localMap.hash?.substring(0, 8)}... -> ${ladderMap.hash.substring(0, 8)}...)`
          );
          if (!this.dryRun) {
            await this.deleteMapFiles(localMap);
          }
          try {
            await mapExtractionService.extractAndNameMap(
              ladderMap.hash,
              ladderMap.map.name,
              ladderMap.map.image_hash,
              ladderPool
            );
            result.updatedMaps++;
          } catch (error) {
            if (!this.dryRun) {
              result.failedDownloads.push({
                hash: ladderMap.hash,
                mapName: ladderMap.map.name,
                error: error instanceof Error ? error.message : String(error),
              });
            }
          }
        } else {
          // Map doesn't exist - download it
          const logPrefix = this.dryRun ? '[DRY RUN] Would download' : '[NEW]';
          console.log(`  ${logPrefix} ${ladderMap.map.name} (${ladderMap.hash.substring(0, 8)}...)`);
          try {
            await mapExtractionService.extractAndNameMap(
              ladderMap.hash,
              ladderMap.map.name,
              ladderMap.map.image_hash,
              ladderPool
            );
            result.downloadedMaps++;
          } catch (error) {
            if (!this.dryRun) {
              result.failedDownloads.push({
                hash: ladderMap.hash,
                mapName: ladderMap.map.name,
                error: error instanceof Error ? error.message : String(error),
              });
            }
          }
        }
      }

      // 5. Detect and remove maps that are no longer in the ladder pool
      console.log(`  Checking for removed maps...`);
      for (const localMap of localMaps) {
        // Compute hash if not already computed
        if (!localMap.hash) {
          try {
            localMap.hash = await this.mapHashService.computeFileHash(localMap.fullPath);
          } catch {
            continue; // Skip if we can't read the file
          }
        }

        // Check if this map's hash is in the ladder
        if (!ladderMapHashes.has(localMap.hash)) {
          // Check if this map belongs to this ladder based on filename pattern or MPMaps.ini
          const mapFilename = localMap.filename.replace('.map', '');

          // Check if exists in MPMaps.ini (keys may have path prefix like "Maps\Yuri's Revenge\")
          const inMPMapsIni = Object.keys(ladderManagedMaps).some(
            (key) => key === mapFilename || key.endsWith(`\\${mapFilename}`) || key.endsWith(`/${mapFilename}`)
          );

          const belongsToLadder =
            inMPMapsIni || // In MPMaps.ini with matching GameMode
            this.matchesLadderPattern(localMap.filename, ladderPool); // Matches filename pattern

          if (belongsToLadder) {
            const logPrefix = this.dryRun ? '[DRY RUN] Would delete' : '[DELETE]';
            console.log(`  ${logPrefix} ${localMap.filename} (removed from ladder)`);
            if (!this.dryRun) {
              await this.deleteMapFiles(localMap);
            }
            result.deletedMaps++;
          }
        }
      }
    } catch (error) {
      result.errors.push(error as Error);
      console.error(`  [ERROR] Sync failed:`, error instanceof Error ? error.message : String(error));
    }

    return result;
  }

  private async getLocalMapFiles(mapsDir: string): Promise<LocalMapFile[]> {
    if (!existsSync(mapsDir)) {
      return [];
    }

    const files = await readdir(mapsDir);
    return files
      .filter((f) => f.endsWith('.map'))
      .map((filename) => ({
        filename,
        fullPath: join(mapsDir, filename),
        exists: true,
      }));
  }

  private async findLocalMapByHash(
    hash: string,
    localMaps: LocalMapFile[],
    hashService: MapHashService
  ): Promise<LocalMapFile | null> {
    // First try filename-based check
    const byFilename = localMaps.find((m) => m.filename.includes(hash));
    if (byFilename) {
      byFilename.hash = hash;
      return byFilename;
    }

    // Fall back to content-based hash computation
    for (const localMap of localMaps) {
      try {
        const computedHash = await hashService.computeFileHash(localMap.fullPath);
        localMap.hash = computedHash;
        if (computedHash === hash) {
          return localMap;
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  private async loadMPMapsIni(mpMapsIniPath: string): Promise<any> {
    if (!existsSync(mpMapsIniPath)) {
      return {};
    }

    const iniContent = await readFile(mpMapsIniPath, 'utf-8');
    return parseIni(iniContent);
  }

  private getMapsForGameMode(mpMapsIni: any, gameMode: string): Record<string, any> {
    const maps: Record<string, any> = {};

    for (const [key, section] of Object.entries(mpMapsIni)) {
      // Skip non-map sections
      if (
        key === 'MultiMaps' ||
        key === 'GameModes' ||
        key.includes('Forced') ||
        typeof section !== 'object' ||
        section === null
      ) {
        continue;
      }

      // Check if this map belongs to the target game mode
      const gameModes = (section as any).GameModes as string | undefined;
      if (gameModes && gameModes.includes(gameMode)) {
        maps[key] = section;
      }
    }

    return maps;
  }

  private async deleteMapFiles(localMap: LocalMapFile): Promise<void> {
    const basePath = localMap.fullPath.replace('.map', '');

    // Delete .map file
    if (existsSync(localMap.fullPath)) {
      await unlink(localMap.fullPath);
    }

    // Delete .png file if it exists
    const imagePath = `${basePath}.png`;
    if (existsSync(imagePath)) {
      await unlink(imagePath);
    }
  }

  private async runMpMapsUpdater(): Promise<void> {
    try {
      const mpmapsUpdaterDir = join(process.cwd(), '..', 'mpmaps-updater');
      const workingDir = join(process.cwd(), '..', '..');

      console.log(`  Running npm run mpmaps-updater from tools directory...`);

      // Run from the tools directory (parent of ladder-maps-sync)
      execSync('npm run mpmaps-updater', {
        cwd: join(process.cwd(), '..'),
        stdio: 'inherit',
      });

      console.log(`  MPMaps.ini updated successfully`);
    } catch (error) {
      console.error(
        `  [ERROR] Failed to run MPMaps updater:`,
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }

  private matchesLadderPattern(filename: string, ladderPool: LadderPoolConfig): boolean {
    // Remove .map extension
    const baseName = filename.replace('.map', '');

    // Check if the filename matches the ladder's pattern
    const pattern = ladderPool.fileNamePattern;

    // For patterns with {players}_{mapname}
    if (pattern.includes('{players}')) {
      // Match: <number>_<anything>
      return /^\d+_.+/.test(baseName);
    }

    // For blitz patterns
    if (pattern.startsWith('blitz_')) {
      if (pattern.endsWith('_2v2')) {
        // Match: blitz_<anything>_2v2
        return /^blitz_.+_2v2$/.test(baseName);
      } else {
        // Match: blitz_<anything> but NOT ending in _2v2
        return /^blitz_.+/.test(baseName) && !baseName.endsWith('_2v2');
      }
    }

    return false;
  }

  private printSyncResult(ladderName: string, result: SyncResult): void {
    console.log(`\n  Results for ${ladderName}:`);
    console.log(`    Total in ladder: ${result.totalMapsInLadder}`);
    console.log(`    Existing (up to date): ${result.existingMaps}`);
    console.log(`    Downloaded (new): ${result.downloadedMaps}`);
    console.log(`    Updated: ${result.updatedMaps}`);
    console.log(`    Deleted: ${result.deletedMaps}`);
    console.log(`    Failed: ${result.failedDownloads.length}`);

    if (result.failedDownloads.length > 0) {
      console.log(`\n  Failed downloads:`);
      for (const failure of result.failedDownloads) {
        console.log(`    - ${failure.mapName} (${failure.hash.substring(0, 8)}...): ${failure.error}`);
      }
    }

    if (result.errors.length > 0) {
      console.log(`\n  Errors:`);
      for (const error of result.errors) {
        console.log(`    - ${error.message}`);
      }
    }
  }
}
