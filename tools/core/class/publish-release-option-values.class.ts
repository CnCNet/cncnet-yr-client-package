import { AbstractOptionValues } from './abstract-option-values.class';
import { Command } from 'commander';

export class PublishReleaseOptionValues extends AbstractOptionValues {
    sshHost: string;
    sshPort: number;
    sshUsername: string;
    sshKeyBase64: string;
    sshPassphrase: string;
    yrGamePath: string;
    ircServer: string;
    ircChannel: string;
    ircNick: string;
    ircUserName: string;
    ircPassword: string;
    ircRealName: string;

    static parse(): PublishReleaseOptionValues {
        return new Command()
            .option('--token <token>')
            .option('--sshHost <sshHost>')
            .option('--sshPort <sshPort>')
            .option('--sshUsername <sshUser>')
            .option('--sshPassphrase <sshPass>')
            .option('--sshKey <sshKey>')
            .option('--sshKeyBase64 <sshKey>')
            .option('--yrGamePath <yrGamePath>')
            .option('--ircServer <ircServer>')
            .option('--ircChannel <ircChannel>')
            .option('--ircNick <ircNick>')
            .option('--ircUserName <ircUserName>')
            .option('--ircPassword <ircPassword>')
            .option('--ircRealName <ircRealName>')
            .parse()
            .opts<PublishReleaseOptionValues>();
    }
}
