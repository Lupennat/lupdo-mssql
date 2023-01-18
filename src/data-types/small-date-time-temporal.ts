import { TYPES, TediousType } from 'tedious';
import { TediousTemporalParameter } from '../types';
import {
    getDaysSince1900DayOneFromTemporalZdt,
    getSqlServerMinutesFromTemporalZdt,
    valueToTemporalBinding
} from '../utils/temporals';

function* generateParameterData(parameter: TediousTemporalParameter): Generator<Buffer> {
    if (parameter.value == null) {
        return;
    }

    const temporalBinding = parameter.value;
    const buffer = Buffer.alloc(4);
    const zdt = temporalBinding.instant.toZonedDateTimeISO(temporalBinding.timezone);

    let nextDay = false;
    let minutes = getSqlServerMinutesFromTemporalZdt(zdt);

    if (minutes === 1440) {
        minutes = 0;
        nextDay = true;
    }

    // write days
    buffer.writeUInt16LE(getDaysSince1900DayOneFromTemporalZdt(zdt) + (nextDay ? 1 : 0), 0);
    // write minutes
    buffer.writeUInt16LE(minutes, 2);
    yield buffer;
}

export default {
    isTemporal: true,
    ...TYPES.SmallDateTime,
    name: 'SmallDateTimeTemporal',
    generateParameterData,
    validate: valueToTemporalBinding
} as TediousType;
