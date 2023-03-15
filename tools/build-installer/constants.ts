import { resolve } from 'path';

const repoPath = resolve(__dirname, '../../');
const packagePath = resolve(repoPath, 'package');
const versionFilePath = resolve(packagePath, 'version');
const innoPath = resolve(__dirname, 'inno');
const innoResourcesPath = resolve(innoPath, 'Resources');
const setupIconPath = resolve(innoResourcesPath, 'cncnet5.ico');
const licenseFilePath = resolve(innoResourcesPath, 'License-YurisRevenge.txt');
const installerBinary = resolve(innoPath, 'bin/ISCC.exe');
const installerTemplate = resolve(innoPath, 'installer.twig');
const installerScript = resolve(innoPath, 'installer.iss');
const preUpdateExecFilename = 'preupdateexec';
const updateExecFilename = 'updateexec';
const preUpdateExecFilePath = resolve(packagePath, preUpdateExecFilename);
const updateExecFilePath = resolve(packagePath, updateExecFilename);
const netCoreCheckPath = resolve(innoPath, 'libs/InnoDependencyInstaller/netcorecheck');

const constants = {
    app: {
        name: 'CnCNet Yuri\'s Revenge',
        publisher: 'cncnet.org',
        publisherUrl: 'https://cncnet.org',
        supportUrl: 'https://cncnet.org',
        updatesUrl: 'https://cncnet.org'
    },
    outputBaseFilename: 'CnCNet5_YR_Installer',
    paths: {
        installerBinary,
        installerTemplate,
        installerScript,
        repoPath,
        packagePath,
        setupIconPath,
        licenseFilePath,
        versionFilePath,
        preUpdateExecFilePath,
        updateExecFilePath,
        netCoreCheckPath
    },
    excludedInstallerFiles: [
        preUpdateExecFilename,
        updateExecFilename,
        'versionconfig.ini',
        'RA2MD.ini'
    ]
}
export { constants };
