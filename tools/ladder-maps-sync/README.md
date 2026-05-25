# Ladder Maps Sync

Automated synchronization of CnCNet Quick Match ladder maps from the ladder API to the local client package.

## Overview

This tool automatically:
- Fetches the current ladder map pool from the CnCNet API
- Downloads missing maps from the map database
- Updates maps when they change (hash-based detection)
- Removes maps that are no longer in the ladder pool
- Updates MPMaps.ini with new map entries
- Supports multiple ladder pools (RA2, YR, Blitz, Blitz 2v2)

## Usage

### Run from tools directory

```bash
cd tools
npm run ladder-maps-sync
```

### Run directly

```bash
cd tools/ladder-maps-sync
npx tsx index.ts
```

### Command Line Options

```bash
npx tsx index.ts --help          # Show help
npx tsx index.ts --ladder blitz  # Sync only the blitz ladder
npx tsx index.ts --ladder YR     # Sync only the YR ladder
npx tsx index.ts --dry-run       # Preview changes without modifying files
npx tsx index.ts --dry-run --ladder blitz  # Preview blitz ladder changes only
npx tsx index.ts --force         # Force redownload (not yet implemented)
```

#### --dry-run Mode

Dry-run mode allows you to preview what changes would be made without actually modifying any files:

- Fetches current map lists from the API (read-only)
- Shows which maps would be downloaded, updated, or deleted
- Does not download any files
- Does not modify MPMaps.ini
- Clearly marks all operations with `[DRY RUN]` prefix

**Example:**
```bash
npx tsx index.ts --dry-run --ladder blitz
```

Output will show:
```
=== DRY RUN MODE ===
No files will be modified. This is a preview only.

[DRY RUN] Would download Boom v2 (96a90c35...)
[DRY RUN] Would download ZIP: https://mapdb.cncnet.org/yr/96a90c35...
[DRY RUN] Final filename: blitz_boom_v2.map
...
```

#### --ladder Filter

The `--ladder` option allows you to sync only a specific ladder instead of all enabled ladders:

**Valid ladder names:**
- `RA2` - Red Alert 2 Ladder
- `YR` - Yuri's Revenge Ladder
- `blitz` - Blitz 1v1 Ladder
- `blitz-2v2` - Blitz 2v2 Ladder

**Example:**
```bash
# Sync only blitz maps
npx tsx index.ts --ladder blitz

# Preview YR ladder changes
npx tsx index.ts --dry-run --ladder YR
```

If you specify an invalid ladder name, the tool will show an error with available options:
```
[FATAL ERROR] Ladder 'invalid' not found or not enabled.
Available ladders: RA2, YR, blitz, blitz-2v2
```

## Configuration

Configuration is stored in `config/ladder-pools.json`:

- **ladderPools**: Array of ladder pool definitions
  - `name`: Ladder identifier (ra2, yr, blitz, blitz-2v2)
  - `gameMode`: GameMode value in MPMaps.ini
  - `apiEndpoint`: API URL for this ladder
  - `fileNamePattern`: File naming pattern (`{players}_{mapname}` or `blitz_{mapname}`)
  - `enabled`: Whether to sync this ladder
  - `description`: Human-readable description

- **settings**: Global settings
  - `mapDatabaseUrl`: Base URL for map ZIP downloads
  - `mapImageBaseUrl`: Base URL for map preview images
  - `mapsDirectory`: Path to maps directory (relative to project root)
  - `mpMapsIniPath`: Path to MPMaps.ini (relative to project root)
  - `tempDirectory`: Temporary directory for downloads/extraction
  - `download`: Download settings (retries, timeouts, concurrency)
  - `logging`: Logging settings

## How It Works

1. **Configuration Loading**: Loads and validates `config/ladder-pools.json`

2. **For Each Enabled Ladder Pool**:
   - Fetches current maps from the ladder API
   - Loads existing maps from the local directory
   - Loads MPMaps.ini and filters maps by GameMode

3. **For Each Ladder Map**:
   - **If missing**: Downloads ZIP, extracts, parses metadata, generates filename, copies to maps directory
   - **If hash changed**: Deletes old version, downloads new version
   - **If up to date**: Skips

4. **Deletion Detection**:
   - Identifies maps in MPMaps.ini (with matching GameMode) that are not in the ladder API
   - Deletes those maps (only touches maps with the specific GameMode)

5. **MPMaps.ini Update**:
   - Runs the existing `mpmaps-updater` tool to regenerate MPMaps.ini

## File Naming

Maps are named according to ladder-specific patterns:

| Ladder | Pattern | Example |
|--------|---------|---------|
| RA2 | `{players}_{mapname}` | `2_arabian_oasis.map` |
| YR | `{players}_{mapname}` | `2_cloud_nine.map` |
| Blitz | `blitz_{mapname}` | `blitz_boom.map` |
| Blitz 2v2 | `blitz_{mapname}_2v2` | `blitz_caladan_2v2.map` |

Map names are:
- Extracted from the map file's `[Basic]->Name` field
- Player count prefix removed (e.g., `[2] Arabian Oasis` → `Arabian Oasis`)
- Sanitized (lowercase, spaces→underscores, special chars removed)

## Temporary Files

Downloaded ZIPs and extracted files are stored in `.temp/`:
- `.temp/downloads/`: Downloaded ZIP files
- `.temp/extracted/{hash}/`: Extracted map files before renaming

These directories are kept for debugging and are excluded from git via `.gitignore`.

## Safety Features

