import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { LadderMapsConfig, LadderPoolConfig } from '../interface/config.interface.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ConfigService {
  private config: LadderMapsConfig | null = null;

  async loadConfig(): Promise<LadderMapsConfig> {
    if (this.config) {
      return this.config;
    }

    const configPath = join(__dirname, '..', 'config', 'ladder-pools.json');
    const configContent = await readFile(configPath, 'utf-8');
    this.config = JSON.parse(configContent) as LadderMapsConfig;

    this.validateConfig(this.config);

    return this.config;
  }

  private validateConfig(config: LadderMapsConfig): void {
    if (!config.ladderPools || config.ladderPools.length === 0) {
      throw new Error('Configuration must contain at least one ladder pool');
    }

    for (const pool of config.ladderPools) {
      if (!pool.name || !pool.gameMode || !pool.apiEndpoint || !pool.fileNamePattern) {
        throw new Error(`Invalid ladder pool configuration: ${JSON.stringify(pool)}`);
      }

      // Validate URL format
      try {
        new URL(pool.apiEndpoint);
      } catch {
        throw new Error(`Invalid API endpoint for ${pool.name}: ${pool.apiEndpoint}`);
      }
    }

    // Check for duplicate names
    const names = config.ladderPools.map((p) => p.name);
    const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicateNames.length > 0) {
      throw new Error(`Duplicate ladder pool names: ${duplicateNames.join(', ')}`);
    }

    // Check for duplicate game modes
    const gameModes = config.ladderPools.map((p) => p.gameMode);
    const duplicateGameModes = gameModes.filter((gm, index) => gameModes.indexOf(gm) !== index);
    if (duplicateGameModes.length > 0) {
      throw new Error(`Duplicate GameMode values: ${duplicateGameModes.join(', ')}`);
    }
  }

  getEnabledLadderPools(config: LadderMapsConfig): LadderPoolConfig[] {
    return config.ladderPools.filter((pool) => pool.enabled);
  }
}
