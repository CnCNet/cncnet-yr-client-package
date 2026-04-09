import * as path from 'path';

import { IniFile } from './ini-file.class';

export class MpMapsFileService {
    public constructor(
        private packagePath: string,
        private mpMapsIniPath: string = path.join(packagePath, 'INI', 'MPMaps.ini'),
    ) {}

    public async getMpMapsIniFileAsync(): Promise<IniFile> {
        console.log(`Reading MPMaps.ini file from ${this.mpMapsIniPath}`);
        return await IniFile.createAsync(this.mpMapsIniPath, this.packagePath);
    }

    public async getMapKeysAsync(mpMapsIniFile?: IniFile): Promise<string[]> {
        mpMapsIniFile = mpMapsIniFile || (await this.getMpMapsIniFileAsync());
        return mpMapsIniFile.getMultiMapsValues();
    }
}
