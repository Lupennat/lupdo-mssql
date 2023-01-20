import { TypedBinding } from 'lupdo';
import { TypeBindingOptions } from 'lupdo/dist/typings/typed-binding';
import { Params, ValidBindingsPrimitive, ValidBindingsSingle } from 'lupdo/dist/typings/types/pdo-prepared-statement';
import { ColumnMetaData, ColumnValue, ParameterOptions, Request, TediousType } from 'tedious-better-data-types';
import MssqlRequest from './mssql-request';
import { MssqlPoolConnection } from './types';
import { castBinding, convertBindingsToDictionary, getTediousType } from './utils/bindings';

class MssqlPreparedRequest extends MssqlRequest {
    constructor(connection: MssqlPoolConnection, sql: string, protected useTemporalDate: boolean) {
        super(connection, sql);
    }

    public async execute(bindings?: Params): Promise<[ColumnMetaData[], number, ColumnValue[][]]> {
        this.rows = [];
        this.columns = [];
        this.rowCount = 0;
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

            if (bindings) {
                bindings = convertBindingsToDictionary(bindings);
                for (const key in bindings) {
                    request.addParameter(key, ...this.getBinding(bindings[key] as ValidBindingsSingle));
                }
            }

            this.connection.execSql(request);
        });
    }

    public async unprepare(): Promise<void> {
        return void 0;
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
}

export default MssqlPreparedRequest;
