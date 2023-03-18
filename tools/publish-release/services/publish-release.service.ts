import { AbstractRepoService, IrcClientService, SshClientService } from '@cncnet-core/service';
import { IrcServerConfig, PublishReleaseOptionValues } from '@cncnet-core/class';
import { Context } from '@actions/github/lib/context';

const tagRegex = /^yr-(?<major>\d+).(?<minor>\d+)(?:\.(?<patch>\d+))*$/;

export class PublishReleaseService extends AbstractRepoService<PublishReleaseOptionValues> {

    private options: PublishReleaseOptionValues;

    constructor() {
        super();

        this.options = this.getOptionValues();
    }

    public static run(context?: any | Context): void {
        new PublishReleaseService().run(context || new Context());
    }

    private async run(context: any | Context): Promise<void> {
        const releaseVersion = await this.getLatestReleaseNumber(context);

        await this.publishReleaseVersionOnServer(releaseVersion);
        await this.postIrcUpdateMessage(releaseVersion);
    }

    /**
     * Gets the latest release number for the latest release. It does this by getting the latest release from Github,
     * then parsing the "tag" for that lease in our expected format of "yr-x.y" or "yr-x.y.z".
     * where "x.y" or "x.y.z" is the release number.
     * @param context
     * @private
     */
    private async getLatestReleaseNumber(context: any | Context): Promise<string> {
        const response = await this.github.rest.repos.getLatestRelease({
            owner: context.repo.owner,
            repo: context.repo.repo,
        });

        if (response?.status !== 200) {
            console.error(response);
            throw 'Unable to get response for latest release';
        }

        let tagName = response.data.tag_name;
        if (!tagName)
            throw 'Unable to get tag name for latest release';

        return await this.getReleaseVersionForTag(tagName);
    }

    /**
     * Publishes the specified release number.
     * This creates or modifies the "live" link to point to the directory for the specified release version.
     * @param releaseVersion
     * @private
     */
    private async publishReleaseVersionOnServer(releaseVersion: string): Promise<void> {
        const sshClient = new SshClientService({
            host: this.options.sshHost,
            port: this.options.sshPort,
            username: this.options.sshUsername,
            privateKey: Buffer.from(this.options.sshKeyBase64, 'base64'),
            passphrase: this.options.sshPassphrase
        });

        await sshClient.executeCommands([
            `cd ${this.options.yrGamePath}`,
            `ln -sfn updates/${releaseVersion} live`
        ]);
    }

    /**
     * Post a message to IRC channel that there is an update available. This requires that the user used to send this message
     * is an admin/mod of the IRC channel.
     *
     * @param releaseVersion The release version to post as an update message.
     * @private
     */
    private async postIrcUpdateMessage(releaseVersion: string): Promise<void> {
        const config: IrcServerConfig = {
            server: this.options.ircServer,
            userName: this.options.ircUserName,
            nick: this.options.ircNick,
            password: this.options.ircPassword,
            realName: this.options.ircRealName
        };
        const channel = `#${this.options.ircChannel}`;
        await new IrcClientService(config, channel, releaseVersion).postUpdateMessage();
    }

    /**
     * Parses the tag name into a release version in the form "x.y" or "x.y.z"
     *
     * @param tagName Tag name to be parsed. It should be in the form "yr-x.y.z"
     * @private
     */
    private async getReleaseVersionForTag(tagName: string): Promise<string> {
        const matches = tagRegex.exec(tagName);
        if (!matches?.groups)
            throw `Unable to match tag name to regex: ${tagRegex}`;

        return `${matches.groups.major}.${matches.groups.minor}.${matches.groups.patch || '0'}`
    }

    protected getOptionValues(): PublishReleaseOptionValues {
        return PublishReleaseOptionValues.parse();
    }
}
