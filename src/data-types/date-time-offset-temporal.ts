/* eslint-disable @typescript-eslint/no-var-requires */

const writableTrackingBuffer = require('tedious/lib/tracking-buffer/writable-tracking-buffer');

import { TYPES, TediousType } from 'tedious';
import { TediousTemporalScalableParameter } from '../types';

import {
    getDaysSinceYearOneDayOneFromTemporalZdt,
    getSqlServerTimeFromTemporalZdt,
    nanoSecondsOffsetToOffset,
    valueToTemporalBinding
} from '../utils/temporals';

function* generateParameterData(parameter: TediousTemporalScalableParameter): Generator<Buffer> {
    if (parameter.value == null) {
        return;
    }

    const temporalBinding = parameter.value;

    const dateInstant = temporalBinding.instant.add({
        nanoseconds: temporalBinding.round
    });

    const scale = parameter.scale;
    const buffer = new writableTrackingBuffer(16);

    const utcZdt = dateInstant.toZonedDateTimeISO('+00:00');

    let nextDay = false;
    let time = getSqlServerTimeFromTemporalZdt(utcZdt, scale);

    if (time / Math.pow(10, scale ?? 7) === 86400) {
        time = 0;
        nextDay = true;
    }

    switch (scale) {
        case 0:
        case 1:
        case 2:
            buffer.writeUInt24LE(time);
            break;

        case 3:
        case 4:
            buffer.writeUInt32LE(time);
            break;

        case 5:
        case 6:
        case 7:
            buffer.writeUInt40LE(time);
    }

    // write days
    buffer.writeUInt24LE(getDaysSinceYearOneDayOneFromTemporalZdt(utcZdt) + (nextDay ? 1 : 0));
    // write offset minutes
    buffer.writeInt16LE(
        nanoSecondsOffsetToOffset(dateInstant.toZonedDateTimeISO(temporalBinding.timezone).offsetNanoseconds)
    );
    yield buffer.data;
}

export default {
    isTemporal: true,
    ...TYPES.DateTimeOffset,
    name: 'DateTimeOffsetTemporal',
    generateParameterData,
    validate: valueToTemporalBinding
} as TediousType;
