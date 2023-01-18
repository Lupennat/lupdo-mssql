import { Pdo, PdoStatement, PdoTransaction, PdoTransactionPreparedStatement } from 'lupdo';
import { pdoData } from './fixtures/config';
import MssqlFakerDriver from './fixtures/mssql-faker-driver';

describe('Mssql Transactions', () => {
    const pdo = new Pdo(pdoData.driver, pdoData.config);

    afterAll(async () => {
        await pdo.disconnect();
    });

    afterEach(() => {
        Pdo.setLogger(() => {});
    });

    it('Works Transaction Rollback && Commit', async () => {
        const countBefore = await pdo.query('SELECT count(*) as total FROM users');
        const counter = countBefore.fetchColumn<number>(0).get() as number;
        let trx = await pdo.beginTransaction();
        expect(trx).toBeInstanceOf(PdoTransaction);
        let executed = await trx.exec("INSERT INTO users (name, gender) VALUES ('Claudio', 'All');");
        expect(executed).toBe(1);
        await trx.rollback();
        let countAfter = await pdo.query('SELECT count(*) as total FROM users');
        expect(countAfter.fetchColumn<number>(0).get()).toBe(counter);

        trx = await pdo.beginTransaction();
        expect(trx).toBeInstanceOf(PdoTransaction);
        executed = await trx.exec("INSERT INTO users (name, gender) VALUES ('Claudio', 'All');");
        expect(executed).toBe(1);
        await trx.commit();
        countAfter = await pdo.query('SELECT count(*) as total FROM users');
        expect(countAfter.fetchColumn<number>(0).get()).toBe(counter + 1);

        const stmt = await pdo.query("SELECT id FROM users where name = 'Claudio';");
        const id = stmt.fetchColumn<number>(0).get() as number;
        expect(await pdo.exec('DELETE FROM users WHERE (id = ' + id + ');')).toBe(1);
    });

    it('Works Transaction Exec Return Number', async () => {
        const trx = await pdo.beginTransaction();
        const res = await trx.exec('SELECT 1');
        expect(typeof res === 'number').toBeTruthy();
        expect(res).toEqual(1);
        await trx.rollback();
    });

    it('Works Transaction Query Return PdoStatement', async () => {
        const trx = await pdo.beginTransaction();
        const stmt = await trx.query('SELECT 1');
        expect(stmt).toBeInstanceOf(PdoStatement);
        await trx.rollback();
    });

    it('Works Transaction Prepare Return PdoTransactionPreparedStatement', async () => {
        const trx = await pdo.beginTransaction();
        const stmt = await trx.prepare('SELECT 1');
        expect(stmt).toBeInstanceOf(PdoTransactionPreparedStatement);
        await stmt.execute();
        await trx.rollback();
    });

    it('Works Transaction Errors', async () => {
        const driver = new MssqlFakerDriver(pdoData.driver, pdoData.config, { min: 1, max: 1 }, {});
        driver.fake = 'BEGIN';
        await expect(driver.beginTransaction()).rejects.toThrowError('Fake Transaction Error');
        driver.fake = 'COMMIT';
        let trx = await driver.beginTransaction();
        await trx.query('SELECT 1');
        await expect(trx.commit()).rejects.toThrowError('Fake Commit Error');
        trx = await driver.beginTransaction();
        driver.fake = 'ROLLBACK';
        await trx.query('SELECT 1');
        await expect(trx.rollback()).rejects.toThrowError('Fake Rollback Error');
        await driver.disconnect();
    });
});
