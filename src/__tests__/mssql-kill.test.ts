import { Pdo } from 'lupdo';
import { pdoData } from './fixtures/config';

describe('Mssql Kill', () => {
    it('Works Destroy Connection Does Kill Connection', async () => {
        const events: {
            killed: {
                [key: string]: number;
            };
        } = {
            killed: {}
        };

        const pdo = new Pdo(pdoData.driver, pdoData.config, {
            killTimeoutMillis: 500,
            killResource: true,
            max: 1,
            min: 1,
            acquired: () => {
                setTimeout(async () => {
                    await pdo.disconnect();
                }, 1000);
            },
            killed(uuid: string): void {
                events.killed[uuid] = events.killed[uuid] == null ? 1 : events.killed[uuid] + 1;
            }
        });

        await expect(pdo.query("WAITFOR DELAY '00:00:10';")).rejects.toThrowError(
            'Connection closed before request completed.'
        );

        expect(Object.keys(events.killed).length).toBe(1);
    });
});
