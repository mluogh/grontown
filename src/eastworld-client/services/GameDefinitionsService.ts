/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GameDef } from '../models/GameDef';
import type { GameDefSummary } from '../models/GameDefSummary';
import type { Lore } from '../models/Lore';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class GameDefinitionsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create Game Def
     * @param gameName
     * @param password
     * @returns GameDef Successful Response
     * @throws ApiError
     */
    public createGame(
        gameName: string,
        password?: string,
    ): CancelablePromise<GameDef> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/game/create',
            headers: {
                'password': password,
            },
            query: {
                'game_name': gameName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Games List
     * @returns GameDefSummary Successful Response
     * @throws ApiError
     */
    public listGames(): CancelablePromise<Array<GameDefSummary>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/game/list',
        });
    }

    /**
     * Get Game Def
     * @param uuid
     * @returns GameDef Successful Response
     * @throws ApiError
     */
    public getGame(
        uuid: string,
    ): CancelablePromise<GameDef> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/game/{uuid}',
            path: {
                'uuid': uuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Game Def
     * @param uuid
     * @param password
     * @returns any Successful Response
     * @throws ApiError
     */
    public deleteGame(
        uuid: string,
        password?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/game/{uuid}',
            path: {
                'uuid': uuid,
            },
            headers: {
                'password': password,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Game Lore
     * @param uuid
     * @returns Lore Successful Response
     * @throws ApiError
     */
    public getLore(
        uuid: string,
    ): CancelablePromise<Array<Lore>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/game/{uuid}/lore',
            path: {
                'uuid': uuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Game Def Json
     * @param uuid
     * @returns any Successful Response
     * @throws ApiError
     */
    public getGameJson(
        uuid: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/game/{uuid}/json',
            path: {
                'uuid': uuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Game Def Json
     * @param jsonedGame
     * @param password
     * @returns any Successful Response
     * @throws ApiError
     */
    public createGameJson(
        jsonedGame: string,
        password?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/game/json',
            headers: {
                'password': password,
            },
            query: {
                'jsoned_game': jsonedGame,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Game Def
     * @param uuid
     * @param requestBody
     * @param overwriteAgents
     * @param password
     * @returns GameDef Successful Response
     * @throws ApiError
     */
    public updateGame(
        uuid: string,
        requestBody: GameDef,
        overwriteAgents: boolean = false,
        password?: string,
    ): CancelablePromise<GameDef> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/game/{uuid}/update',
            path: {
                'uuid': uuid,
            },
            headers: {
                'password': password,
            },
            query: {
                'overwrite_agents': overwriteAgents,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
