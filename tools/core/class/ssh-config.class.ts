export class SshConfig {
    host: string;
    port: number;
    username: string;
    privateKey: string | Buffer;
    passphrase: string;
}
