import { PARAM_DATETIME, Pdo, TypedBinding } from 'lupdo';
import { TediousDate } from '../../types';
import { pdoData } from '../fixtures/config';

describe('Mssql DateTime Temporal', () => {
    const pdo = new Pdo(pdoData.driver, pdoData.config);

    beforeAll(async () => {
        await pdo.exec('CREATE TABLE test_datetime (id int IDENTITY(1,1), date datetime NULL);');
    });

    afterAll(async () => {
        await pdo.exec('DROP TABLE test_datetime;');
        await pdo.disconnect();
    });

    it('Works DateTime As Null', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, null)]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();
        query = await pdo.query("SELECT null AS 'datetime';");
        expect(query.fetchColumn(0).get()).toBeNull();
    });

    it('Works DateTime As String', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, '2007-05-08 23:10:10')]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-08 23:10:10' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-08 23:10:10.000');
    });

    it('Works DateTime As String Round At Three-Hundredths Of A Second ', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, '2007-05-09 00:00:00.001')]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 00:00:00.001' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09 00:00:00.000');

        stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, '2007-05-09 00:00:00.002')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 00:00:00.002' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09 00:00:00.003');

        stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, '2007-05-09 00:00:00.005')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 00:00:00.005' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09 00:00:00.007');

        stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, '2007-05-09 00:00:00.998')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 00:00:00.998' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09 00:00:00.997');

        stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, '2007-05-09 00:00:00.999')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 00:00:00.999' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09 00:00:01.000');

        stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, '2007-05-09 23:59:59.999')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 23:59:59.999' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-10 00:00:00.000');
    });

    it('Works DateTime As String Error For Time and TimeZone', async () => {
        await expect(
            pdo.query("SELECT CAST('2007-05-08 23:59:59.999999999 +00:00' AS datetime) AS 'date';")
        ).rejects.toThrowError();
        await expect(
            pdo.query("SELECT CAST('2007-05-08 23:59:59.999999999' AS datetime) AS 'date';")
        ).rejects.toThrowError();
        await expect(
            pdo.query("SELECT CAST('2007-05-08 23:59:59.9999' AS datetime) AS 'date';")
        ).rejects.toThrowError();

        const stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        await expect(
            stmt.execute([TypedBinding.create(PARAM_DATETIME, '2007-05-08 23:59:59.999999999 +00:00')])
        ).rejects.toThrowError();

        await expect(
            stmt.execute([TypedBinding.create(PARAM_DATETIME, '2007-05-08 23:59:59.999999999')])
        ).rejects.toThrowError();

        await expect(
            stmt.execute([TypedBinding.create(PARAM_DATETIME, '2007-05-08 23:59:59.9999')])
        ).rejects.toThrowError();
        await stmt.close();
    });

    it('Works DateTime As Date', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        const date = new Date('2007-05-10 23:10:10');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, date)]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-10 23:10:10' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-10 23:10:10.000');
    });

    it('Works DateTime As Date Round At Three-Hundredths Of A Second ', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        let date = new Date('2007-05-11 00:00:00.001');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, date)]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-11 00:00:00.001' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11 00:00:00.000');

        stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        date = new Date('2007-05-11 00:00:00.002');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, date)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-11 00:00:00.002' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11 00:00:00.003');

        stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        date = new Date('2007-05-11 00:00:00.005');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, date)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-11 00:00:00.005' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11 00:00:00.007');

        stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        date = new Date('2007-05-11 00:00:00.998');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, date)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-11 00:00:00.998' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11 00:00:00.997');

        stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        date = new Date('2007-05-11 00:00:00.999');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, date)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-11 00:00:00.999' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11 00:00:01.000');

        stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        date = new Date('2007-05-11 23:59:59.999');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, date)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-11 23:59:59.999' AS datetime) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-12 00:00:00.000');
    });

    it('Works DateTime As Date Error For Time', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        let date = new Date('2007-05-12 23:59:59.999 -01:00') as TediousDate;
        date.nanosecondDelta = '0.000999999';
        await expect(stmt.execute([TypedBinding.create(PARAM_DATETIME, date)])).rejects.toThrowError();
        date = new Date('2007-05-12 23:59:59.999 -01:00') as TediousDate;
        date.nanosecondDelta = '0.0009';
        await expect(stmt.execute([TypedBinding.create(PARAM_DATETIME, date)])).rejects.toThrowError();

        await stmt.close();
    });

    it('DateTime As Date Can Not Ignore Timezone', async () => {
        const date = new Date('2007-05-13 23:59:59.998 -01:00') as TediousDate;
        date.nanosecondDelta = '0.000';

        const stmt = await pdo.prepare('INSERT INTO test_datetime (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, date)]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-13 23:59:59.998' AS datetime) AS 'date';");
        expect(res).not.toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-14 01:59:59.997');
    });
});
