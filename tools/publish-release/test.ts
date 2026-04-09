import { PublishReleaseService } from './services/publish-release.service';
import { testPublishRelease } from './test-data/test-publish-release';
import { PublishReleaseOptionValues } from 'cncnet-core/class/publish-release-option-values.class';

const mockGitHub = {
    rest: {
        repos: {
            async getLatestRelease({ owner, repo }: { owner: string; repo: string }): Promise<any> {
                console.log(`Mock getLatestRelease for ${owner}/${repo}`);
                return {
                    status: 200,
                    data: {
                        tag_name: 'yr-8.28',
                    },
                };
            },
        },
    },
};

const testOptionValues = {
    sshHost: 'localhost',
    sshPort: 22,
    sshUsername: 'test-user',
    sshKeyBase64: Buffer.from('test-key').toString('base64'),
    sshPassphrase: 'test-passphrase',
    yrGamePath: '/var/www/cncnet-yr',
    ircServer: 'irc.example.test',
    ircChannel: 'cncnet-test',
    ircNick: 'cncnet-bot',
    ircUserName: 'cncnet-user',
    ircPassword: 'secret',
    ircRealName: 'CnCNet Test',
} as PublishReleaseOptionValues;

PublishReleaseService.run(testPublishRelease, {
    github: mockGitHub,
    optionValues: testOptionValues,
    createSshClient: () => ({
        async executeCommands(commands: string[]): Promise<void> {
            console.log(`Mock SSH executeCommands: ${JSON.stringify(commands)}`);
        },
    }),
    createIrcClient: (_options, releaseVersion) => ({
        async postUpdateMessage(): Promise<void> {
            console.log(`Mock IRC postUpdateMessage for release ${releaseVersion}`);
        },
    }),
}).catch(console.error);
