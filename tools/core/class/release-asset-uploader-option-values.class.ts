import { AbstractOptionValues } from './abstract-option-values.class';
import { program } from 'commander';

export class ReleaseAssetUploaderOptionValues extends AbstractOptionValues {
    assetPath: string;
    assetName: string;

    static parse(): ReleaseAssetUploaderOptionValues {
        return program
            .option('--token <token>')
            .option('--assetName <assetName>')
            .option('--assetPath <assetPath>')
            .parse()
            .opts<ReleaseAssetUploaderOptionValues>();
    }
}
