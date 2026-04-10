import * as path from 'path';
import * as url from 'url';

export function createConstants(workingDir: string) {
    const currentDir = path.dirname(url.fileURLToPath(import.meta.url));
    const resolvedWorkingDir = path.resolve(workingDir);
    const versionWriterBinary = path.resolve(currentDir, 'bin/VersionWriter.exe');
    const runnerBinary = path.resolve(resolvedWorkingDir, 'VersionWriter.runtime.exe');
    const versionConfigPath = path.resolve(resolvedWorkingDir, 'versionconfig.ini');
    const winePrefixPath = path.resolve(currentDir, '.wine');

    return {
        commands: {
            mono: 'mono',
            wine: 'wine',
        },
        paths: {
            versionWriterBinary,
            runnerBinary,
            workingDir: resolvedWorkingDir,
            versionConfigPath,
            winePrefixPath,
        },
    };
}
