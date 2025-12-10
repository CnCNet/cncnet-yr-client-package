import CRC32 from "./CRC32";
import ExBuffer from "./ExBuffer";
import ExFS from "./ExFS";
import * as path from "path";
import * as fs from "fs";

export default class MIXFile {
    folderPath: string;
    body: ExBuffer;

    includedFilesID: Map<
        number,
        {
            id: number;
            offset: number;
            size: number;
            fileName: string;
        }
    >;

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

    addFile(filePath: string) {
        const fileName = path.basename(filePath);
        const id = MIXFile.getID(fileName);

        if (this.includedFilesID.has(id)) {
            console.log(`fileID =${id.toString(16)}, filePath =${filePath} Has in ${path}`);
            throw new Error();
        }

        const fileBuffer = ExFS.GetFile(filePath);
        const offset = this.body.findOrCopy(fileBuffer);
        const size = fileBuffer.length;

        this.includedFilesID.set(id, { id, offset, size, fileName });

        return this;
    }

    addLocalMixDatabase() {
        const fileName = "local mix database.dat";

        const fileList = Array.from(this.includedFilesID.values()).map((el) => el.fileName);
        fileList.push(fileName);
        fileList.sort();

        const body = fileList.join("\x00");
        const size = 0x34 + body.length + 1;

        const fileBuffer = Buffer.alloc(size, 0);
        fileBuffer.write("XCC by Olaf van der Spek", 0);
        fileBuffer.writeInt32BE(0x1a041727, 0x18);
        fileBuffer.writeInt32BE(0x10198000, 0x1c);

        fileBuffer.writeInt32LE(size, 0x20);

        fileBuffer.writeInt8(0x05, 0x2c);
        fileBuffer.writeInt32LE(fileList.length, 0x30);
        fileBuffer.write(body, 0x34);

        const id = MIXFile.getID(fileName);
        const offset = this.body.findOrCopy(fileBuffer);
        this.includedFilesID.set(id, { id, offset, size, fileName });

        return this;
    }

    getHeader() {
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
        result.writeUInt32LE(0x00_00_00_00, 0);
        result.writeUInt16LE(array.length, 4);
        result.writeUInt32LE(this.body.offset, 6);

        return result;
    }

    getBody() {
        return this.body.GetBuffer();
    }

    save(mixPath: string): this {
        this.addLocalMixDatabase();
        const headerBuffer = this.getHeader();
        const bodyBuffer = this.getBody();

        fs.writeFileSync(mixPath, headerBuffer);
        fs.appendFileSync(mixPath, bodyBuffer);
        return this;
    }

    // ===== statics =====
    static getID(fileName: string): number {
        fileName = fileName.toUpperCase();

        const a1 = fileName.length % 4;
        if (a1) {
            const a2 = fileName.length & ~3;
            fileName += String.fromCharCode(a1);
            let b = 3 - a1;
            while (b--) fileName += fileName[a2];
        }

        return CRC32(fileName);
    }
}
