import { ReleaseAssetUploaderService } from './service/release-asset-uploader.service';

ReleaseAssetUploaderService.run() //
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
