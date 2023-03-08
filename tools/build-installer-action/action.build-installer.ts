import { resolve } from 'path';
import { spawn } from 'child_process'

const installerBinary = resolve(__dirname, 'bin/ISCC.exe');
const installerScript = resolve(__dirname, 'installer.iss');


export class BuildInstallerAction {

    public static run(): void {
        new BuildInstallerAction().run();
    }

    private async run(): Promise<void> {
        const inno = spawn(installerBinary, [installerScript], {
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
