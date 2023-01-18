import { Temporal } from '@js-temporal/polyfill';
import { Connection, ConnectionConfig, ConnectionOptions } from 'tedious';

export interface MssqlConnectionOptions extends ConnectionOptions {
    /**
     * A boolean determining whether to pass time values using Temporal or Date. (default: false).
     */
    useDateTemporal?: boolean;
}

export interface MssqlOptions extends ConnectionConfig {
    /**
     * Further options
     */
    options?: MssqlConnectionOptions | undefined;
}

export interface TemporalDateObject {
    year: number;
    month: number;
    day: number;
}

export interface TemporalTimeObject {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    microsecond: number;
    nanosecond: number;
}

export interface TemporalObject extends TemporalDateObject, TemporalTimeObject {
    // timezone offset nanoseconds
    offsetNanoseconds: number;
}

export interface MssqlPoolConnection extends Connection {
    __lupdo_uuid: string;
    __lupdo_killed: boolean;
    __lupdo_sql_server_connected: boolean;
    __lupdo_sql_server_before: undefined | string[];
}

export interface TediousDate extends Date {
    nanosecondsDelta?: number;
}

export interface TediousTemporalParameter {
    value: null | TemporalBinding;
}

export interface TediousTemporalScalableParameter extends TediousTemporalParameter {
    scale: number;
}

export interface TemporalBinding {
    timezone: string;
    instant: Temporal.Instant;
}
