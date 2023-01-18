import { PARAM_DATE, PARAM_DATETIME, PARAM_VARBINARY, Pdo, TypedBinding } from 'lupdo';
import { pdoData } from './fixtures/config';

describe('Mssql Prepared Statement', () => {
    const pdo = new Pdo(pdoData.driver, pdoData.config);

    afterAll(async () => {
        await pdo.disconnect();
    });
    afterEach(() => {
        Pdo.setLogger(() => {});
    });

    it('Works Statement Prepared Statement Execute Without Array', async () => {
        const stmt = await pdo.prepare('SELECT TOP 3 * FROM users;');
        const stmt2 = await pdo.prepare('SELECT TOP 5 * FROM users;');
        await stmt.execute();
        await stmt2.execute();

        expect(stmt.fetchArray().all().length).toBe(3);
        expect(stmt.fetchArray().all().length).toBe(0);

        expect(stmt2.fetchArray().all().length).toBe(5);
        expect(stmt2.fetchArray().all().length).toBe(0);

        await stmt.close();
        await stmt2.close();
    });

    it('Works Statement Prepared Statement Bind Numeric Value', async () => {
        const stmt = await pdo.prepare('SELECT TOP (?) * FROM users;');
        stmt.bindValue(1, 3);
        await stmt.execute();
        expect(stmt.fetchArray().all().length).toBe(3);
        expect(stmt.fetchArray().all().length).toBe(0);
        stmt.bindValue(1, 5);
        await stmt.execute();

        expect(stmt.fetchArray().all().length).toBe(5);
        expect(stmt.fetchArray().all().length).toBe(0);

        await stmt.close();
    });

    it('Works Statement Prepared Statement Bind Key Value', async () => {
        const stmt = await pdo.prepare('SELECT TOP (:limit) * FROM users;');
        stmt.bindValue('limit', 3);
        await stmt.execute();
        expect(stmt.fetchArray().all().length).toBe(3);
        expect(stmt.fetchArray().all().length).toBe(0);
        stmt.bindValue('limit', 5);
        await stmt.execute();

        expect(stmt.fetchArray().all().length).toBe(5);
        expect(stmt.fetchArray().all().length).toBe(0);

        await stmt.close();
    });

    it('Works Statement Bind Value Fails With Mixed Values', async () => {
        let stmt = await pdo.prepare('SELECT TOP (:limit) * FROM users where gender = ?;');
        stmt.bindValue(1, 'Cisgender male');
        expect(() => {
            stmt.bindValue('limit', 3);
        }).toThrow('Mixed Params Numeric and Keyed are forbidden.');

        await stmt.close();

        stmt = await pdo.prepare('SELECT TOP (:limit) * FROM users where gender = ?;');
        stmt.bindValue('limit', 3);
        expect(() => {
            stmt.bindValue(1, 'Cisgender male');
        }).toThrow('Mixed Params Numeric and Keyed are forbidden.');

        await stmt.close();
    });

    it('Works Statement Execute With Numeric Value', async () => {
        const stmt = await pdo.prepare('SELECT TOP (?) * FROM users;');
        await stmt.execute([3]);

        expect(stmt.fetchArray().all().length).toBe(3);
        expect(stmt.fetchArray().all().length).toBe(0);
        await stmt.execute([5]);

        expect(stmt.fetchArray().all().length).toBe(5);
        expect(stmt.fetchArray().all().length).toBe(0);

        await stmt.close();
    });

    it('Works Statement Execute With Key Value', async () => {
        const stmt = await pdo.prepare('SELECT TOP (:limit) * FROM users;');

        await stmt.execute({ limit: 3 });
        expect(stmt.fetchArray().all().length).toBe(3);
        expect(stmt.fetchArray().all().length).toBe(0);
        await stmt.execute({ limit: 5 });

        expect(stmt.fetchArray().all().length).toBe(5);
        expect(stmt.fetchArray().all().length).toBe(0);

        await stmt.close();
    });

    it('Works Statement Bind Number', async () => {
        let stmt = await pdo.prepare('SELECT TOP (:limit) * FROM users;');
        stmt.bindValue('limit', BigInt(3));
        await stmt.execute();
        expect(stmt.fetchArray().all().length).toBe(3);
        await stmt.close();
        stmt = await pdo.prepare('SELECT ?;');
        await stmt.execute([1]);
        expect(stmt.fetchColumn(0).get()).toBe(1);
        await stmt.close();
    });

    it('Works Statement Bind BigInter', async () => {
        let stmt = await pdo.prepare('SELECT TOP (:limit) * FROM users;');
        stmt.bindValue('limit', BigInt(3));
        await stmt.execute();
        expect(stmt.fetchArray().all().length).toBe(3);
        await stmt.close();
        stmt = await pdo.prepare('SELECT ?;');
        await stmt.execute([BigInt(9007199254740994)]);
        expect(stmt.fetchColumn(0).get()).toBe('9007199254740994');
        await stmt.close();
    });

    it('Works Statement Bind Date', async () => {
        let stmt = await pdo.prepare('SELECT * FROM companies WHERE opened > ?;');
        const date = new Date('2014-01-01');
        stmt.bindValue(1, TypedBinding.create(PARAM_DATE, date));
        await stmt.execute();
        expect(stmt.fetchArray().all().length).toBe(10);
        await stmt.close();
        stmt = await pdo.prepare('SELECT ?');
        await stmt.execute([TypedBinding.create(PARAM_DATETIME, date)]);

        expect(new Date(stmt.fetchColumn(0).get() as string)).toEqual(date);
        await stmt.close();
    });

    it('Works Statement Bind Boolean', async () => {
        let stmt = await pdo.prepare('SELECT * FROM companies where active = ?;');
        stmt.bindValue(1, false);
        await stmt.execute();
        expect(stmt.fetchArray().all().length).toBe(5);
        await stmt.close();
        stmt = await pdo.prepare('SELECT ?;');
        await stmt.execute([true]);
        expect(stmt.fetchColumn(0).get()).toEqual(1);
        await stmt.close();
    });

    it('Works Statement Bind String', async () => {
        let stmt = await pdo.prepare('select id from users where name = ?;');
        stmt.bindValue(1, 'Edmund');
        await stmt.execute();
        expect(stmt.fetchArray().all().length).toBe(1);
        await stmt.close();
        stmt = await pdo.prepare('SELECT LOWER(?);');
        await stmt.execute(['Edmund']);
        expect(stmt.fetchColumn(0).get()).toEqual('edmund');
        await stmt.close();
    });

    it('Works Statement Bind Buffer', async () => {
        let stmt = await pdo.prepare('select ?');
        const buffer = Buffer.from('Edmund');
        stmt.bindValue(1, buffer);
        await stmt.execute();
        expect(stmt.fetchColumn<Buffer>(0).get()?.toString()).toBe('Edmund');
        await stmt.close();
        const newBuffer = Buffer.from('buffer as blob on database');
        stmt = await pdo.prepare('INSERT INTO companies (name, opened, active, binary) VALUES(?,?,?,?);');
        await stmt.execute(['Test', '2000-12-26 00:00:00', 1, newBuffer]);
        const lastId = (await stmt.lastInsertId()) as number;
        await stmt.close();
        stmt = await pdo.prepare('SELECT binary FROM companies WHERE id = ?;');
        await stmt.execute([lastId]);
        expect(stmt.fetchColumn<Buffer>(0).get()?.toString()).toBe('buffer as blob on database');
        await stmt.close();
        stmt = await pdo.prepare('SELECT id FROM companies WHERE binary = ?;');
        await stmt.execute([Buffer.from('buffer as blob on database')]);
        expect(stmt.fetchColumn<number>(0).get()).toBe(lastId);
        await stmt.close();
        expect(await pdo.exec('DELETE FROM companies WHERE (id = ' + lastId + ');')).toBe(1);
    });

    it('Works Statement Bind Null', async () => {
        let stmt = await pdo.prepare('select ?;');
        stmt.bindValue(1, null);
        await stmt.execute();
        expect(stmt.fetchColumn(0).get()).toBeNull();
        await stmt.close();
        stmt = await pdo.prepare('INSERT INTO companies (name, opened, active, binary) VALUES(?,?,?,?);');
        await stmt.execute(['Test', '2000-12-26 00:00:00', 1, TypedBinding.create(PARAM_VARBINARY, null)]);
        const lastId = (await stmt.lastInsertId()) as number;
        await stmt.close();
        stmt = await pdo.prepare('SELECT binary FROM companies WHERE id = ?;');
        await stmt.execute([lastId]);
        expect(stmt.fetchColumn(0).get()).toBeNull();
        await stmt.close();
        expect(await pdo.exec('DELETE FROM companies WHERE (id = ' + lastId + ');')).toBe(1);
    });
});
