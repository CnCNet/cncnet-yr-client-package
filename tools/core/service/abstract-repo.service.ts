import { getOctokit } from '@actions/github';

import { AbstractOptionValues } from 'cncnet-core/class/abstract-option-values.class';

const TAG_REGEX: RegExp = /^refs\/tags\/(yr-\d+.\d+(?:\.\d+){0,1})$/;

export abstract class AbstractRepoService<T extends AbstractOptionValues> {
    protected github?: ReturnType<typeof getOctokit>;

    protected optionValues: T;

    public constructor() {
        this.optionValues = this.getOptionValues();
        if (this.optionValues.token) {
            this.github = getOctokit(this.optionValues.token);
        }
    }

    protected abstract getOptionValues(): T;

    protected isRelease(eventName: string): boolean {
        return eventName === 'release';
    }

    protected getTagName(ref: string): string | null {
        const match = ref.match(TAG_REGEX);
        if (!match || match?.length < 2) {
            return null;
        }

        return match[1];
    }
}
