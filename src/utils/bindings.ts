import {
    PARAM_BIGINT,
    PARAM_BINARY,
    PARAM_BOOLEAN,
    PARAM_CHAR,
    PARAM_DATE,
    PARAM_DATETIME,
    PARAM_DATETIMEZONE,
    PARAM_DECIMAL,
    PARAM_FLOAT,
    PARAM_GEOMETRY,
    PARAM_INTEGER,
    PARAM_NUMERIC,
    PARAM_TEXT,
    PARAM_TIME,
    PARAM_TIMESTAMP,
    PARAM_VARBINARY,
    PARAM_VARCHAR
} from 'lupdo';
import { ObjectParams, Params, ValidBindingsPrimitive } from 'lupdo/dist/typings/types/pdo-prepared-statement';
import { TYPES, TediousType } from 'tedious';
import { MSSQL_PARAM_SMALLDATETIME } from '../constants';

export function sqlQuestionMarkToNumericAtP(sql: string): string {
    let questionCount = 0;
    return sql.replace(/\\?\?/g, match => {
        if (match === '\\?') {
            return '?';
        }

        questionCount += 1;
        return `@p${questionCount}`;
    });
}

export function sqlColumnBindingsToAtP(sql: string, bindings: ObjectParams): string {
    const sortedKeys = Object.keys(bindings).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
        sql = sql.replace(':' + key, '@' + key);
    }

    return sql;
}

export function convertBindingsToDictionary(bindings: Params): ObjectParams {
    if (Array.isArray(bindings)) {
        const obj: ObjectParams = {};
        for (let x = 0; x < bindings.length; x++) {
            obj[`p${x + 1}`] = bindings[x];
        }
        return obj;
    }
    return bindings;
}

export function toBigInt(value: string): bigint | number {
    const bigint = BigInt(value);
    if (bigint > Number.MAX_SAFE_INTEGER || bigint < Number.MIN_SAFE_INTEGER) {
        return bigint;
    }
    return Number(value);
}

export function castBinding(value: ValidBindingsPrimitive): ValidBindingsPrimitive {
    if (typeof value === 'bigint') {
        value = value.toString();
    }

    if (typeof value === 'boolean') {
        value = Number(value);
    }

    return value;
}

export function getTediousTypeFromPdoType(
    type: string,
    value: ValidBindingsPrimitive,
    useTemporalDate: boolean
): TediousType | null {
    switch (type) {
        case PARAM_BINARY:
            return TYPES.Binary;
        case PARAM_BOOLEAN:
            return TYPES.Bit;
        case PARAM_CHAR:
            return TYPES.NChar;
        case PARAM_DATE:
            return useTemporalDate ? TYPES.DateTemporal : TYPES.Date;
        case MSSQL_PARAM_SMALLDATETIME:
            return useTemporalDate ? TYPES.SmallDateTimeTemporal : TYPES.SmallDateTime;
        case PARAM_DATETIME:
            return useTemporalDate ? TYPES.DateTimeTemporal : TYPES.DateTime;
        case PARAM_TIMESTAMP:
            return useTemporalDate ? TYPES.DateTime2Temporal : TYPES.DateTime2;
        case PARAM_DATETIMEZONE:
            return useTemporalDate ? TYPES.DateTimeOffsetTemporal : TYPES.DateTimeOffset;
        case PARAM_TEXT:
            return TYPES.NText;
        case PARAM_DECIMAL:
            if (
                (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') &&
                (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER)
            ) {
                return TYPES.NVarChar;
            }
            return TYPES.Decimal;
        case PARAM_FLOAT:
            return TYPES.Float;
        case PARAM_INTEGER:
            return TYPES.Int;
        case PARAM_NUMERIC:
            if (
                (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') &&
                (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER)
            ) {
                return TYPES.NVarChar;
            }
            return TYPES.Numeric;
        case PARAM_TIME:
            return useTemporalDate ? TYPES.TimeTemporal : TYPES.Time;
        case PARAM_VARBINARY:
            return TYPES.VarBinary;
        case PARAM_BIGINT:
        case PARAM_VARCHAR:
        case PARAM_GEOMETRY:
            return TYPES.NVarChar;
        default:
            return null;
    }
}

export function getTediousTypeFromValue(value: ValidBindingsPrimitive, useTemporalDate: boolean): TediousType {
    switch (typeof value) {
        case 'boolean':
            return TYPES.Bit;
        case 'bigint': {
            if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
                return TYPES.NVarChar;
            }
            return getTediousTypeFromValue(Number(value), useTemporalDate);
        }
        case 'number': {
            if (Number.isInteger(value)) {
                if (value >= -2147483648 && value <= 2147483647) {
                    return TYPES.Int;
                }
                if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
                    return TYPES.NVarChar;
                }
                return TYPES.BigInt;
            }

            return TYPES.Numeric;
        }
        default: {
            if (value instanceof Date) {
                return useTemporalDate ? TYPES.DateTimeTemporal : TYPES.DateTime;
            }

            if (value instanceof Buffer) {
                return TYPES.VarBinary;
            }

            return TYPES.NVarChar;
        }
    }
}

export function getTediousType(value: ValidBindingsPrimitive, useTemporalDate: boolean, type?: string): TediousType {
    let tediousType = null;
    if (type != null) {
        tediousType = getTediousTypeFromPdoType(type, value, useTemporalDate);
    }
    return tediousType !== null ? tediousType : getTediousTypeFromValue(value, useTemporalDate);
}
