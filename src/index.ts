import { Pdo } from 'lupdo';
import MssqlDriver from './mssql-driver';

Pdo.addDriver('sqlsrv', MssqlDriver);
Pdo.addDriver('mssql', MssqlDriver);

export { default as MssqlDriver } from './mssql-driver';
export * from './types';
