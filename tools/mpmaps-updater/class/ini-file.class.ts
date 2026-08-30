import * as fsPromises from 'fs/promises';
import * as path from 'path';

import { parse as parseIni, stringify as stringifyIni } from 'js-ini';
import type { IIniObject, IIniObjectSection, IniValue } from 'js-ini';

function isIniSection(value: unknown): value is IIniObjectSection {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export class IniFile {
    protected filePath: string;
    protected fileName: string;
    protected fileExt: string;
    protected packagePath: string;
    public data: IIniObject;

    private constructor(filePath: string, data: IIniObject, packagePath: string) {
        const parsed = path.parse(filePath);
        this.filePath = filePath;
        this.fileName = parsed.name;
        this.fileExt = parsed.ext;
        this.packagePath = packagePath;
        this.data = data;
    }

    /**
     * Convert this file into a string that can be written to a file.
     */
    public async stringify(): Promise<string> {
        return stringifyIni(this.data, {
            skipUndefined: true, // don't write keys that have no values
        });
    }

    /**
     * Write this file to disk.
     */
    public async writeAsync(): Promise<void> {
        await fsPromises.writeFile(this.filePath, (await this.stringify()).trim());
    }

    /**
     * Create an instance of this file.
     * @param filePath the path at which this file should be read from or written to
     */
    public static async createAsync(filePath: string, packagePath: string): Promise<IniFile> {
        const content = await fsPromises.readFile(filePath, {
            encoding: 'utf-8',
        });
        const iniObject = parseIni(content, {
            autoTyping: false,
        });
        return new IniFile(filePath, iniObject, packagePath);
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
     */
    public deleteMapSection(mpMapKey: string): void {
        delete this.data[mpMapKey];
    }

    /**
     * Sets the object of the entire [MultiMaps] section
     * @param iniValue The object to write to the [MultiMaps] section.
     */
    public setMultiMapsSection(iniValue: IniValue): void {
        this.data['MultiMaps'] = iniValue;
    }

    /**
     * Get the object at the [MultiMaps] section.
     */
    public getMultiMapsSection(): IniValue {
        return this.getSection('MultiMaps');
    }

    /**
     * Gets the [Basic] section of the file. This is most commonly used for .map files.
     */
    public getBasicSection(): IniValue {
        return this.getSection('Basic');
    }

    /**
     * Gets the [Header] section of the file. This is most commonly used for .map files.
     */
    public getHeaderSection(): IniValue {
        return this.getSection('Header');
    }

    /**
     * Get any data section by name
     * @param sectionName the name of the section to retrieve
     */
    public getSection(sectionName: string): IniValue {
        return this.data[sectionName];
    }

    /**
     * Gets the [Waypoints] section of the file. This is most commonly used for .map files.
     */
    public getWaypointsSection(): IniValue {
        return this.getSection('Waypoints');
    }

    public getWaypointsSectionValues(): string[] {
        const section = this.getWaypointsSection();
        if (!isIniSection(section)) {
            return [];
        }

        return Object.values(section).filter((value): value is string => typeof value === 'string');
    }

    /**
     * Gets the [Map] section of the file. This is most commonly used for .map files.
     */
    public getMapSection(): IniValue {
        return this.getSection('Map');
    }

    /**
     * Gets the values of each key in the [MultiMaps] section
     */
    public getMultiMapsValues(): string[] {
        const section = this.getMultiMapsSection();
        if (!isIniSection(section)) {
            return [];
        }

        return Object.values(section).filter((value): value is string => typeof value === 'string');
    }

    /**
     * Can be used to generate the key used for a given map.
     * Example: Maps\Yuri's Revenge\hillbtwn
     */
    public getMpMapsKey(): string {
        return this.normalizeMpMapsPath(this.filePath.slice(this.packagePath.length + 1, -this.fileExt.length));
    }

    public getPackageRelativePath(): string {
        return this.filePath.slice(this.packagePath.length + 1);
    }

    private normalizeMpMapsPath(relativePath: string): string {
        return relativePath.replace(/[\\/]/g, '\\');
    }
}
