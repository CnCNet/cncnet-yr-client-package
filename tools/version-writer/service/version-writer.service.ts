import { spawn } from 'child_process';
import { constants } from '../constants';

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
    }
}
