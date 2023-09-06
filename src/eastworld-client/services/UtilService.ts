/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UtilService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get Action Json Schema
     * @returns string Successful Response
     * @throws ApiError
     */
    public getActionJsonSchema(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/action.json',
        });
    }

}
