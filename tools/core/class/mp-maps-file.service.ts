import { IniFile } from '../../mpmaps-updater/class';
import { coreConstants } from '../constants';

export class MpMapsFileService {
    public async getMpMapsIniFileAsync(): Promise<IniFile> {
        console.log(`Reading MPMaps.ini file from ${coreConstants.paths.mpMapsIni}`);
        return await IniFile.createAsync(coreConstants.paths.mpMapsIni);
    }

    public async getMapKeysAsync(mpMapsIniFile?: IniFile): Promise<string[]> {
        mpMapsIniFile = mpMapsIniFile || await this.getMpMapsIniFileAsync();
        return mpMapsIniFile.getMultiMapsValues();
    }
}
