import { Pdo } from 'lupdo';
import { TYPES } from 'tedious';
import { default as DateTemporal } from './data-types/date-temporal';
import { default as DateTime2Temporal } from './data-types/date-time-2-temporal';
import { default as DateTimeOffsetTemporal } from './data-types/date-time-offset-temporal';
import { default as DateTimeTemporal } from './data-types/date-time-temporal';
import { default as SmallDateTimeTemporal } from './data-types/small-date-time-temporal';
import { default as TimeTemporal } from './data-types/time-temporal';
import MssqlDriver from './mssql-driver';

TYPES.DateTemporal = DateTemporal;
TYPES.DateTime2Temporal = DateTime2Temporal;
TYPES.DateTimeOffsetTemporal = DateTimeOffsetTemporal;
TYPES.DateTimeTemporal = DateTimeTemporal;
TYPES.SmallDateTimeTemporal = SmallDateTimeTemporal;
TYPES.TimeTemporal = TimeTemporal;

Pdo.addDriver('sqlsrv', MssqlDriver);
Pdo.addDriver('mssql', MssqlDriver);

export { default as MssqlDriver } from './mssql-driver';
export * from './types';
