import { Client } from 'ssh2';
import { SshConfig } from '@cncnet-core/class/ssh-config.class';

export class SshClientService {
    constructor(
        private sshConfig: SshConfig
    ) {
    }

    public async executeCommands(commands: string[]): Promise<void> {
        const conn = new Client();
        conn.on('ready', async () => {
            console.log('connection established');
            conn.shell(async (err, stream) => {
                if (err)
                    throw err;

                stream.on('close', () => {
                    conn.end();
                }).on('data', (data) => {
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
