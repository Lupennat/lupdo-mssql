import { Temporal } from '@js-temporal/polyfill';
import { DateTimeObject, DateWithNanosecondsDelta } from 'tedious-better-data-types';

export function offsetToTimezone(offset: number): string {
    if (offset === 0) {
        return '+00:00';
    } else {
        return `${offset < 0 ? '-' : '+'}${Math.floor(Math.abs(offset) / 60)
            .toString()
            .padStart(2, '0')}:${(Math.abs(offset) % 60).toString().padStart(2, '0')}`;
    }
}

export function temporalZdtFromDateTimeObject(dto: DateTimeObject): Temporal.ZonedDateTime {
    const timezone = dto.offset ? offsetToTimezone(dto.offset) : '+00:00';
    const instant = Temporal.Instant.from(
        `${dto.startingYear.toString().padStart(4, '0')}-01-01 00:00:00.000000000${timezone}`
    );
    const minutes = (dto.minutes ?? 0) + (dto.offset ?? 0);

    let zdt = instant.toZonedDateTimeISO(timezone).add({
        days: dto.days ?? 0,
        milliseconds: dto.milliseconds ?? 0,
        nanoseconds: dto.nanoseconds ?? 0
    });

    if (minutes !== 0) {
        zdt = zdt[minutes > 0 ? 'add' : 'subtract']({
            minutes: Math.abs(minutes)
        });
    }

    return zdt;
}

export function formatToDate(dateOrZdt: Temporal.ZonedDateTime | DateWithNanosecondsDelta): string {
    if (dateOrZdt instanceof Date) {
        return `${dateOrZdt.getFullYear().toString().padStart(4, '0')}-${(dateOrZdt.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${dateOrZdt.getDate().toString().padStart(2, '0')}`;
    } else {
        return `${dateOrZdt.year.toString().padStart(4, '0')}-${dateOrZdt.month
            .toString()
            .padStart(2, '0')}-${dateOrZdt.day.toString().padStart(2, '0')}`;
    }
}

export function formatToDateTime(dateOrZdt: Temporal.ZonedDateTime | DateWithNanosecondsDelta): string {
    if (dateOrZdt instanceof Date) {
        return `${formatToDate(dateOrZdt)} ${dateOrZdt.getHours().toString().padStart(2, '0')}:${dateOrZdt
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${dateOrZdt.getSeconds().toString().padStart(2, '0')}.${dateOrZdt
            .getMilliseconds()
            .toString()
            .padStart(3, '0')}`;
    } else {
        return `${formatToDate(dateOrZdt)} ${dateOrZdt.hour.toString().padStart(2, '0')}:${dateOrZdt.minute
            .toString()
            .padStart(2, '0')}:${dateOrZdt.second.toString().padStart(2, '0')}.${dateOrZdt.millisecond
            .toString()
            .padStart(3, '0')}`;
    }
}

export function formatToSmallDateTime(dateOrZdt: Temporal.ZonedDateTime | DateWithNanosecondsDelta): string {
    if (dateOrZdt instanceof Date) {
        return `${formatToDate(dateOrZdt)} ${dateOrZdt.getHours().toString().padStart(2, '0')}:${dateOrZdt
            .getMinutes()
            .toString()
            .padStart(2, '0')}:00.000`;
    } else {
        return `${formatToDate(dateOrZdt)} ${dateOrZdt.hour.toString().padStart(2, '0')}:${dateOrZdt.minute
            .toString()
            .padStart(2, '0')}:00.000`;
    }
}

export function formatToTime(dateOrZdt: Temporal.ZonedDateTime | DateWithNanosecondsDelta, scale: number): string {
    let formattedTime = '';
    if (dateOrZdt instanceof Date) {
        formattedTime = `${dateOrZdt.getHours().toString().padStart(2, '0')}:${dateOrZdt
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${dateOrZdt.getSeconds().toString().padStart(2, '0')}.${dateOrZdt
            .getMilliseconds()
            .toString()
            .padStart(3, '0')}${('nanosecondsDelta' in dateOrZdt
            ? (dateOrZdt.nanosecondsDelta as number).toString().slice(5)
            : ''
        ).padEnd(4, '0')}`;
    } else {
        formattedTime = `${dateOrZdt.hour.toString().padStart(2, '0')}:${dateOrZdt.minute
            .toString()
            .padStart(2, '0')}:${dateOrZdt.second.toString().padStart(2, '0')}.${dateOrZdt.millisecond
            .toString()
            .padStart(3, '0')}${dateOrZdt.microsecond.toString().padStart(3, '0')}${(dateOrZdt.nanosecond / 100)
            .toString()
            .slice(0, 1)}`;
    }

    const fixedScale = 7 - scale;
    // when scale 0 remove also dot
    return formattedTime.slice(0, formattedTime.length - (fixedScale === 7 ? 8 : fixedScale));
}

export function formatToDateTime2(dateOrZdt: Temporal.ZonedDateTime | DateWithNanosecondsDelta, scale: number): string {
    return `${formatToDate(dateOrZdt)} ${formatToTime(dateOrZdt, scale)}`;
}

export function formatToDateTimeOffset(
    dateOrZdt: Temporal.ZonedDateTime | DateWithNanosecondsDelta,
    scale: number
): string {
    return `${formatToDate(dateOrZdt)} ${formatToTime(dateOrZdt, scale)}${
        dateOrZdt instanceof Date ? offsetToTimezone(-dateOrZdt.getTimezoneOffset()) : dateOrZdt.offset
    }`;
}
