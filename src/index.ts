import { Pdo } from 'lupdo';
import PdoAttributes from 'lupdo/dist/typings/types/pdo-attributes';
import { PoolOptions } from 'lupdo/dist/typings/types/pdo-pool';
import MssqlDriver from './mssql-driver';
import { MssqlOptions } from './types';

Pdo.addDriver('sqlsrv', MssqlDriver);
Pdo.addDriver('mssql', MssqlDriver);

export function createMssqlPdo(options: MssqlOptions, poolOptions?: PoolOptions, attributes?: PdoAttributes): Pdo {
    return new Pdo('mssql', options, poolOptions, attributes);
}

export { default as MssqlDriver } from './mssql-driver';
export * from './types';
