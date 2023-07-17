import { MpMapsFileService } from '@cncnet-core/class/mp-maps-file.service';
import * as path from 'path';
import { coreConstants } from '@cncnet-core/constants';
import { readdirSync } from 'fs';
import * as fs from 'fs';

interface MapKeyPairing {
    mapKey: string,
    imageName: string;
}

export class MapNameCaseFixService {

    private mpMapsFileService: MpMapsFileService;
    private mapDirectoryFiles: string[];
    private mapDirectoryFilesLower: string[];

    public constructor() {
        this.mpMapsFileService = new MpMapsFileService();
    }

    public static run(): void {
        new MapNameCaseFixService().run();
    }

    private async run(): Promise<void> {
        // scan MPMaps.ini file for eligible maps
        // compare keys found in MPMaps.ini to filenames for *.map and *.png files
        await this.loadMapDirectoryFilesAsync();
        const invalidMapPairings: MapKeyPairing[] = (await this.mpMapsFileService.getMapKeysAsync())
            .map(mapKey => this.getInvalidMapPairing(mapKey))
            .filter(pairing => !!pairing);

        invalidMapPairings.forEach(pairing => this.fixInvalidMapKey(pairing));
        console.log(`processed ${invalidMapPairings.length} invalid map(s)`);
    }

    private fixInvalidMapKey(mapKeyPairing: MapKeyPairing): void {
        const mapFilePreviewImg = this.getMapKeyImagePath(mapKeyPairing.mapKey);

        const oldName = mapKeyPairing.imageName;
        const newName = mapFilePreviewImg;

        // console.log('fix', oldName, newName);

        fs.renameSync(oldName, newName)
    }

    private async loadMapDirectoryFilesAsync(): Promise<void> {
        this.mapDirectoryFiles = await this.readDirAsync(coreConstants.paths.yrMaps);
        this.mapDirectoryFilesLower = this.mapDirectoryFiles.map(f => f.toLowerCase());
    }

    private async readDirAsync(filePath: string): Promise<string[]> {
        const files = [];
        readdirSync(filePath, {withFileTypes: true}).map(async (f) => {
            if (f.isFile()) {
                files.push(path.join(filePath, f.name));
                return;
            }

            files.push(...(await this.readDirAsync(path.join(filePath, f.name))));
        })

        return files;
    }

    private getInvalidMapPairing(mapKey: string): MapKeyPairing {
        const mapFilePreviewImg = this.getMapKeyImagePath(mapKey);
        const fileLowerIndex = this.mapDirectoryFilesLower.indexOf(mapFilePreviewImg.toLowerCase());

        if (this.mapDirectoryFiles.indexOf(mapFilePreviewImg) === -1 && this.mapDirectoryFilesLower.indexOf(mapFilePreviewImg.toLowerCase()) !== -1) {
            return {
                mapKey,
                imageName: this.mapDirectoryFiles[fileLowerIndex]
            };
        }

        return null;
    }

    private getMapKeyImagePath(mapKey: string): string {
        const mapFileBase = path.join(coreConstants.paths.yrMaps, mapKey.substring(mapKey.lastIndexOf('\\') + 1));
        return `${mapFileBase}.png`;
    }
}
