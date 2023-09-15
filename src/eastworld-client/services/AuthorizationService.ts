/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AuthorizationService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Google Authorize
     * Generate login url and redirect
     * @param clientRedirectUri
     * @returns any Successful Response
     * @throws ApiError
     */
    public googleAuthorize(
        clientRedirectUri?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/google_authorize',
            query: {
                'client_redirect_uri': clientRedirectUri,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Google Callback
     * @returns any Successful Response
     * @throws ApiError
     */
    public googleCallback(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/google_callback',
        });
    }

    /**
     * Github Authorize
     * Generate login url and redirect
     * @param clientRedirectUri
     * @returns any Successful Response
     * @throws ApiError
     */
    public githubAuthorize(
        clientRedirectUri?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/github_authorize',
            query: {
                'client_redirect_uri': clientRedirectUri,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Github Callback
     * @returns any Successful Response
     * @throws ApiError
     */
    public githubCallback(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/github_callback',
        });
    }

    /**
     * Check
     * @returns any Successful Response
     * @throws ApiError
     */
    public check(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/check',
        });
    }

}
