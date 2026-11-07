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

    // `size` is the expected number of bytes; the buffer grows if more is written.
    constructor(size: number) {
        this.offset = 0;
        this.buffer = Buffer.allocUnsafe(Math.max(size, 1));
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

    copy(source: Buffer) {
        const result = this.offset;
        this.reserve(source.length);
        source.copy(this.buffer, result);
        this.offset += source.length;
        this.fileItems.add(this.buffer.subarray(result, this.offset), result);

        return result;
    }

    write(value: number) {
        this.reserve(4);
        this.buffer.writeUInt32LE(value, this.offset);
        this.offset += 4;
    }

    // Make room for `length` more bytes. Buffer.copy drops whatever does not fit in the target
    // without an error, so a buffer that is too small would silently produce a MIX whose index
    // describes bytes that were never written.
    private reserve(length: number) {
        const needed = this.offset + length;
        if (needed <= this.buffer.length) {
            return;
        }
        const grown = Buffer.allocUnsafe(Math.max(needed, this.buffer.length * 2));
        this.buffer.copy(grown, 0, 0, this.offset);
        this.buffer = grown;
    }
}
