/**
 * This is a simple script to test the action.
 */

import { testPackageContext } from './test-data/';
import { ReleaseAssetUploaderAction } from './action.release-asset-uploader';

ReleaseAssetUploaderAction.run(testPackageContext)
