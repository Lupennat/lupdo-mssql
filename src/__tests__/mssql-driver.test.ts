import {
    ATTR_DEBUG,
    DEBUG_ENABLED,
    Pdo,
    PdoConnectionI,
    PdoError,
    PdoPreparedStatement,
    PdoStatement,
    PdoTransaction
} from 'lupdo';

import { ColumnValue, Connection, Request } from 'tedious-better-data-types';
import { createMssqlPdo } from '..';
import { pdoData } from './fixtures/config';
import MssqlFakerDriver from './fixtures/mssql-faker-driver';

describe('Mssql Driver', () => {
    const pdo = new Pdo(pdoData.driver, pdoData.config);

    afterAll(async () => {
        await pdo.disconnect();
    });

    afterEach(() => {
        Pdo.setLogger(() => {});
    });

    const doRequest = function (conn: Connection): Promise<ColumnValue[][]> {
        return new Promise((resolve, reject) => {
            const rows: ColumnValue[][] = [];
            const request = new Request("select 42, 'hello world'", function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });

            request.on('row', function (row: ColumnValue[]) {
                rows.push(row);
            });

            conn.execSql(request);
        });
    };

    it('Works Driver Registration', () => {
        expect(Pdo.getAvailableDrivers()).toEqual(['sqlsrv', 'mssql']);
    });

    it('Works Random Host From List', async () => {
        const config = pdoData.config;
        config.server = [`${config.server}:${config.options!.port}`, `${config.server}:${config.options!.port}`];
        config.options!.port = undefined;
        const pdo = new Pdo(pdoData.driver, config);
        const stmt = await pdo.query('SELECT 1');
        expect(stmt.fetchColumn(0).all()).toEqual([1]);
        await pdo.disconnect();
    });

    it('Works BeginTransaction Return Transaction', async () => {
        const trx = await pdo.beginTransaction();
        expect(trx).toBeInstanceOf(PdoTransaction);
        await trx.rollback();
    });

    it('Works Exec Return Number', async () => {
        const res = await pdo.exec('SELECT 1');
        expect(typeof res === 'number').toBeTruthy();
        expect(res).toEqual(1);
        const trx = await pdo.beginTransaction();
        expect(await trx.exec("INSERT INTO users (name, gender) VALUES ('Claudio', 'All');")).toEqual(1);
        await trx.rollback();
    });

    it('Works Exec Fails', async () => {
        await expect(pdo.exec('SELECT ?')).rejects.toThrow(PdoError);
    });

    it('Works Query Return PdoStatement', async () => {
        const stmt = await pdo.query('SELECT 1');
        expect(stmt).toBeInstanceOf(PdoStatement);
    });

    it('Works Query Fails', async () => {
        await expect(pdo.query('SELECT ?')).rejects.toThrow(PdoError);
    });

    it('Works Prepare Return PdoPreparedStatement', async () => {
        const stmt = await pdo.prepare('SELECT 1');
        expect(stmt).toBeInstanceOf(PdoPreparedStatement);
        await stmt.execute();
        await stmt.close();
    });

    it('Works Wrong PreparedStatement Fails on Execute', async () => {
        const stmt = await pdo.prepare('SELECT ??');
        await expect(stmt.execute([1])).rejects.toThrow(PdoError);
        await stmt.close();
    });

    it('Works Execute Fails', async () => {
        const stmt = await pdo.prepare('SELECT ? as spaccati');
        await expect(stmt.execute([])).rejects.toThrow(PdoError);
        await stmt.close();
    });

    it('Works Get Raw Pool Connection', async () => {
        const raw = await pdo.getRawPoolConnection();
        expect(raw.connection).toBeInstanceOf(Connection);
        await raw.release();
    });

    it('Works Get Raw Driver Connection', async () => {
        const conn = await pdo.getRawDriverConnection<Connection>();
        const res = await doRequest(conn);
        expect(res[0][0].value).toBe(42);
        expect(res[0][1].value).toBe('hello world');
        conn.close();
    });

    it('Works Connection On Create', async () => {
        const pdo = new Pdo(
            pdoData.driver,
            pdoData.config,
            {
                created: async (uuid: string, connection: PdoConnectionI) => {
                    await connection.query('SET LANGUAGE Italian');
                    await connection.query('SET DATEFORMAT dmy;');
                }
            },
            {}
        );

        let stmt = await pdo.query(`SELECT DATENAME(month, '2023-01-05');`);
        expect(stmt.fetchColumn<string>(0).get()).toBe('gennaio');
        stmt = await pdo.query(`SET LANGUAGE English;SELECT DATENAME(month, '2023-01-05');`);
        expect(stmt.fetchColumn<string>(0).get()).toBe('January');
        stmt = await pdo.query(`SELECT DATENAME(month, '2023-01-05');`);
        expect(stmt.fetchColumn<string>(0).get()).toBe('gennaio');

        await pdo.disconnect();
    });

    it('Work Get Version', async () => {
        const pdo = createMssqlPdo(pdoData.config);
        expect((await pdo.getVersion()).startsWith('Microsoft SQL Server')).toBeTruthy();
    });

    it('Works Pdo Connection Version', async () => {
        const pdo = createMssqlPdo(pdoData.config, {
            created: (uuid, connection) => {
                expect(connection.version.startsWith('Microsoft SQL Server')).toBeTruthy();
            }
        });
        await pdo.query('SELECT 1');
        await pdo.disconnect();
    });

    it('Works Debug', async () => {
        console.log = jest.fn();
        console.trace = jest.fn();
        const pdo = new Pdo(pdoData.driver, pdoData.config, {}, { [ATTR_DEBUG]: DEBUG_ENABLED });
        await pdo.query('SELECT 1');
        expect(console.log).toHaveBeenCalled();
        await pdo.disconnect();
    });

    it('Works Throw Error', async () => {
        const fakedriver = new MssqlFakerDriver('mssqlfaker', { server: 'localhost' }, {}, {});
        fakedriver.fake = 'CONNECT';
        await expect(fakedriver.connect()).rejects.toThrowError('Fake Connection Error');
    });

    it('Works createMssqlPdo', async () => {
        const pdo = createMssqlPdo(pdoData.config);
        expect(pdo).toBeInstanceOf(Pdo);
        await pdo.disconnect();
    });
});
