/**
 * This is a simple script to test the action.
 */

import { ReleaseTagValidatorService } from './service';
import { testBadReleaseTagContext, testGoodReleaseTagContext, testNonReleaseContext } from './test-data';

ReleaseTagValidatorService.run(testGoodReleaseTagContext);
ReleaseTagValidatorService.run(testNonReleaseContext);

try {
    ReleaseTagValidatorService.run(testBadReleaseTagContext);
} catch (e) {
    console.error(e);
}
