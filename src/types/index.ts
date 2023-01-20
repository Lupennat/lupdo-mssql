import { Connection, ConnectionConfig, ConnectionOptions } from 'tedious-better-data-types';

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

export interface MssqlPoolConnection extends Connection {
    __lupdo_uuid: string;
    __lupdo_killed: boolean;
    __lupdo_sql_server_connected: boolean;
    __lupdo_sql_server_before: undefined | string[];
}
