import { Context } from '@actions/github/lib/context';
import { DefaultOptionValues } from '@cncnet-core/class';
import { AbstractRepoService } from '@cncnet-core/service';

/**
 * This action is meant to be run with the github-script action:
 * https://github.com/actions/github-script
 */
export class ReleaseTagValidatorService extends AbstractRepoService<DefaultOptionValues> {
    private run(context: Context): void {
        console.log(`Running ReleaseTagValidatorAction`)
        if (!super.isRelease(context.eventName)) {
            console.log('Not a release')
            return;
        }

        console.log('This is a published release. Validating tag name format.')

        // This workflow was triggered by a published release. We need to validate that the tag 
        // was created with the proper format for auto versioning. (GitVersion)
        const tagName = super.getTagName(context.ref);
        if (!!tagName) {
            console.log(`Valid tag name: ${tagName}`)
            return;
        }

        throw `Invalid tag specified: ${context.ref}. Must be in the format 'yr-0.0' or 'yr-0.0.0'.`
    }

    public static run(context?: Context | any): void {
        new ReleaseTagValidatorService().run(context || new Context());
    }

    protected getOptionValues(): DefaultOptionValues {
        return new DefaultOptionValues();
    }
}
