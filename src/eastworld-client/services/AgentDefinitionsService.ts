/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AgentDef } from '../models/AgentDef';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AgentDefinitionsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create Agent Def
     * @param gameUuid
     * @param agentName
     * @returns AgentDef Successful Response
     * @throws ApiError
     */
    public createAgent(
        gameUuid: string,
        agentName: string,
    ): CancelablePromise<AgentDef> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/game/{game_uuid}/agent/create',
            path: {
                'game_uuid': gameUuid,
            },
            query: {
                'agent_name': agentName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Games List
     * @param gameUuid
     * @returns AgentDef Successful Response
     * @throws ApiError
     */
    public listAgents(
        gameUuid: string,
    ): CancelablePromise<Array<AgentDef>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/game/{game_uuid}/agent/list',
            path: {
                'game_uuid': gameUuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Agent Def
     * @param gameUuid
     * @param agentUuid
     * @returns AgentDef Successful Response
     * @throws ApiError
     */
    public getAgent(
        gameUuid: string,
        agentUuid: string,
    ): CancelablePromise<AgentDef> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/game/{game_uuid}/agent/{agent_uuid}',
            path: {
                'game_uuid': gameUuid,
                'agent_uuid': agentUuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Agent Def
     * @param gameUuid
     * @param agentUuid
     * @param requestBody
     * @returns AgentDef Successful Response
     * @throws ApiError
     */
    public updateAgent(
        gameUuid: string,
        agentUuid: string,
        requestBody: AgentDef,
    ): CancelablePromise<AgentDef> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/game/{game_uuid}/agent/{agent_uuid}',
            path: {
                'game_uuid': gameUuid,
                'agent_uuid': agentUuid,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Agent Def
     * @param gameUuid
     * @param agentUuid
     * @returns any Successful Response
     * @throws ApiError
     */
    public deleteAgent(
        gameUuid: string,
        agentUuid: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/game/{game_uuid}/agent/{agent_uuid}',
            path: {
                'game_uuid': gameUuid,
                'agent_uuid': agentUuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
