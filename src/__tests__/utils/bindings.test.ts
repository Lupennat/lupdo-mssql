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
import { TediousType } from 'tedious';
import { MSSQL_PARAM_SMALLDATETIME } from '../../constants';
import {
    castBinding,
    convertBindingsToDictionary,
    getTediousType,
    getTediousTypeFromPdoType,
    getTediousTypeFromValue,
    sqlColumnBindingsToAtP,
    sqlQuestionMarkToNumericAtP,
    toBigInt
} from '../../utils/bindings';

describe('Utils Bindings', () => {
    it('Works Sql Question Mark To Numeric At P', () => {
        expect(sqlQuestionMarkToNumericAtP('SELECT ?,?,?,?')).toBe('SELECT @p1,@p2,@p3,@p4');
        expect(sqlQuestionMarkToNumericAtP('SELECT \\?')).toBe('SELECT ?');
    });

    it('Works Sql Column Bindings To At P', () => {
        expect(sqlColumnBindingsToAtP('SELECT :li,:limit,:test', { li: 1, limit: 2, test: 3 })).toBe(
            'SELECT @li,@limit,@test'
        );
        expect(sqlColumnBindingsToAtP('SELECT :li,:limit, ":test"', { li: 1, limit: 2 })).toBe(
            'SELECT @li,@limit, ":test"'
        );
    });

    it('Works Convert Bindings To Dictionary', () => {
        expect(convertBindingsToDictionary(['a', 'b', 'c', 1])).toEqual({
            p1: 'a',
            p2: 'b',
            p3: 'c',
            p4: 1
        });
        expect(convertBindingsToDictionary({ a: 'a', b: 'b', c: 'c', number: 1 })).toEqual({
            a: 'a',
            b: 'b',
            c: 'c',
            number: 1
        });
    });

    it('Works To BigInt', () => {
        expect(toBigInt('9007199254740991')).toBe(9007199254740991);
        expect(toBigInt('-9007199254740991')).toBe(-9007199254740991);
        expect(toBigInt('9007199254740992')).toEqual(BigInt('9007199254740992'));
        expect(toBigInt('-9007199254740992')).toEqual(BigInt('-9007199254740992'));
    });

    it('Works Cast Binding', () => {
        expect(castBinding(BigInt('9007199254740992'))).toBe('9007199254740992');
        expect(castBinding('2023-01-01 23:59:59.999999999Z')).toBe('2023-01-01 23:59:59.999999999Z');
    });

    it('Works Get TediousType From Pdo Type', () => {
        expect((getTediousTypeFromPdoType(MSSQL_PARAM_SMALLDATETIME, null, false) as TediousType).name).toBe(
            'SmallDateTime'
        );
        expect((getTediousTypeFromPdoType(MSSQL_PARAM_SMALLDATETIME, null, true) as TediousType).name).toBe(
            'SmallDateTimeTemporal'
        );
        expect((getTediousTypeFromPdoType(PARAM_BIGINT, null, false) as TediousType).name).toBe('NVarChar');
        expect((getTediousTypeFromPdoType(PARAM_INTEGER, null, false) as TediousType).name).toBe('Int');
        expect((getTediousTypeFromPdoType(PARAM_DECIMAL, null, false) as TediousType).name).toBe('Decimal');
        expect((getTediousTypeFromPdoType(PARAM_NUMERIC, null, false) as TediousType).name).toBe('Numeric');
        expect((getTediousTypeFromPdoType(PARAM_FLOAT, null, false) as TediousType).name).toBe('Float');
        expect((getTediousTypeFromPdoType(PARAM_BOOLEAN, null, false) as TediousType).name).toBe('Bit');
        expect((getTediousTypeFromPdoType(PARAM_TEXT, null, false) as TediousType).name).toBe('NText');
        expect((getTediousTypeFromPdoType(PARAM_CHAR, null, false) as TediousType).name).toBe('NChar');
        expect((getTediousTypeFromPdoType(PARAM_VARCHAR, null, false) as TediousType).name).toBe('NVarChar');
        expect((getTediousTypeFromPdoType(PARAM_GEOMETRY, null, false) as TediousType).name).toBe('NVarChar');
        expect((getTediousTypeFromPdoType(PARAM_DATE, null, false) as TediousType).name).toBe('Date');
        expect((getTediousTypeFromPdoType(PARAM_DATETIME, null, false) as TediousType).name).toBe('DateTime');
        expect((getTediousTypeFromPdoType(PARAM_TIMESTAMP, null, false) as TediousType).name).toBe('DateTime2');
        expect((getTediousTypeFromPdoType(PARAM_DATETIMEZONE, null, false) as TediousType).name).toBe('DateTimeOffset');
        expect((getTediousTypeFromPdoType(PARAM_TIME, null, false) as TediousType).name).toBe('Time');
        expect((getTediousTypeFromPdoType(PARAM_DATE, null, true) as TediousType).name).toBe('DateTemporal');
        expect((getTediousTypeFromPdoType(PARAM_DATETIME, null, true) as TediousType).name).toBe('DateTimeTemporal');
        expect((getTediousTypeFromPdoType(PARAM_TIMESTAMP, null, true) as TediousType).name).toBe('DateTime2Temporal');
        expect((getTediousTypeFromPdoType(PARAM_DATETIMEZONE, null, true) as TediousType).name).toBe(
            'DateTimeOffsetTemporal'
        );
        expect((getTediousTypeFromPdoType(PARAM_TIME, null, true) as TediousType).name).toBe('TimeTemporal');
        expect((getTediousTypeFromPdoType(PARAM_BINARY, null, false) as TediousType).name).toBe('Binary');
        expect((getTediousTypeFromPdoType(PARAM_VARBINARY, null, false) as TediousType).name).toBe('VarBinary');

        // bigint numeric and decimal
        expect((getTediousTypeFromPdoType(PARAM_DECIMAL, '-9007199254740992.232312', false) as TediousType).name).toBe(
            'NVarChar'
        );
        expect(
            (getTediousTypeFromPdoType(PARAM_DECIMAL, parseFloat('9007199254740992.232312'), false) as TediousType).name
        ).toBe('NVarChar');
        expect((getTediousTypeFromPdoType(PARAM_DECIMAL, BigInt('9007199254740992'), false) as TediousType).name).toBe(
            'NVarChar'
        );
        expect((getTediousTypeFromPdoType(PARAM_NUMERIC, '-9007199254740992.232312', false) as TediousType).name).toBe(
            'NVarChar'
        );
        expect(
            (getTediousTypeFromPdoType(PARAM_NUMERIC, parseFloat('9007199254740992.232312'), false) as TediousType).name
        ).toBe('NVarChar');
        expect((getTediousTypeFromPdoType(PARAM_NUMERIC, BigInt('9007199254740992'), false) as TediousType).name).toBe(
            'NVarChar'
        );
    });

    it('Works Get TediousType From Value', () => {
        expect(getTediousTypeFromValue(null, false).name).toBe('NVarChar');
        expect(getTediousTypeFromValue(true, false).name).toBe('Bit');
        expect(getTediousTypeFromValue('string', false).name).toBe('NVarChar');
        expect(getTediousTypeFromValue(2147483647, false).name).toBe('Int');
        expect(getTediousTypeFromValue(-2147483648, false).name).toBe('Int');
        expect(getTediousTypeFromValue(2147483648, false).name).toBe('BigInt');
        expect(getTediousTypeFromValue(-2147483649, false).name).toBe('BigInt');
        expect(getTediousTypeFromValue(10.25, false).name).toBe('Numeric');
        expect(getTediousTypeFromValue(parseFloat('9007199254740992.232312'), false).name).toBe('NVarChar');
        expect(getTediousTypeFromValue(BigInt(2147483647), false).name).toBe('Int');
        expect(getTediousTypeFromValue(BigInt(-2147483648), false).name).toBe('Int');
        expect(getTediousTypeFromValue(BigInt(2147483648), false).name).toBe('BigInt');
        expect(getTediousTypeFromValue(BigInt(-2147483649), false).name).toBe('BigInt');
        expect(getTediousTypeFromValue(BigInt('9007199254740992'), false).name).toBe('NVarChar');
        expect(getTediousTypeFromValue(new Date(), false).name).toBe('DateTime');
        expect(getTediousTypeFromValue(new Date(), true).name).toBe('DateTimeTemporal');
        expect(getTediousTypeFromValue(Buffer.from('buffer'), false).name).toBe('VarBinary');
    });

    it('Works Get TediousType', () => {
        expect(getTediousType(true, false).name).toBe('Bit');
        expect(getTediousType(true, false, PARAM_DATE).name).toBe('Date');
        expect(getTediousType(true, true, PARAM_DATE).name).toBe('DateTemporal');
        expect(getTediousType(true, false, 'PARAM_TYPE_NOT_EXISTS').name).toBe('Bit');
    });
});
