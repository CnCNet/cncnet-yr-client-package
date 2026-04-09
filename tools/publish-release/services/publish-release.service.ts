import { IrcServerConfig } from 'cncnet-core/class/irc-server-config.class';
import { PublishReleaseOptionValues } from 'cncnet-core/class/publish-release-option-values.class';
import { AbstractRepoService } from 'cncnet-core/service/abstract-repo.service';
import { IrcClientService } from 'cncnet-core/service/irc-client.service';
import { SshClientService } from 'cncnet-core/service/ssh-client.service';
import { Context } from '@actions/github/lib/context';

const tagRegex = /^yr-(?<major>\d+).(?<minor>\d+)(?:\.(?<patch>\d+))*$/;

type PublishReleaseGitHub = {
    rest: {
        repos: {
            getLatestRelease(args: { owner: string; repo: string }): Promise<any>;
        };
    };
};

type SshClientLike = {
    executeCommands(commands: string[]): Promise<void>;
};

type IrcClientLike = {
    postUpdateMessage(): Promise<void>;
};

type PublishReleaseDependencies = {
    github?: PublishReleaseGitHub;
    optionValues?: PublishReleaseOptionValues;
    createSshClient?: (options: PublishReleaseOptionValues) => SshClientLike;
    createIrcClient?: (options: PublishReleaseOptionValues, releaseVersion: string) => IrcClientLike;
};

export class PublishReleaseService extends AbstractRepoService<PublishReleaseOptionValues> {
    private options: PublishReleaseOptionValues;
    private createSshClient: (options: PublishReleaseOptionValues) => SshClientLike;
    private createIrcClient: (options: PublishReleaseOptionValues, releaseVersion: string) => IrcClientLike;

    constructor(dependencies: PublishReleaseDependencies = {}) {
        super();

        this.options = dependencies.optionValues || this.optionValues;
        if (dependencies.github) {
            this.github = dependencies.github as any;
        }
        this.createSshClient =
            dependencies.createSshClient ||
            ((options) =>
                new SshClientService({
                    host: options.sshHost,
                    port: options.sshPort,
                    username: options.sshUsername,
                    privateKey: Buffer.from(options.sshKeyBase64, 'base64'),
                    passphrase: options.sshPassphrase,
                }));
        this.createIrcClient =
            dependencies.createIrcClient ||
            ((options, releaseVersion) => {
                const config: IrcServerConfig = {
                    server: options.ircServer,
                    userName: options.ircUserName,
                    nick: options.ircNick,
                    password: options.ircPassword,
                    realName: options.ircRealName,
                };
                const channel = `#${options.ircChannel}`;

                return new IrcClientService(config, channel, releaseVersion);
            });
    }

    public static run(context?: any | Context, dependencies?: PublishReleaseDependencies): Promise<void> {
        return new PublishReleaseService(dependencies).run(context || new Context());
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
        const github = this.getRequiredGitHub();
        const response = await github.rest.repos.getLatestRelease({
            owner: context.repo.owner,
            repo: context.repo.repo,
        });

        if (response?.status !== 200) {
            console.error(response);
            throw 'Unable to get response for latest release';
        }

        let tagName = response.data.tag_name;
        if (!tagName) throw 'Unable to get tag name for latest release';

        return await this.getReleaseVersionForTag(tagName);
    }

    /**
     * Publishes the specified release number.
     * This creates or modifies the "live" link to point to the directory for the specified release version.
     * @param releaseVersion
     * @private
     */
    private async publishReleaseVersionOnServer(releaseVersion: string): Promise<void> {
        const sshClient = this.createSshClient(this.options);
        await sshClient.executeCommands([`cd ${this.options.yrGamePath}`, `ln -sfn updates/${releaseVersion} live`]);
    }

    /**
     * Post a message to IRC channel that there is an update available. This requires that the user used to send this message
     * is an admin/mod of the IRC channel.
     *
     * @param releaseVersion The release version to post as an update message.
     * @private
     */
    private async postIrcUpdateMessage(releaseVersion: string): Promise<void> {
        await this.createIrcClient(this.options, releaseVersion).postUpdateMessage();
    }

    /**
     * Parses the tag name into a release version in the form "x.y" or "x.y.z"
     *
     * @param tagName Tag name to be parsed. It should be in the form "yr-x.y.z"
     * @private
     */
    private async getReleaseVersionForTag(tagName: string): Promise<string> {
        const matches = tagRegex.exec(tagName);
        if (!matches?.groups) throw `Unable to match tag name to regex: ${tagRegex}`;

        return `${matches.groups.major}.${matches.groups.minor}.${matches.groups.patch || '0'}`;
    }

    protected getOptionValues(): PublishReleaseOptionValues {
        return PublishReleaseOptionValues.parse();
    }

    private getRequiredGitHub(): PublishReleaseGitHub {
        if (!this.github) {
            throw new Error('Missing GitHub token/client. Pass --token when running publish-release.');
        }

        return this.github as any;
    }
}
