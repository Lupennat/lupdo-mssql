import { ATTR_CASE, ATTR_FETCH_DIRECTION, CASE_LOWER, CASE_NATURAL, FETCH_BACKWARD, Pdo } from 'lupdo';
import { pdoData } from './fixtures/config';

describe('Mssql Statement', () => {
    const pdo = new Pdo(pdoData.driver, pdoData.config);

    afterAll(async () => {
        await pdo.disconnect();
    });

    it('Works Statement Debug', async () => {
        const stmt = await pdo.query('SELECT TOP 5 * FROM users;');
        expect(stmt.debug()).toBe('SQL: SELECT TOP 5 * FROM users;\nPARAMS:[]');
    });

    it('Works Statement Get Attribute is Localized', async () => {
        const stmt = await pdo.query('SELECT TOP 5 * FROM users;');
        const stmtFetchMode = stmt.getAttribute(ATTR_CASE);
        expect(pdo.getAttribute(ATTR_CASE)).toBe(stmtFetchMode);
        pdo.setAttribute(ATTR_CASE, CASE_LOWER);
        expect(pdo.getAttribute(ATTR_CASE)).toBe(CASE_LOWER);
        expect(stmt.getAttribute(ATTR_CASE)).toBe(stmtFetchMode);
        pdo.setAttribute(ATTR_CASE, CASE_NATURAL);
    });

    it('Works Statement Set Attribute is Localized', async () => {
        const stmt = await pdo.query('SELECT TOP 5 * FROM users;');
        const pdoFetchMode = pdo.getAttribute(ATTR_CASE);
        expect(stmt.getAttribute(ATTR_CASE)).toBe(pdoFetchMode);
        const res = stmt.setAttribute(ATTR_CASE, CASE_LOWER);
        expect(res).toBeTruthy();
        expect(stmt.getAttribute(ATTR_CASE)).toBe(CASE_LOWER);
        expect(pdo.getAttribute(ATTR_CASE)).toBe(pdoFetchMode);
        expect(stmt.setAttribute('NOT_EXISTS', 1)).toBeFalsy();
        pdo.setAttribute(ATTR_CASE, CASE_NATURAL);
    });

    it('Works Statement Last Insert Id', async () => {
        const trx = await pdo.beginTransaction();

        let stmt = await trx.query('SELECT count(*) as total from users');
        const lastId = stmt.fetchColumn<number>(0).get() as number;

        stmt = await trx.query("INSERT INTO users (name, gender) OUTPUT INSERTED.* VALUES ('Claudio', 'All');");
        expect(await stmt.lastInsertId()).toBeGreaterThan(lastId);
        expect(stmt.fetchColumn(0).get()).toBe(await stmt.lastInsertId());
        await trx.rollback();

        await pdo.exec('CREATE TABLE test (id int IDENTITY(1,1), name VARCHAR(100));');
        stmt = await pdo.query("INSERT INTO test (name) VALUES ('Claudio');");
        expect(await stmt.lastInsertId()).toBe(1);
        await pdo.exec('DROP TABLE test;');

        await pdo.exec(
            'CREATE SEQUENCE "test_sequence" AS INTEGER START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 100 CYCLE'
        );
        await pdo.exec('CREATE TABLE test (id int, name VARCHAR(100));');
        stmt = await pdo.query("INSERT INTO test (id, name) VALUES (NEXT VALUE FOR test_sequence, 'Test')");
        expect(await stmt.lastInsertId('test_sequence')).toBe(1);
        await pdo.exec('DROP TABLE test;');
        await pdo.exec('DROP SEQUENCE test_sequence;');
    });

    it('Works Statement Last Insert Id With Sequence in Real Time', async () => {
        const pdo = new Pdo(pdoData.driver, pdoData.config);
        await pdo.exec(
            'CREATE SEQUENCE "test_sequence2" AS INTEGER START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 100 CYCLE'
        );
        await pdo.exec('CREATE TABLE test2 (id int, name VARCHAR(100));');
        let stmt = await pdo.query('SELECT * FROM test2');
        stmt = await pdo.query("INSERT INTO test2 (id, name) VALUES (NEXT VALUE FOR test_sequence2, 'Test')");
        expect(await stmt.lastInsertId()).toBeNull();
        stmt = await pdo.query('SELECT * FROM test2');
        expect(await stmt.lastInsertId('test_sequence2')).toBe(1);
        expect(await stmt.lastInsertId('not_exist_test_sequence')).toBeNull();
        expect(await stmt.lastInsertId()).toBeNull();
        stmt = await pdo.query("INSERT INTO test2 (id, name) VALUES (NEXT VALUE FOR test_sequence2, 'Test')");
        expect(await stmt.lastInsertId()).toBeNull();
        expect(await stmt.lastInsertId('test_sequence2')).toBe(2);
        await pdo.exec('DROP TABLE test2;');
        await pdo.exec('DROP SEQUENCE test_sequence2;');
        await pdo.disconnect();
    });

    it('Works Statement Row Count', async () => {
        const trx = await pdo.beginTransaction();
        let stmt = await trx.query('SELECT TOP 5 * FROM users;');
        expect(stmt.rowCount()).toBe(5);
        stmt = await trx.query("INSERT INTO users (name, gender) VALUES ('Claudio', 'All');");
        expect(stmt.rowCount()).toBe(1);
        await trx.rollback();
    });

    it('Works Column Count', async () => {
        const stmt = await pdo.query('SELECT TOP 5 * FROM users;');
        expect(stmt.columnCount()).toBe(3);
    });

    it('Works Get Column Meta', async () => {
        const stmt = await pdo.query('SELECT TOP 5 * FROM users;');
        expect(stmt.getColumnMeta(0)?.name).toBe('id');
        expect(stmt.getColumnMeta(1)?.name).toBe('name');
        expect(stmt.getColumnMeta(5)).toBeNull();
    });

    it('Works Reset Cursor', async () => {
        const stmt = await pdo.query('SELECT TOP 5 * FROM users;');
        const fetch = stmt.fetchArray();
        expect(fetch.get()).toEqual([1, 'Edmund', 'Multigender']);
        fetch.all();
        expect(fetch.get()).toBeUndefined();
        stmt.resetCursor();
        expect(fetch.get()).toEqual([1, 'Edmund', 'Multigender']);
        stmt.setAttribute(ATTR_FETCH_DIRECTION, FETCH_BACKWARD);
        stmt.resetCursor();
        expect(fetch.get()).toEqual([5, 'Sincere', 'Demi-girl']);
        fetch.all();
        expect(fetch.get()).toBeUndefined();
        stmt.resetCursor();
        expect(fetch.get()).toEqual([5, 'Sincere', 'Demi-girl']);
    });
});
