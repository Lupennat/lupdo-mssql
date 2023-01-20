import { PARAM_TIMESTAMP, Pdo, TypedBinding } from 'lupdo';

import { DateWithNanosecondsDelta } from 'tedious-better-data-types';
import { pdoData } from '../fixtures/config';

describe('Mssql DateTime2 Temporal', () => {
    const pdo = new Pdo(pdoData.driver, pdoData.config);

    beforeAll(async () => {
        await pdo.exec('CREATE TABLE test_datetime20 (id int IDENTITY(1,1), date datetime2(0) NULL);');
        await pdo.exec('CREATE TABLE test_datetime21 (id int IDENTITY(1,1), date datetime2(1) NULL);');
        await pdo.exec('CREATE TABLE test_datetime22 (id int IDENTITY(1,1), date datetime2(2) NULL);');
        await pdo.exec('CREATE TABLE test_datetime23 (id int IDENTITY(1,1), date datetime2(3) NULL);');
        await pdo.exec('CREATE TABLE test_datetime24 (id int IDENTITY(1,1), date datetime2(4) NULL);');
        await pdo.exec('CREATE TABLE test_datetime25 (id int IDENTITY(1,1), date datetime2(5) NULL);');
        await pdo.exec('CREATE TABLE test_datetime26 (id int IDENTITY(1,1), date datetime2(6) NULL);');
        await pdo.exec('CREATE TABLE test_datetime2 (id int IDENTITY(1,1), date datetime2 NULL);');
    });

    afterAll(async () => {
        await pdo.exec('DROP TABLE test_datetime20;');
        await pdo.exec('DROP TABLE test_datetime21;');
        await pdo.exec('DROP TABLE test_datetime22;');
        await pdo.exec('DROP TABLE test_datetime23;');
        await pdo.exec('DROP TABLE test_datetime24;');
        await pdo.exec('DROP TABLE test_datetime25;');
        await pdo.exec('DROP TABLE test_datetime26;');
        await pdo.exec('DROP TABLE test_datetime2;');
        await pdo.disconnect();
    });

    it('Works DateTime2 As Null', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_datetime2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, null)]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime2 WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();

        stmt = await pdo.prepare('INSERT INTO test_datetime24 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, null)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime24 WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();

        stmt = await pdo.prepare('INSERT INTO test_datetime22 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, null)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime22 WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();

        query = await pdo.query("SELECT CAST(null AS datetime2) AS 'date'");
        expect(query.fetchColumn(0).get()).toBeNull();
    });

    it('Works DateTime2 As String', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_datetime2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-09 23:59:59.123456789')]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime2 WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 23:59:59.123456789' AS datetime2(7)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09 23:59:59.1234568');

        stmt = await pdo.prepare('INSERT INTO test_datetime24 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-09 23:59:59.123456789')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime24 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 23:59:59.123456789' AS datetime2(4)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09 23:59:59.1235');

        stmt = await pdo.prepare('INSERT INTO test_datetime22 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-09 23:59:59.123456789')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime22 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 23:59:59.123456789' AS datetime2(2)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09 23:59:59.12');
    });

    it('Works DateTime2 As Date', async () => {
        const date = new Date('2007-05-10 23:59:59.123') as DateWithNanosecondsDelta;
        date.nanosecondsDelta = 0.000456789;

        let stmt = await pdo.prepare('INSERT INTO test_datetime2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, date)]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime2 WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-10 23:59:59.123456789' AS datetime2(7)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-10 23:59:59.1234568');

        stmt = await pdo.prepare('INSERT INTO test_datetime24 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, date)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime24 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-10 23:59:59.123456789' AS datetime2(4)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-10 23:59:59.1235');

        stmt = await pdo.prepare('INSERT INTO test_datetime22 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, date)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime22 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-10 23:59:59.123456789' AS datetime2(2)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-10 23:59:59.12');
    });

    it('DateTime2 As String Ignore Timezone', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_datetime2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-13 23:59:59.998456789 -01:00')]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime2 WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-13 23:59:59.998456789 -01:00' AS datetime2) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-13 23:59:59.9984568');
    });

    it('DateTime2 As Date Can Not Ignore Timezone', async () => {
        const date = new Date('2007-05-13 23:59:59.998 -01:00') as DateWithNanosecondsDelta;
        date.nanosecondsDelta = 0.000456789;

        const stmt = await pdo.prepare('INSERT INTO test_datetime2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, date)]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime2 WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-13 23:59:59.998456789 -01:00' AS datetime2) AS 'date';");
        expect(res).not.toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-14 01:59:59.9984568');
    });

    it('Works DateTime2 Can Have Options Scale', async () => {
        // scale 6
        let stmt = await pdo.prepare('INSERT INTO test_datetime26 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-15 23:59:59.123456789', { scale: 6 })]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime26 WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789' AS datetime2(6)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59.123457');

        // scale 5
        stmt = await pdo.prepare('INSERT INTO test_datetime25 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-15 23:59:59.123456789', { scale: 5 })]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime25 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789' AS datetime2(5)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59.12346');

        // scale 4
        stmt = await pdo.prepare('INSERT INTO test_datetime24 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-15 23:59:59.123456789', { scale: 4 })]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime24 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789' AS datetime2(4)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59.1235');

        // scale 3
        stmt = await pdo.prepare('INSERT INTO test_datetime23 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-15 23:59:59.123456789', { scale: 3 })]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime23 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789' AS datetime2(3)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59.123');

        // scale 2
        stmt = await pdo.prepare('INSERT INTO test_datetime22 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-15 23:59:59.123456789', { scale: 2 })]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime22 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789' AS datetime2(2)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59.12');

        // scale 1
        stmt = await pdo.prepare('INSERT INTO test_datetime21 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-15 23:59:59.123456789', { scale: 1 })]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime21 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789' AS datetime2(1)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59.1');

        // scale 0
        stmt = await pdo.prepare('INSERT INTO test_datetime20 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-15 23:59:59.123456789', { scale: 0 })]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime20 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789' AS datetime2(0)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59');
    });

    it('Works DateTime2 Scale Different From Database Scale', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_datetime2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-16 23:59:59.123456789', { scale: 1 })]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        const query = await pdo.query('SELECT date FROM test_datetime2 WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBe('2007-05-16 23:59:59.1000000');
    });

    it('Works DateTime2 Round To Next Day', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_datetime2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-17 23:59:59.999999999', { scale: 1 })]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime2 WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-17 23:59:59.999999999' AS datetime2) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-18 00:00:00.0000000');
    });

    it('Works DateTime2 As Incomplete String', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_datetime2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-15')]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetime2 WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15' AS datetime2) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 00:00:00.0000000');

        stmt = await pdo.prepare('INSERT INTO test_datetime2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-15 22:10')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime2 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 22:10' AS datetime2) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 22:10:00.0000000');

        stmt = await pdo.prepare('INSERT INTO test_datetime2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '22:10')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetime2 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('22:10' AS datetime2) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('1900-01-01 22:10:00.0000000');

        stmt = await pdo.prepare('INSERT INTO test_datetime2 (date) values (?);');
        await expect(stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2007-05-15 -01:00')])).rejects.toThrowError();
        await stmt.close();
        await expect(pdo.query("SELECT CAST('2007-05-15 -01:00' AS datetime2) AS 'date';")).rejects.toThrowError();
    });
});
