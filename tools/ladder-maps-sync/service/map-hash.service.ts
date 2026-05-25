import { createHash } from 'crypto';
import { readFile } from 'fs/promises';

export class MapHashService {
  async computeFileHash(filePath: string): Promise<string> {
    const fileBuffer = await readFile(filePath);
    const hashSum = createHash('sha1');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  }

  async verifyFileHash(filePath: string, expectedHash: string): Promise<boolean> {
    const actualHash = await this.computeFileHash(filePath);
    return actualHash === expectedHash;
  }
}
