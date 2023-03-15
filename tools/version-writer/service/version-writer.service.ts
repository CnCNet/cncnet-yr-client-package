import { spawn } from 'child_process';
import { constants } from '../constants';
import { rm } from 'fs/promises';
import { resolve } from 'path';

export class VersionWriterService {
    public static async run(): Promise<void> {
        await new VersionWriterService().run();
    }

    private async run(): Promise<void> {
        const versionWriter = spawn(constants.paths.versionWriterBinary, ['/S', constants.paths.packagePath], {
            cwd: __dirname,
        });
        versionWriter.stdout.on('data', data => {
            console.log(data.toString());
        });
        versionWriter.stderr.on('data', data => {
            throw data.toString();
        });
        versionWriter.stdout.on('end', await this.deleteVersionWriterCopiedFiles);
    }

    private async deleteVersionWriterCopiedFiles(): Promise<void> {
        return rm(resolve(constants.paths.packagePath, 'VersionWriter-CopiedFiles'), {
            force: true,
            recursive: true
        });
    }
}
