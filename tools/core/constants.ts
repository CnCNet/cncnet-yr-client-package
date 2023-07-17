import { resolve } from 'path';

const rootPath = resolve(__dirname, '../../');
const toolsPath = resolve(rootPath, 'tools');
const packagePath = resolve(rootPath, 'package');
const mapsPath = resolve(packagePath, 'Maps');
const yrMapsPath = resolve(mapsPath, `Yuri's Revenge`);
const iniPath = resolve(packagePath, 'INI');
const mpMapsIniPath = resolve(iniPath, 'MPMaps.ini');
export const coreConstants = {
    paths: {
        // the root of the repo
        root: rootPath,
        // the /tools directory
        tools: toolsPath,
        // the /package directory
        package: packagePath,
        // the /package/Maps directory
        maps: mapsPath,
        yrMaps: yrMapsPath,
        // the /package/INI directory
        ini: iniPath,
        // the path to the /package/INI/MPMaps.ini file
        mpMapsIni: mpMapsIniPath
    }
}
