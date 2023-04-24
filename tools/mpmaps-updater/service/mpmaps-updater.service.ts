import { access, constants as fsConstants } from 'fs';
import { constants } from '../constants';
import { MapLoaderService } from './map-loader.service';
import { IniFile } from '../class';

export class MpMapsUpdaterService {
    public static run(): void {
        new MpMapsUpdaterService().run()
            .catch(console.error);
    }

    /**
     * @private
     */
    private async run(): Promise<void> {
        console.log('MPMaps.ini updater');
        await this.checkForRequiredFilesAsync();

        const mpMapsIniFile: IniFile = await this.getMpMapsIniFile();
        const mapIniFiles: IniFile[] = await new MapLoaderService().getMapIniFilesAsync();
        await this.mergeMapsKeys(mpMapsIniFile, mapIniFiles);

        await mpMapsIniFile.writeAsync();
    }

    private async getMpMapsIniFile(): Promise<IniFile> {
        console.log('Reading MPMaps.ini file');
        return await IniFile.createAsync(constants.paths.mpMapsIni);
    }

    /**
     * This merges the map data from .map files and the MPMaps.ini file.
     * @param mpMapsIniFile the MPMaps.ini file to merge
     * @param mapIniFiles the list of maps found on the system
     * @private
     */
    private async mergeMapsKeys(mpMapsIniFile: IniFile, mapIniFiles: IniFile[]): Promise<void> {
        console.log('Merging MPMaps.ini file with .map files');
        await this.addNewMapIniFiles(mpMapsIniFile, mapIniFiles);
        await this.removeMissingMaps(mpMapsIniFile, mapIniFiles);
    }

    private async getNewMapSection(mapIniFile: IniFile): Promise<any> {
        const newSection = Object.assign({}, mapIniFile.getMapSection() || {}, mapIniFile.getBasicSection() || {}, mapIniFile);
        const waypoints = mapIniFile.getWaypointsSectionValues();
        for (let i = 0; i < waypoints.length; i++) {
            newSection[`Waypoint${i}`] = waypoints[i];
        }

        return await this.normalizeSection(newSection);
    }

    private async normalizeSection(newSection: any): Promise<any> {
        console.log('Normalizing new map section');
        // map files declare this as 'GameMode'. MPMaps.ini declares this as 'GameModes'.
        newSection['GameModes'] = newSection['GameMode'];
        newSection['MinPlayers'] = newSection['MinPlayer'];
        newSection['MaxPlayers'] = newSection['MaxPlayer'];
        newSection['EnforceMaxPlayers'] = newSection['true'];

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

    private async addNewMapIniFiles(mpMapsIniFile: IniFile, mapIniFiles: IniFile[]): Promise<void> {
        console.log('Checking for added maps');
        const mapKeys = mapIniFiles.map(m => m.mpMapsKey);
        const mpMapKeys = mpMapsIniFile.getMultiMapsValues();
        const addedMapKeys = mapKeys.filter(mapKey => mpMapKeys.indexOf(mapKey) === -1);
        const addedMapIniFiles = mapIniFiles.filter(m => addedMapKeys.indexOf(m.mpMapsKey) !== -1);
        const combinedMapKeys = mpMapKeys.concat(addedMapKeys);

        if (!addedMapIniFiles.length) {
            console.log('No maps added');
            return;
        }

        console.log(`${addedMapIniFiles.length} new map(s) found`);
        for (let addedMapIniFile of addedMapIniFiles) {
            await this.addNewMapIniFile(mpMapsIniFile, addedMapIniFile);
        }

        const multiMapsSection = {};
        for (let i = 0; i < combinedMapKeys.length; i++) {
            multiMapsSection[i] = combinedMapKeys[i];
        }

        console.log('Updating [MultiMap] section');
        mpMapsIniFile.setMultiMapsSection(multiMapsSection);
    }

    private async addNewMapIniFile(mpMapsIniFile: IniFile, mapIniFile: IniFile): Promise<void> {
        console.log(`Adding new map '${mapIniFile.getPackageRelativePath()}'`);
        const newMapSection = await this.getNewMapSection(mapIniFile);

        const mpMapsKey = mapIniFile.mpMapsKey;
        console.log(`Adding map key to MPMaps.ini: '${mpMapsKey}'`);
        mpMapsIniFile.setMapSection(mpMapsKey, newMapSection);
    }

    /**
     * If .map files are removed from the repo, we must also remove them from the MPMaps.ini file.
     * @param mpMapsIniFile the file to remove maps from
     * @param mapIniFiles the list of maps found on the system
     * @private
     */
    private async removeMissingMaps(mpMapsIniFile: IniFile, mapIniFiles: IniFile[]): Promise<void> {
        console.log('Checking for removed maps');
        const mapKeys = mapIniFiles.map(m => m.mpMapsKey);
        const mpMapKeys = mpMapsIniFile.getMultiMapsValues();
        const missingMapKeys = mpMapKeys.filter(mapKey => mapKeys.indexOf(mapKey) === -1);

        if (!missingMapKeys.length) {
            console.log('No maps removed');
            return;
        }

        console.log(`${missingMapKeys.length} map(s) being removed`);
        await this.removeMissingMapKeys(mpMapsIniFile, mpMapKeys, missingMapKeys);
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

        const multiMapsSection = {};
        for (let i = 0; i < currentMapKeys.length; i++) {
            multiMapsSection[i] = currentMapKeys[i];
        }

        console.log('Updating [MultiMap] section');
        mpMapsIniFile.setMultiMapsSection(multiMapsSection);
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
