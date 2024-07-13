/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { dto_MapResponse } from '../models/dto_MapResponse';
import type { dto_ParticipateResponse } from '../models/dto_ParticipateResponse';
import type { dto_RoundList } from '../models/dto_RoundList';
import type { dto_UnitsResponse } from '../models/dto_UnitsResponse';
import type { dto_ValidationErrors } from '../models/dto_ValidationErrors';
import type { model_Command } from '../models/model_Command';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlayService {
    /**
     * commands to build and attack, should be sent only once per turn
     * @param requestBody build and attack commands
     * @returns dto_ValidationErrors OK
     * @throws ApiError
     */
    public static postPlayZombidefCommand(
        requestBody: model_Command,
    ): CancelablePromise<dto_ValidationErrors> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/play/zombidef/command',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                429: `Too Many Requests`,
            },
        });
    }
    /**
     * you MUST send this request in lobby time to participate in the game (once per round)
     * @returns dto_ParticipateResponse OK
     * @throws ApiError
     */
    public static putPlayZombidefParticipate(): CancelablePromise<dto_ParticipateResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/play/zombidef/participate',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                429: `Too Many Requests`,
            },
        });
    }
    /**
     * world parts around player that are changing during the game (zombies, players, current player, etc...)
     * @returns dto_UnitsResponse OK
     * @throws ApiError
     */
    public static getPlayZombidefUnits(): CancelablePromise<dto_UnitsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/play/zombidef/units',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                429: `Too Many Requests`,
            },
        });
    }
    /**
     * world parts around player that are not changing during the game (zombie zpots)
     * @returns dto_MapResponse OK
     * @throws ApiError
     */
    public static getPlayZombidefWorld(): CancelablePromise<dto_MapResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/play/zombidef/world',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                429: `Too Many Requests`,
            },
        });
    }
    /**
     * game rounds
     * @returns dto_RoundList OK
     * @throws ApiError
     */
    public static getRoundsZombidef(): CancelablePromise<dto_RoundList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rounds/zombidef',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
}
