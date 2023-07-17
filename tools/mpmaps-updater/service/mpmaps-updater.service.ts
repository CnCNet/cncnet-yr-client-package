import { access, constants as fsConstants, readFile, writeFileSync } from 'fs';
import { constants } from '../constants';
import { MapLoaderService } from './map-loader.service';
import { IniFile } from '../class';
import { SortedMapSection } from '../interface';
import * as util from 'util';
import { IIniObject, parse as parseIni, stringify } from 'js-ini';
import { MpMapsFileService } from '@cncnet-core/class/mp-maps-file.service';

export class MpMapsUpdaterService {

    private mpMapsIniFileService: MpMapsFileService;
    private mapLoaderService: MapLoaderService;

    public static run(): void {
        new MpMapsUpdaterService().run().catch(console.error);
    }

    constructor() {
        this.mpMapsIniFileService = new MpMapsFileService();
        this.mapLoaderService = new MapLoaderService();
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
        const removedMapKeys: string[] = await this.removeMissingMaps(mpMapsIniFile, mapIniFiles);
        await this.updateMultiMaps(mpMapsIniFile, addedMapFiles, removedMapKeys);
    }

    private async updateMultiMaps(mpMapsIniFile: IniFile, addedMapIniFiles: IniFile[], removedMapKeys: string[]): Promise<void> {
        const addedMapKeys = addedMapIniFiles.map(m => m.getMpMapsKey());
        const allMapKeys = mpMapsIniFile
            // get all existing map keys from [MultiMaps]
            .getMultiMapsValues()
            // filter out those that were removed
            .filter(mpMapKey => removedMapKeys.indexOf(mpMapKey) === -1)
            // add new ones
            .concat(addedMapKeys);

        // This is the property of each map that we sort on when ordering them in the [MultiMaps] section.
        // This will also dictate how they are default sorted in the client game lobby.
        const sortKey: string = 'Description';
        const sortedMapSections: SortedMapSection[] = allMapKeys.map(mapKey => {
            // create simple array of objects for each map key and the map section in the MPMaps.ini file
            return {
                mapKey,
                section: mpMapsIniFile.getSection(mapKey)
            }
        }).filter((m, index, allMaps) => {
            // create unique array
            return allMaps.findIndex(_m => _m.mapKey === m.mapKey) === index;
        }).sort((mapObjA: any, mapObjB: any) => {
            // sort the simple array by "sortKey" above
            if (mapObjA.section[sortKey] === mapObjB.section[sortKey])
                return 0;
            return mapObjA.section[sortKey] > mapObjB.section[sortKey] ? 1 : -1;
        });

        const multiMapsSection: { [key: number]: string } = {}
        for (let i = 0; i < sortedMapSections.length; i++) {
            multiMapsSection[i] = sortedMapSections[i].mapKey;
        }

        mpMapsIniFile.setMultiMapsSection(multiMapsSection);
    }

    private async getNewMapSection(mapIniFile: IniFile): Promise<any> {
        const newSection = Object.assign({}, mapIniFile.getMapSection() || {}, mapIniFile.getBasicSection() || {}, mapIniFile);
        const headerSection = mapIniFile.getHeaderSection() || {};
        const maxWaypoints = parseInt(headerSection['NumberStartingPoints']) || constants.maxWaypoints;
        const waypoints = mapIniFile.getWaypointsSectionValues();
        for (let i = 0; i < maxWaypoints; i++) {
            newSection[`Waypoint${i}`] = waypoints[i];
        }

        return await this.normalizeSection(newSection);
    }

    private async normalizeSection(newSection: any): Promise<any> {
        console.log('Normalizing new map section');
        // map files declare this as 'GameMode'. MPMaps.ini declares this as 'GameModes'.
        newSection['GameModes'] = newSection['GameMode'].replace('Standard', 'Battle');
        newSection['MinPlayers'] = 1;   //allow 1 person to launch the game, to practice/preview the map (this is existing behavior from previous script)
        newSection['MaxPlayers'] = newSection['MaxPlayer'];
        newSection['EnforceMaxPlayers'] = 'True';
        newSection['Description'] = newSection['Name'];
        delete newSection['Name'];

        // only pull properties that we've whitelisted
        for (let key of Object.keys(newSection)) {
            if (!constants.newMapSectionWhitelist.find(item => new RegExp(`^${item}$`).test(key)))
                delete newSection[key];
        }

        await this.normalizeGameModes(newSection);

        // sort properties alphabetically;
        return Object.keys(newSection).sort((a, b) => {
            return a > b ? 1 : -1;
        }).reduce((obj, key) => {
            obj[key] = newSection[key];
            return obj;
        }, {});
    }

