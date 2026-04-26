import * as path from 'path';

export function createConstants(workingDir: string) {
    const packagePath = path.resolve(workingDir);
    const mapsPath = path.resolve(packagePath, 'Maps');
    const yrMapsPath = path.resolve(mapsPath, `Yuri's Revenge`);
    const iniPath = path.resolve(packagePath, 'INI');
    const mpMapsIniPath = path.resolve(iniPath, 'MPMaps.ini');
    const updateExecPath = path.resolve(packagePath, 'updateexec');

    return {
        regex: {
            // some maps have bad Briefing values in this format
            badBriefing: /^Brief:(ALL|TRN)\d{2}(md)?$/,
            enemyHouse: /^(\d+,\d+,\d+)\s*;?.*$'/,
            // this is the "ideal" map name: "[4] Awesome Map"
            mapName: /^\[\d\] \S.+$/,
        },
        paths: {
            package: packagePath,
            maps: mapsPath,
            yrMaps: yrMapsPath,
            ini: iniPath,
            mpMapsIni: mpMapsIniPath,
            updateExec: updateExecPath,
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
            'TeamStartMapping.*',
        ],
        maxWaypoints: 8,
        updateExecSections: {
            deleteFile: 'Delete',
            deleteFolder: 'DeleteFolder',
        },
    };
}
