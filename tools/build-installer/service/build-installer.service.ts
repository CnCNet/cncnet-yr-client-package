import { spawn } from 'child_process'
import { constants } from '../constants';

export class BuildInstallerService {
    public static run(): void {
        new BuildInstallerService().run();
    }

    private async run(): Promise<void> {
        const inno = spawn(constants.paths.installerBinary, [constants.paths.installerScript], {
            cwd: __dirname,
        });
        inno.stdout.on('data', data => {
            console.log(data.toString());
        });
        inno.stderr.on('data', data => {
            console.error(data.toString());
        });
    }
}
