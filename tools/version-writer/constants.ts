import { resolve } from 'path';

const versionWriterBinary = resolve(__dirname, 'bin/VersionWriter.exe');
const repoRoot = resolve(__dirname, '../../');
const packagePath = resolve(repoRoot, 'package');

const constants = {
    paths: {
        versionWriterBinary,
        packagePath
    }
}

export { constants };
