import { parseArgs } from 'util';
import * as path from 'path';

import ExFS from './ExFS';
import MIXFile from './MIXFile';

function getOptions() {
    const { values } = parseArgs({
        options: {
            inDir: {
                type: 'string',
                short: 'i',
            },
            outDir: {
                type: 'string',
                short: 'o',
            },
        },
    });

    if (!values.inDir || !values.outDir) {
        console.error('Missing required arguments: --inDir and --outDir');
        console.error('Example: npm run mix-packer -- --inDir /path/to/game-assets --outDir /path/to/package');
        process.exit(1);
    }

    return {
        inDir: path.resolve(values.inDir),
        outDir: path.resolve(values.outDir),
    };
}

function main() {
    const { inDir, outDir } = getOptions();

    console.log(`Packing MIX files from '${inDir}' to '${outDir}'`);

    ExFS.deleteAllMix(inDir);
    const packArray = ExFS.GetPackArray(inDir);

    for (const item of packArray) {
        const parse = path.parse(item);

        let currentOutDir = path.normalize(parse.dir);
        if (!inPack(currentOutDir, inDir)) {
            currentOutDir = outDir;
        }

        ExFS.mkdir(currentOutDir);
        const mix = path.join(currentOutDir, parse.name + '.mix');
        const pack = path.join(parse.dir, parse.base);

        console.log(mix);
        new MIXFile(pack).save(mix);
    }
}

function inPack(mixDir: string, inDir: string) {
    return (
        mixDir
            .replace(inDir, '')
            .split(path.sep)
            .findIndex((i) => i.endsWith('.pack')) !== -1
    );
}

main();
