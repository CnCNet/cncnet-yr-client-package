import { resolve } from 'path';

const installerBinary = resolve(__dirname, 'inno/bin/ISCC.exe');
const installerScript = resolve(__dirname, 'inno/installer.iss');

const constants = {
    paths: {
        installerBinary,
        installerScript,
    }
}
export { constants };
