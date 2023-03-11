/**
 * This is a simple script to test the action.
 */

import { ReleaseTagValidatorAction } from './action.release-tag-validator';
import { testBadReleaseTagContext, testGoodReleaseTagContext, testNonReleaseContext } from './test-data';

ReleaseTagValidatorAction.run(testGoodReleaseTagContext);
ReleaseTagValidatorAction.run(testNonReleaseContext);

try {
    ReleaseTagValidatorAction.run(testBadReleaseTagContext);
} catch (e) {
    console.error(e);
}
