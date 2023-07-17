import { resolve } from 'path';
import { coreConstants } from '@cncnet-core/constants';

const updateExecPath = resolve(coreConstants.paths.package, 'updateexec');

const constants = {
    regex: {
        // some maps have bad Briefing values in this format
        badBriefing: /^Brief:(ALL|TRN)\d{2}(md)?$/,
        enemyHouse: /^(\d+,\d+,\d+)\s*;?.*$'/,
        // this is the "ideal" map name: "[4] Awesome Map"
        mapName: /^\[\d\] \S.+$/
    },
    paths: {
        ...coreConstants.paths,
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
