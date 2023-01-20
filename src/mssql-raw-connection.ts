import { PdoRawConnection } from 'lupdo';
import PdoAffectingData from 'lupdo/dist/typings/types/pdo-affecting-data';
import PdoColumnData from 'lupdo/dist/typings/types/pdo-column-data';
import { Params, ValidBindingsSingle } from 'lupdo/dist/typings/types/pdo-prepared-statement';
import PdoRowData from 'lupdo/dist/typings/types/pdo-raw-data';
import { ColumnMetaData, ColumnValue } from 'tedious-better-data-types';
import { MSSQL_DATE_BINDING, MSSQL_DATE_BINDING_TEMPORAL } from './constants';
import MssqlPreparedRequest from './mssql-prepared-request';
import MssqlRequest from './mssql-request';
import { MssqlPoolConnection } from './types';
import { sqlColumnBindingsToAtP } from './utils/bindings';

class MssqlRawConnection extends PdoRawConnection {
    public async lastInsertId(
        {
            affectingResults
        }: {
            affectingResults: PdoAffectingData;
        },
        name?: string
    ): Promise<string | number | bigint | null> {
        if (this.connection == null && !name) {
            return await super.lastInsertId({ affectingResults });
        }

        const releaseConnection = this.connection == null;
        const id = await this.executeGetLastIdQuery(
            (await this.generateOrReuseConnection()) as MssqlPoolConnection,
            name
        );

        if (releaseConnection) {
            await this.release();
        }

        return id === 0 ? null : id;
    }

    protected async doBeginTransaction(connection: MssqlPoolConnection): Promise<void> {
        return new Promise((resolve, reject) => {
            connection.beginTransaction((err?: Error) => {
                if (err != null) {
                    connection.__lupdo_sql_server_connected = false;
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    protected async doCommit(connection: MssqlPoolConnection): Promise<void> {
        return new Promise((resolve, reject) => {
            connection.commitTransaction((err?: Error) => {
                if (err != null) {
                    connection.__lupdo_sql_server_connected = false;
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    protected async doRollback(connection: MssqlPoolConnection): Promise<void> {
        return new Promise((resolve, reject) => {
            connection.rollbackTransaction((err?: Error) => {
                if (err != null) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    protected async getStatement(sql: string, connection: MssqlPoolConnection): Promise<MssqlPreparedRequest> {
        return new MssqlPreparedRequest(connection, sql, this.useTemporal());
    }

    protected async executeStatement(
        statement: MssqlPreparedRequest,
        bindings: Params
    ): Promise<[string, PdoAffectingData, PdoRowData[], PdoColumnData[]]> {
        if (!Array.isArray(bindings)) {
            statement.sql = sqlColumnBindingsToAtP(statement.sql, bindings);
        }
        return [statement.sql, ...this.adaptResponse(...(await statement.execute(bindings)))];
    }

    protected async closeStatement(statement: MssqlPreparedRequest): Promise<void> {
        await statement.unprepare();
    }

    protected async doExec(connection: MssqlPoolConnection, sql: string): Promise<PdoAffectingData> {
        const request = new MssqlRequest(connection, sql);
        return this.adaptResponse(...(await request.execute()))[0];
    }

    protected async doQuery(
        connection: MssqlPoolConnection,
        sql: string
    ): Promise<[PdoAffectingData, PdoRowData[], PdoColumnData[]]> {
        const request = new MssqlRequest(connection, sql);
        const [pdoAffectingData, ...rest] = this.adaptResponse(...(await request.execute()));
        if (!this.inTransaction) {
            try {
                pdoAffectingData.lastInsertRowid = await this.executeGetLastIdQuery(connection);
            } catch (error) {}
        }
        return [pdoAffectingData, ...rest];
    }

    protected async executeGetLastIdQuery(connection: MssqlPoolConnection, name?: string): Promise<number | bigint> {
        const sql = name
            ? 'SELECT CAST(current_value AS bigInt) FROM sys.sequences WHERE name= @p1'
            : 'SELECT CAST(@@IDENTITY AS bigInt);';
        const bindings = name ? [name] : [];
        const request = name
            ? new MssqlPreparedRequest(connection, sql, this.useTemporal())
            : new MssqlRequest(connection, sql);
        const res = name ? await request.execute(bindings) : await request.execute();
        if (name) {
            return res[2].length > 0 ? res[2][0][0].value : 0;
        } else {
            const row = res[2].pop() as any[];
            return row[0].value;
        }
    }

    protected adaptResponse(
        columns: ColumnMetaData[],
        rowCount: number,
        rows: ColumnValue[][]
    ): [PdoAffectingData, PdoRowData[], PdoColumnData[]] {
        return [
            {
                affectedRows: rowCount
            },
            rows.map((row: ColumnValue[]) => this.adaptRow(row)),
            columns.map(column => {
                return {
                    name: column.colName,
                    table: '',
                    type: column.type,
                    dataLength: column.dataLength,
                    scale: column.scale,
                    precision: column.precision
                };
            })
        ];
    }

    protected adaptRow(row: ColumnValue[]): PdoRowData {
        return row.map((column: ColumnValue) => column.value);
    }

    protected useTemporal(): boolean {
        return this.getAttribute(MSSQL_DATE_BINDING) === MSSQL_DATE_BINDING_TEMPORAL;
    }

    protected adaptBindValue(value: ValidBindingsSingle): ValidBindingsSingle {
        return value;
    }
}

export default MssqlRawConnection;
