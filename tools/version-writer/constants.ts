import { resolve } from 'path';

export function createConstants(workingDir: string) {
    const resolvedWorkingDir = resolve(workingDir);
    const versionWriterBinary = resolve(__dirname, 'bin/VersionWriter.exe');
    const runnerBinary = resolve(resolvedWorkingDir, 'VersionWriter.runtime.exe');
    const versionConfigPath = resolve(resolvedWorkingDir, 'versionconfig.ini');
    const winePrefixPath = resolve(__dirname, '.wine');

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

export type VersionWriterConstants = ReturnType<typeof createConstants>;
