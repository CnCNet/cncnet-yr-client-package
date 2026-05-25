#!/usr/bin/env node

import { Command } from 'commander';
import { LadderMapsSyncService } from './service/ladder-maps-sync.service.js';

const program = new Command();

program
  .name('ladder-maps-sync')
  .description('Synchronize ladder maps from CnCNet API to local client package')
  .version('1.0.0')
  .option('--ladder <name>', 'Sync specific ladder (e.g., blitz, ra2, yr, blitz-2v2)')
  .option('--dry-run', 'Preview changes without making them (not yet implemented)')
  .option('--force', 'Force redownload of all maps (not yet implemented)')
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    console.log('Starting Ladder Maps Sync...\n');

    const syncService = new LadderMapsSyncService();

    if (options.ladder) {
      console.log(`Note: Syncing specific ladder '${options.ladder}' is not yet implemented.`);
      console.log(`Will sync all enabled ladders instead.\n`);
    }

    if (options.dryRun) {
      console.log('Note: Dry-run mode is not yet implemented.\n');
    }

    if (options.force) {
      console.log('Note: Force mode is not yet implemented.\n');
    }

    await syncService.syncAllLadders();

    console.log('\nSync completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n[FATAL ERROR] Sync failed:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
