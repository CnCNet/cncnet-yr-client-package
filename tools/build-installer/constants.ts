import { resolve } from 'path';

export function createConstants(workingDir: string) {
    const packagePath = resolve(workingDir);
    const repoPath = resolve(packagePath, '..');
    const versionFilePath = resolve(packagePath, 'version');
    const innoPath = resolve(__dirname, 'inno');
    const innoResourcesPath = resolve(innoPath, 'Resources');
    const innoBinPath = resolve(innoPath, 'bin');
    const dependencyInstallerPath = resolve(innoPath, 'libs/InnoDependencyInstaller/CodeDependencies.iss');
    const setupIconPath = resolve(innoResourcesPath, 'cncnet5.ico');
    const licenseFilePath = resolve(innoResourcesPath, 'License-YurisRevenge.txt');
    const installerBinary = resolve(innoBinPath, 'ISCC.exe');
    const installerTemplate = resolve(innoPath, 'installer.twig');
    const installerScript = resolve(innoPath, 'installer.iss');
    const winePrefixPath = resolve(__dirname, '.wine');
    const preUpdateExecFilename = 'preupdateexec';
    const updateExecFilename = 'updateexec';
    const preUpdateExecFilePath = resolve(packagePath, preUpdateExecFilename);
    const updateExecFilePath = resolve(packagePath, updateExecFilename);

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

export type BuildInstallerConstants = ReturnType<typeof createConstants>;
