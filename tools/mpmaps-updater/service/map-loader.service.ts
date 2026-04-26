import * as fsPromises from 'fs/promises';
import * as path from 'path';

import { IniFile } from 'mpmaps-updater/class/ini-file.class';

export class MapLoaderService {
    public constructor(
        private packagePath: string,
        private mapsPath: string,
    ) {}

    public async getMapIniFilesAsync(): Promise<IniFile[]> {
        console.log('Reading all .map files');
        return await this.getMapFilesFromDirAsync(this.mapsPath);
    }

    private async getMapFilesFromDirAsync(dir: string): Promise<IniFile[]> {
        const maps: IniFile[] = [];
        const dirFiles: string[] = await fsPromises.readdir(dir, {
            encoding: 'utf-8',
        });

        for (const fileOrDir of dirFiles) {
            const fileOrDirPath = path.join(dir, fileOrDir);
            const stats = await fsPromises.stat(fileOrDirPath);
            if (stats.isDirectory()) {
                maps.push(...(await this.getMapFilesFromDirAsync(fileOrDirPath)));
            } else if (this.isMapFile(fileOrDir)) {
                await this.addMapFileAsync(maps, fileOrDirPath);
            }
        }

        return maps;
    }

    private async addMapFileAsync(mapIniFiles: IniFile[], filePath: string): Promise<void> {
        try {
            const mapIniFile = await IniFile.createAsync(filePath, this.packagePath);
            await this.cleanUpMapIniFileAsync(mapIniFile);
            mapIniFiles.push(mapIniFile);
        } catch (e) {
            console.error(`Unable to parse map: ${filePath}`);
            console.error(e);
        }
    }

    private async cleanUpMapIniFileAsync(mapIniFile: IniFile): Promise<void> {
        // no-op, for now
    }

    private isMapFile(file: string): boolean {
        return file.toLowerCase().endsWith('.map');
    }
}
