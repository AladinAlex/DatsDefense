/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { model_AttackCommand } from './model_AttackCommand';
import type { model_BuildCommand } from './model_BuildCommand';
import type { model_Coordinate } from './model_Coordinate';
export type model_Command = {
    attack?: Array<model_AttackCommand>;
    build?: Array<model_BuildCommand>;
    moveBase?: model_Coordinate;
};

