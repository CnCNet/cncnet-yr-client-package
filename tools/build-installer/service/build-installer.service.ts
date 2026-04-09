import { spawn } from 'child_process';
import { BuildInstallerConstants, createConstants } from 'build-installer/constants';
import * as Twig from 'twig';
import { access, readFile, writeFile } from 'fs';
import { mkdir } from 'fs/promises';
import { TemplateModel } from 'build-installer/class/template-model.class';
import { parse as parseIni } from 'js-ini';
import { parseArgs } from 'util';
import * as util from 'util';
import { resolve } from 'path';

interface BuildCommandOptions {
    command: string;
    args: string[];
    env?: NodeJS.ProcessEnv;
    useWindowsPaths: boolean;
}

export class BuildInstallerService {
    private constants: BuildInstallerConstants;

    public constructor(private workingDir: string) {
        this.constants = createConstants(workingDir);
    }

    public static run(): void {
        const { values } = parseArgs({
            options: {
                workingDir: {
                    type: 'string',
                    short: 'w',
                },
            },
        });

        if (!values.workingDir) {
            console.error('Missing required argument: --workingDir');
            console.error('Example: npm run build-installer -- --workingDir /path/to/package');
            process.exit(1);
        }

        new BuildInstallerService(values.workingDir).run();
    }

    private async run(): Promise<void> {
        await this.checkForRequiredFilesAsync();
        const commandOptions = await this.getBuildCommandOptions();
        await this.buildInstallerScript(commandOptions.useWindowsPaths);
        await this.buildInstaller(commandOptions);
    }

    private async buildInstallerScript(useWindowsPaths: boolean): Promise<void> {
        console.log('Building installer script');
        const templateModel = await this.getTemplateModel(useWindowsPaths);
        console.log('Template model:');
        console.log(templateModel);
        return new Promise((resolvePromise, reject) => {
            Twig.renderFile(this.constants.paths.installerTemplate, templateModel, (err, content) => {
                if (err) throw err;

                writeFile(this.constants.paths.installerScript, content, (err) => {
                    if (err) throw err;

                    console.log(`Installer script written to '${this.constants.paths.installerScript}'`);

                    resolvePromise();
                });
            });
        });
    }

    private async getTemplateModel(useWindowsPaths: boolean): Promise<TemplateModel> {
        const appVersion = await this.getAppVersion();
        return {
            app: {
                name: this.constants.app.name,
                version: appVersion,
                versionName: `${this.constants.app.name} ${appVersion}`,
                publisher: this.constants.app.publisher,
                publisherUrl: this.constants.app.publisherUrl,
                supportUrl: this.constants.app.supportUrl,
                updatesUrl: this.constants.app.updatesUrl,
            },
            sourceDir: this.getRuntimePath(this.constants.paths.packagePath, useWindowsPaths),
            outputDir: this.getRuntimePath(this.constants.paths.repoPath, useWindowsPaths),
            setupIconFile: this.getRuntimePath(this.constants.paths.setupIconPath, useWindowsPaths),
            licenseFile: this.getRuntimePath(this.constants.paths.licenseFilePath, useWindowsPaths),
            outputBaseFilename: this.constants.outputBaseFilename,
            installDeleteFiles: await this.getInstallDeleteFiles(),
            excludedInstallerFiles: this.constants.excludedInstallerFiles.join(','),
        };
    }

    private async getAppVersion(): Promise<string> {
        const versionContent = await util.promisify(readFile)(this.constants.paths.versionFilePath, {
            encoding: 'utf-8',
        });
        const versionIni = parseIni(versionContent, {
            autoTyping: false,
        });
        return versionIni['DTA']['Version'];
    }

    private async getInstallDeleteFiles(): Promise<string[]> {
        const preUpdateExecDeleteFilesOrDirs = await this.getUpdateExecFileEntries(
            this.constants.paths.preUpdateExecFilePath,
        );
        const updateExecDeleteFilesOrDirs = await this.getUpdateExecFileEntries(
            this.constants.paths.updateExecFilePath,
        );

        return preUpdateExecDeleteFilesOrDirs.concat(updateExecDeleteFilesOrDirs).sort((a, b) => {
            if (a === b) return 0;
            return a > b ? 1 : -1;
        });
    }

