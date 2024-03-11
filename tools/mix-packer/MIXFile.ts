import CRC32 from "./CRC32";
import ExBuffer from "./ExBuffer";
import ExFS from "./ExFS";
import * as path from "path";
import * as fs from "fs";

export default class MIXFile {
    folderPath: string;
    body: ExBuffer;

    includedFilesID: Map<any, any>;

    // CreateFromFolder
    constructor(folderPath: string) {
        this.folderPath = folderPath;
        this.includedFilesID = new Map();

        const filesArray = ExFS.GetFileArray(this.folderPath);

        this.body = new ExBuffer(ExFS.GetFolderSize(this.folderPath) + filesArray.length);

        for (let i = 0; i < filesArray.length; i++) {
            this.addFile(filesArray[i]);
            // console.log(i + 1, " of ", filesArray.length, "\r");
        }
    }

    addFile(filePath) {
        const id = MIXFile.getID(filePath);

        if (this.includedFilesID.has(id)) {
            console.log(`fileID =${id.toString(16)}, filePath =${filePath} Has in ${path}`);
            throw new Error();
        }

        const fileBuffer = ExFS.GetFile(filePath);

        const offset = this.body.findOrCopy(fileBuffer);
        const size = fileBuffer.length;

        this.includedFilesID.set(id, { id, offset, size });

        return this;
    }

    createHeader() {
        const array = Array.from(this.includedFilesID.values());
        array.sort((a, b) => ~~a.id - ~~b.id);

        const buf = new ExBuffer(array.length * 12 + 10);
        buf.offset = 10;

        for (const item of array) {
            buf.write(item.id);
            buf.write(item.offset);
            buf.write(item.size);
        }

        const result = buf.GetBuffer();
        result.writeUInt32LE(0xcf_00_00_00, 0);
        result.writeUInt16LE(array.length, 4);
        result.writeUInt32LE(this.body.offset, 6);

        return result;
    }

    save(mixPath: string): this {
        const hqBuffer = this.createHeader();

        fs.writeFileSync(mixPath, hqBuffer);
        fs.appendFileSync(mixPath, this.body.GetBuffer());
        return this;
    }

    // ===== statics =====
    static getID(filePath): number {
        let name = path.basename(filePath).toUpperCase();

        const a1 = name.length % 4;
        if (a1) {
            const a2 = name.length & ~3;
            name += String.fromCharCode(a1);
            let b = 3 - a1;
            while (b--) name += name[a2];
        }

        return CRC32(name);
    }
}
