import { Temporal } from '@js-temporal/polyfill';
import { TediousDate } from '../../types';

import {
    TemporalTypeCheck,
    formatToDate,
    formatToDateTime,
    formatToDateTime2,
    formatToDateTimeOffset,
    formatToSmallDateTime,
    formatToTime,
    getDaysSince1900DayOneFromTemporalZdt,
    getDaysSinceYearOneDayOneFromTemporalZdt,
    getSqlServerMinutesFromTemporalZdt,
    getSqlServerThreeHundredthsOfSecondFromTemporalZdt,
    getSqlServerTimeFromTemporalZdt,
    getTemporalDurationFromTemporalZdt,
    nanoSecondsOffsetToTimezone,
    stringToTemporalObject,
    temporalBindingFromTediousDate,
    temporalBindingFromTemporalObject,
    temporalZdtFromDateTimeObject,
    timeZoneToTemporalOffsetNanoseconds,
    valueToTemporalBinding
} from '../../utils/temporals';

describe('Temporal Utils', () => {
    it('Works Get Temporal Duration From Temporal Zdt', () => {
        const duration = getTemporalDurationFromTemporalZdt(
            Temporal.Instant.from('2023-01-01 12:34:56.123456789+00:00').toZonedDateTimeISO('+00:00')
        );
        expect(duration.hours).toBe(12);
        expect(duration.minutes).toBe(34);
        expect(duration.seconds).toBe(56);
        expect(duration.milliseconds).toBe(123);
        expect(duration.microseconds).toBe(456);
        expect(duration.nanoseconds).toBe(789);
    });

    it('Works Get Days Since Year One Day One From Temporal Zdt', () => {
        let days = getDaysSinceYearOneDayOneFromTemporalZdt(
            Temporal.Instant.from('0001-01-01 01:59:59.999999999+02:00').toZonedDateTimeISO('+02:00')
        );
        expect(days).toBe(0);
        days = getDaysSinceYearOneDayOneFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 00:00:00.000000000+02:00').toZonedDateTimeISO('+02:00')
        );
        expect(days).toBe(1);
        days = getDaysSinceYearOneDayOneFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 00:00:00.000000000+00:00').toZonedDateTimeISO('+02:00')
        );
        expect(days).toBe(1);
        days = getDaysSinceYearOneDayOneFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 00:00:00.000000000+00:00').toZonedDateTimeISO('+00:00')
        );
        expect(days).toBe(1);
        days = getDaysSinceYearOneDayOneFromTemporalZdt(
            Temporal.Instant.from('0001-01-01 23:59:59.999999999-01:00').toZonedDateTimeISO('+00:00')
        );
        expect(days).toBe(1);
    });

    it('Works Get Days Since 1900 Day One From Temporal Zdt', () => {
        let days = getDaysSince1900DayOneFromTemporalZdt(
            Temporal.Instant.from('1900-01-01 01:59:59.999999999+02:00').toZonedDateTimeISO('+02:00')
        );
        expect(days).toBe(0);
        days = getDaysSince1900DayOneFromTemporalZdt(
            Temporal.Instant.from('1900-01-02 00:00:00.000000000+02:00').toZonedDateTimeISO('+02:00')
        );
        expect(days).toBe(1);
        days = getDaysSince1900DayOneFromTemporalZdt(
            Temporal.Instant.from('1900-01-02 00:00:00.000000000+00:00').toZonedDateTimeISO('+02:00')
        );
        expect(days).toBe(1);
        days = getDaysSince1900DayOneFromTemporalZdt(
            Temporal.Instant.from('1900-01-02 00:00:00.000000000+00:00').toZonedDateTimeISO('+00:00')
        );
        expect(days).toBe(1);
        days = getDaysSince1900DayOneFromTemporalZdt(
            Temporal.Instant.from('1900-01-01 23:59:59.999999999-01:00').toZonedDateTimeISO('+00:00')
        );
        expect(days).toBe(1);

        days = getDaysSince1900DayOneFromTemporalZdt(
            Temporal.Instant.from('1753-01-01 00:00:00.000000000+00:00').toZonedDateTimeISO('+00:00')
        );
        expect(days).toBe(-53690);
    });

    it('Works Get SqlServer Time From Temporal Zdt', () => {
        let time = getSqlServerTimeFromTemporalZdt(
            Temporal.Instant.from('1900-01-02 23:59:59.999999999+02:00').toZonedDateTimeISO('+02:00'),
            1
        );
        expect(time).toBe(864000);
        time = getSqlServerTimeFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 23:59:59.999999999+00:00').toZonedDateTimeISO('+00:00'),
            7
        );
        expect(time).toBe(864000000000);
        time = getSqlServerTimeFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 23:59:59.9999999+00:00').toZonedDateTimeISO('+00:00'),
            7
        );
        expect(time).toBe(863999999999);
        time = getSqlServerTimeFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 23:59:59.9999999+00:00').toZonedDateTimeISO('+00:00'),
            3
        );
        expect(time).toBe(86400000);
        time = getSqlServerTimeFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 00:00:00.000000000+00:00').toZonedDateTimeISO('+00:00'),
            5
        );
        expect(time).toBe(0);
    });

    it('Works Get SqlServer Minutes From Temporal Zdt', () => {
        let minutes = getSqlServerMinutesFromTemporalZdt(
            Temporal.Instant.from('1900-01-02 23:59:29.999999999+02:00').toZonedDateTimeISO('+00:00')
        );
        expect(minutes).toBe(1320);
        minutes = getSqlServerMinutesFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 23:59:29.999999999+00:00').toZonedDateTimeISO('+00:00')
        );
        expect(minutes).toBe(1440);
        minutes = getSqlServerMinutesFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 23:59:29.000000000+00:00').toZonedDateTimeISO('+00:00')
        );
        expect(minutes).toBe(1439);
        minutes = getSqlServerMinutesFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 23:59:30.000000000+00:00').toZonedDateTimeISO('+00:00')
        );
        expect(minutes).toBe(1440);
    });

    it('Works Get SqlServer ThreeHundredths Of Second Temporal Zdt', () => {
        let ths = getSqlServerThreeHundredthsOfSecondFromTemporalZdt(
            Temporal.Instant.from('1900-01-02 23:59:29.999999999+02:00').toZonedDateTimeISO('+00:00')
        );
        expect(ths).toBe(23751000);
        ths = getSqlServerThreeHundredthsOfSecondFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 00:00:01.900000000+00:00').toZonedDateTimeISO('+00:00')
        );
        expect(ths).toBe(570);
        ths = getSqlServerThreeHundredthsOfSecondFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 00:00:01.990000000+00:00').toZonedDateTimeISO('+00:00')
        );
        expect(ths).toBe(597);
        ths = getSqlServerThreeHundredthsOfSecondFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 00:00:01.999000000+00:00').toZonedDateTimeISO('+00:00')
        );
        expect(ths).toBe(600);
        ths = getSqlServerThreeHundredthsOfSecondFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 23:59:59.099999999+00:00').toZonedDateTimeISO('+00:00')
        );
        expect(ths).toBe(25919730);
        ths = getSqlServerThreeHundredthsOfSecondFromTemporalZdt(
            Temporal.Instant.from('0001-01-02 23:59:59.999999999+00:00').toZonedDateTimeISO('+00:00')
        );
        expect(ths).toBe(25920000);
    });

    it('Works Temporal Zdt From Date Time Object', () => {
        let zdt = temporalZdtFromDateTimeObject({
            startingYear: 2000,
            days: 60,
            minutes: 30,
            milliseconds: 60000,
            nanoseconds: 4500,
            offset: 0
        });
        expect(zdt).toBeInstanceOf(Temporal.ZonedDateTime);
        zdt = temporalZdtFromDateTimeObject({
            startingYear: 2000,
            minutes: 30,
            milliseconds: 60000,
            nanoseconds: 4500,
            offset: 0
        });
        expect(zdt).toBeInstanceOf(Temporal.ZonedDateTime);
        zdt = temporalZdtFromDateTimeObject({
            startingYear: 2000,
            milliseconds: 60000,
            nanoseconds: 4500,
            offset: 0
        });
        expect(zdt).toBeInstanceOf(Temporal.ZonedDateTime);
        zdt = temporalZdtFromDateTimeObject({
            startingYear: 2000,
            nanoseconds: 4500,
            offset: 0
        });
        expect(zdt).toBeInstanceOf(Temporal.ZonedDateTime);
        zdt = temporalZdtFromDateTimeObject({
            startingYear: 2000,
            offset: 0
        });
        expect(zdt).toBeInstanceOf(Temporal.ZonedDateTime);
        zdt = temporalZdtFromDateTimeObject({
            startingYear: 2000
        });
        expect(zdt).toBeInstanceOf(Temporal.ZonedDateTime);
    });

    it('Works Format to Sql Server String', () => {
        const zdt = temporalZdtFromDateTimeObject({
            startingYear: 2000,
            minutes: 120,
            nanoseconds: 888999900
        });
        expect(formatToDate(zdt)).toBe('2000-01-01');
        expect(formatToDateTime(zdt)).toBe('2000-01-01 02:00:00.888');
        expect(formatToSmallDateTime(zdt)).toBe('2000-01-01 02:00:00.000');
        expect(formatToDateTime2(zdt, 7)).toBe('2000-01-01 02:00:00.8889999');
        expect(formatToDateTimeOffset(zdt, 7)).toBe('2000-01-01 02:00:00.8889999 +00:00');
        expect(formatToTime(zdt, 1)).toBe('02:00:00.8');
        expect(formatToDateTime2(zdt, 1)).toBe('2000-01-01 02:00:00.8');
        expect(formatToDateTimeOffset(zdt, 1)).toBe('2000-01-01 02:00:00.8 +00:00');
        expect(formatToTime(zdt, 1)).toBe('02:00:00.8');
    });

    it('Works Instant Timezone From TemporalObject', () => {
        const t = temporalBindingFromTemporalObject({
            year: 2023,
            month: 1,
            day: 1,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 999,
            microsecond: 999,
            nanosecond: 950,
            offsetNanoseconds: 120 * 60_000_000_000
        });

        expect(t.instant).toBeInstanceOf(Temporal.Instant);
        expect(t.timezone).toBe('+02:00');
        const zdt = t.instant.toZonedDateTimeISO(t.timezone);
        expect(zdt.year).toBe(2023);
        expect(zdt.month).toBe(1);
        expect(zdt.day).toBe(1);
        expect(zdt.hour).toBe(0);
        expect(zdt.minute).toBe(0);
        expect(zdt.second).toBe(0);
        expect(zdt.millisecond).toBe(999);
        expect(zdt.microsecond).toBe(999);
        expect(zdt.nanosecond).toBe(950);
        expect(zdt.offsetNanoseconds).toBe(120 * 60_000_000_000);
    });

    it('Works Instant Timezone From TediousDate', () => {
        const tDate = new Date('2023-01-01 00:00:00.000+00:00') as TediousDate;
        tDate.nanosecondsDelta = 0.000999949;
        const t = temporalBindingFromTediousDate(tDate, TemporalTypeCheck.FULL);
        expect(t.instant).toBeInstanceOf(Temporal.Instant);
        expect(t.timezone).toBe('+01:00');
    });

    it('Works String To Temporal Object', () => {
        expect(stringToTemporalObject(' 2023-01-15 12:34:56.123456789Z    ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 789,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 2023-01-15 12:34:56.999999949Z    ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 999,
            microsecond: 999,
            nanosecond: 949,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 2023-01-15 12:34:56.99999995Z    ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 999,
            microsecond: 999,
            nanosecond: 950,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 2023-01-15 12:34:56.999999999Z    ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 999,
            microsecond: 999,
            nanosecond: 999,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 2023-01-15 12:34:56.9999999Z    ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 999,
            microsecond: 999,
            nanosecond: 900,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 2023-01-15 12:34:56.123456789 +03:00    ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 789,
            offsetNanoseconds: 10800_000_000_000
        });
        expect(stringToTemporalObject(' 2023-01-15 12:34:56.123456789-02:00    ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 789,
            offsetNanoseconds: -7200_000_000_000
        });
        expect(stringToTemporalObject(' 2023-01-15 12:34:56.123456789  ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 789,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 2023-01-15 12:34:56 ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 2023-01-15 12:34 ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 0,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 2023-01-15T12:34:56.123456789Z    ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 789,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 2023-01-15T12:34:56.123456789 -03:00    ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 789,
            offsetNanoseconds: -10800_000_000_000
        });
        expect(stringToTemporalObject(' 2023-01-15T12:34:56.123456789+02:00    ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 789,
            offsetNanoseconds: 7200_000_000_000
        });
        expect(stringToTemporalObject(' 2023-01-15T12:34:56.123456789  ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 789,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 2023-01-15T12:34:56 ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 2023-01-15T12:34 ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 12,
            minute: 34,
            second: 0,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 2023-01-15 ', TemporalTypeCheck.FULL)).toEqual({
            year: 2023,
            month: 1,
            day: 15,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34:56.123456789Z ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 789,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34:56.123456789 +03:00 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 789,
            offsetNanoseconds: 10800_000_000_000
        });
        expect(stringToTemporalObject(' 12:34:56.123456789+02:00 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 789,
            offsetNanoseconds: 7200_000_000_000
        });
        expect(stringToTemporalObject(' 12:34:56.123456789 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 789,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34:56.12345678 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 780,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34:56.1234567 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 700,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34:56.123456 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 456,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34:56.12345 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 450,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34:56.1234 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 400,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34:56.123 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 123,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34:56.12 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 120,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34:56.1 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 100,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34:56. ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34:56.2Z ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 200,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34:56.2+01 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 200,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 3600_000_000_000
        });
        expect(stringToTemporalObject(' 12:34:56 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 0,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 0
        });
        expect(stringToTemporalObject(' 12:34+01 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 0,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 3600_000_000_000
        });
        expect(stringToTemporalObject(' 12:34+14:00 ', TemporalTypeCheck.FULL)).toEqual({
            year: 1900,
            month: 1,
            day: 1,
            hour: 12,
            minute: 34,
            second: 0,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
            offsetNanoseconds: 50400_000_000_000
        });
        expect(stringToTemporalObject('2023/01/1500:00:00.000000000+00:00', TemporalTypeCheck.FULL)).toBeNull();
    });

    it('Works Value To Temporal Parameter', () => {
        const simulatedType = {
            type: 'Fake',
            name: 'DateTimeOffsetTemporal',
            valueToTemporalBinding: valueToTemporalBinding
        };
        expect(simulatedType.valueToTemporalBinding(null)).toBe(null);
        expect(simulatedType.valueToTemporalBinding(new Date())?.instant).toBeInstanceOf(Temporal.Instant);
        expect(
            simulatedType.valueToTemporalBinding(' 2023-01-15 12:34:56.123456789+00:00    ')?.instant
        ).toBeInstanceOf(Temporal.Instant);
        expect(() => {
            simulatedType.valueToTemporalBinding('2023/01/1500:00:00.000000000+00:00');
        }).toThrowError('"2023/01/1500:00:00.000000000+00:00" is not a valid date format!');
    });

    it('Works TimeZone To Temporal Offset Nanoseconds', () => {
        expect(timeZoneToTemporalOffsetNanoseconds(' Z ')).toBe(0);
        expect(timeZoneToTemporalOffsetNanoseconds(' +00:00')).toBe(0);
        expect(timeZoneToTemporalOffsetNanoseconds(' -00:00')).toBe(0);
        expect(timeZoneToTemporalOffsetNanoseconds('00:00')).toBe(0);
        expect(timeZoneToTemporalOffsetNanoseconds('00')).toBe(0);
        expect(timeZoneToTemporalOffsetNanoseconds('+14:00')).toBe(50400000000000);
        expect(timeZoneToTemporalOffsetNanoseconds('-14:00')).toBe(-50400000000000);
        expect(timeZoneToTemporalOffsetNanoseconds('+07:00')).toBe(25200000000000);
        expect(timeZoneToTemporalOffsetNanoseconds('-07:00')).toBe(-25200000000000);
        expect(timeZoneToTemporalOffsetNanoseconds('-7')).toBe(0);
    });

    it('Works Date Offset To Timezone', () => {
        expect(nanoSecondsOffsetToTimezone(null)).toBe('+00:00');
        expect(nanoSecondsOffsetToTimezone(0)).toBe('+00:00');
        expect(nanoSecondsOffsetToTimezone(840 * 60_000_000_000)).toBe('+14:00');
        expect(nanoSecondsOffsetToTimezone(-840 * 60_000_000_000)).toBe('-14:00');
        expect(nanoSecondsOffsetToTimezone(120 * 60_000_000_000)).toBe('+02:00');
        expect(nanoSecondsOffsetToTimezone(-15 * 60_000_000_000)).toBe('-00:15');
        expect(nanoSecondsOffsetToTimezone(732 * 60_000_000_000)).toBe('+12:12');
        expect(nanoSecondsOffsetToTimezone(-732 * 60_000_000_000)).toBe('-12:12');
    });

    it('Works Format Time With Base Date', () => {
        expect(formatToTime(new Date('2023-01-12 23:59:59.999'), 7)).toBe('23:59:59.9990000');
    });
});
