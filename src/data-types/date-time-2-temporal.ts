/* eslint-disable @typescript-eslint/no-var-requires */

const writableTrackingBuffer = require('tedious/lib/tracking-buffer/writable-tracking-buffer');

import { TYPES, TediousType } from 'tedious';
import { TediousTemporalScalableParameter } from '../types';
import {
    getDaysSinceYearOneDayOneFromTemporalZdt,
    getSqlServerTimeFromTemporalZdt,
    valueToTemporalBinding
} from '../utils/temporals';

function* generateParameterData(parameter: TediousTemporalScalableParameter): Generator<Buffer> {
    if (parameter.value == null) {
        return;
    }

    const temporalBinding = parameter.value;

    const scale = parameter.scale;
    const buffer = new writableTrackingBuffer(16);
    const zdt = temporalBinding.instant.toZonedDateTimeISO(temporalBinding.timezone);

    let nextDay = false;
    let time = getSqlServerTimeFromTemporalZdt(zdt, scale);

    if (time / Math.pow(10, scale) === 86400) {
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
    buffer.writeUInt24LE(getDaysSinceYearOneDayOneFromTemporalZdt(zdt) + (nextDay ? 1 : 0));
    yield buffer.data;
}

export default {
    isTemporal: true,
    ...TYPES.DateTime2,
    name: 'DateTime2Temporal',
    generateParameterData,
    validate: valueToTemporalBinding
} as TediousType;
