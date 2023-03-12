import { spawn } from 'child_process'
import { constants } from '../constants';
import * as Twig from 'twig';
import { access, readFile, writeFile } from 'fs';
import { TemplateModel } from '../class';
import { parse as parseIni } from 'js-ini';
import * as util from 'util';
import { resolve } from 'path';

export class BuildInstallerService {
    public static run(): void {
        new BuildInstallerService().run();
    }

    private async run(): Promise<void> {
        await this.buildInstallerScript();
        await this.buildInstaller();
    }

    private async buildInstallerScript(): Promise<void> {
        console.log('Building installer script');
        const templateModel = await this.getTemplateModel();
        console.log('Template model:');
        console.log(templateModel);
        return new Promise((resolve, reject) => {
            Twig.renderFile(constants.paths.installerTemplate, templateModel, (err, content) => {
                if (err)
                    throw err;

                writeFile(constants.paths.installerScript, content, err => {
                    if (err)
                        throw err;

                    console.log(`Installer script written to '${constants.paths.installerScript}'`);

                    resolve();
                });
            })
        });
    }

    private async getTemplateModel(): Promise<TemplateModel> {
        const appVersion = await this.getAppVersion();
        return {
            app: {
                name: constants.app.name,
                version: appVersion,
                versionName: `${constants.app.name} ${appVersion}`,
                publisher: constants.app.publisher,
                publisherUrl: constants.app.publisherUrl,
                supportUrl: constants.app.supportUrl,
                updatesUrl: constants.app.updatesUrl,
            },
            sourceDir: constants.paths.packagePath,
            outputDir: constants.paths.repoPath,
            setupIconFile: constants.paths.setupIconPath,
            licenseFile: constants.paths.licenseFilePath,
            outputBaseFilename: constants.outputBaseFilename,
            installDeleteFiles: await this.getInstallDeleteFiles(),
            excludedInstallerFiles: constants.excludedInstallerFiles.join(','),
            netCoreCheckPath: constants.paths.netCoreCheckPath
        };
    }

    private async getAppVersion(): Promise<string> {
        const versionContent = await util.promisify(readFile)(constants.paths.versionFilePath, {encoding: 'utf-8'});
        const versionIni = parseIni(versionContent, {
            autoTyping: false
        });
        return versionIni['DTA']['Version'];

    }

    private async getInstallDeleteFiles(): Promise<string[]> {
        const preUpdateExecDeleteFilesOrDirs = await this.getUpdateExecFileEntries(constants.paths.preUpdateExecFilePath);
        const updateExecDeleteFilesOrDirs = await this.getUpdateExecFileEntries(constants.paths.updateExecFilePath);

        return preUpdateExecDeleteFilesOrDirs
            .concat(updateExecDeleteFilesOrDirs)
            .sort((a, b) => {
                if (a === b)
                    return 0;
                return a > b ? 1 : -1;
            });
    }

    private async getUpdateExecFileEntries(file: string): Promise<string[]> {
        const content = await util.promisify(readFile)(file, {encoding: 'utf-8'});
        const ini = parseIni(content, {
            autoTyping: false,
            // tell the parser to read this as a list of strings without keys
            dataSections: ['Delete', 'DeleteFolder']
        });
        const deleteFiles = ini['Delete'] as string[];
        const deleteFolders = ini['DeleteFolder'] as string[];

        return deleteFiles.concat(deleteFolders)
            .filter(this.isValidDeleteEntry)
            .filter(async entry => {
                try {
                    const entryPath = resolve(constants.paths.packagePath, entry);
                    // if this succeeds, then the file or dir currently exists in /package dir
                    // it probably shouldn't exist in preupdateexec or updateexec files
                    await util.promisify(access)(entryPath);
                    console.warn(`File in '${file}' delete list, but still in repo: '${entryPath}'`)
                    return false;
                } catch (e) {
                    return true;
                }
            });
    }

    private isValidDeleteEntry(entry: string): boolean {
        return entry && entry !== 'do_not_remove_this_line';
    }

    private async buildInstaller(): Promise<void> {
        console.log(`Building installer from script '${constants.paths.installerScript}'`);
        const inno = spawn(constants.paths.installerBinary, [constants.paths.installerScript], {
            cwd: __dirname,
        });
        inno.stdout.on('data', data => {
            console.log(data.toString());
        });
        inno.stderr.on('data', data => {
            throw data.toString();
        });
    }
}