    private async normalizeGameModes(section: any): Promise<void> {
        const gameModes = section['GameModes'].split(',') || [];
        for (let i = 0; i < gameModes.length; i++) {
            gameModes[i] = await this.normalizeGameMode(gameModes[i]);
        }
        section['GameModes'] = gameModes.join(',');
    }

    private async normalizeGameMode(gameMode: string): Promise<string> {
        return gameMode.split(/\s+/).map(a => `${a.slice(0, 1).toUpperCase()}${a.slice(1)}`).join(' ');
    }

    private async addNewMapIniFiles(mpMapsIniFile: IniFile, mapIniFiles: IniFile[]): Promise<IniFile[]> {
        console.log('Checking for added maps');
        const mpMapKeys = mpMapsIniFile.getMultiMapsValues();
        // find all map files that so not have an entry in MPMaps.ini [MultiMaps] OR do not have a section of their own in MPMaps.ini
        const addedMapIniFiles = mapIniFiles.filter(m => mpMapKeys.indexOf(m.getMpMapsKey()) === -1 || !mpMapsIniFile.getSection(m.getMpMapsKey()));

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
     * If .map files are removed from the repo, we must also remove them from the MPMaps.ini file.
     * @param {IniFile} mpMapsIniFile the file to remove maps from
     * @param {IniFile[]} mapIniFiles the list of maps found on the system
     * @return {string[]} missing map keys
     */
    private async removeMissingMaps(mpMapsIniFile: IniFile, mapIniFiles: IniFile[]): Promise<string[]> {
        console.log('Checking for removed maps');
        const mapKeys = mapIniFiles.map(m => m.getMpMapsKey());
        const mpMapKeys = mpMapsIniFile.getMultiMapsValues();
        const missingMapKeys = mpMapKeys.filter(mapKey => mapKeys.indexOf(mapKey) === -1);

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
    private async removeMissingMapKeys(mpMapsIniFile: IniFile, currentMapKeys: string[], missingMapKeys: string[]): Promise<void> {
        for (let missingMapKey of missingMapKeys) {
            currentMapKeys.splice(currentMapKeys.indexOf(missingMapKey), 1);
            console.log(`Clearing map key from MPMaps.ini: '${missingMapKey}'`);
            mpMapsIniFile.deleteMapSection(missingMapKey);
        }
    }

    /**
     * This adds entries to the updateexec file in the [Delete] section for all removed maps
     * @param {string[]} missingMapKeys
     */
    private async addRemovedMapsToUpdateExec(missingMapKeys: string[]): Promise<void> {
        const updateExecIniFile = await this.getUpdateExecIniFile();
        const deleteFiles = updateExecIniFile[constants.updateExecSections.deleteFile] as string[];
        const keysToAdd = missingMapKeys.map(key => [
            `${key}.map`,
            `${key}.png`
        ]).flat();

        for (let mapKey of keysToAdd) {
            deleteFiles.push(mapKey);
        }

        updateExecIniFile[constants.updateExecSections.deleteFile] = deleteFiles;

        await this.writeUpdateExecIniFile(updateExecIniFile);
    }

    /**
     * Get the content of the existing updateexec file as an IIniObject
     */
    private async getUpdateExecIniFile(): Promise<IIniObject> {
        const updateExecContent = await util.promisify(readFile)(constants.paths.updateExec, {
            encoding: 'utf-8'
        });
        return parseIni(updateExecContent, {
            autoTyping: false,
            dataSections: [
                constants.updateExecSections.deleteFile,
                constants.updateExecSections.deleteFolder
            ]
        });
    }

    /**
     * Write out data to the updateexec file
     * @param {IIniObject} data
     */
    private async writeUpdateExecIniFile(data: IIniObject): Promise<void> {
        const updateExecContent = stringify(data, {}).trim();
        writeFileSync(constants.paths.updateExec, updateExecContent, 'utf8');
    }

    /**
     * There are some files or directories required for this tool.
     * Make sure they exist.
     * @private
     */
    private async checkForRequiredFilesAsync(): Promise<void> {
        console.log('Checking for required files');
        for (const path of [
            constants.paths.maps,
            constants.paths.mpMapsIni
        ]) {
            await this.checkForRequiredFileAsync(path);
        }
    }

    /**
     * Validate that the specified file or directory
     * @param fileOrDirPath The file or directory to check
     * @private
     */
    private async checkForRequiredFileAsync(fileOrDirPath: string): Promise<void> {
        access(fileOrDirPath, fsConstants.F_OK, err => {
            if (err) {
                console.error(`Unable to access file ${fileOrDirPath}`);
                throw err;
            }
        });
    }
}
