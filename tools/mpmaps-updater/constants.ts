import { resolve } from 'path';

export function createConstants(workingDir: string) {
    const packagePath = resolve(workingDir);
    const mapsPath = resolve(packagePath, 'Maps');
    const yrMapsPath = resolve(mapsPath, `Yuri's Revenge`);
    const iniPath = resolve(packagePath, 'INI');
    const mpMapsIniPath = resolve(iniPath, 'MPMaps.ini');
    const updateExecPath = resolve(packagePath, 'updateexec');

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

export type MpMapsUpdaterConstants = ReturnType<typeof createConstants>;
