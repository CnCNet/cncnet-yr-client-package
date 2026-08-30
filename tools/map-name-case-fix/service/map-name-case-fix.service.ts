import { parseArgs } from 'util';
import * as fs from 'fs';
import * as path from 'path';

import { MpMapsFileService } from 'mpmaps-updater/class/mp-maps-file.service';
interface IMapKeyPairing {
    mapKey: string;
    imageName: string;
}

export class MapNameCaseFixService {
    private mpMapsFileService: MpMapsFileService;
    private mapDirectoryFiles: string[] = [];
    private mapDirectoryFilesLower: string[] = [];
    private yrMapsPath: string;

    public constructor(private workingDir: string) {
        this.workingDir = path.resolve(workingDir);
        this.yrMapsPath = path.join(this.workingDir, 'Maps', `Yuri's Revenge`);
        this.mpMapsFileService = new MpMapsFileService(this.workingDir);
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
            console.error('Example: npm run map-name-case-fix -- --workingDir /path/to/package');
            process.exit(1);
        }

        new MapNameCaseFixService(values.workingDir).run();
    }

    private async run(): Promise<void> {
        // scan MPMaps.ini file for eligible maps
        // compare keys found in MPMaps.ini to filenames for *.map and *.png files
        await this.loadMapDirectoryFilesAsync();
        const invalidMapPairings: IMapKeyPairing[] = (await this.mpMapsFileService.getMapKeysAsync())
            .map((mapKey) => this.getInvalidMapPairing(mapKey))
            .filter((pairing) => !!pairing);

        invalidMapPairings.forEach((pairing) => this.fixInvalidMapKey(pairing));
        console.log(`processed ${invalidMapPairings.length} invalid map(s)`);
    }

    private fixInvalidMapKey(mapKeyPairing: IMapKeyPairing): void {
        const mapFilePreviewImg = this.getMapKeyImagePath(mapKeyPairing.mapKey);

        const oldName = mapKeyPairing.imageName;
        const newName = mapFilePreviewImg;

        // console.log('fix', oldName, newName);

        fs.renameSync(oldName, newName);
    }

    private async loadMapDirectoryFilesAsync(): Promise<void> {
        this.mapDirectoryFiles = await this.readDirAsync(this.yrMapsPath);
        this.mapDirectoryFilesLower = this.mapDirectoryFiles.map((f) => f.toLowerCase());
    }

    private async readDirAsync(filePath: string): Promise<Array<string>> {
        const files: Array<string> = [];
        fs.readdirSync(filePath, { withFileTypes: true }).map(async (f) => {
            if (f.isFile()) {
                files.push(path.join(filePath, f.name));
                return;
            }

            files.push(...(await this.readDirAsync(path.join(filePath, f.name))));
        });

        return files;
    }

    private getInvalidMapPairing(mapKey: string): IMapKeyPairing | null {
        const mapFilePreviewImg = this.getMapKeyImagePath(mapKey);
        const fileLowerIndex = this.mapDirectoryFilesLower.indexOf(mapFilePreviewImg.toLowerCase());

        if (
            this.mapDirectoryFiles.indexOf(mapFilePreviewImg) === -1 &&
            this.mapDirectoryFilesLower.indexOf(mapFilePreviewImg.toLowerCase()) !== -1
        ) {
            return {
                mapKey,
                imageName: this.mapDirectoryFiles[fileLowerIndex],
            };
        }

        return null;
    }

    private getMapKeyImagePath(mapKey: string): string {
        const mapFileBase = path.join(this.yrMapsPath, mapKey.substring(mapKey.lastIndexOf('\\') + 1));
        return `${mapFileBase}.png`;
    }
}
