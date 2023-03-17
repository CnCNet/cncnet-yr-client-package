import { Client } from 'irc';
import { IrcServerConfig } from '@cncnet-core/class/irc-server-config.class';

/**
 * This is a simple IRC client with the sole purpose of posting an update message for a newly published release.
 */
export class IrcClientService {

    public constructor(private config: IrcServerConfig) {
    }

    /**
     * Post a CTCP message notifying that there is an update. Users will only see this if the username used
     * is an admin/mod of the channel used.
     *
     * @param channel the channel to post this update message to
     * @param releaseVersion the release version to include in the update message
     */
    public async postUpdateMessage(channel: string, releaseVersion: string): Promise<void> {
        const client = new Client(this.config.server, this.config.nick, {
            autoConnect: false,
            userName: this.config.userName,
            password: this.config.password,
            // debug: true
        });

        console.log(`Connecting to ${this.config.server}...`);
        client.connect(0, serverReply => {
            console.log('Connected.', serverReply);
            console.log(`Joining channel ${channel}...`);
            client.join(channel, () => {
                const updateMessage = `UPDATE ${releaseVersion}`;
                console.log('Channel joined.');
                console.log(`Sending update message: ${updateMessage}...`)
                client.ctcp(channel, null, updateMessage);
                console.log('Disconnecting...');
                client.disconnect();
            });
        });
    }
}
