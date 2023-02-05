import { Connection, ConnectionConfig } from 'tedious-better-data-types';
import MssqlDriver from '../../mssql-driver';
import { MssqlIsolationLevel, MssqlOptions, MssqlPoolConnection } from '../../types';

class FakeConnection extends Connection {
    __lupdo_uuid = '';
    __lupdo_killed = false;
    __lupdo_sql_server_connected = false;
    __lupdo_sql_server_before: undefined | string[];
    public fake = '';
    public connect(callback?: (err?: Error) => void): void {
        if (this.fake === 'CONNECT') {
            const error = new Error('Fake Connection Error');
            if (callback) {
                callback(error);
            }
            this.emit('connect', error);
        } else {
            return super.connect(callback);
        }
    }

    public beginTransaction(
        callback: (error?: Error) => void,
        name?: string,
        isolationLevel?: MssqlIsolationLevel
    ): void {
        if (this.fake === 'BEGIN') {
            callback(new Error('Fake Transaction Error'));
        } else {
            return super.beginTransaction(callback, name, isolationLevel);
        }
    }

    public commitTransaction(callback: (error: Error) => void): void {
        if (this.fake === 'COMMIT') {
            callback(new Error('Fake Commit Error'));
        } else {
            return this.commitTransaction(callback);
        }
    }

    public rollbackTransaction(callback: (error: Error) => void): void {
        if (this.fake === 'ROLLBACK') {
            callback(new Error('Fake Rollback Error'));
        } else {
            return this.rollbackTransaction(callback);
        }
    }
}

class MssqlFakerDriver extends MssqlDriver {
    protected connections: FakeConnection[] = [];
    protected faker = '';
    protected generateTediousConnection(tediousOptions: MssqlOptions): MssqlPoolConnection {
        const conn = new FakeConnection(tediousOptions as ConnectionConfig);
        conn.fake = this.faker;
        this.connections.push(conn);
        return conn;
    }

    public set fake(fake: string) {
        this.faker = fake;
        for (const conn of this.connections) {
            conn.fake = this.faker;
        }
    }

    public async connect(): Promise<MssqlPoolConnection> {
        return await this.createConnection(false);
    }
}

export default MssqlFakerDriver;