    private async getUpdateExecFileEntries(file: string): Promise<string[]> {
        const content = await util.promisify(readFile)(file, { encoding: 'utf-8' });
        const ini = parseIni(content, {
            autoTyping: false,
            // tell the parser to read this as a list of strings without keys
            dataSections: ['Delete', 'DeleteFolder'],
        });
        const deleteFiles = ini['Delete'] as string[];
        const deleteFolders = ini['DeleteFolder'] as string[];

        return deleteFiles
            .concat(deleteFolders)
            .filter(this.isValidDeleteEntry)
            .filter(async (entry) => {
                try {
                    const entryPath = resolve(this.constants.paths.packagePath, entry);
                    // if this succeeds, then the file or dir currently exists in /package dir
                    // it probably shouldn't exist in preupdateexec or updateexec files
                    await util.promisify(access)(entryPath);
                    console.warn(`File in '${file}' delete list, but still in repo: '${entryPath}'`);
                    return false;
                } catch (e) {
                    return true;
                }
            });
    }

    private isValidDeleteEntry(entry: string): boolean {
        return entry && entry !== 'do_not_remove_this_line';
    }

    private async checkForRequiredFilesAsync(): Promise<void> {
        for (const filePath of [
            this.constants.paths.versionFilePath,
            this.constants.paths.preUpdateExecFilePath,
            this.constants.paths.updateExecFilePath,
            this.constants.paths.dependencyInstallerPath,
            this.constants.paths.installerBinary,
            this.constants.paths.installerTemplate,
        ]) {
            await this.checkForRequiredFileAsync(filePath);
        }
    }

    private async checkForRequiredFileAsync(filePath: string): Promise<void> {
        try {
            await util.promisify(access)(filePath);
        } catch (error) {
            if (filePath === this.constants.paths.dependencyInstallerPath) {
                throw new Error(
                    `Missing build-installer dependency: '${filePath}'. ` +
                        `Initialize the git submodule at 'tools/build-installer/inno/libs/InnoDependencyInstaller'.`,
                );
            }

            throw new Error(`Missing required file: '${filePath}'`);
        }
    }

    private async getBuildCommandOptions(): Promise<BuildCommandOptions> {
        if (process.platform === 'win32') {
            return {
                command: this.constants.paths.installerBinary,
                args: [this.constants.paths.installerScript],
                useWindowsPaths: false,
            };
        }

        if (process.platform === 'linux') {
            return await this.getLinuxBuildCommandOptions();
        }

        throw new Error(`Unsupported platform for build-installer: ${process.platform}`);
    }

    private async getLinuxBuildCommandOptions(): Promise<BuildCommandOptions> {
        if (!(await this.isCommandAvailable(this.constants.commands.wine, ['--version']))) {
            throw new Error('build-installer requires wine on Linux, but it was not found in PATH.');
        }

        await mkdir(this.constants.paths.winePrefixPath, { recursive: true });
        console.log(`Running ISCC.exe via wine with local prefix '${this.constants.paths.winePrefixPath}'`);

        return {
            command: this.constants.commands.wine,
            args: [
                this.toWinePath(this.constants.paths.installerBinary),
                this.toWinePath(this.constants.paths.installerScript),
            ],
            env: {
                ...process.env,
                WINEDEBUG: '-fixme-all',
                WINEPREFIX: this.constants.paths.winePrefixPath,
            },
            useWindowsPaths: true,
        };
    }

    private async isCommandAvailable(command: string, args: string[]): Promise<boolean> {
        return await new Promise((resolvePromise) => {
            const child = spawn(command, args, {
                stdio: 'ignore',
            });

            child.on('error', (error) => {
                if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                    resolvePromise(false);
                    return;
                }

                resolvePromise(false);
            });

            child.on('close', () => {
                resolvePromise(true);
            });
        });
    }

    private async buildInstaller(commandOptions: BuildCommandOptions): Promise<void> {
        console.log(`Building installer from script '${this.constants.paths.installerScript}'`);
        await new Promise<void>((resolvePromise, reject) => {
            const inno = spawn(commandOptions.command, commandOptions.args, {
                cwd: this.constants.paths.innoBinPath,
                env: commandOptions.env,
            });

            inno.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            inno.stderr.on('data', (data) => {
                console.error(data.toString());
            });

            inno.on('error', (error) => {
                reject(error);
            });

            inno.on('close', (code) => {
                if (code === 0) {
                    resolvePromise();
                    return;
                }

                reject(new Error(`ISCC exited with code ${code ?? 'unknown'}`));
            });
        });
    }

    private getRuntimePath(filePath: string, useWindowsPaths: boolean): string {
        if (!useWindowsPaths) {
            return filePath;
        }

        return this.toWinePath(filePath);
    }

    private toWinePath(filePath: string): string {
        return `Z:${filePath.replace(/\//g, '\\')}`;
    }
}
