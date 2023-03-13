import { readdir, stat } from 'fs';
import { constants } from '../constants';
import * as util from 'util'
import { IniFile } from '../class';

export class MapLoaderService {

    public async getMapIniFilesAsync(): Promise<IniFile[]> {
        console.log('Reading all .map files');
        return await this.getMapFilesFromDirAsync(constants.paths.maps);
    }

    private async getMapFilesFromDirAsync(dir: string): Promise<IniFile[]> {
        const maps: IniFile[] = [];
        const dirFiles: string[] = await util.promisify(readdir)(dir, {
            encoding: 'utf-8'
        });

        for (const fileOrDir of dirFiles) {
            const fileOrDirPath = `${dir}\\${fileOrDir}`;
            const stats = await util.promisify(stat)(fileOrDirPath);
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
            const mapIniFile = await IniFile.createAsync(filePath);
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
