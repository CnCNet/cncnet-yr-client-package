import * as path from 'path';
import * as url from 'url';

export function createConstants(workingDir: string) {
    const currentDir = path.dirname(url.fileURLToPath(import.meta.url));
    const packagePath = path.resolve(workingDir);
    const repoPath = path.resolve(packagePath, '..');
    const versionFilePath = path.resolve(packagePath, 'version');
    const innoPath = path.resolve(currentDir, 'inno');
    const innoResourcesPath = path.resolve(innoPath, 'Resources');
    const innoBinPath = path.resolve(innoPath, 'bin');
    const dependencyInstallerPath = path.resolve(innoPath, 'libs/InnoDependencyInstaller/CodeDependencies.iss');
    const setupIconPath = path.resolve(innoResourcesPath, 'cncnet5.ico');
    const licenseFilePath = path.resolve(innoResourcesPath, 'License-YurisRevenge.txt');
    const installerBinary = path.resolve(innoBinPath, 'ISCC.exe');
    const installerTemplate = path.resolve(innoPath, 'installer.twig');
    const installerScript = path.resolve(innoPath, 'installer.iss');
    const winePrefixPath = path.resolve(currentDir, '.wine');
    const preUpdateExecFilename = 'preupdateexec';
    const updateExecFilename = 'updateexec';
    const preUpdateExecFilePath = path.resolve(packagePath, preUpdateExecFilename);
    const updateExecFilePath = path.resolve(packagePath, updateExecFilename);

    return {
        app: {
            name: "CnCNet Yuri's Revenge",
            publisher: 'cncnet.org',
            publisherUrl: 'https://cncnet.org',
            supportUrl: 'https://cncnet.org',
            updatesUrl: 'https://cncnet.org',
        },
        commands: {
            wine: 'wine',
        },
        outputBaseFilename: 'CnCNet5_YR_Installer',
        paths: {
            innoBinPath,
            dependencyInstallerPath,
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
            winePrefixPath,
        },
        excludedInstallerFiles: [preUpdateExecFilename, updateExecFilename, 'versionconfig.ini', 'RA2MD.ini'],
    };
}
