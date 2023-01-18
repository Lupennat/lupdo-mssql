import { PdoConnection } from 'lupdo';
import MssqlRequest from './mssql-request';
import { MssqlPoolConnection } from './types';

class MssqlConnection extends PdoConnection {
    constructor(public readonly connection: MssqlPoolConnection) {
        super();
    }

    async query(sql: string): Promise<void> {
        const request = new MssqlRequest(this.connection, sql);
        await request.execute();
        // tedious do not preserve set statement across request
        // query will be executed only to validate it
        // all queries are stored to private and launched before any other query
        // set xx; set xx; new query
        if (this.connection.__lupdo_sql_server_before == null) {
            this.connection.__lupdo_sql_server_before = [];
        }
        this.connection.__lupdo_sql_server_before.push(sql.endsWith(';') ? sql : sql + ';');
    }
}

export default MssqlConnection;
