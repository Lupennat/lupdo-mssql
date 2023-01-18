import { PARAM_TIME, Pdo, TypedBinding } from 'lupdo';
import { TediousDate } from '../../types';
import { pdoData } from '../fixtures/config';

describe('Mssql Time Temporal', () => {
    const pdo = new Pdo(pdoData.driver, pdoData.config);

    beforeAll(async () => {
        await pdo.exec('CREATE TABLE test_time0 (id int IDENTITY(1,1), time time(0) NULL);');
        await pdo.exec('CREATE TABLE test_time1 (id int IDENTITY(1,1), time time(1) NULL);');
        await pdo.exec('CREATE TABLE test_time2 (id int IDENTITY(1,1), time time(2) NULL);');
        await pdo.exec('CREATE TABLE test_time3 (id int IDENTITY(1,1), time time(3) NULL);');
        await pdo.exec('CREATE TABLE test_time4 (id int IDENTITY(1,1), time time(4) NULL);');
        await pdo.exec('CREATE TABLE test_time5 (id int IDENTITY(1,1), time time(5) NULL);');
        await pdo.exec('CREATE TABLE test_time6 (id int IDENTITY(1,1), time time(6) NULL);');
        await pdo.exec('CREATE TABLE test_time (id int IDENTITY(1,1), time time NULL);');
    });

    afterAll(async () => {
        await pdo.exec('DROP TABLE test_time0;');
        await pdo.exec('DROP TABLE test_time1;');
        await pdo.exec('DROP TABLE test_time2;');
        await pdo.exec('DROP TABLE test_time3;');
        await pdo.exec('DROP TABLE test_time4;');
        await pdo.exec('DROP TABLE test_time5;');
        await pdo.exec('DROP TABLE test_time6;');
        await pdo.exec('DROP TABLE test_time;');
        await pdo.disconnect();
    });

    it('Works Time As Null', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_time (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, null)]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT time FROM test_time WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();

        stmt = await pdo.prepare('INSERT INTO test_time4 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, null)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time4 WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();

        stmt = await pdo.prepare('INSERT INTO test_time2 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, null)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time2 WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();

        query = await pdo.query("SELECT CAST(null AS time) AS 'time'");
        expect(query.fetchColumn(0).get()).toBeNull();
    });

    it('Works Time As String', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_time (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.123456789')]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT time FROM test_time WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.123456789' AS time(7)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.1234568');

        stmt = await pdo.prepare('INSERT INTO test_time4 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.123456789')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time4 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.123456789' AS time(4)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.1235');

        stmt = await pdo.prepare('INSERT INTO test_time2 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.123456789')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time2 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.123456789' AS time(2)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.12');
    });

    it('Works Time As Date', async () => {
        const date = new Date('2007-05-10 23:59:59.123') as TediousDate;
        date.nanosecondsDelta = 0.000456789;

        let stmt = await pdo.prepare('INSERT INTO test_time (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, date)]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT time FROM test_time WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.123456789' AS time(7)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.1234568');

        stmt = await pdo.prepare('INSERT INTO test_time4 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, date)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time4 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.123456789' AS time(4)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.1235');

        stmt = await pdo.prepare('INSERT INTO test_time2 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, date)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time2 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.123456789' AS time(2)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.12');
    });

    it('Time As String Ignore Timezone', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_time (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.998456789 -01:00')]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT time FROM test_time WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.998456789' AS time) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.9984568');
    });

    it('Time As Date Can Not Ignore Timezone', async () => {
        const date = new Date('2007-05-13 23:59:59.998 -01:00') as TediousDate;
        date.nanosecondsDelta = 0.000456789;

        const stmt = await pdo.prepare('INSERT INTO test_time (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, date)]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT time FROM test_time WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.998456789 -01:00' AS time) AS 'time';");
        expect(res).not.toBe(query.fetchColumn(0).get());
        expect(res).toBe('01:59:59.9984568');
    });

    it('Works Time Can Have Options Scale', async () => {
        // scale 6
        let stmt = await pdo.prepare('INSERT INTO test_time6 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.123456789', { scale: 6 })]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT time FROM test_time6 WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.123456789' AS time(6)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.123457');

        // scale 5
        stmt = await pdo.prepare('INSERT INTO test_time5 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.123456789', { scale: 5 })]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time5 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.123456789' AS time(5)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.12346');

        // scale 4
        stmt = await pdo.prepare('INSERT INTO test_time4 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.123456789', { scale: 4 })]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time4 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.123456789' AS time(4)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.1235');

        // scale 3
        stmt = await pdo.prepare('INSERT INTO test_time3 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.123456789', { scale: 3 })]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time3 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.123456789' AS time(3)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.123');

        // scale 2
        stmt = await pdo.prepare('INSERT INTO test_time2 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.123456789', { scale: 2 })]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time2 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.123456789' AS time(2)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.12');

        // scale 1
        stmt = await pdo.prepare('INSERT INTO test_time1 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.123456789', { scale: 1 })]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time1 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.123456789' AS time(1)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.1');

        // scale 0
        stmt = await pdo.prepare('INSERT INTO test_time0 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.123456789', { scale: 0 })]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time0 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.123456789' AS time(0)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59');
    });

    it('Works Time Scale Different From Database Scale', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_time (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.123456789', { scale: 1 })]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        const query = await pdo.query('SELECT time FROM test_time WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBe('23:59:59.1000000');
    });

    it('Works Zero Time', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_time (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '00:00:00.000000000')]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT time FROM test_time WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('00:00:00.000000000' AS time) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('00:00:00.0000000');
    });

    it('Works Time Do Not Round To Next Day', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_time (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.999999999')]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT time FROM test_time WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.999999999' AS time) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.9999999');

        stmt = await pdo.prepare('INSERT INTO test_time4 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.999999999')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time4 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.999999999' AS time(4)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59.9999');

        stmt = await pdo.prepare('INSERT INTO test_time0 (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '23:59:59.999999999')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time0 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('23:59:59.999999999' AS time(0)) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('23:59:59');
    });

    it('Works Time As Incomplete String', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_time (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '2007-05-15')]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT time FROM test_time WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15' AS time) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('00:00:00.0000000');

        stmt = await pdo.prepare('INSERT INTO test_time (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '2007-05-15 22:10')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 22:10' AS time) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('22:10:00.0000000');

        stmt = await pdo.prepare('INSERT INTO test_time (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '22:10')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM test_time WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('22:10' AS time) AS 'time';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('22:10:00.0000000');

        stmt = await pdo.prepare('INSERT INTO test_time (time) values (?);');
        await expect(stmt.execute([TypedBinding.create(PARAM_TIME, '2007-05-15 -01:00')])).rejects.toThrowError();
        await stmt.close();
        await expect(pdo.query("SELECT CAST('2007-05-15 -01:00' AS time) AS 'time';")).rejects.toThrowError();
    });
});
