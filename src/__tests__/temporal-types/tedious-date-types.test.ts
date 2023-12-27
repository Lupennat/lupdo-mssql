import { PARAM_DATE, PARAM_DATETIME, PARAM_DATETIMEZONE, PARAM_TIME, PARAM_TIMESTAMP, Pdo, TypedBinding } from 'lupdo';
import { MSSQL_DATE_BINDING, MSSQL_DATE_BINDING_DATE, MSSQL_PARAM_SMALLDATETIME } from '../../constants';
import mssqlParser from '../../mssql-parser';
import MssqlPreparedRequest from '../../mssql-prepared-request';
import MssqlRequest from '../../mssql-request';
import { MssqlPoolConnection } from '../../types';
import { pdoData } from '../fixtures/config';

describe('Mssql Tedious Date Types', () => {
    const pdo = new Pdo(pdoData.driver, pdoData.config, {}, { [MSSQL_DATE_BINDING]: MSSQL_DATE_BINDING_DATE });

    const options = { ...pdoData.config };
    options.options = {
        ...options.options,
        ...{ returnDateTimeAsObject: false, useUTC: false, customParsers: mssqlParser }
    };
    const tmpPdo = new Pdo(pdoData.driver, options);

    const utcOptions = { ...options };
    utcOptions.options = { ...utcOptions.options, ...{ useUTC: true } };
    const tmpPdoUct = new Pdo(pdoData.driver, utcOptions);

    let connection: MssqlPoolConnection;

    let connectionUtc: MssqlPoolConnection;

    const closeConnection = (): Promise<void> => {
        return new Promise(resolve => {
            connection.once('end', () => {
                connection.removeAllListeners();
                resolve();
            });
            connection.close();
        });
    };

    const closeUtcConnection = (): Promise<void> => {
        return new Promise(resolve => {
            connectionUtc.once('end', () => {
                connectionUtc.removeAllListeners();
                resolve();
            });
            connectionUtc.close();
        });
    };

    beforeAll(async () => {
        connection = (await tmpPdo.getRawDriverConnection()) as MssqlPoolConnection;
        connectionUtc = (await tmpPdoUct.getRawDriverConnection()) as MssqlPoolConnection;
        await pdo.exec('CREATE TABLE ted_test_date (id int IDENTITY(1,1), date date NULL);');
        await pdo.exec('CREATE TABLE ted_test_smalldatetime (id int IDENTITY(1,1), date smalldatetime NULL);');
        await pdo.exec('CREATE TABLE ted_test_datetime (id int IDENTITY(1,1), date datetime NULL);');
        await pdo.exec('CREATE TABLE ted_test_datetime2 (id int IDENTITY(1,1), date datetime2 NULL);');
        await pdo.exec('CREATE TABLE ted_test_datetimeoffset (id int IDENTITY(1,1), date datetimeoffset NULL);');
        await pdo.exec('CREATE TABLE ted_test_time (id int IDENTITY(1,1), time time NULL);');
    });

    afterAll(async () => {
        await pdo.exec('DROP TABLE ted_test_date;');
        await pdo.exec('DROP TABLE ted_test_smalldatetime;');
        await pdo.exec('DROP TABLE ted_test_datetime;');
        await pdo.exec('DROP TABLE ted_test_datetime2;');
        await pdo.exec('DROP TABLE ted_test_datetimeoffset;');
        await pdo.exec('DROP TABLE ted_test_time;');
        await closeConnection();
        await closeUtcConnection();
        await tmpPdo.disconnect();
        await tmpPdoUct.disconnect();
        await pdo.disconnect();
    });

    it('Works Tedious Date Types As Null', async () => {
        let stmt = await pdo.prepare('INSERT INTO ted_test_date (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATE, null)]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM ted_test_date WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();
        query = await pdo.query("SELECT CAST(null AS date) AS 'date';");
        expect(query.fetchColumn(0).get()).toBeNull();

        stmt = await pdo.prepare('INSERT INTO ted_test_smalldatetime (date) values (?);');
        await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, null)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM ted_test_smalldatetime WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();
        query = await pdo.query("SELECT CAST(null AS smalldatetime) AS 'date';");
        expect(query.fetchColumn(0).get()).toBeNull();

        stmt = await pdo.prepare('INSERT INTO ted_test_datetime (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, null)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM ted_test_datetime WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();
        query = await pdo.query("SELECT CAST(null AS datetime) AS 'date';");
        expect(query.fetchColumn(0).get()).toBeNull();

        stmt = await pdo.prepare('INSERT INTO ted_test_datetime2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, null)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM ted_test_datetime2 WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();
        query = await pdo.query("SELECT CAST(null AS datetime2) AS 'date';");
        expect(query.fetchColumn(0).get()).toBeNull();

        stmt = await pdo.prepare('INSERT INTO ted_test_datetimeoffset (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, null)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM ted_test_datetimeoffset WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();
        query = await pdo.query("SELECT CAST(null AS datetimeoffset) AS 'date';");
        expect(query.fetchColumn(0).get()).toBeNull();

        stmt = await pdo.prepare('INSERT INTO ted_test_time (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, null)]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM ted_test_time WHERE id = ' + id);
        expect(query.fetchColumn(0).get()).toBeNull();
        query = await pdo.query("SELECT CAST(null AS time) AS 'time';");
        expect(query.fetchColumn(0).get()).toBeNull();
    });

    it('Works Tedious Date Types As String From Object', async () => {
        let stmt = await pdo.prepare('INSERT INTO ted_test_date (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATE, '2023-01-02 23:59:59.999')]);
        let id = await stmt.lastInsertId();
        await stmt.close();
        let query = await pdo.query('SELECT date FROM ted_test_date WHERE id = ' + id);
        let res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2023-01-02 23:59:59.999' AS date) AS 'date';");
        let cast = query.fetchColumn(0).get();
        expect(res).toBe(cast);
        expect(res).toBe('2023-01-02');

        stmt = await pdo.prepare('INSERT INTO ted_test_smalldatetime (date) values (?);');
        await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, '2023-01-02 23:59:59.999')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM ted_test_smalldatetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2023-01-02 23:59:59.999' AS smalldatetime) AS 'date';");
        cast = query.fetchColumn(0).get();
        expect(res).not.toBe(cast);
        // WRONG DATA STORED ON DB
        expect(res).toBe('2023-01-03 23:59:00.000');
        expect(cast).toBe('2023-01-03 00:00:00.000');

        stmt = await pdo.prepare('INSERT INTO ted_test_datetime (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, '2023-01-02 23:59:59.999')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM ted_test_datetime WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2023-01-02 23:59:59.999' AS datetime) AS 'date';");
        cast = query.fetchColumn(0).get();
        expect(res).toBe(cast);
        expect(res).toBe('2023-01-03 00:00:00.000');

        stmt = await pdo.prepare('INSERT INTO ted_test_datetime2 (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2023-01-02 23:59:59.999')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM ted_test_datetime2 WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2023-01-02 23:59:59.999' AS datetime2) AS 'date';");
        cast = query.fetchColumn(0).get();
        expect(res).toBe(cast);
        expect(res).toBe('2023-01-02 23:59:59.9990000');

        stmt = await pdo.prepare('INSERT INTO ted_test_datetimeoffset (date) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '2023-01-02 23:59:59.999')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT date FROM ted_test_datetimeoffset WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2023-01-02 23:59:59.999' AS datetimeoffset) AS 'date';");
        cast = query.fetchColumn(0).get();
        expect(res).not.toBe(cast);
        expect(res).toBe('2023-01-02 23:59:59.9990000+01:00');
        expect(cast).toBe('2023-01-02 23:59:59.9990000+00:00');

        stmt = await pdo.prepare('INSERT INTO ted_test_time (time) values (?);');
        await stmt.execute([TypedBinding.create(PARAM_TIME, '2023-01-02 23:59:59.999')]);
        id = await stmt.lastInsertId();
        await stmt.close();
        query = await pdo.query('SELECT time FROM ted_test_time WHERE id = ' + id);
        res = query.fetchColumn(0).get();
        query = await pdo.query("SELECT CAST('2023-01-02 23:59:59.999' AS time) AS 'time';");
        cast = query.fetchColumn(0).get();
        expect(res).toBe(cast);
        expect(res).toBe('23:59:59.9990000');
    });

    it('Works Tedious Date Types As String From Tedious Date', async () => {
        let stmt = new MssqlPreparedRequest(connection, 'INSERT INTO ted_test_date (date) values (?);', false);
        let res = await stmt.execute([TypedBinding.create(PARAM_DATE, '2023-01-02 23:59:59.999')]);
        res = await new MssqlRequest(connection, 'SELECT CAST(@@IDENTITY AS bigInt);').execute();
        let id = res[2][0][0][0].value;
        res = await new MssqlRequest(connection, 'SELECT date FROM ted_test_date WHERE id = ' + id).execute();
        let cast = await new MssqlRequest(
            connection,
            "SELECT CAST('2023-01-02 23:59:59.999' AS date) AS 'date';"
        ).execute();
        expect(res[2][0][0][0].value).toBe(cast[2][0][0][0].value);
        expect(res[2][0][0][0].value).toBe('2023-01-02');

        stmt = new MssqlPreparedRequest(connection, 'INSERT INTO ted_test_smalldatetime (date) values (?);', false);
        res = await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, '2023-01-02 23:59:59.999')]);
        res = await new MssqlRequest(connection, 'SELECT CAST(@@IDENTITY AS bigInt);').execute();
        id = res[2][0][0][0].value;
        res = await new MssqlRequest(connection, 'SELECT date FROM ted_test_smalldatetime WHERE id = ' + id).execute();
        cast = await new MssqlRequest(
            connection,
            "SELECT CAST('2023-01-02 23:59:59.999' AS smalldatetime) AS 'date';"
        ).execute();
        expect(res[2][0][0][0].value).not.toBe(cast[2][0][0][0].value);
        // WRONG DATA STORED ON DB
        expect(res[2][0][0][0].value).toBe('2023-01-03 23:59:00.000');
        expect(cast[2][0][0][0].value).toBe('2023-01-03 00:00:00.000');

        stmt = new MssqlPreparedRequest(connection, 'INSERT INTO ted_test_datetime (date) values (?);', false);
        res = await stmt.execute([TypedBinding.create(PARAM_DATETIME, '2023-01-02 23:59:59.999')]);
        res = await new MssqlRequest(connection, 'SELECT CAST(@@IDENTITY AS bigInt);').execute();
        id = res[2][0][0][0].value;
        res = await new MssqlRequest(connection, 'SELECT date FROM ted_test_datetime WHERE id = ' + id).execute();
        cast = await new MssqlRequest(
            connection,
            "SELECT CAST('2023-01-02 23:59:59.999' AS datetime) AS 'date';"
        ).execute();
        expect(res[2][0][0][0].value).toBe(cast[2][0][0][0].value);
        expect(res[2][0][0][0].value).toBe('2023-01-03 00:00:00.000');

        stmt = new MssqlPreparedRequest(connection, 'INSERT INTO ted_test_datetime2 (date) values (?);', false);
        res = await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2023-01-02 23:59:59.999')]);
        res = await new MssqlRequest(connection, 'SELECT CAST(@@IDENTITY AS bigInt);').execute();
        id = res[2][0][0][0].value;
        res = await new MssqlRequest(connection, 'SELECT date FROM ted_test_datetime2 WHERE id = ' + id).execute();
        cast = await new MssqlRequest(
            connection,
            "SELECT CAST('2023-01-02 23:59:59.999' AS datetime2) AS 'date';"
        ).execute();
        expect(res[2][0][0][0].value).toBe(cast[2][0][0][0].value);
        expect(res[2][0][0][0].value).toBe('2023-01-02 23:59:59.9990000');

        stmt = new MssqlPreparedRequest(connection, 'INSERT INTO ted_test_datetimeoffset (date) values (?);', false);
        res = await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '2023-01-02 23:59:59.999')]);
        res = await new MssqlRequest(connection, 'SELECT CAST(@@IDENTITY AS bigInt);').execute();
        id = res[2][0][0][0].value;
        res = await new MssqlRequest(connection, 'SELECT date FROM ted_test_datetimeoffset WHERE id = ' + id).execute();
        cast = await new MssqlRequest(
            connection,
            "SELECT CAST('2023-01-02 23:59:59.999' AS datetimeoffset) AS 'date';"
        ).execute();
        expect(res[2][0][0][0].value).not.toBe(cast[2][0][0][0].value);
        expect(res[2][0][0][0].value).toBe('2023-01-02 23:59:59.9990000+01:00');
        // STRING SHOULD BE '2023-01-02 23:59:59.999 +00:00' ORIGINAL VALUE IS COMPLETLY LOST
        expect(cast[2][0][0][0].value).toBe('2023-01-03 00:59:59.9990000+01:00');

        stmt = new MssqlPreparedRequest(connection, 'INSERT INTO ted_test_time (time) values (?);', false);
        res = await stmt.execute([TypedBinding.create(PARAM_TIME, '2023-01-02 23:59:59.999')]);
        res = await new MssqlRequest(connection, 'SELECT CAST(@@IDENTITY AS bigInt);').execute();
        id = res[2][0][0][0].value;
        res = await new MssqlRequest(connection, 'SELECT time FROM ted_test_time WHERE id = ' + id).execute();
        cast = await new MssqlRequest(
            connection,
            "SELECT CAST('2023-01-02 23:59:59.999' AS time) AS 'date';"
        ).execute();
        expect(res[2][0][0][0].value).toBe(cast[2][0][0][0].value);
        expect(res[2][0][0][0].value).toBe('23:59:59.9990000');
    });

    it('Works Tedious Date Types As String From Tedious Date use UTC', async () => {
        // TO SIMULATE UTC WITH CAST WE USE -1 HOUR, DEFAULT TZ IS AFRICA/ALGERIES UTC+01

        let stmt = new MssqlPreparedRequest(connectionUtc, 'INSERT INTO ted_test_date (date) values (?);', false);
        let res = await stmt.execute([TypedBinding.create(PARAM_DATE, '2023-01-02 23:59:59.999')]);
        res = await new MssqlRequest(connectionUtc, 'SELECT CAST(@@IDENTITY AS bigInt);').execute();
        let id = res[2][0][0][0].value;
        res = await new MssqlRequest(connectionUtc, 'SELECT date FROM ted_test_date WHERE id = ' + id).execute();
        let cast = await new MssqlRequest(
            connectionUtc,
            "SELECT CAST('2023-01-02 22:59:59.999' AS date) AS 'date';"
        ).execute();
        expect(res[2][0][0][0].value).toBe(cast[2][0][0][0].value);
        expect(res[2][0][0][0].value).toBe('2023-01-02');

        stmt = new MssqlPreparedRequest(connectionUtc, 'INSERT INTO ted_test_smalldatetime (date) values (?);', false);
        res = await stmt.execute([TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, '2023-01-02 23:59:59.999')]);
        res = await new MssqlRequest(connectionUtc, 'SELECT CAST(@@IDENTITY AS bigInt);').execute();
        id = res[2][0][0][0].value;
        res = await new MssqlRequest(
            connectionUtc,
            'SELECT date FROM ted_test_smalldatetime WHERE id = ' + id
        ).execute();
        cast = await new MssqlRequest(
            connectionUtc,
            "SELECT CAST('2023-01-02 22:59:59.999' AS smalldatetime) AS 'date';"
        ).execute();
        expect(res[2][0][0][0].value).not.toBe(cast[2][0][0][0].value);
        // WRONG DATA STORED ON DB SHOULD BE 2023-01-03 00:00:00.000
        expect(res[2][0][0][0].value).toBe('2023-01-02 23:59:00.000');
        expect(cast[2][0][0][0].value).toBe('2023-01-03 00:00:00.000');

        stmt = new MssqlPreparedRequest(connectionUtc, 'INSERT INTO ted_test_datetime (date) values (?);', false);
        res = await stmt.execute([TypedBinding.create(PARAM_DATETIME, '2023-01-02 23:59:59.999')]);
        res = await new MssqlRequest(connectionUtc, 'SELECT CAST(@@IDENTITY AS bigInt);').execute();
        id = res[2][0][0][0].value;
        res = await new MssqlRequest(connectionUtc, 'SELECT date FROM ted_test_datetime WHERE id = ' + id).execute();
        cast = await new MssqlRequest(
            connectionUtc,
            "SELECT CAST('2023-01-02 22:59:59.999' AS datetime) AS 'date';"
        ).execute();
        expect(res[2][0][0][0].value).toBe(cast[2][0][0][0].value);
        expect(res[2][0][0][0].value).toBe('2023-01-03 00:00:00.000');

        stmt = new MssqlPreparedRequest(connectionUtc, 'INSERT INTO ted_test_datetime2 (date) values (?);', false);
        res = await stmt.execute([TypedBinding.create(PARAM_TIMESTAMP, '2023-01-02 23:59:59.999')]);
        res = await new MssqlRequest(connectionUtc, 'SELECT CAST(@@IDENTITY AS bigInt);').execute();
        id = res[2][0][0][0].value;
        res = await new MssqlRequest(connectionUtc, 'SELECT date FROM ted_test_datetime2 WHERE id = ' + id).execute();
        cast = await new MssqlRequest(
            connectionUtc,
            "SELECT CAST('2023-01-02 22:59:59.999' AS datetime2) AS 'date';"
        ).execute();
        expect(res[2][0][0][0].value).toBe(cast[2][0][0][0].value);
        expect(res[2][0][0][0].value).toBe('2023-01-02 23:59:59.9990000');

        stmt = new MssqlPreparedRequest(connectionUtc, 'INSERT INTO ted_test_datetimeoffset (date) values (?);', false);
        res = await stmt.execute([TypedBinding.create(PARAM_DATETIMEZONE, '2023-01-02 23:59:59.999 +00:00')]);
        res = await new MssqlRequest(connectionUtc, 'SELECT CAST(@@IDENTITY AS bigInt);').execute();
        id = res[2][0][0][0].value;
        res = await new MssqlRequest(
            connectionUtc,
            'SELECT date FROM ted_test_datetimeoffset WHERE id = ' + id
        ).execute();
        cast = await new MssqlRequest(
            connectionUtc,
            "SELECT CAST('2023-01-02 23:59:59.999 +00:00' AS datetimeoffset) AS 'date';"
        ).execute();
        expect(res[2][0][0][0].value).toBe(cast[2][0][0][0].value);
        // STRING SHOULD BE '2023-01-02 23:59:59.999+00:00' ORIGINAL VALUE IS COMPLETLY LOST
        expect(res[2][0][0][0].value).toBe('2023-01-03 00:59:59.9990000+01:00');

        stmt = new MssqlPreparedRequest(connectionUtc, 'INSERT INTO ted_test_time (time) values (?);', false);
        res = await stmt.execute([TypedBinding.create(PARAM_TIME, '2023-01-02 23:59:59.999')]);
        res = await new MssqlRequest(connectionUtc, 'SELECT CAST(@@IDENTITY AS bigInt);').execute();
        id = res[2][0][0][0].value;
        res = await new MssqlRequest(connectionUtc, 'SELECT time FROM ted_test_time WHERE id = ' + id).execute();
        cast = await new MssqlRequest(
            connectionUtc,
            "SELECT CAST('2023-01-02 22:59:59.999' AS time) AS 'date';"
        ).execute();
        expect(res[2][0][0][0].value).toBe(cast[2][0][0][0].value);
        // WRONG DATA STORED SHOULD RETURN 23:59:59.9990000
        expect(res[2][0][0][0].value).toBe('22:59:59.9990000');
    });
});
