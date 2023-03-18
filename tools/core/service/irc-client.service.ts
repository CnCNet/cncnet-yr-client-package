import { Client } from 'irc';
import { IrcServerConfig } from '@cncnet-core/class/irc-server-config.class';

const timeout = 60000; // 1 minute
/**
 * This is a simple IRC client with the sole purpose of posting an update message for a newly published release.
 */
export class IrcClientService {

    private client: Client;

    /**
     *
     * @param config
     * @param channel the channel to post this update message to
     * @param releaseVersion the release version to include in the update message
     */
    public constructor(private config: IrcServerConfig, private channel: string, private releaseVersion: string) {
        this.client = new Client(this.config.server, this.config.nick, {
            autoConnect: false,
            userName: this.config.userName,
            password: this.config.password,
            // debug: true
        });
    }

    /**
     * Post a CTCP message notifying that there is an update. Users will only see this if the username used
     * is an admin/mod of the channel used.
     */
    public async postUpdateMessage(): Promise<void> {
        await this.initiateTimeout();
        await this.connectToIrc();
    }

    /**
     * Connect to IRC
     * @private
     */
    private async connectToIrc(): Promise<void> {
        console.log(`Connecting to ${this.config.server}...`);
        this.client.connect(0, async serverReply => {
            console.log('Connected.');
            // Now that we're connected, authorize our client
            await this.authorizeClient();
        });
    }

    /**
     * Authorize our client with IRC
     * @private
     */
    private async authorizeClient(): Promise<void> {
        console.log('Authorizing client...');
        this.client.send('AUTHSERV', 'auth', this.config.userName, this.config.password);
        // Listen for a message that confirms that we're authorized.
        await this.waitForAuthNotice()
    }

    /**
     * Here, we wait for the confirmation that we are authorized.
     * @private
     */
    private async waitForAuthNotice(): Promise<void> {
        const messageHandler = async (message) => {
            if (await this.isAuthorizedMessage(message)) {
                this.client.removeListener('raw', messageHandler);
                console.log('Authorized.');
                await this.joinChannel();
            } else if (await this.isIncorrectPasswordMessage(message)) {
                console.error('Invalid password provided.');
                process.exit(1);
            }
        }
        console.log('Waiting for authorization confirmation...');
        this.client.addListener('raw', messageHandler.bind(this));
    }

    private async isAuthorizedMessage(message: any): Promise<boolean> {
        return message.command === 'NOTICE' &&
            message.args.length > 1 &&
            message.args[0] === 'cncnet-update-announcer' &&
            message.args[1] === 'I recognize you.';
    }

    private async isIncorrectPasswordMessage(message: any): Promise<boolean> {
        return message.command === 'NOTICE' &&
            message.args.length > 1 &&
            message.args[0] === 'cncnet-update-announcer' &&
            message.args[1] === 'Incorrect password; please try again.';
    }

    /**
     * Join the channel necessary for sending the update message
     * @private
     */
    private async joinChannel(): Promise<void> {
        console.log(`Joining channel ${this.channel}...`);
        this.client.join(this.channel, async () => {
            console.log('Channel joined.');
            await this.sendUpdateMessage();
        });
    }

    /**
     * Send the CTCP UPDATE message
     * @private
     */
    private async sendUpdateMessage(): Promise<void> {
        const updateMessage = `UPDATE ${this.releaseVersion}`;
        console.log(`Sending update message: ${updateMessage}...`)
        this.client.ctcp(this.channel, null, updateMessage);
        console.log('Disconnecting...');
        this.client.disconnect();
        process.exit(0);
    }

    /**
     * In case something goes wrong, we don't want this process hanging around forever.
     * @private
     */
    private async initiateTimeout(): Promise<void> {
        setTimeout(() => {
            console.error('Timeout occurred...');
            process.exit(1);
        }, timeout);
    }
}
