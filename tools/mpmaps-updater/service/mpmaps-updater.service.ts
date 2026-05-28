import { parseArgs } from 'util';
import * as fsPromises from 'fs/promises';

import { parse as parseIni, stringify } from 'js-ini';
import type { IIniObject, IIniObjectSection } from 'js-ini';

import { createConstants } from 'mpmaps-updater/constants';
import { IniFile } from 'mpmaps-updater/class/ini-file.class';
import { MapLoaderService } from 'mpmaps-updater/service/map-loader.service';
import { MpMapsFileService } from 'mpmaps-updater/class/mp-maps-file.service';
import { type ISortedMapSection } from 'mpmaps-updater/interface/sorted-map-section.interface';

function isIniSection(value: unknown): value is IIniObjectSection {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export class MpMapsUpdaterService {
    private constants: ReturnType<typeof createConstants>;

    private mpMapsIniFileService: MpMapsFileService;
    private mapLoaderService: MapLoaderService;
    private ladderMapsMetadataCache: any | null = null;

    constructor(private workingDir: string) {
        this.constants = createConstants(workingDir);
        this.mpMapsIniFileService = new MpMapsFileService(this.constants.paths.package);
        this.mapLoaderService = new MapLoaderService(this.constants.paths.package, this.constants.paths.maps);
    }

    public static run(): void {
        const { values } = parseArgs({
            options: {
                workingDir: {
                    type: 'string',
                    short: 'w',
                },
            },
        });

        if (!values.workingDir) {
            console.error('Missing required argument: --workingDir');
            console.error('Example: npm run mpmaps-updater -- --workingDir /path/to/package');
            process.exit(1);
        }

        new MpMapsUpdaterService(values.workingDir).run().catch(console.error);
    }

    /**
     * @private
     */
    private async run(): Promise<void> {
        console.log('MPMaps.ini updater');
        await this.checkForRequiredFilesAsync();

        const mpMapsIniFile: IniFile = await this.mpMapsIniFileService.getMpMapsIniFileAsync();
        const mapIniFiles: IniFile[] = await this.mapLoaderService.getMapIniFilesAsync();
        await this.mergeMapsKeys(mpMapsIniFile, mapIniFiles);

        await mpMapsIniFile.writeAsync();
    }

    /**
     * This merges the map data from .map files and the MPMaps.ini file.
     * @param mpMapsIniFile the MPMaps.ini file to merge
     * @param mapIniFiles the list of maps found on the system
     * @private
     */
    private async mergeMapsKeys(mpMapsIniFile: IniFile, mapIniFiles: IniFile[]): Promise<void> {
        console.log('Merging MPMaps.ini file with .map files');
        const addedMapFiles: IniFile[] = await this.addNewMapIniFiles(mpMapsIniFile, mapIniFiles);
        await this.updateExistingMapSections(mpMapsIniFile, mapIniFiles);
        const removedMapKeys: string[] = await this.removeMissingMaps(mpMapsIniFile, mapIniFiles);
        await this.updateMultiMaps(mpMapsIniFile, addedMapFiles, removedMapKeys);
    }

    private async updateMultiMaps(
        mpMapsIniFile: IniFile,
        addedMapIniFiles: IniFile[],
        removedMapKeys: string[],
    ): Promise<void> {
        const addedMapKeys = addedMapIniFiles.map((m) => m.getMpMapsKey());
        const allMapKeys = mpMapsIniFile
            // get all existing map keys from [MultiMaps]
            .getMultiMapsValues()
            // filter out those that were removed
            .filter((mpMapKey) => removedMapKeys.indexOf(mpMapKey) === -1)
            // add new ones
            .concat(addedMapKeys);

        // This is the property of each map that we sort on when ordering them in the [MultiMaps] section.
        // This will also dictate how they are default sorted in the client game lobby.
        const sortKey: string = 'Description';
        const sortedMapSections: ISortedMapSection[] = allMapKeys
            .map((mapKey): ISortedMapSection | null => {
                const section = mpMapsIniFile.getSection(mapKey);
                if (!isIniSection(section)) {
                    return null;
                }

                // create simple array of objects for each map key and the map section in the MPMaps.ini file
                return {
                    mapKey,
                    section,
                };
            })
            .filter((mapSection): mapSection is ISortedMapSection => mapSection !== null)
            .filter((m, index, allMaps) => {
                // create unique array
                return allMaps.findIndex((_m) => _m.mapKey === m.mapKey) === index;
            })
            .sort((mapObjA, mapObjB) => {
                // sort the simple array by "sortKey" above
                const valueA = mapObjA.section[sortKey];
                const valueB = mapObjB.section[sortKey];
                if (valueA === valueB) return 0;
                return String(valueA) > String(valueB) ? 1 : -1;
            });

        // Use the map path as the key to produce stable, minimal diffs.
        // The CnCNet client reads all keys in [MultiMaps] regardless of format —
        // they do not need to be sequential integers.
        const multiMapsSection: { [key: string]: string } = {};
        for (const sortedMap of sortedMapSections) {
            multiMapsSection[sortedMap.mapKey] = sortedMap.mapKey;
        }

        mpMapsIniFile.setMultiMapsSection(multiMapsSection);
    }

    private async getNewMapSection(mapIniFile: IniFile): Promise<IIniObjectSection> {
        const newSection: IIniObjectSection = Object.assign(
            {},
            this.getOptionalIniSection(mapIniFile.getMapSection()),
            this.getOptionalIniSection(mapIniFile.getBasicSection()),
        );
        const headerSection = this.getOptionalIniSection(mapIniFile.getHeaderSection());
        const rawMaxWaypoints = headerSection['NumberStartingPoints'];
        const parsedMaxWaypoints =
            typeof rawMaxWaypoints === 'string' ? Number.parseInt(rawMaxWaypoints, 10) : Number.NaN;
        const maxWaypoints =
            Number.isFinite(parsedMaxWaypoints) && parsedMaxWaypoints > 0
                ? parsedMaxWaypoints
                : this.constants.maxWaypoints;
        const waypoints = mapIniFile.getWaypointsSectionValues();
        for (let i = 0; i < maxWaypoints; i++) {
            const waypoint = waypoints[i];
            if (waypoint !== undefined) {
                newSection[`Waypoint${i}`] = waypoint;
            }
        }

        return await this.normalizeSection(mapIniFile, newSection);
    }

    /**
     * Clean up map description by removing version info and redundant suffixes
     * Examples:
     *   "[4] Village Swing v0.9 blitz QM (no preview)" -> "[4] Village Swing"
     *   "[4] Tubac v3 - Blitz 2v2" -> "[4] Tubac"
     *   "Boom v2" -> "Boom"
     */
    private cleanDescription(description: string): string {
        let cleaned = description;

        // Remove version info (v0.9, v3, v12.8, etc.) and everything after it
        cleaned = cleaned.replace(/\s+v\d+(\.\d+)*.*$/i, '');

        // Remove common ladder/mode suffixes (case insensitive)
        // Remove "- Blitz 2v2", "- blitz", etc.
        cleaned = cleaned.replace(/\s*-?\s*(blitz\s*(2v2)?|qm|ladder)\s*$/gi, '');

        // Remove parenthetical notes at the end (e.g., "(no preview)")
        cleaned = cleaned.replace(/\s*\([^)]*\)\s*$/g, '');

        // Remove "blitz" or "Blitz" in the middle or end (not part of the actual map name)
        // But be careful not to remove it if it's part of the core name
        cleaned = cleaned.replace(/\s+(blitz|qm|ladder)\s*$/gi, '');

        // Clean up multiple spaces and trim
        cleaned = cleaned.replace(/\s+/g, ' ').trim();

        // Remove trailing punctuation like " -" or ","
        cleaned = cleaned.replace(/[\s\-,]+$/, '');

        return cleaned;
    }

    private async normalizeSection(mapIniFile: IniFile, newSection: IIniObjectSection): Promise<IIniObjectSection> {
        console.log('Normalizing new map section');
        const gameMode = this.getRequiredSectionValue(mapIniFile, newSection, 'GameMode');
        const maxPlayer = this.getRequiredSectionValue(mapIniFile, newSection, 'MaxPlayer');
        const name = this.getRequiredSectionValue(mapIniFile, newSection, 'Name');

        // map files declare this as 'GameMode'. MPMaps.ini declares this as 'GameModes'.
        newSection['GameModes'] = gameMode.replace(/standard/gi, 'Battle');
        newSection['MinPlayers'] = 1; //allow 1 person to launch the game, to practice/preview the map (this is existing behavior from previous script)
        newSection['MaxPlayers'] = maxPlayer;
        newSection['EnforceMaxPlayers'] = 'True';
        newSection['Description'] = this.cleanDescription(name);
        delete newSection['Name'];

        // only pull properties that we've whitelisted
        for (const key of Object.keys(newSection)) {
            if (!this.constants.newMapSectionWhitelist.find((item) => new RegExp(`^${item}$`).test(key))) {
                delete newSection[key];
            }
        }

        await this.normalizeGameModes(newSection);

        // Detect and append additional GameModes based on filename patterns
        await this.detectLadderGameModes(mapIniFile, newSection);

        // sort properties alphabetically;
        return Object.keys(newSection)
            .sort((a, b) => {
                return a > b ? 1 : -1;
            })
            .reduce<IIniObjectSection>((obj, key) => {
                obj[key] = newSection[key];
                return obj;
            }, {});
    }

    private getRequiredSectionValue(mapIniFile: IniFile, section: IIniObjectSection, key: string): string {
        const value = section[key];
        if (typeof value === 'string' && value.trim()) {
            return value;
        }

        throw new Error(
            `Map '${mapIniFile.getPackageRelativePath()}' is missing required '${key}' metadata in its [Basic] or [Map] section.`,
        );
    }

    private async normalizeGameModes(section: IIniObjectSection): Promise<void> {
        const gameModesValue = section['GameModes'];
        const gameModes = typeof gameModesValue === 'string' ? gameModesValue.split(',') : [];
        for (let i = 0; i < gameModes.length; i++) {
            gameModes[i] = await this.normalizeGameMode(gameModes[i]);
        }
        section['GameModes'] = gameModes.join(',');
    }

    private getOptionalIniSection(value: unknown): IIniObjectSection {
        return isIniSection(value) ? value : {};
    }

    private async normalizeGameMode(gameMode: string): Promise<string> {
        return gameMode
            .split(/\s+/)
            .map((a) => `${a.slice(0, 1).toUpperCase()}${a.slice(1)}`)
            .join(' ');
    }

    /**
     * Detects additional GameModes based on ladder maps metadata or filename patterns.
     * This handles maps downloaded from ladder pools that don't have the correct GameMode in their file.
     * For Blitz maps, replaces GameModes entirely instead of appending.
     */
    private async detectLadderGameModes(mapIniFile: IniFile, section: IIniObjectSection): Promise<void> {
        const mpMapsKey = mapIniFile.getMpMapsKey();
        const filename = mpMapsKey.split(/[\\/]/).pop() || '';

        // Get current GameModes as array
        const gameModesValue = section['GameModes'];
        const gameModes = typeof gameModesValue === 'string' ? gameModesValue.split(',').map(g => g.trim()) : [];

        let ladderGameMode: string | null = null;

        // First, try to get GameMode from ladder maps metadata
        const metadata = await this.loadLadderMapsMetadata();
        if (metadata) {
            const mapMetadata = metadata.maps[filename];
            if (mapMetadata) {
                ladderGameMode = mapMetadata.gameMode;
                console.log(`  Detected ladder GameMode from metadata for '${filename}': ${ladderGameMode}`);
            }
        }

        // Fallback to pattern matching for ladder maps (if metadata not found)
        if (!ladderGameMode) {
            // blitz_*_2v2 pattern
            if (/^blitz_.+_2v2$/i.test(filename)) {
                ladderGameMode = 'Blitz 2v2';
            }
            // blitz_* pattern (but NOT ending in _2v2)
            else if (/^blitz_.+/i.test(filename) && !/2v2$/i.test(filename)) {
                ladderGameMode = 'Blitz';
            }
            // \d+_* pattern (YR Ladder or RA2 Ladder) - ONLY if in metadata or explicitly marked
            // NOTE: We no longer auto-detect {number}_{name} patterns to avoid false positives
            // These should be tracked via metadata from ladder-maps-sync

            if (ladderGameMode) {
                console.log(`  Detected ladder GameMode from filename pattern '${filename}': ${ladderGameMode}`);
            }
        }

        // Apply the ladder GameMode if detected
        if (ladderGameMode) {
            // For Blitz maps, REPLACE GameModes entirely (don't append to Battle)
            if (ladderGameMode.startsWith('Blitz')) {
                section['GameModes'] = ladderGameMode;
            }
            // For other ladder maps (YR/RA2), append if not already present
            else if (!gameModes.includes(ladderGameMode)) {
                gameModes.push(ladderGameMode);
                section['GameModes'] = gameModes.join(',');
            }
        }
    }

    /**
     * Load ladder maps metadata file (if exists)
     * Uses caching to avoid repeated file I/O
     */
    private async loadLadderMapsMetadata(): Promise<any> {
        // Return cached metadata if already loaded
        if (this.ladderMapsMetadataCache !== null) {
            return this.ladderMapsMetadataCache;
        }

        try {
            const metadataPath = `${this.constants.paths.package}/INI/ladder-maps-metadata.json`;
            const content = await fsPromises.readFile(metadataPath, 'utf-8');
            this.ladderMapsMetadataCache = JSON.parse(content);
            return this.ladderMapsMetadataCache;
        } catch (error) {
            // Metadata file doesn't exist or can't be read - that's okay, it's optional
            this.ladderMapsMetadataCache = null;
            return null;
        }
    }

    private async addNewMapIniFiles(mpMapsIniFile: IniFile, mapIniFiles: IniFile[]): Promise<IniFile[]> {
        console.log('Checking for added maps');
        const mpMapKeys = mpMapsIniFile.getMultiMapsValues();
        // find all map files that so not have an entry in MPMaps.ini [MultiMaps] OR do not have a section of their own in MPMaps.ini
        const addedMapIniFiles = mapIniFiles.filter(
            (m) => mpMapKeys.indexOf(m.getMpMapsKey()) === -1 || !mpMapsIniFile.getSection(m.getMpMapsKey()),
        );

        if (!addedMapIniFiles.length) {
            console.log('No maps added');
            return [];
        }

        console.log(`${addedMapIniFiles.length} new map(s) found`);
        for (let addedMapIniFile of addedMapIniFiles) {
            await this.addNewMapIniFile(mpMapsIniFile, addedMapIniFile);
        }

        return addedMapIniFiles;
    }

    private async addNewMapIniFile(mpMapsIniFile: IniFile, mapIniFile: IniFile): Promise<void> {
        console.log(`Adding new map '${mapIniFile.getPackageRelativePath()}'`);
        const newMapSection = await this.getNewMapSection(mapIniFile);

        const mpMapsKey = mapIniFile.getMpMapsKey();
        console.log(`Adding map section to MPMaps.ini: '${mpMapsKey}'`);
        mpMapsIniFile.setMapSection(mpMapsKey, newMapSection);
    }

    /**
     * Update existing map sections with ladder GameModes and cleaned descriptions
     */
    private async updateExistingMapSections(mpMapsIniFile: IniFile, mapIniFiles: IniFile[]): Promise<void> {
        console.log('Checking for existing maps to update');
        const mpMapKeys = mpMapsIniFile.getMultiMapsValues();

        // Find maps that exist in both MPMaps.ini and on disk
        const existingMapFiles = mapIniFiles.filter(
            (mapFile) => mpMapKeys.includes(mapFile.getMpMapsKey()) && mpMapsIniFile.getSection(mapFile.getMpMapsKey())
        );

        if (!existingMapFiles.length) {
            console.log('No existing maps to update');
            return;
        }

        let updatedCount = 0;

        for (const mapIniFile of existingMapFiles) {
            const mpMapsKey = mapIniFile.getMpMapsKey();
            const section = mpMapsIniFile.getSection(mpMapsKey);

            if (!isIniSection(section)) {
                continue;
            }

            let updated = false;

            // Update Description if needed (clean it)
            const currentDescription = section['Description'];
            if (typeof currentDescription === 'string') {
                const cleanedDescription = this.cleanDescription(currentDescription);
                if (cleanedDescription !== currentDescription) {
                    section['Description'] = cleanedDescription;
                    updated = true;
                }
            }

            // Update GameModes if ladder GameMode is missing or incorrect
            const filename = mpMapsKey.split(/[\\/]/).pop() || '';
            const currentGameModes = typeof section['GameModes'] === 'string'
                ? section['GameModes'].split(',').map(g => g.trim())
                : [];

            // Check if we need to add/replace with ladder GameMode
            const ladderGameMode = await this.detectMissingLadderGameMode(filename);
            if (ladderGameMode) {
                // For Blitz maps, REPLACE GameModes entirely (not append)
                if (ladderGameMode.startsWith('Blitz')) {
                    if (section['GameModes'] !== ladderGameMode) {
                        section['GameModes'] = ladderGameMode;
                        updated = true;
                        console.log(`  Updated '${filename}' with GameMode: ${ladderGameMode}`);
                    }
                }
                // For other ladder maps (YR/RA2), append if not already present
                else if (!currentGameModes.includes(ladderGameMode)) {
                    currentGameModes.push(ladderGameMode);
                    section['GameModes'] = currentGameModes.join(',');
                    updated = true;
                    console.log(`  Updated '${filename}' with GameMode: ${ladderGameMode}`);
                }
            }

            if (updated) {
                mpMapsIniFile.setMapSection(mpMapsKey, section);
                updatedCount++;
            }
        }

        if (updatedCount > 0) {
            console.log(`${updatedCount} existing map(s) updated`);
        } else {
            console.log('No existing maps needed updates');
        }
    }

    /**
     * Detect ladder GameMode for a filename (without appending to existing GameModes)
     * Returns the ladder GameMode if detected, null otherwise
     */
    private async detectMissingLadderGameMode(filename: string): Promise<string | null> {
        // First, try to get GameMode from ladder maps metadata
        const metadata = await this.loadLadderMapsMetadata();
        if (metadata) {
            const mapMetadata = metadata.maps[filename];
            if (mapMetadata) {
                return mapMetadata.gameMode;
            }
        }

        // Fallback to pattern matching for ladder maps
        // blitz_*_2v2 pattern
        if (/^blitz_.+_2v2$/i.test(filename)) {
            return 'Blitz 2v2';
        }
        // blitz_* pattern (but NOT ending in _2v2)
        else if (/^blitz_.+/i.test(filename) && !/2v2$/i.test(filename)) {
            return 'Blitz';
        }

        return null;
    }

    /**
     * If .map files are removed from the repo, we must also remove them from the MPMaps.ini file.
     * @param mpMapsIniFile the file to remove maps from
     * @param mapIniFiles the list of maps found on the system
     * @returns the missing map keys
     */
    private async removeMissingMaps(mpMapsIniFile: IniFile, mapIniFiles: IniFile[]): Promise<string[]> {
        console.log('Checking for removed maps');
        const mapKeys = mapIniFiles.map((m) => m.getMpMapsKey());
        const mpMapKeys = mpMapsIniFile.getMultiMapsValues();
        const missingMapKeys = mpMapKeys.filter((mapKey) => mapKeys.indexOf(mapKey) === -1);

        if (!missingMapKeys.length) {
            console.log('No maps removed');
            return [];
        }

        console.log(`${missingMapKeys.length} map(s) being removed`);
        await this.removeMissingMapKeys(mpMapsIniFile, mpMapKeys, missingMapKeys);
        await this.addRemovedMapsToUpdateExec(missingMapKeys);

        return missingMapKeys;
    }

    /**
     * If .map files are removed from the repo, we must also remove them from the MPMaps.ini file.
     * @param mpMapsIniFile the file to remove maps from
     * @param currentMapKeys the current maps in the MPMaps.ini file
     * @param missingMapKeys the maps that should be removed from the MPMaps.ini file
     * @private
     */
    private async removeMissingMapKeys(
        mpMapsIniFile: IniFile,
        currentMapKeys: string[],
        missingMapKeys: string[],
    ): Promise<void> {
        for (let missingMapKey of missingMapKeys) {
            currentMapKeys.splice(currentMapKeys.indexOf(missingMapKey), 1);
            console.log(`Clearing map key from MPMaps.ini: '${missingMapKey}'`);
            mpMapsIniFile.deleteMapSection(missingMapKey);
        }
    }

    /**
     * This adds entries to the updateexec file in the [Delete] section for all removed maps
     * @param missingMapKeys the map keys that should be added to the delete list
     */
    private async addRemovedMapsToUpdateExec(missingMapKeys: string[]): Promise<void> {
        const updateExecIniFile = await this.getUpdateExecIniFile();
        const deleteFiles = updateExecIniFile[this.constants.updateExecSections.deleteFile] as string[];
        const keysToAdd = missingMapKeys.map((key) => [`${key}.map`, `${key}.png`]).flat();

        for (let mapKey of keysToAdd) {
            deleteFiles.push(mapKey);
        }

        updateExecIniFile[this.constants.updateExecSections.deleteFile] = deleteFiles;

        await this.writeUpdateExecIniFile(updateExecIniFile);
    }

    /**
     * Get the content of the existing updateexec file.
     */
    private async getUpdateExecIniFile(): Promise<IIniObject> {
        const updateExecContent = await fsPromises.readFile(this.constants.paths.updateExec, {
            encoding: 'utf-8',
        });
        return parseIni(updateExecContent, {
            autoTyping: false,
            dataSections: [
                this.constants.updateExecSections.deleteFile,
                this.constants.updateExecSections.deleteFolder,
            ],
        });
    }

    /**
     * Write out data to the updateexec file
     * @param data the INI object content to write
     */
    private async writeUpdateExecIniFile(data: IIniObject): Promise<void> {
        const updateExecContent = stringify(data, {}).trim();
        await fsPromises.writeFile(this.constants.paths.updateExec, updateExecContent, 'utf8');
    }

    /**
     * There are some files or directories required for this tool.
     * Make sure they exist.
     * @private
     */
    private async checkForRequiredFilesAsync(): Promise<void> {
        console.log('Checking for required files');
        for (const path of [this.constants.paths.maps, this.constants.paths.mpMapsIni]) {
            await this.checkForRequiredFileAsync(path);
        }
    }

    /**
     * Validate that the specified file or directory
     * @param fileOrDirPath The file or directory to check
     * @private
     */
    private async checkForRequiredFileAsync(fileOrDirPath: string): Promise<void> {
        try {
            await fsPromises.access(fileOrDirPath);
        } catch (error) {
            console.error(`Unable to access file ${fileOrDirPath}`);
            throw error;
        }
    }
}
