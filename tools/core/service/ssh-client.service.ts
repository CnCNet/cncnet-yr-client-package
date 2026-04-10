import { Client, type ClientChannel } from 'ssh2';

import { type ISshConfig } from 'cncnet-core/interface/ssh-config.interface';

export class SshClientService {
    constructor(private sshConfig: ISshConfig) {}

    public async executeCommands(commands: string[]): Promise<void> {
        const conn = new Client();
        conn.on('ready', async () => {
            console.log('connection established');
            conn.shell(async (err, stream) => {
                if (err) throw err;

                stream
                    .on('close', () => {
                        conn.end();
                    })
                    .on('data', (_data: Buffer | string) => {
                        // only uncomment for debugging purposes
                        // console.log(data.toString());
                    });
                stream.end(await this.createCommand(commands));
            });
        }).connect(this.sshConfig);
    }

    private async createCommand(commandGroup: string[]): Promise<string> {
        return commandGroup.concat('exit\n').join('\n');
    }
}
