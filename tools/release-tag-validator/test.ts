/**
 * This is a simple script to test the action.
 */

import { ReleaseTagValidatorService } from './service/release-tag-validator.service';
import { testBadReleaseTagContext } from './test-data/test-bad-release-tag-context';
import { testGoodReleaseTagContext } from './test-data/test-good-release-tag-context';
import { testNonReleaseContext } from './test-data/test-non-release-context';

async function run(): Promise<void> {
    await ReleaseTagValidatorService.run(testGoodReleaseTagContext);
    await ReleaseTagValidatorService.run(testNonReleaseContext);

    try {
        await ReleaseTagValidatorService.run(testBadReleaseTagContext);
    } catch (e) {
        console.error(e);
    }
}

run() //
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
