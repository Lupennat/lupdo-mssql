import { Pdo, TypedBinding } from 'lupdo';
import { MSSQL_PARAM_SMALLDATETIME } from '../../constants';
import { TediousDate } from '../../types';
import { pdoData } from '../fixtures/config';

describe('Mssql SmallDateTime Temporal', () => {
    const pdo = new Pdo(pdoData.driver, pdoData.config);

    beforeAll(async () => {
        await pdo.exec('CREATE TABLE test_smalldatetime (id int IDENTITY(1,1), date smalldatetime NULL);');
    });

    afterAll(async () => {
        await pdo.exec('DROP TABLE test_smalldatetime;');
        await pdo.disconnect();
    });

    it('Works SmallDateTime As Null', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_smalldatetime (date) values (?);');
        await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, null)]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_smalldatetime WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();
        query = await pdo.query("SELECT null AS 'smalldatetime';");
        expect(query.fetchColumn(0).get()).toBeNull();
    });

    it('Works SmallDateTime As String', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_smalldatetime (date) values (?);');
        await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, '2007-05-08 23:59:00')]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_smalldatetime WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-08 23:59:00' AS smalldatetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-08 23:59:00.000');
    });

    it('Works SmallDateTime As String Round At Minutes', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_smalldatetime (date) values (?);');
        await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, '2007-05-09 00:59:29.999')]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_smalldatetime WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 00:59:29.999' AS smalldatetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09 01:00:00.000');

        stmt = await pdo.prepare('INSERT INTO test_smalldatetime (date) values (?);');
        await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, '2007-05-09 00:59:29.998')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_smalldatetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 00:59:29.998' AS smalldatetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09 00:59:00.000');

        stmt = await pdo.prepare('INSERT INTO test_smalldatetime (date) values (?);');
        await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, '2007-05-09 23:59:30')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_smalldatetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 23:59:30' AS smalldatetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-10 00:00:00.000');
    });

    it('Works SmallDateTime As String Error For Time and TimeZone', async () => {
        await expect(
            pdo.query("SELECT CAST('2007-05-08 23:59:59.999999999 +00:00' AS smalldatetime) AS 'date';")
        ).rejects.toThrowError();
        await expect(
            pdo.query("SELECT CAST('2007-05-08 23:59:59.999999999' AS smalldatetime) AS 'date';")
        ).rejects.toThrowError();
        await expect(
            pdo.query("SELECT CAST('2007-05-08 23:59:59.9999' AS smalldatetime) AS 'date';")
        ).rejects.toThrowError();

        const stmt = await pdo.prepare('INSERT INTO test_smalldatetime (date) values (?);');
        await expect(
            stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, '2007-05-08 23:59:59.999999999 +00:00')])
        ).rejects.toThrowError();

        await expect(
            stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, '2007-05-08 23:59:59.999999999')])
        ).rejects.toThrowError();

        await expect(
            stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, '2007-05-08 23:59:59.9999')])
        ).rejects.toThrowError();
        await stmt.close();
    });

    it('Works SmallDateTime As Date', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_smalldatetime (date) values (?);');
        const date = new Date('2007-05-10 23:59:00');
        await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, date)]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_smalldatetime WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-10 23:59:00' AS smalldatetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-10 23:59:00.000');
    });

    it('Works SmallDateTime As Date Round At Minutes', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_smalldatetime (date) values (?);');
        let date = new Date('2007-05-11 00:59:29.999');
        await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, date)]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_smalldatetime WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-11 00:59:29.999' AS smalldatetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11 01:00:00.000');

        stmt = await pdo.prepare('INSERT INTO test_smalldatetime (date) values (?);');
        date = new Date('2007-05-11 00:59:29.998');
        await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, date)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_smalldatetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-11 00:59:29.998' AS smalldatetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11 00:59:00.000');

        stmt = await pdo.prepare('INSERT INTO test_smalldatetime (date) values (?);');
        date = new Date('2007-05-11 23:59:30');
        await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, date)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_smalldatetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-11 23:59:30' AS smalldatetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-12 00:00:00.000');
    });

    it('Works SmallDateTime As Date Error For Time', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_smalldatetime (date) values (?);');
        let date = new Date('2007-05-12 23:59:59.999 -01:00') as TediousDate;
        date.nanosecondDelta = '0.000999999';
        await expect(stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, date)])).rejects.toThrowError();
        date = new Date('2007-05-12 23:59:59.999 -01:00') as TediousDate;
        date.nanosecondDelta = '0.0009';
        await expect(stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, date)])).rejects.toThrowError();

        await stmt.close();
    });

    it('DateTime As Date Can Not Ignore Timezone', async () => {
        const date = new Date('2007-05-13 23:59:29.998 -01:00') as TediousDate;
        date.nanosecondDelta = '0.000';

        const stmt = await pdo.prepare('INSERT INTO test_smalldatetime (date) values (?);');
        await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, date)]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_smalldatetime WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-13 23:59:29.998' AS smalldatetime) AS 'date';");
        expect(res).not.toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-14 01:59:00.000');
    });

    // it.only('Works Temporal DateTime2', async () => {
    //     const options = { ...pdoData.config };
    //     options.options = options.options ?? {};
    //     options.options.returnDateTimeAsObject = true;
    //     const connection = new Connection(options);
    //     await startConnection(connection);

    //     let sql = 'INSERT INTO test_datetime2 (date) values (?);';
    //     let prepared = new MssqlPreparedRequest(connection as MssqlPoolConnection, sql);
    //     let res = await prepared.execute([TypedBinding.create(PARAM_TIMESTAMP, '0001-01-01 23:59:59.99')]);

    //     sql = 'INSERT INTO test_datetime2 (date) values (?);';
    //     prepared = new MssqlPreparedRequest(connection as MssqlPoolConnection, sql);
    //     res = await prepared.execute([
    //         TypedBinding.create(PARAM_TIMESTAMP, '0001-01-01 00:00:00.999999930', { scale: 1 })
    //     ]);

    //     sql = 'SELECT TOP 2 id, date FROM test_datetime2 ORDER BY id DESC';
    //     res = await new MssqlRequest(connection as MssqlPoolConnection, sql).execute();

    //     for (const item of res[2]) {
    //         console.log(item);
    //     }
    //     // console.log(res[2][0][0].value);
    //     await closeConnection(connection);

    //     // let sql = 'CREATE TABLE test_datetime2 (id int IDENTITY(1,1), date datetime2(1));';
    //     // await new MssqlRequest(connection as MssqlPoolConnection, sql).execute();
    //     // sql = 'INSERT INTO test_datetime2 (date) values (?);';
    //     // let prepared = new MssqlPreparedRequest(connection as MssqlPoolConnection, sql);
    //     // let res = await prepared.execute([TypedBinding.create(PARAM_TIMESTAMP, '0001-01-01 23:59:59.999999950')]);

    //     // sql = 'SELECT TOP 1 date FROM test_datetime2 ORDER BY id DESC';
    //     // res = await new MssqlRequest(connection as MssqlPoolConnection, sql).execute();

    //     // expect(res[2][0][0].value).toEqual({ days: 1, nanoseconds: 0 });

    //     // prepared = new MssqlPreparedRequest(connection as MssqlPoolConnection, sql);
    //     // res = await prepared.execute([TypedBinding.create(PARAM_TIMESTAMP, '0001-01-01 23:59:59.9', { scale: 1 })]);

    //     // sql = 'SELECT TOP 1 date FROM test_datetime2 ORDER BY id DESC';
    //     // res = await new MssqlRequest(connection as MssqlPoolConnection, sql).execute();

    //     // console.log(res[2][0][0].value);
    //     // // expect(res[2][0][0].value).toEqual({ days: 1 });

    //     // sql = 'ALTER TABLE test_datetime2 ALTER COLUMN date datetime2(2)';
    //     // await new MssqlRequest(connection as MssqlPoolConnection, sql).execute();

    //     // prepared = new MssqlPreparedRequest(connection as MssqlPoolConnection, sql);
    //     // res = await prepared.execute([TypedBinding.create(PARAM_TIMESTAMP, '0001-01-01 23:59:59.999999950')]);

    //     // sql = 'SELECT TOP 1 date FROM test_datetime2 ORDER BY id DESC';
    //     // res = await new MssqlRequest(connection as MssqlPoolConnection, sql).execute();

    //     // expect(res[2][0][0].value).toEqual({ days: 1, nanoseconds: 0 });

    //     // await closeConnection(connection);

    //     // options.options.useUTC = true;
    //     // connection = new Connection(options);
    //     // await startConnection(connection);
    //     // sql = 'INSERT INTO test_datetime2 (date) values (?);';
    //     // prepared = new MssqlPreparedRequest(connection as MssqlPoolConnection, sql);
    //     // res = await prepared.execute([TypedBinding.create(PARAM_TIMESTAMP, '0001-01-02 00:59:59.999999950 +01:00')]);

    //     // sql = 'SELECT TOP 1 date FROM test_datetime2 ORDER BY id DESC';
    //     // res = await new MssqlRequest(connection as MssqlPoolConnection, sql).execute();

    //     // expect(res[2][0][0].value).toEqual({ days: 1, nanoseconds: 0 });

    //     // sql = 'DROP TABLE test_datetime2;';
    //     // await new MssqlRequest(connection as MssqlPoolConnection, sql).execute();

    //     // await closeConnection(connection);
    // });
});
