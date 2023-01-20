import { DateTimeObject, DateWithNanosecondsDelta } from 'tedious-better-data-types';
import { toBigInt } from './utils/bindings';

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
    BigInt: function (parserCallback: (value: unknown) => void, value: string | null): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(toBigInt(value));
    },
    Bit: function (parserCallback: (value: unknown) => void, value: boolean | null): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(Number(value));
    },
    Float: function (parserCallback: (value: unknown) => void, value: string | null): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(value.toString());
    },
    Real: function (parserCallback: (value: unknown) => void, value: string | null): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(value.toString());
    },
    SmallDateTime: function (
        parserCallback: (value: unknown) => void,
        value: DateTimeObject | DateWithNanosecondsDelta | null
    ): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(formatToSmallDateTime(value instanceof Date ? value : temporalZdtFromDateTimeObject(value)));
    },
    DateTime: function (
        parserCallback: (value: unknown) => void,
        value: DateTimeObject | DateWithNanosecondsDelta | null
    ): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(formatToDateTime(value instanceof Date ? value : temporalZdtFromDateTimeObject(value)));
    },
    Time: function (
        parserCallback: (value: unknown) => void,
        value: DateTimeObject | DateWithNanosecondsDelta | null,
        scale: number
    ): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(formatToTime(value instanceof Date ? value : temporalZdtFromDateTimeObject(value), scale));
    },
    Date: function (
        parserCallback: (value: unknown) => void,
        value: DateTimeObject | DateWithNanosecondsDelta | null
    ): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(formatToDate(value instanceof Date ? value : temporalZdtFromDateTimeObject(value)));
    },
    DateTime2: function (
        parserCallback: (value: unknown) => void,
        value: DateTimeObject | DateWithNanosecondsDelta | null,
        scale: number
    ): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(formatToDateTime2(value instanceof Date ? value : temporalZdtFromDateTimeObject(value), scale));
    },
    DateTimeOffset: function (
        parserCallback: (value: unknown) => void,
        value: DateTimeObject | DateWithNanosecondsDelta | null,
        scale: number
    ): void {
        if (value === null) {
            return parserCallback(null);
        }
        parserCallback(
            formatToDateTimeOffset(value instanceof Date ? value : temporalZdtFromDateTimeObject(value), scale)
        );
    }
};
