import { parseArgs } from 'util';
import * as childProcess from 'child_process';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

import { createConstants } from 'version-writer/constants';

interface ICommandOptions {
    command: string;
    args: string[];
    env?: NodeJS.ProcessEnv;
}

export class VersionWriterService {
    private constants: ReturnType<typeof createConstants>;

    public constructor(private workingDir: string) {
        this.constants = createConstants(workingDir);
    }

    public static async run(): Promise<void> {
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
            console.error('Example: npm run version-writer -- --workingDir /path/to/package');
            process.exit(1);
        }

        await new VersionWriterService(values.workingDir).run();
    }

    private async run(): Promise<void> {
        await this.validateWorkingDir();
        await this.prepareRunnerBinary();

        try {
            const command = await this.getCommandOptions();
            await this.runCommand(command);
        } finally {
            await this.deleteRunnerBinary();
            await this.deleteVersionWriterCopiedFiles();
        }
    }

    private async validateWorkingDir(): Promise<void> {
        await fsPromises.access(this.constants.paths.workingDir);
        await fsPromises.access(this.constants.paths.versionConfigPath);
    }

    private async prepareRunnerBinary(): Promise<void> {
        await fsPromises.copyFile(this.constants.paths.versionWriterBinary, this.constants.paths.runnerBinary);
    }

    private async getCommandOptions(): Promise<ICommandOptions> {
        if (process.platform === 'win32') {
            return {
                command: this.constants.paths.runnerBinary,
                args: ['/S', this.constants.paths.workingDir],
            };
        }

        if (process.platform === 'linux') {
            return await this.getLinuxCommandOptions();
        }

        throw new Error(`Unsupported platform for version-writer: ${process.platform}`);
    }

    private async getLinuxCommandOptions(): Promise<ICommandOptions> {
        if (await this.isCommandAvailable(this.constants.commands.mono, ['--version'])) {
            console.log('Running VersionWriter.exe via mono');
            return {
                command: this.constants.commands.mono,
                args: [this.constants.paths.runnerBinary, '/S', this.constants.paths.workingDir],
            };
        }

        if (await this.isCommandAvailable(this.constants.commands.wine, ['--version'])) {
            await fsPromises.mkdir(this.constants.paths.winePrefixPath, { recursive: true });
            console.log(
                `Running VersionWriter.exe via wine with local prefix '${this.constants.paths.winePrefixPath}'`,
            );
            return {
                command: this.constants.commands.wine,
                args: [
                    this.toWinePath(this.constants.paths.runnerBinary),
                    '/S',
                    this.toWinePath(this.constants.paths.workingDir),
                ],
                env: {
                    ...process.env,
                    WINEPREFIX: this.constants.paths.winePrefixPath,
                },
            };
        }

        throw new Error(
            'VersionWriter.exe requires mono on Linux, or wine as a fallback. Neither command was found in PATH.',
        );
    }

    private async isCommandAvailable(command: string, args: string[]): Promise<boolean> {
        return await new Promise((resolvePromise) => {
            const child = childProcess.spawn(command, args, {
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

    private async runCommand(options: ICommandOptions): Promise<void> {
        await new Promise<void>((resolvePromise, reject) => {
            const versionWriter = childProcess.spawn(options.command, options.args, {
                cwd: this.constants.paths.workingDir,
                env: options.env,
            });

            versionWriter.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            versionWriter.stderr.on('data', (data) => {
                console.error(data.toString());
            });

            versionWriter.on('error', (error) => {
                reject(error);
            });

            versionWriter.on('close', (code) => {
                if (code === 0) {
                    resolvePromise();
                    return;
                }

                reject(new Error(`VersionWriter exited with code ${code ?? 'unknown'}`));
            });
        });
    }

    private toWinePath(filePath: string): string {
        return `Z:${filePath.replace(/\//g, '\\')}`;
    }

    private async deleteRunnerBinary(): Promise<void> {
        return fsPromises.rm(this.constants.paths.runnerBinary, {
            force: true,
        });
    }

    private async deleteVersionWriterCopiedFiles(): Promise<void> {
        return fsPromises.rm(path.resolve(this.constants.paths.workingDir, 'VersionWriter-CopiedFiles'), {
            force: true,
            recursive: true,
        });
    }
}
