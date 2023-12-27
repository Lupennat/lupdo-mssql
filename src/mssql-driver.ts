import { ATTR_DEBUG, DEBUG_ENABLED, PdoConnectionI, PdoDriver, PdoRawConnectionI } from 'lupdo';
import PdoAttributes from 'lupdo/dist/typings/types/pdo-attributes';
import { PoolOptions } from 'lupdo/dist/typings/types/pdo-pool';
import { Connection, ConnectionConfig } from 'tedious-better-data-types';
import { MSSQL_DATE_BINDING, MSSQL_DATE_BINDING_TEMPORAL } from './constants';
import MssqlConnection from './mssql-connection';
import mssqlParser from './mssql-parser';
import MssqlRawConnection from './mssql-raw-connection';
import MssqlRequest from './mssql-request';
import { MssqlOptions, MssqlPoolConnection } from './types';

class MssqlDriver extends PdoDriver {
    protected driverAttributes: PdoAttributes = {
        [MSSQL_DATE_BINDING]: MSSQL_DATE_BINDING_TEMPORAL
    };

    constructor(driver: string, protected options: MssqlOptions, poolOptions: PoolOptions, attributes: PdoAttributes) {
        super(driver, poolOptions, attributes);
    }

    protected async createConnection(unsecure = false): Promise<MssqlPoolConnection> {
        const debugMode = this.getAttribute(ATTR_DEBUG) as number;
        const connection = this.generateTediousConnection(
            this.generateTediousOptions({ ...this.options }, unsecure, debugMode)
        );
        return new Promise((resolve, reject) => {
            if (!unsecure && debugMode === DEBUG_ENABLED) {
                connection.on('debug', function (message: string) {
                    console.log(message);
                });
            }

            connection.on('connect', function (err) {
                if (err) {
                    reject(err);
                } else {
                    if (!unsecure) {
                        connection.__lupdo_sql_server_connected = true;
                    }
                    resolve(connection);
                }
            });

            connection.connect();
        });
    }

    protected generateTediousOptions(tediousOptions: MssqlOptions, unsecure: boolean, debugMode: number): MssqlOptions {
        if (tediousOptions.options == null) {
            tediousOptions.options = {};
        }

        if (!unsecure) {
            if (debugMode === DEBUG_ENABLED) {
                tediousOptions.options.debug = {
                    packet: true,
                    token: true,
                    data: true,
                    payload: true
                };
            }

            tediousOptions.options.debug = undefined;
            tediousOptions.options.rowCollectionOnDone = false;
            tediousOptions.options.rowCollectionOnRequestCompletion = false;
            tediousOptions.options.abortTransactionOnError = false;
            tediousOptions.options.useColumnNames = false;
            tediousOptions.options.useUTC = false;
            tediousOptions.options.camelCaseColumns = false;
            tediousOptions.options.debug = {};
            tediousOptions.options.enableConcatNullYieldsNull = true;
            tediousOptions.options.enableCursorCloseOnCommit = false;
            tediousOptions.options.enableImplicitTransactions = false;
            tediousOptions.options.enableNumericRoundabort = false;
            tediousOptions.options.enableQuotedIdentifier = true;
            // new config after patch tedious
            tediousOptions.options.useDateTemporal =
                'useDateTemporal' in tediousOptions.options ? tediousOptions.options.useDateTemporal : true;
            tediousOptions.options.columnNameReplacer = undefined;
            tediousOptions.options.returnDecimalAndNumericAsString = true;
            tediousOptions.options.returnMoneyAsString = true;
            tediousOptions.options.returnDateTimeAsObject = true;
            tediousOptions.options.customParsers = mssqlParser;
        }

        if (Array.isArray(tediousOptions.server)) {
            const exploded = tediousOptions.server[Math.floor(Math.random() * tediousOptions.server.length)].split(':');
            tediousOptions.options.port = Number(exploded.pop() as string);
            tediousOptions.server = exploded.join(':');
        }

        return tediousOptions;
    }

    protected generateTediousConnection(tediousOptions: MssqlOptions): MssqlPoolConnection {
        const connection = new Connection(tediousOptions as ConnectionConfig) as MssqlPoolConnection;
        connection.__lupdo_sql_server_connected = false;

        return connection;
    }

    protected createPdoConnection(connection: MssqlPoolConnection): PdoConnectionI {
        return new MssqlConnection(connection);
    }

    protected async closeConnection(connection: MssqlPoolConnection): Promise<void> {
        return new Promise(resolve => {
            connection.once('end', () => {
                connection.__lupdo_sql_server_connected = false;
                connection.removeAllListeners();
                resolve();
            });
            connection.close();
        });
    }

    protected async destroyConnection(connection: MssqlPoolConnection): Promise<void> {
        return new Promise(async resolve => {
            // @ts-expect-error request not exposed
            if (connection.request != null) {
                const cancelled = (): void => {
                    // @ts-expect-error request not exposed
                    connection.request.removeListener('cancel', cancelled);
                    connection.once('end', () => {
                        connection.__lupdo_sql_server_connected = false;
                        connection.removeAllListeners();
                        resolve();
                    });
                    connection.close();
                };
                // @ts-expect-error request not exposed
                connection.request.on('cancel', cancelled);
                await connection.cancel();
            }
        });
    }

    protected validateRawConnection(connection: MssqlPoolConnection): boolean {
        return connection && connection.__lupdo_sql_server_connected;
    }

    public getRawConnection(): PdoRawConnectionI {
        return new MssqlRawConnection(this.pool);
    }

    protected async getVersionFromConnection(connection: MssqlPoolConnection): Promise<string> {
        const request = new MssqlRequest(connection, 'SELECT @@version as version');
        const res = await request.execute();
        return res[2][0][0][0].value.split('\n')[0];
    }
}

export default MssqlDriver;
