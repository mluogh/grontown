/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class LlmService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Embed
     * @param text
     * @returns number Successful Response
     * @throws ApiError
     */
    public embed(
        text: string,
    ): CancelablePromise<Array<number>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/llm/embed',
            query: {
                'text': text,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Rate
     * @param question
     * @returns number Successful Response
     * @throws ApiError
     */
    public rate(
        question: string,
    ): CancelablePromise<number> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/llm/rate',
            query: {
                'question': question,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
