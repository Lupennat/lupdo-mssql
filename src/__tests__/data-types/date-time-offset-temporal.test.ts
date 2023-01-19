import { PARAM_DATETIMEZONE, Pdo, TypedBinding } from 'lupdo';
import { TediousDate } from '../../types';
import { pdoData } from '../fixtures/config';

describe('Mssql DateTimeOffser Temporal', () => {
    const pdo = new Pdo(pdoData.driver, pdoData.config);

    beforeAll(async () => {
        await pdo.exec('CREATE TABLE test_datetimeoffset0 (id int IDENTITY(1,1), date datetimeoffset(0) NULL);');
        await pdo.exec('CREATE TABLE test_datetimeoffset1 (id int IDENTITY(1,1), date datetimeoffset(1) NULL);');
        await pdo.exec('CREATE TABLE test_datetimeoffset2 (id int IDENTITY(1,1), date datetimeoffset(2) NULL);');
        await pdo.exec('CREATE TABLE test_datetimeoffset3 (id int IDENTITY(1,1), date datetimeoffset(3) NULL);');
        await pdo.exec('CREATE TABLE test_datetimeoffset4 (id int IDENTITY(1,1), date datetimeoffset(4) NULL);');
        await pdo.exec('CREATE TABLE test_datetimeoffset5 (id int IDENTITY(1,1), date datetimeoffset(5) NULL);');
        await pdo.exec('CREATE TABLE test_datetimeoffset6 (id int IDENTITY(1,1), date datetimeoffset(6) NULL);');
        await pdo.exec('CREATE TABLE test_datetimeoffset (id int IDENTITY(1,1), date datetimeoffset NULL);');
    });

    afterAll(async () => {
        await pdo.exec('DROP TABLE test_datetimeoffset0;');
        await pdo.exec('DROP TABLE test_datetimeoffset1;');
        await pdo.exec('DROP TABLE test_datetimeoffset2;');
        await pdo.exec('DROP TABLE test_datetimeoffset3;');
        await pdo.exec('DROP TABLE test_datetimeoffset4;');
        await pdo.exec('DROP TABLE test_datetimeoffset5;');
        await pdo.exec('DROP TABLE test_datetimeoffset6;');
        await pdo.exec('DROP TABLE test_datetimeoffset;');
        await pdo.disconnect();
    });

    it('Works DateTimeOffset As Null', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_datetimeoffset (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, null)]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetimeoffset WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();

        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset4 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, null)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset4 WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();

        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, null)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset2 WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();

        query = await pdo.query("SELECT CAST(null AS datetimeoffset) AS 'date'");
        expect(query.fetchColumn(0).get()).toBeNull();
    });

    it('Works DateTimeOffset As String', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_datetimeoffset (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-09 23:59:59.123456789 -01:00')]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetimeoffset WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 23:59:59.123456789 -01:00' AS datetimeoffset(7)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09 23:59:59.1234568-01:00');
        query = await pdo.query("SELECT date AT TIME ZONE 'UTC' AS date FROM test_datetimeoffset WHERE id = " + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query(
            "SELECT CAST('2007-05-09 23:59:59.123456789 -01:00' AS datetimeoffset(7)) AT TIME ZONE 'UTC' AS 'date';"
        );
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-10 00:59:59.1234568+00:00');

        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset4 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-09 23:59:59.123456789 -01:00')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset4 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 23:59:59.123456789 -01:00' AS datetimeoffset(4)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09 23:59:59.1235-01:00');
        query = await pdo.query("SELECT date AT TIME ZONE 'UTC' AS date FROM test_datetimeoffset4 WHERE id = " + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query(
            "SELECT CAST('2007-05-09 23:59:59.123456789 -01:00' AS datetimeoffset(4)) AT TIME ZONE 'UTC' AS 'date';"
        );
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-10 00:59:59.1235+00:00');

        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-09 23:59:59.123456789 -01:00')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset2 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-09 23:59:59.123456789 -01:00' AS datetimeoffset(2)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-09 23:59:59.12-01:00');
        query = await pdo.query("SELECT date AT TIME ZONE 'UTC' AS date FROM test_datetimeoffset2 WHERE id = " + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query(
            "SELECT CAST('2007-05-09 23:59:59.123456789 -01:00' AS datetimeoffset(2)) AT TIME ZONE 'UTC' AS 'date';"
        );
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-10 00:59:59.12+00:00');
    });

    it('DateTimeOffset As Date Can Not Bypass Local Timezone', async () => {
        const date = new Date('2007-05-10 23:59:59.123 -01:00') as TediousDate;
        date.nanosecondsDelta = 0.000456789;

        let stmt = await pdo.prepare('INSERT INTO test_datetimeoffset (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, date)]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetimeoffset WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-10 23:59:59.123456789 -01:00' AS datetimeoffset(7)) AS 'date';");
        expect(res).not.toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11 01:59:59.1234568+01:00');
        query = await pdo.query("SELECT date AT TIME ZONE 'UTC' AS date FROM test_datetimeoffset WHERE id = " + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query(
            "SELECT CAST('2007-05-10 23:59:59.123456789 -01:00' AS datetimeoffset(7)) AT TIME ZONE 'UTC' AS 'date';"
        );
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11 00:59:59.1234568+00:00');

        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset4 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, date)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset4 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-10 23:59:59.123456789 -01:00' AS datetimeoffset(4)) AS 'date';");
        expect(res).not.toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11 01:59:59.1235+01:00');
        query = await pdo.query("SELECT date AT TIME ZONE 'UTC' AS date FROM test_datetimeoffset4 WHERE id = " + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query(
            "SELECT CAST('2007-05-10 23:59:59.123456789 -01:00' AS datetimeoffset(4)) AT TIME ZONE 'UTC' AS 'date';"
        );
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11 00:59:59.1235+00:00');

        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, date)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset2 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-10 23:59:59.123456789 -01:00' AS datetimeoffset(2)) AS 'date';");
        expect(res).not.toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11 01:59:59.12+01:00');
        query = await pdo.query("SELECT date AT TIME ZONE 'UTC' AS date FROM test_datetimeoffset2 WHERE id = " + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query(
            "SELECT CAST('2007-05-10 23:59:59.123456789 -01:00' AS datetimeoffset(2)) AT TIME ZONE 'UTC' AS 'date';"
        );
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-11 00:59:59.12+00:00');
    });

    it('Works DateTimeOffset Can Have Options Scale', async () => {
        // scale 6
        let stmt = await pdo.prepare('INSERT INTO test_datetimeoffset6 (date) values (?);');
        await stmt.execute([
            TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-15 23:59:59.123456789 -01:00', { scale: 6 })
        ]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetimeoffset6 WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(6)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59.123457-01:00');
        query = await pdo.query("SELECT date AT TIME ZONE 'UTC' AS date FROM test_datetimeoffset6 WHERE id = " + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query(
            "SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(6)) AT TIME ZONE 'UTC' AS 'date';"
        );
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-16 00:59:59.123457+00:00');

        // scale 5
        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset5 (date) values (?);');
        await stmt.execute([
            TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-15 23:59:59.123456789 -01:00', { scale: 5 })
        ]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset5 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(5)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59.12346-01:00');
        query = await pdo.query("SELECT date AT TIME ZONE 'UTC' AS date FROM test_datetimeoffset5 WHERE id = " + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query(
            "SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(5)) AT TIME ZONE 'UTC' AS 'date';"
        );
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-16 00:59:59.12346+00:00');

        // scale 4
        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset4 (date) values (?);');
        await stmt.execute([
            TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-15 23:59:59.123456789 -01:00', { scale: 4 })
        ]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset4 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(4)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59.1235-01:00');
        query = await pdo.query("SELECT date AT TIME ZONE 'UTC' AS date FROM test_datetimeoffset4 WHERE id = " + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query(
            "SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(4)) AT TIME ZONE 'UTC' AS 'date';"
        );
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-16 00:59:59.1235+00:00');

        // scale 3
        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset3 (date) values (?);');
        await stmt.execute([
            TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-15 23:59:59.123456789 -01:00', { scale: 3 })
        ]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset3 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(3)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59.123-01:00');
        query = await pdo.query("SELECT date AT TIME ZONE 'UTC' AS date FROM test_datetimeoffset3 WHERE id = " + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query(
            "SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(3)) AT TIME ZONE 'UTC' AS 'date';"
        );
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-16 00:59:59.123+00:00');

        // scale 2
        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset2 (date) values (?);');
        await stmt.execute([
            TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-15 23:59:59.123456789 -01:00', { scale: 2 })
        ]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset2 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(2)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59.12-01:00');
        query = await pdo.query("SELECT date AT TIME ZONE 'UTC' AS date FROM test_datetimeoffset2 WHERE id = " + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query(
            "SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(2)) AT TIME ZONE 'UTC' AS 'date';"
        );
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-16 00:59:59.12+00:00');

        // scale 1
        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset1 (date) values (?);');
        await stmt.execute([
            TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-15 23:59:59.123456789 -01:00', { scale: 1 })
        ]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset1 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(1)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59.1-01:00');
        query = await pdo.query("SELECT date AT TIME ZONE 'UTC' AS date FROM test_datetimeoffset1 WHERE id = " + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query(
            "SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(1)) AT TIME ZONE 'UTC' AS 'date';"
        );
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-16 00:59:59.1+00:00');

        // scale 0
        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset0 (date) values (?);');
        await stmt.execute([
            TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-15 23:59:59.123456789 -01:00', { scale: 0 })
        ]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset0 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(0)) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 23:59:59-01:00');
        query = await pdo.query("SELECT date AT TIME ZONE 'UTC' AS date FROM test_datetimeoffset0 WHERE id = " + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query(
            "SELECT CAST('2007-05-15 23:59:59.123456789 -01:00' AS datetimeoffset(0)) AT TIME ZONE 'UTC' AS 'date';"
        );
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-16 00:59:59+00:00');
    });

    it('Works DateTimeOffset Scale Different From Database Scale', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_datetimeoffset (date) values (?);');
        await stmt.execute([
            TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-16 23:59:59.123456789 -01:00', { scale: 1 })
        ]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        const query = await pdo.query('SELECT date FROM test_datetimeoffset WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBe('2007-05-16 23:59:59.1000000-01:00');
    });

    it('Works DateTimeOffset Min-Max Timezone', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_datetimeoffset (date) values (?);');
        await expect(
            stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-16 23:59:59.123456789 -14:01')])
        ).rejects.toThrowError();
        await expect(
            stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-16 23:59:59.123456789 +14:01')])
        ).rejects.toThrowError();

        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-16 23:59:59.123456789 +14:00')]);
        let id = await stmt.lastInsertId();
        let query = await pdo.query('SELECT date FROM test_datetimeoffset WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-16 23:59:59.123456789 +14:00' AS datetimeoffset) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-16 23:59:59.1234568+14:00');

        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-16 23:59:59.123456789 -14:00')]);
        id = await stmt.lastInsertId();
        query = await pdo.query('SELECT date FROM test_datetimeoffset WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-16 23:59:59.123456789 -14:00' AS datetimeoffset) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-16 23:59:59.1234568-14:00');

        await stmt.close();
    });

    it('Works DateTimeOffset Round To Next Day', async () => {
        const stmt = await pdo.prepare('INSERT INTO test_datetimeoffset (date) values (?);');
        await stmt.execute([
            TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-17 23:59:59.999999999 +00:00', { scale: 1 })
        ]);
        const id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetimeoffset WHERE id = ' + id);
        const res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-17 23:59:59.999999999 +00:00' AS datetimeoffset) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-18 00:00:00.0000000+00:00');
    });

    it('Works DateTimeOffset As Incomplete String', async () => {
        let stmt = await pdo.prepare('INSERT INTO test_datetimeoffset (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-15')]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM test_datetimeoffset WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15' AS datetimeoffset) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 00:00:00.0000000+00:00');

        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-15 22:10')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2007-05-15 22:10' AS datetimeoffset) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('2007-05-15 22:10:00.0000000+00:00');

        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '22:10')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('22:10' AS datetimeoffset) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('1900-01-01 22:10:00.0000000+00:00');

        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '22:10 -01:00')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM test_datetimeoffset WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('22:10 -01:00' AS datetimeoffset) AS 'date';");
        expect(res).toBe(query.fetchColumn(0).get());
        expect(res).toBe('1900-01-01 22:10:00.0000000-01:00');

        stmt = await pdo.prepare('INSERT INTO test_datetimeoffset (date) values (?);');
        await expect(
            stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '2007-05-15 -01:00')])
        ).rejects.toThrowError();
        await stmt.close();
        await expect(pdo.query("SELECT CAST('2007-05-15 -01:00' AS datetimeoffset) AS 'date';")).rejects.toThrowError();
    });
});
