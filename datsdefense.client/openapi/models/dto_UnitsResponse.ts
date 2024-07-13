/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { dto_BlockResponse } from './dto_BlockResponse';
import type { dto_EnemyBaseResponse } from './dto_EnemyBaseResponse';
import type { dto_PlayerResponse } from './dto_PlayerResponse';
import type { dto_ZombieResponse } from './dto_ZombieResponse';
export type dto_UnitsResponse = {
    base?: Array<dto_BlockResponse>;
    enemyBlocks?: Array<dto_EnemyBaseResponse>;
    player?: dto_PlayerResponse;
    realmName?: string;
    turn?: number;
    turnEndsInMs?: number;
    zombies?: Array<dto_ZombieResponse>;
};

