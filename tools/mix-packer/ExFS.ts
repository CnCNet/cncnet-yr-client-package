import * as fs from "fs-extra";
import * as path from "path";
import * as glob from "glob";

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
        if (!fs.existsSync(folderPath)) return 0;

        try {
            const globPattern = toPosixPath(path.join(folderPath, "**", "*"));
            const files = glob.sync(globPattern, { nodir: true, absolute: true });
            let total = 0;
            for (const f of files) {
                try {
                    const st = fs.statSync(f);
                    total += st.size || 0;
                } catch {
                    // ignore files that disappear / are inaccessible
                }
            }
            return total;
        } catch {
            return 0;
        }
    }

    static GetFile(filePath: string) {
        return fs.readFileSync(filePath);
    }

    static mkdir(filePath: string) {
        fs.ensureDirSync(filePath);
    }
}
