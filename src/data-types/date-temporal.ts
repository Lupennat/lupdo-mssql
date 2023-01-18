import { TYPES, TediousType } from 'tedious';
import { TediousTemporalParameter } from '../types';

import { getDaysSinceYearOneDayOneFromTemporalZdt, valueToTemporalBinding } from '../utils/temporals';

function* generateParameterData(parameter: TediousTemporalParameter): Generator<Buffer> {
    if (parameter.value == null) {
        return;
    }

    const temporalBinding = parameter.value;
    const buffer = Buffer.alloc(3);
    const zdt = temporalBinding.instant.toZonedDateTimeISO('+00:00');

    // write days
    buffer.writeUIntLE(getDaysSinceYearOneDayOneFromTemporalZdt(zdt), 0, 3);
    yield buffer;
}

export default {
    isTemporal: true,
    ...TYPES.Date,
    name: 'DateTemporal',
    generateParameterData,
    validate: valueToTemporalBinding
} as TediousType;
