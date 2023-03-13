import { GitHub } from '@actions/github/lib/utils';
import { getOctokit } from '@actions/github';
import { AbstractOptionValues } from '../class';

const TAG_REGEX: RegExp = /^refs\/tags\/(yr-\d+.\d+(?:\.\d+){0,1})$/;

export abstract class AbstractRepoService<T extends AbstractOptionValues> {

    protected github: InstanceType<typeof GitHub>;

    protected optionValues: T;

    public constructor() {
        this.optionValues = this.getOptionValues();
        if (this.optionValues.token) {
            // this lib isn't always necessary
            this.github = getOctokit(this.optionValues.token);
        }
    }

    protected abstract getOptionValues(): T;

    protected isRelease(eventName): boolean {
        return eventName === 'release';
    }

    protected getTagName(ref: string): string {
        const match = ref.match(TAG_REGEX);
        if (!match || match?.length < 2)
            return null;
        return match[1];
    }
}
