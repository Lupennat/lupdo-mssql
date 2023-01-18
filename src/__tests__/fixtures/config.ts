import { MssqlOptions } from '../../types';

export const drivers: {
    [key: string]: MssqlOptions;
} = {
    mssql17: {
        server: 'localhost',
        options: {
            port: 21433,
            database: 'test_db',
            trustServerCertificate: true
        },
        authentication: {
            type: 'default',
            options: {
                userName: 'sa',
                password: 'lupdo@s3cRet'
            }
        }
    },
    mssql19: {
        server: 'localhost',
        options: {
            port: 21434,
            database: 'test_db',
            trustServerCertificate: true
        },
        authentication: {
            type: 'default',
            options: {
                userName: 'sa',
                password: 'lupdo@s3cRet'
            }
        }
    },
    mssql22: {
        server: 'localhost',
        options: {
            port: 21435,
            database: 'test_db',
            trustServerCertificate: true
        },
        authentication: {
            type: 'default',
            options: {
                userName: 'sa',
                password: 'lupdo@s3cRet'
            }
        }
    }
};

const currentDB: string = process.env.DB as string;

export const pdoData: { driver: string; config: MssqlOptions } = {
    driver: 'sqlsrv',
    config: drivers[currentDB]
};
