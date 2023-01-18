import mssqlParser from '../mssql-parser';

describe('Parser', () => {
    it('Works Parser With Nullable', () => {
        function callback(value: null): void {
            expect(value).toBeNull();
        }
        mssqlParser.BigInt(callback, null);
        mssqlParser.Bit(callback, null);
        mssqlParser.Date(callback, null);
        mssqlParser.DateTime(callback, null);
        mssqlParser.DateTime2(callback, null, 0);
        mssqlParser.DateTimeOffset(callback, null, 0);
        mssqlParser.Float(callback, null);
        mssqlParser.Real(callback, null);
        mssqlParser.SmallDateTime(callback, null);
        mssqlParser.Time(callback, null, 0);
    });
});
