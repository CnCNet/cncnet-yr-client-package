import MIXFile from "./MIXFile";
import ExFS from "./ExFS";
import * as path from "path";

const inDir = path.normalize("../game-assets");
const outDir = path.normalize("../package");

ExFS.deleteAllMix(inDir);
const packArray = ExFS.GetPackArray(inDir);

for (const item of packArray) {
    const parse = path.parse(item);

    let currentOutDir = path.normalize(parse.dir);
    if (!inPack(currentOutDir)) {
        currentOutDir = outDir;
    }

    ExFS.mkdir(currentOutDir);
    const mix = path.join(currentOutDir, parse.name + ".mix");
    const pack = path.join(parse.dir, parse.base);

    console.log(mix);
    new MIXFile(pack).save(mix);
}

function inPack(mixDir) {
    return (
        mixDir
            .replace(inDir, "")
            .split(path.sep)
            .findIndex((i) => i.endsWith(".pack")) !== -1
    );
}
