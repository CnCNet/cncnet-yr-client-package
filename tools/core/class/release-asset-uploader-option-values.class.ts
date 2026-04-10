import { AbstractOptionValues } from './abstract-option-values.class';
import { Command } from 'commander';

export class ReleaseAssetUploaderOptionValues extends AbstractOptionValues {
    assetPath!: string;
    assetName!: string;

    static parse(): ReleaseAssetUploaderOptionValues {
        return new Command()
            .option('--token <token>')
            .option('--assetName <assetName>')
            .option('--assetPath <assetPath>')
            .parse()
            .opts<ReleaseAssetUploaderOptionValues>();
    }
}
