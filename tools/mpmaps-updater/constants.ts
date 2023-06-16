import { resolve } from 'path';

const rootPath = resolve(__dirname, '../../');
const toolsPath = resolve(rootPath, 'tools');
const packagePath = resolve(rootPath, 'package');
const mapsPath = resolve(packagePath, 'Maps');
const iniPath = resolve(packagePath, 'INI');
const mpMapsIniPath = resolve(iniPath, 'MPMaps.ini');
const updateExecPath = resolve(packagePath, 'updateexec');

const constants = {
    regex: {
        // some maps have bad Briefing values in this format
        badBriefing: /^Brief:(ALL|TRN)\d{2}(md)?$/,
        enemyHouse: /^(\d+,\d+,\d+)\s*;?.*$'/,
        // this is the "ideal" map name: "[4] Awesome Map"
        mapName: /^\[\d\] \S.+$/
    },
    paths: {
        // the root of the repo
        root: rootPath,
        // the /tools directory
        tools: toolsPath,
        // the /package directory
        package: packagePath,
        // the /Maps directory
        maps: mapsPath,
        // the path to the /INI/MPMaps.ini file
        mpMapsIni: mpMapsIniPath,
        updateExec: updateExecPath
    },
    newMapSectionWhitelist: [
        'Name',
        'Description',
        'Author',
        'GameModes',
        'MinPlayers',
        'MaxPlayers',
        'EnforceMaxPlayers',
        'Briefing',
        'ForceRandomStartLocations',
        'Size',
        'LocalSize',
        'Waypoint.*',
        'TeamStartMapping.*'
    ],
    maxWaypoints: 8,
    updateExecSections: {
        deleteFile: 'Delete',
        deleteFolder: 'DeleteFolder'
    }
};

export { constants };
