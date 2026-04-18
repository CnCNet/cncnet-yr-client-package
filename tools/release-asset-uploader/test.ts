/**
 * This is a simple script to test the action.
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { ReleaseAssetUploaderOptionValues } from 'cncnet-core/class/release-asset-uploader-option-values.class';

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
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-asset-uploader-test-'));
    const assetPath = path.join(tempDir, 'test-asset.txt');

    fs.writeFileSync(assetPath, 'test release asset uploader payload');

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
        fs.rmSync(tempDir, {
            recursive: true,
            force: true,
        });
    }
}

run() //
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