- **GameMode-Based Protection**: Only manages maps with the specific GameMode for each ladder
- **Hash Verification**: All downloaded files are hash-verified before copying
- **Existing Updater Integration**: Uses the proven `mpmaps-updater` tool for MPMaps.ini updates
- **Error Handling**: Failed downloads don't stop the entire process
- **Retry Logic**: Automatic retries with exponential backoff for network errors

## Output Example

### Normal Sync

```
=== Ladder Maps Sync ===

Found 4 enabled ladder pool(s)

--- Syncing ladder: blitz (GameMode: Blitz) ---
  Fetching maps from API...
  Found 45 maps in ladder API
  Found 40 existing Blitz maps
  Processing 45 ladder maps...
  [NEW] Boom v2 (96a90c35...)
    Downloading ZIP: https://mapdb.cncnet.org/yr/96a90c35...
    Extracting to: .temp/extracted/96a90c35...
    Final filename: blitz_boom_v2.map
    Copied to: package/Maps/Yuri's Revenge/blitz_boom_v2.map
    Downloading image: https://ladder.cncnet.org/images/maps/yr/a7fa8688...
  Checking for removed maps...
  [DELETE] blitz_old_map.map (removed from ladder)

  Results for blitz:
    Total in ladder: 45
    Existing (up to date): 40
    Downloaded (new): 4
    Updated: 0
    Deleted: 1
    Failed: 0

--- Running MPMaps updater ---
  Running npm run mpmaps-updater from tools directory...
  MPMaps.ini updated successfully

=== Sync Complete ===
```

### Dry-Run Mode

```
=== DRY RUN MODE ===
No files will be modified. This is a preview only.

Starting Ladder Maps Sync...

Filtering to specific ladder: blitz


=== Ladder Maps Sync ===

Found 1 enabled ladder pool(s)


--- Syncing ladder: blitz (GameMode: Blitz) ---
  Fetching maps from API...
  Found 45 maps in ladder API
  Found 109 existing Blitz maps
  Processing 45 ladder maps...
  [DRY RUN] Would download Boom v2 (96a90c35...)
    [DRY RUN] Would download ZIP: https://mapdb.cncnet.org/yr/96a90c35...
    [DRY RUN] Would extract and process map file
    [DRY RUN] Final filename: blitz_boom_v2.map
    [DRY RUN] Would copy to: package/Maps/Yuri's Revenge/blitz_boom_v2.map
    [DRY RUN] Would download image: https://ladder.cncnet.org/images/maps/yr/a7fa8688...
  Checking for removed maps...

  Results for blitz:
    Total in ladder: 45
    Existing (up to date): 0
    Downloaded (new): 45
    Updated: 0
    Deleted: 0
    Failed: 0

--- MPMaps updater ---
  [DRY RUN] Would run: npm run mpmaps-updater

=== Sync Complete ===


=== DRY RUN COMPLETE ===
No files were modified. Run without --dry-run to apply changes.
```

## Architecture

```
ladder-maps-sync/
├── config/
│   └── ladder-pools.json           # Configuration
├── interface/
│   ├── config.interface.ts         # Configuration types
│   ├── ladder-map.interface.ts     # Ladder API response types
│   ├── local-map-file.interface.ts # Local map file types
│   └── sync-result.interface.ts    # Sync result types
├── service/
│   ├── config.service.ts           # Configuration loader/validator
│   ├── ladder-api.service.ts       # Ladder API client
│   ├── ladder-maps-sync.service.ts # Main orchestrator
│   ├── map-download.service.ts     # File download service
│   ├── map-extraction.service.ts   # ZIP extraction & naming
│   └── map-hash.service.ts         # Hash computation
├── index.ts                        # CLI entry point
├── package.json                    # Dependencies
└── README.md                       # This file
```

## Dependencies

- **tsx**: TypeScript execution
- **js-ini**: INI file parsing
- **adm-zip**: ZIP file extraction
- **commander**: CLI argument parsing
- **cncnet-core**: Core utilities (workspace dependency)

## Future Enhancements

- [x] Implement `--ladder` flag to sync specific ladders ✅
- [x] Implement `--dry-run` mode for previewing changes ✅
- [ ] Implement `--force` mode for redownloading all maps
- [ ] Add parallel downloads (currently sequential)
- [ ] Add progress indicators for downloads
- [ ] Add hash caching to avoid recomputation
- [ ] Add backup functionality before deletion
- [ ] Add notification support (map added/removed)
- [ ] Add CI/CD integration for automated syncing

## Troubleshooting

### Issue: Sync fails with network error
**Solution**: Check internet connection, verify API endpoints are accessible, increase timeout in config

### Issue: Maps are not appearing in game
**Solution**: Verify MPMaps.ini was updated, check GameMode values match configuration

### Issue: Wrong maps being deleted
**Solution**: Verify GameMode values in configuration exactly match MPMaps.ini values

### Issue: Hash mismatch errors
**Solution**: Corrupted download - tool will retry automatically. If persistent, report to map database maintainers

## Related Documentation

- [Ladder Maps Sync Specification](../../docs/specs/README.md)
- [Technical Specification](../../docs/specs/ladder-maps-sync-technical-spec.md)
- [Configuration Specification](../../docs/specs/ladder-maps-sync-config-spec.md)
- [File Naming Specification](../../docs/specs/ladder-maps-sync-file-naming-spec.md)

## Support

For issues or questions:
1. Check the specification documents in `docs/specs/`
2. Review the implementation checklist in `docs/specs/README.md`
3. Open an issue on the GitHub repository
