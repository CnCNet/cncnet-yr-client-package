class FileItemArray {
    Array: Array<{ buffer: Buffer; offset: number }> = [];

    add(buffer: Buffer, offset: number): void {
        this.Array.push({ buffer, offset });
    }

    find(source: Buffer): number {
        const result = this.Array.find((i) => {
            return i.buffer.equals(source);
        });
        return result ? result.offset : -1;
    }
}

export default class ExBuffer {
    fileItems = new FileItemArray();
    buffer: Buffer;
    offset: number;

    constructor(size: number) {
        this.offset = 0;
        this.buffer = Buffer.allocUnsafe(size);
    }

    GetBuffer(): Buffer {
        return this.buffer.subarray(0, this.offset);
    }

    findOrCopy(source: Buffer) {
        let result = this.fileItems.find(source);
        if (result === -1) {
            result = this.copy(source);
        }
        return result;
    }

    copy(source) {
        const result = this.offset;
        source.copy(this.buffer, result);
        this.offset += source.length;
        this.fileItems.add(this.buffer.subarray(result, this.offset), result);

        return result;
    }

    write(value) {
        this.buffer.writeUInt32LE(value, this.offset);
        this.offset += 4;
    }
}
