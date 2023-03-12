import { resolve } from 'path';

const versionWriterBinary = resolve(__dirname, 'bin/VersionWriter.exe');
const packagePath = resolve(__dirname, '../../package');

const constants = {
    paths: {
        versionWriterBinary,
        packagePath
    }
}

export { constants };
