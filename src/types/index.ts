import { Connection, ConnectionConfig, ConnectionOptions, ISOLATION_LEVEL } from 'tedious-better-data-types';

export type MssqlIsolationLevel = ISOLATION_LEVEL;

export interface MssqlConnectionOptions extends ConnectionOptions {
    /**
     * A boolean determining whether to pass time values using Temporal or Date. (default: false).
     */
    useDateTemporal?: boolean;
}

export interface MssqlOptions extends Omit<ConnectionConfig, 'server'> {
    /**
     * Hostname to connect to.
     * It Accept a list of Hosts of type host:port for random connection
     */
    server?: string | string[] | undefined;

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
