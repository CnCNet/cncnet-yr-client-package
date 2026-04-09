/**
 * This is a simple script to test the action.
 */

import { ReleaseAssetUploaderOptionValues } from 'cncnet-core/class/release-asset-uploader-option-values.class';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { ReleaseAssetUploaderService } from './service/release-asset-uploader.service';
import { testPackageContext } from './test-data/test-package';

const mockGitHub = {
    rest: {
        repos: {
            async getReleaseByTag({ owner, repo, tag }: { owner: string; repo: string; tag: string }): Promise<any> {
                console.log(`Mock getReleaseByTag for ${owner}/${repo}@${tag}`);
                return {
                    status: 200,
                    data: {
                        id: 123,
                    },
                };
            },
            async uploadReleaseAsset({
                owner,
                repo,
                release_id,
                name,
                data,
            }: {
                owner: string;
                repo: string;
                release_id: number;
                name: string;
                data: Buffer;
            }): Promise<any> {
                console.log(`Mock uploadReleaseAsset for ${owner}/${repo} release ${release_id} as ${name}`);
                if (!Buffer.isBuffer(data) || !data.length) {
                    throw new Error('Expected uploaded asset data to be a non-empty Buffer.');
                }

                return {
                    status: 201,
                };
            },
        },
    },
};

async function run(): Promise<void> {
    const tempDir = mkdtempSync(join(tmpdir(), 'release-asset-uploader-test-'));
    const assetPath = join(tempDir, 'test-asset.txt');

    writeFileSync(assetPath, 'test release asset uploader payload');

    const testOptionValues = {
        assetName: 'test-asset.txt',
        assetPath,
    } as ReleaseAssetUploaderOptionValues;

    try {
        await ReleaseAssetUploaderService.run(testPackageContext, {
            github: mockGitHub,
            optionValues: testOptionValues,
        });
    } finally {
        rmSync(tempDir, {
            recursive: true,
            force: true,
        });
    }
}

run().catch(console.error);
