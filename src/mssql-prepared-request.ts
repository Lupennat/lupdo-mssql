import { Params } from 'lupdo/dist/typings/types/pdo-prepared-statement';
import { ColumnMetaData, ColumnValue } from 'tedious-better-data-types';
import MssqlRequest from './mssql-request';

class MssqlPreparedRequest extends MssqlRequest {
    public async execute(bindings?: Params): Promise<[ColumnMetaData[][], number, ColumnValue[][][]]> {
        this.rows = [];
        this.columns = [];
        this.rowCount = 0;
        this.cursor = -1;

        return await this.convertRequestToPromise(bindings);
    }

    public async unprepare(): Promise<void> {
        return void 0;
    }
}

export default MssqlPreparedRequest;
