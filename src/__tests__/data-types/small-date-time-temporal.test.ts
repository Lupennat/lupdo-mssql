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
        query = await pdo.query("SELECT CAST(null AS smalldatetime) AS 'date'");
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
        date.nanosecondsDelta = 0.000999999;
        await expect(stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, date)])).rejects.toThrowError();
        date = new Date('2007-05-12 23:59:59.999 -01:00') as TediousDate;
        date.nanosecondsDelta = 0.0009;
        await expect(stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, date)])).rejects.toThrowError();

        await stmt.close();
    });

    it('DateTime As Date Can Not Ignore Timezone', async () => {
        const date = new Date('2007-05-13 23:59:29.998 -01:00') as TediousDate;
        date.nanosecondsDelta = 0.0;

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
});
