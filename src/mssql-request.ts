import { ColumnMetaData, ColumnValue, Request } from 'tedious-better-data-types';
import { MssqlPoolConnection } from './types';
import { sqlQuestionMarkToNumericAtP } from './utils/bindings';

class MssqlRequest {
    protected request: Request | null = null;
    protected columns: ColumnMetaData[] = [];
    protected rowCount = 0;
    protected rows: ColumnValue[][] = [];
    public sql = '';

    constructor(protected connection: MssqlPoolConnection, sql: string) {
        if (connection.__lupdo_sql_server_before) {
            for (const sql of connection.__lupdo_sql_server_before) {
                this.sql += sql;
            }
        }
        this.sql += sqlQuestionMarkToNumericAtP(sql);
    }

    public async execute(): Promise<[ColumnMetaData[], number, ColumnValue[][]]> {
        return new Promise((resolve, reject) => {
            const request = new Request(this.sql, (err: Error | undefined, count: number) => {
                if (err != null) {
                    reject(err);
                }
                this.rowCount = count;
            });

            request.on('columnMetadata', (columnsMetaData: ColumnMetaData[]) => {
                this.columns = columnsMetaData;
            });

            request.on('requestCompleted', () => {
                resolve([this.columns, this.rowCount, this.rows]);
            });

            request.on('row', (row: ColumnValue[]) => {
                this.rows.push(row);
            });

            this.connection.execSql(request);
        });
    }
}

export default MssqlRequest;
