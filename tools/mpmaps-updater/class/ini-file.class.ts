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
     * @param {string} filePath the path at which this file should be read from or written to
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
     * @param {string} mpMapKey The key to write, ex: Maps\Yuri's Revenge\hillbtwn
     * @param {IniValue} iniValue The object to write
     */
    public setMapSection(mpMapKey: string, iniValue: IniValue): void {
        this.data[mpMapKey] = iniValue;
    }

    /**
     * Deletes a map section the MPMaps.ini file. This would be done when a map has been removed from the repo.
     * @param {string} mpMapKey
     */
    public deleteMapSection(mpMapKey: string): void {
        delete this.data[mpMapKey];
    }

    /**
     * Sets the object of the entire [MultiMaps] section
     * @param {IniValue} iniValue
     */
    public setMultiMapsSection(iniValue: IniValue): void {
        this.data['MultiMaps'] = iniValue;
    }

    /**
     * Get the object at the [MultiMaps] section.
     * @return {IniValue}
     */
    public getMultiMapsSection(): IniValue {
        return this.getSection('MultiMaps');
    }

    /**
     * Gets the [Basic] section of the file. This is most commonly used for .map files.
     *
     * @return {IniValue}
     */
    public getBasicSection(): IniValue {
        return this.getSection('Basic');
    }

    /**
     * Gets the [Header] section of the file. This is most commonly used for .map files.
     *
     * @return {IniValue}
     */
    public getHeaderSection(): IniValue {
        return this.getSection('Header');
    }

    /**
     * Get any data section by name
     * @param {string} sectionName
     * @return {IniValue}
     */
    public getSection(sectionName: string): IniValue {
        return this.data[sectionName];
    }

    /**
     * Gets the [Waypoints] section of the file. This is most commonly used for .map files.
     * @return {IniValue}
     */
    public getWaypointsSection(): IniValue {
        return this.getSection('Waypoints');
    }

    /**
     * @return {string[]}
     */
    public getWaypointsSectionValues(): string[] {
        return Object.values(this.getWaypointsSection());
    }

    /**
     * Gets the [Map] section of the file. This is most commonly used for .map files.
     * @return {IniValue}
     */
    public getMapSection(): IniValue {
        return this.getSection('Map');
    }

    /**
     * Gets the values of each key in the [MultiMaps] section
     * @return {string[]}
     */
    public getMultiMapsValues(): string[] {
        return Object.values(this.getMultiMapsSection());
    }

    /**
     * Can be used to generate the key used for a given map.
     * Example: Maps\Yuri's Revenge\hillbtwn
     * @return {string}
     */
    public getMpMapsKey(): string {
        return this.filePath.slice(constants.paths.package.length + 1, -this.fileExt.length);
    }

    /**
     * @return {string}
     */
    public getPackageRelativePath(): string {
        return this.filePath.slice(constants.paths.package.length + 1);
    }
}
