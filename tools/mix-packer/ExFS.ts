import * as fs from "fs-extra";
import * as path from "path";
import * as glob from "glob";
const fastFolderSizeSync = require("fast-folder-size/sync") as (target: string) => number;

function toPosixPath(pathStr: string) {
    return pathStr.replace(/\\/g, "/");
}

export default class ExFS {
    static deleteAllMix(folderPath: string) {
        const globOptions = {
            nodir: true,
            absolute: true,
        };

        const globPattern = toPosixPath(path.join(folderPath, "**", "*.mix"));

        const fileArray = glob.sync(globPattern, globOptions);
        fileArray.forEach((item) => {
            fs.removeSync(item);
            console.log("delete " + item);
        });
    }

    static GetFileArray(folderPath: string) {
        const globOptions = {
            nodir: true,
            absolute: true,
            ignore: [
                //
                toPosixPath(path.join(folderPath, "**", "*.md")),
                toPosixPath(path.join(folderPath, "*.pack", "**")),
            ],
        };

        const globPattern = toPosixPath(path.join(folderPath, "**"));

        return glob.sync(globPattern, globOptions).sort();
    }

    static GetPackArray(folderPath: string) {
        const globPattern = toPosixPath(path.join(folderPath, "**", "*.pack"));

        let result = glob.sync(globPattern);

        result = result.sort((a, b) => b.length - a.length);

        return result;
    }

    static GetFolderSize(folderPath: string) {
        if (!fs.existsSync(folderPath)) {
            return 0;
        }

        try {
            // Try the quick method
            return fastFolderSizeSync(folderPath) || 0;
        } catch {
            try {
                const globPattern = toPosixPath(path.join(folderPath, "**", "*"));
                const filesList = glob.sync(globPattern, { nodir: true, absolute: true });

                let totalSize = 0;
                for (const currentFile of filesList) {
                    try {
                        const st = fs.statSync(currentFile);
                        totalSize += st.size || 0;
                    } catch {
                        // ignore files that disappear / are inaccessible
                        continue;
                    }
                }

                return totalSize;
            } catch {
                return 0;
            }
        }
    }

    static GetFile(filePath: string) {
        return fs.readFileSync(filePath);
    }

    static mkdir(filePath: string) {
        fs.ensureDirSync(filePath);
    }
}
