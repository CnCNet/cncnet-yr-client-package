import { PublishReleaseService } from './services/publish-release.service';

PublishReleaseService.run() //
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
