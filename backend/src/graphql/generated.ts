
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface VehicleType {
    typeId: number;
    typeName: string;
}

export interface Make {
    makeId: number;
    makeName: string;
    vehicleTypes: VehicleType[];
}

export interface IQuery {
    makes(actualize?: Nullable<boolean>): Make[] | Promise<Make[]>;
}

type Nullable<T> = T | null;
