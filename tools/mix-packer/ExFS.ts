import * as path from 'path';

import fs from 'fs-extra';
import * as glob from 'glob';

const CSF_SOURCE_FILE_SUFFIX = '.csf.ini';

function toPosixPath(pathStr: string) {
    return pathStr.replace(/\\/g, '/');
}

export default class ExFS {
    static deleteAllMix(folderPath: string) {
        const globOptions = {
            nodir: true,
            absolute: true,
        };

        const globPattern = toPosixPath(path.join(folderPath, '**', '*.mix'));

        const fileArray = glob.sync(globPattern, globOptions);
        fileArray.forEach((item) => {
            fs.removeSync(item);
            console.log('delete ' + item);
        });
    }

    static GetFileArray(folderPath: string) {
        const globOptions = {
            nodir: true,
            absolute: true,
            ignore: [
                //
                toPosixPath(path.join(folderPath, '**', '*.md')),
                toPosixPath(path.join(folderPath, '*.pack', '**')),
            ],
        };

        const globPattern = toPosixPath(path.join(folderPath, '**'));

        // CSF sources end with .csf.ini and are converted to .csf before packing.
        return glob
            .sync(globPattern, globOptions)
            .filter((filePath) => !filePath.toLowerCase().endsWith(CSF_SOURCE_FILE_SUFFIX))
            .sort();
    }

    static GetPackArray(folderPath: string) {
        const globPattern = toPosixPath(path.join(folderPath, '**', '*.pack'));

        let result = glob.sync(globPattern);

        result = result.sort((a, b) => b.length - a.length);

        return result;
    }

    static GetFileSize(filePath: string) {
        return fs.statSync(filePath).size;
    }

    static GetFile(filePath: string) {
        return fs.readFileSync(filePath);
    }

    static mkdir(filePath: string) {
        fs.ensureDirSync(filePath);
    }
}
