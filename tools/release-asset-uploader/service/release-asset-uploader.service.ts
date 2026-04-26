import * as fs from 'fs';
import * as path from 'path';

import { context as githubContext } from '@actions/github';

import { ReleaseAssetUploaderOptionValues } from 'cncnet-core/class/release-asset-uploader-option-values.class';
import { AbstractRepoService } from 'cncnet-core/service/abstract-repo.service';

type ReleaseAssetUploaderContext = Pick<typeof githubContext, 'ref' | 'repo'>;

type ReleaseAssetUploaderGitHub = {
    rest: {
        repos: {
            getReleaseByTag(args: { owner: string; repo: string; tag: string }): Promise<any>;
            uploadReleaseAsset(args: {
                owner: string;
                repo: string;
                release_id: number;
                name: string;
                data: Buffer;
            }): Promise<any>;
        };
    };
};

type ReleaseAssetUploaderDependencies = {
    github?: ReleaseAssetUploaderGitHub;
    optionValues?: ReleaseAssetUploaderOptionValues;
};

export class ReleaseAssetUploaderService extends AbstractRepoService<ReleaseAssetUploaderOptionValues> {
    public constructor(dependencies: ReleaseAssetUploaderDependencies = {}) {
        super();

        if (dependencies.optionValues) {
            this.optionValues = dependencies.optionValues;
        }
        if (dependencies.github) {
            this.github = dependencies.github as any;
        }
    }

    public static async run(
        context: ReleaseAssetUploaderContext = githubContext,
        dependencies?: ReleaseAssetUploaderDependencies,
    ): Promise<void> {
        return new ReleaseAssetUploaderService(dependencies).run(context);
    }

    protected getOptionValues(): ReleaseAssetUploaderOptionValues {
        return ReleaseAssetUploaderOptionValues.parse();
    }

    private async run(context: ReleaseAssetUploaderContext): Promise<void> {
        const tagName = super.getTagName(context.ref);
        if (!tagName) {
            console.log('No tag/release to upload asset to');
            return;
        }
        const assetPath = this.getRequiredOptionValue('assetPath');
        const assetName = this.getRequiredOptionValue('assetName');
        const github = this.getRequiredGitHub();

        console.log(`Getting release for tag ${tagName}`);
        const releaseResponse = await github.rest.repos.getReleaseByTag({
            owner: context.repo.owner,
            repo: context.repo.repo,
            tag: tagName,
        });

        if (!releaseResponse || releaseResponse.status != 200) {
            console.error(
                `Unable to get ID for owner: ${context.repo.owner}, repo: ${context.repo.repo}, tag: ${tagName}`,
            );
            console.error(releaseResponse);
            return;
        }

        const fullAssetPath = path.resolve(process.cwd(), assetPath);
        console.log(`Checking to see if asset exists at ${fullAssetPath}`);
        if (!fs.existsSync(fullAssetPath)) throw `Asset does not exist at: ${fullAssetPath}`;

        console.log(`Reading asset file data`);
        const data: unknown = fs.readFileSync(fullAssetPath);

        console.log(`Uploading asset to release`);
        const uploadResponse = await github.rest.repos.uploadReleaseAsset({
            owner: context.repo.owner,
            repo: context.repo.repo,
            release_id: releaseResponse.data.id,
            name: assetName,
            data: data as Buffer,
        });

        if (uploadResponse.status != 201) {
            console.error(`Failed to upload asset to release`);
            console.error(uploadResponse);
            return;
        } else {
            console.log('Asset upload complete');
        }
    }

    private getRequiredGitHub(): ReleaseAssetUploaderGitHub {
        if (!this.github) {
            throw new Error('Missing GitHub token/client. Pass --token when running release-asset-uploader.');
        }

        return this.github as any;
    }

    private getRequiredOptionValue(key: 'assetName' | 'assetPath'): string {
        const value = this.optionValues[key];
        if (!value) {
            throw new Error(`Missing required argument: --${key}`);
        }

        return value;
    }
}
