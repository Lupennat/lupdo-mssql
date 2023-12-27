import { TypedBinding } from 'lupdo';
import { TypeBindingOptions } from 'lupdo/dist/typings/typed-binding';
import { Params, ValidBindingsPrimitive, ValidBindingsSingle } from 'lupdo/dist/typings/types/pdo-prepared-statement';
import { ColumnMetaData, ColumnValue, ParameterOptions, Request, TediousType } from 'tedious-better-data-types';
import { MssqlPoolConnection } from './types';
import {
    castBinding,
    convertBindingsToDictionary,
    getTediousType,
    sqlQuestionMarkToNumericAtP
} from './utils/bindings';

class MssqlRequest {
    static requestQueue: { request: Request; connection: MssqlPoolConnection }[] = [];
    protected columns: ColumnMetaData[][] = [];
    protected rowCount = 0;
    protected cursor = -1;
    protected rows: ColumnValue[][][] = [];
    public sql = '';

    constructor(protected connection: MssqlPoolConnection, sql: string, protected useTemporalDate: boolean = false) {
        if (connection.__lupdo_sql_server_before) {
            for (const sql of connection.__lupdo_sql_server_before) {
                this.sql += sql;
            }
        }
        this.sql += sqlQuestionMarkToNumericAtP(sql);
    }

    protected generateRequest(
        callback: (error: Error | undefined, response?: [ColumnMetaData[][], number, ColumnValue[][][]]) => void
    ): Request {
        const request = new Request(this.sql, (err: Error | undefined, count: number) => {
            if (err != null) {
                callback(err);
            }
            this.rowCount = count;
        });

        request.on('columnMetadata', (columnsMetaData: ColumnMetaData[]) => {
            this.cursor++;
            this.rows[this.cursor] = [];
            this.columns.push(columnsMetaData);
        });

        request.on('requestCompleted', () => {
            callback(undefined);
        });

        return request;
    }

    protected consumeRequest(): void {
        if (this.connection.state?.name === 'LoggedIn') {
            const nextRequest =
                this.connection.__lupdo_sql_server_queue && this.connection.__lupdo_sql_server_queue.pop();
            if (nextRequest) {
                this.connection.execSql(nextRequest);
            }
        }
    }

    protected enqueueRequest(request: Request): void {
        if (this.connection.__lupdo_sql_server_queue === undefined) {
            this.connection.__lupdo_sql_server_queue = [];
        }
        this.connection.__lupdo_sql_server_queue.push(request);
        this.consumeRequest();
    }

    protected convertRequestToPromise(bindings?: Params): Promise<[ColumnMetaData[][], number, ColumnValue[][][]]> {
        return new Promise((resolve, reject) => {
            const request = this.generateRequest((err: Error | undefined) => {
                if (err) {
                    return reject(err);
                }

                process.nextTick(() => this.consumeRequest());

                resolve([this.columns, this.rowCount, this.rows]);
            });

            request.on('row', (row: ColumnValue[]) => {
                this.rows[this.cursor].push(row);
            });

            if (bindings) {
                bindings = convertBindingsToDictionary(bindings);
                for (const key in bindings) {
                    request.addParameter(key, ...this.getBinding(bindings[key] as ValidBindingsSingle));
                }
            }

            this.enqueueRequest(request);
        });
    }

    protected getBinding(
        binding: ValidBindingsSingle,
        type?: string,
        options?: TypeBindingOptions
    ): [TediousType, ValidBindingsPrimitive, ParameterOptions?] {
        if (binding instanceof TypedBinding) {
            return this.getBinding(binding.value, binding.type, binding.options);
        }
        const tediousType = getTediousType(binding, this.useTemporalDate, type);
        const value = castBinding(binding);
        return [tediousType, value, options];
    }

    public async execute(): Promise<[ColumnMetaData[][], number, ColumnValue[][][]]> {
        return await this.convertRequestToPromise();
    }
}

export default MssqlRequest;
