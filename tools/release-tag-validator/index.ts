import { ReleaseTagValidatorService } from './service/release-tag-validator.service';

ReleaseTagValidatorService.run() //
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
