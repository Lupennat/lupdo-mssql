import { CustomParsers, DateTimeObject, ParserCallback } from 'tedious';
import { toBigInt } from './utils/bindings';

import { TediousDate } from './types';
import {
    formatToDate,
    formatToDateTime,
    formatToDateTime2,
    formatToDateTimeOffset,
    formatToSmallDateTime,
    formatToTime,
    temporalZdtFromDateTimeObject
} from './utils/temporals';

export default {
    BigInt: function (parserCallback: ParserCallback, value: string | null): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(toBigInt(value));
    },
    Bit: function (parserCallback: ParserCallback, value: boolean | null): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(Number(value));
    },
    Float: function (parserCallback: ParserCallback, value: string | null): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(value.toString());
    },
    Real: function (parserCallback: ParserCallback, value: string | null): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(value.toString());
    },
    SmallDateTime: function (parserCallback: ParserCallback, value: DateTimeObject | TediousDate | null): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(
            formatToSmallDateTime(value instanceof Date ? value : temporalZdtFromDateTimeObject('1900', value))
        );
    },
    DateTime: function (parserCallback: ParserCallback, value: DateTimeObject | TediousDate | null): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(formatToDateTime(value instanceof Date ? value : temporalZdtFromDateTimeObject('1900', value)));
    },
    Time: function (parserCallback: ParserCallback, value: DateTimeObject | TediousDate, scale: number): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(
            formatToTime(value instanceof Date ? value : temporalZdtFromDateTimeObject('1900', value), scale)
        );
    },
    Date: function (parserCallback: ParserCallback, value: DateTimeObject | TediousDate | null): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(formatToDate(value instanceof Date ? value : temporalZdtFromDateTimeObject('0001', value)));
    },
    DateTime2: function (
        parserCallback: ParserCallback,
        value: DateTimeObject | TediousDate | null,
        scale: number
    ): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(
            formatToDateTime2(value instanceof Date ? value : temporalZdtFromDateTimeObject('0001', value), scale)
        );
    },
    DateTimeOffset: function (
        parserCallback: ParserCallback,
        value: DateTimeObject | TediousDate,
        scale: number
    ): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(
            formatToDateTimeOffset(value instanceof Date ? value : temporalZdtFromDateTimeObject('0001', value), scale)
        );
    }
} as CustomParsers;
