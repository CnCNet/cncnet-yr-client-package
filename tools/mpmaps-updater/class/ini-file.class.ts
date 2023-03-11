import { parse } from 'path';
import { IIniObject, IniValue, parse as parseIni, stringify as stringifyIni } from 'js-ini';
import { constants } from '../constants';
import * as util from 'util';
import { readFile, writeFile } from 'fs';

export class IniFile {
    protected filePath: string;
    protected fileName: string;
    protected fileExt: string;
    public data: IIniObject;

    private constructor(filePath: string, data: IIniObject) {
        const parsed = parse(filePath);
        this.filePath = filePath;
        this.fileName = parsed.name;
        this.fileExt = parsed.ext;
        this.data = data;
    }

    /**
     * Convert this file into a string that can be written to a file.
     */
    public async stringify(): Promise<string> {
        return stringifyIni(this.data, {
            skipUndefined: true // don't write keys that have no values
        });
    }

    /**
     * Write this file to disk.
     */
    public async writeAsync(): Promise<void> {
        await util.promisify(writeFile)(this.filePath, (await this.stringify()).trim());
    }

    /**
     * Create an instance of this file.
     * @param filePath the path at which this file should be read from or written to
     */
    public static async createAsync(filePath: string): Promise<IniFile> {
        const content = await util.promisify(readFile)(filePath, {
            encoding: 'utf-8'
        });
        const iniObject = parseIni(content, {
            autoTyping: false
        });
        return new IniFile(filePath, iniObject);
    }

    /**
     * Adds/sets the map section to the file, by header
     * Example: [Maps\Yuri's Revenge\hillbtwn]
     * @param mpMapKey The key to write, ex: Maps\Yuri's Revenge\hillbtwn
     * @param iniValue The object to write
     */
    public setMapSection(mpMapKey: string, iniValue: IniValue): void {
        this.data[mpMapKey] = iniValue;
    }

    /**
     * Deletes a map section the MPMaps.ini file. This would be done when a map has been removed from the repo.
     * @param mpMapKey
     */
    public deleteMapSection(mpMapKey: string): void {
        delete this.data[mpMapKey];
    }

    /**
     * Sets the object of the entire [MultiMaps] section
     * @param iniValue
     */
    public setMultiMapsSection(iniValue: IniValue): void {
        this.data['MultiMaps'] = iniValue;
    }

    /**
     * Get the object at the [MultiMaps] section.
     */
    public getMultiMapsSection(): IniValue {
        return this.data['MultiMaps'];
    }

    /**
     * Gets the [Basic] section of the file. This is most commonly used for .map files.
     */
    public getBasicSection(): IniValue {
        return this.data['Basic'];
    }

    /**
     * Gets the [Waypoints] section of the file. This is most commonly used for .map files.
     */
    public getWaypointsSection(): IniValue {
        return this.data['Waypoints'];
    }

    public getWaypointsSectionValues(): string[] {
        return Object.values(this.getWaypointsSection());
    }

    /**
     * Gets the [Map] section of the file. This is most commonly used for .map files.
     */
    public getMapSection(): IniValue {
        return this.data['Map'];
    }

    /**
     * Gets the values of each key in the [MultiMaps] section
     */
    public getMultiMapsValues(): string[] {
        return Object.values(this.getMultiMapsSection());
    }

    /**
     * Can be used to generate the key used for a given map.
     * Example: Maps\Yuri's Revenge\hillbtwn
     */
    public get mpMapsKey(): string {
        return this.filePath.slice(constants.paths.package.length + 1, -this.fileExt.length);
    }

    public getPackageRelativePath(): string {
        return this.filePath.slice(constants.paths.package.length + 1);
    }

}
