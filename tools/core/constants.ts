import * as path from 'path';
import * as url from 'url';

const currentDir = path.dirname(url.fileURLToPath(import.meta.url));
const rootPath = path.resolve(currentDir, '../../');
const toolsPath = path.resolve(rootPath, 'tools');
const packagePath = path.resolve(rootPath, 'package');
const mapsPath = path.resolve(packagePath, 'Maps');
const yrMapsPath = path.resolve(mapsPath, `Yuri's Revenge`);
const iniPath = path.resolve(packagePath, 'INI');
const mpMapsIniPath = path.resolve(iniPath, 'MPMaps.ini');

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
        mpMapsIni: mpMapsIniPath,
    },
};
