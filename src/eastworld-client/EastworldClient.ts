/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { AgentDefinitionsService } from './services/AgentDefinitionsService';
import { AuthorizationService } from './services/AuthorizationService';
import { GameDefinitionsService } from './services/GameDefinitionsService';
import { GameSessionsService } from './services/GameSessionsService';
import { LlmService } from './services/LlmService';
import { UtilService } from './services/UtilService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class EastworldClient {

    public readonly agentDefinitions: AgentDefinitionsService;
    public readonly authorization: AuthorizationService;
    public readonly gameDefinitions: GameDefinitionsService;
    public readonly gameSessions: GameSessionsService;
    public readonly llm: LlmService;
    public readonly util: UtilService;

    public readonly request: BaseHttpRequest;

    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '0.0.1',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });

        this.agentDefinitions = new AgentDefinitionsService(this.request);
        this.authorization = new AuthorizationService(this.request);
        this.gameDefinitions = new GameDefinitionsService(this.request);
        this.gameSessions = new GameSessionsService(this.request);
        this.llm = new LlmService(this.request);
        this.util = new UtilService(this.request);
    }
}

