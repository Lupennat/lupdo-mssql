import { PARAM_DATE, Pdo, TypedBinding } from 'lupdo';
import { DateWithNanosecondsDelta } from 'tedious-better-data-types';
import { pdoData } from '../fixtures/config';

describe('Mssql Date Temporal', () => {
    const pdo = new Pdo(pdoData.driver, pdoData.config);

    beforeAll(async () => {
        await pdo.exec('CREATE TABLE test_date (id int IDENTITY(1,1), date date NULL);');
    });

    afterAll(async () => {
        await pdo.exec('DROP TABLE test_date;');
        await pdo.disconnect();
    });

    it('Works Date As Null', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_date (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATE, null)]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_date WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();
        query = await pdo.query("SELECT CAST(null AS date) AS 'date';");
        expect(query.fetchColumn(0).get()).toBeNull();
    });

    it('Works Date As String', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_date (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATE, '2007-05-08')]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_date WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-08' AS date) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-08');
    });

    it('Works Date As String Ignore Time and TimeZone', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_date (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATE, '2007-05-09 23:59:59.999999999 -01:00')]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_date WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 23:59:59.999999999 -01:00' AS date) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09');
    });

    it('Works Date As Date', async () => {
        const date = new Date('2007-05-10') as DateWithNanosecondsDelta;
        const stmt = await pdo.prepare('INSERT INTO test_date (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATE, date)]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_date WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-10' AS date) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-10');
    });

    it('Works Date As String Ignore Time', async () => {
        const date = new Date('2007-05-11 23:59:59.999') as DateWithNanosecondsDelta;
        date.nanosecondsDelta = 0.000999999;
        const stmt = await pdo.prepare('INSERT INTO test_date (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATE, date)]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_date WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-11 23:59:59.999999999' AS date) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11');
    });

    it('Date As Date Can Not Ignore Timezone', async () => {
        const date = new Date('2007-05-12 23:59:59.999 -01:00') as DateWithNanosecondsDelta;
        date.nanosecondsDelta = 0.000999999;
        const stmt = await pdo.prepare('INSERT INTO test_date (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATE, date)]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_date WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-12 23:59:59.999999999 -01:00' AS date) AS 'date';");
        expect(res).not.toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-13');
    });
});
