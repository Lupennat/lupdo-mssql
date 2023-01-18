/* eslint-disable @typescript-eslint/no-var-requires */

import { TYPES, TediousType } from 'tedious';
import { TediousTemporalParameter } from '../types';

import {
    getDaysSince1900DayOneFromTemporalZdt,
    getSqlServerThreeHundredthsOfSecondFromTemporalZdt,
    valueToTemporalBinding
} from '../utils/temporals';

function* generateParameterData(parameter: TediousTemporalParameter): Generator<Buffer> {
    if (parameter.value == null) {
        return;
    }

    const temporalBinding = parameter.value;
    const buffer = Buffer.alloc(8);
    const zdt = temporalBinding.instant.toZonedDateTimeISO(temporalBinding.timezone);

    let nextDay = false;
    let threeHundredthsOfSecond = getSqlServerThreeHundredthsOfSecondFromTemporalZdt(zdt);

    if (threeHundredthsOfSecond === 25920000) {
        threeHundredthsOfSecond = 0;
        nextDay = true;
    }

    // write days
    buffer.writeInt32LE(getDaysSince1900DayOneFromTemporalZdt(zdt) + (nextDay ? 1 : 0), 0);
    // write three hundredths of second
    buffer.writeUInt32LE(threeHundredthsOfSecond, 4);
    yield buffer;
}

export default {
    isTemporal: true,
    ...TYPES.DateTime,
    name: 'DateTimeTemporal',
    generateParameterData,
    validate: valueToTemporalBinding
} as TediousType;
