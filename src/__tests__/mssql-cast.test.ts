import {
    PARAM_BINARY,
    PARAM_BOOLEAN,
    PARAM_CHAR,
    PARAM_DATE,
    PARAM_DATETIME,
    PARAM_DATETIMEZONE,
    PARAM_DECIMAL,
    PARAM_FLOAT,
    PARAM_INTEGER,
    PARAM_NUMERIC,
    PARAM_TIME,
    PARAM_TIMESTAMP,
    PARAM_VARBINARY,
    Pdo,
    TypedBinding
} from 'lupdo';
import { ValidBindings } from 'lupdo/dist/typings/types/pdo-prepared-statement';
import { MSSQL_PARAM_SMALLDATETIME } from '../constants';
import { pdoData } from './fixtures/config';

describe('Mssql Cast', () => {
    it('Works Cast', async () => {
        const pdo = new Pdo(pdoData.driver, pdoData.config);

        let stmt = await pdo.query("SELECT CAST('9007199254740992' as BIGINT)");
        expect(stmt.fetchColumn(0).get()).toEqual(BigInt('9007199254740992'));

        stmt = await pdo.query("SELECT CAST('-9007199254740992' as BIGINT)");
        expect(stmt.fetchColumn(0).get()).toEqual(BigInt('-9007199254740992'));

        stmt = await pdo.query("SELECT CAST('9007199254740991' as BIGINT)");
        expect(stmt.fetchColumn(0).get()).toEqual(9007199254740991);

        stmt = await pdo.query("SELECT CAST('-9007199254740991' as BIGINT)");
        expect(stmt.fetchColumn(0).get()).toEqual(-9007199254740991);

        await pdo.disconnect();
    });

    it('Works All Columns Types', async () => {
        const pdo = new Pdo(pdoData.driver, pdoData.config);

        const stmt = await pdo.prepare(
            'INSERT INTO types (bigint,numeric,bit,smallint,decimal,smallmoney,int,tinyint,money,float,real,date,datetimeoffset,datetime2,smalldatetime,datetime,time,char,varchar,text,nchar,nvarchar,ntext,binary,varbinary,image,hierarchyid,uniqueidentifier,sql_variant,xml,point,linestring,circularstring,compoundcurve,polygon,curvepolygon,multipoint,multilinestring,multipolygon,geometrycollection,geo_point,geo_linestring,geo_circularstring,geo_compoundcurve,geo_polygon,geo_curvepolygon,geo_multipoint,geo_multilinestring,geo_multipolygon,geo_geometrycollection)' +
                ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CAST(? as hierarchyid),?,CAST(? as bigint),CONVERT(XML, ?, 2),geometry::Parse(?),geometry::Parse(?),geometry::Parse(?),geometry::Parse(?),geometry::Parse(?),geometry::Parse(?),geometry::Parse(?),geometry::Parse(?),geometry::Parse(?),geometry::Parse(?),geography::Parse(?),geography::Parse(?),geography::Parse(?),geography::Parse(?),geography::Parse(?),geography::Parse(?),geography::Parse(?),geography::Parse(?),geography::Parse(?),geography::Parse(?));'
        );

        await stmt.execute([
            TypedBinding.create(PARAM_INTEGER, null),
            TypedBinding.create(PARAM_NUMERIC, null),
            TypedBinding.create(PARAM_BOOLEAN, null),
            TypedBinding.create(PARAM_INTEGER, null),
            TypedBinding.create(PARAM_DECIMAL, null),
            null,
            TypedBinding.create(PARAM_INTEGER, null),
            TypedBinding.create(PARAM_INTEGER, null),
            null,
            TypedBinding.create(PARAM_FLOAT, null),
            TypedBinding.create(PARAM_FLOAT, null),
            TypedBinding.create(PARAM_DATE, null),
            TypedBinding.create(PARAM_TIMESTAMP, null),
            TypedBinding.create(PARAM_DATETIME, null),
            TypedBinding.create(PARAM_DATETIME, null),
            TypedBinding.create(PARAM_DATETIME, null),
            TypedBinding.create(PARAM_TIME, null),
            TypedBinding.create(PARAM_CHAR, null),
            null,
            null,
            null,
            null,
            null,
            TypedBinding.create(PARAM_BINARY, null),
            TypedBinding.create(PARAM_VARBINARY, null),
            TypedBinding.create(PARAM_VARBINARY, null),
            null,
            null,
            TypedBinding.create(PARAM_INTEGER, null),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ]);

        await stmt.execute([
            BigInt('-9223372036854775807'),
            TypedBinding.create(PARAM_NUMERIC, '1234567890123456789012345678.1234567890923456789'),
            TypedBinding.create(PARAM_BOOLEAN, true),
            1,
            '1234567890123456789012345678.1234567890923456789',
            '-214748.3456',
            1000,
            100,
            '922337203685477.1200',
            TypedBinding.create(
                PARAM_FLOAT,
                '12345678901234567890123456781234567890923456789.1234567890123456789012345678123456789092345678912345678901234567890123456781234567890923456789'
            ),
            TypedBinding.create(
                PARAM_FLOAT,
                '123456789012345678901234567812345678909.1234567890123456789012345678123456789092345678912345678901234567890123456781234567890923456789'
            ),
            TypedBinding.create(PARAM_DATE, new Date('2014-01-01')),
            TypedBinding.create(PARAM_DATETIMEZONE, '2004-10-19 10:23:54.1234567 +06:00'),
            TypedBinding.create(PARAM_TIMESTAMP, '2004-10-19 08:23:54.1234567'),
            TypedBinding.create(MSSQL_PARAM_SMALLDATETIME, '2004-10-19 10:23:54'),
            new Date('2004-10-19 10:23:54.1236'),
            TypedBinding.create(PARAM_TIME, '10:23:54.1234567'),
            'a',
            'abcd',
            'text',
            'c',
            '😀😂',
            '😀😃text',
            Buffer.from('1'),
            Buffer.from('101'),
            Buffer.from('image'),
            '/1/3/',
            '0E984725-C51C-4BF4-9960-E1C80E27ABA0',
            '9223372036854775806',
            '<?xml version="1.0" encoding="utf-16" standalone="yes"?><content>abc</content>',
            'POINT(4 5)',
            'LINESTRING(-122.360 47.656, -122.343 47.656 )',
            'CIRCULARSTRING (1 1, 2 0, -1 1)',
            'COMPOUNDCURVE(CIRCULARSTRING(1 0, 0 1, -1 0), (-1 0, 1.25 0))',
            'POLYGON((-122.358 47.653 , -122.348 47.649, -122.348 47.658, -122.358 47.658, -122.358 47.653))',
            'CURVEPOLYGON ((4 2, 8 2, 8 6, 4 6, 4 2))',
            'MULTIPOINT((21 2), (12 2), (30 40))',
            'MultiLineString ((0 2, 1 1), (2 1, 1 2))',
            'MultiPolygon(((2 0, 3 1, 2 2, 1.5 1.5, 2 1, 1.5 0.5, 2 0)), ((1 0, 1.5 0.5, 1 1, 1.5 1.5, 1 2, 0 1, 1 0)))',
            'GEOMETRYCOLLECTION (POINT (4 0), LINESTRING (4 2, 5 3), POLYGON ((0 0, 3 0, 3 3, 0 3, 0 0), (1 1, 1 2, 2 2, 2 1, 1 1)))',
            'POINT(4 5)',
            'LINESTRING(-122.360 47.656, -122.343 47.656 )',
            'CIRCULARSTRING (1 1, 2 0, -1 1)',
            'COMPOUNDCURVE(CIRCULARSTRING(1 0, 0 1, -1 0), (-1 0, 1.25 0))',
            'POLYGON((-122.358 47.653 , -122.348 47.649, -122.348 47.658, -122.358 47.658, -122.358 47.653))',
            'CURVEPOLYGON ((4 2, 8 2, 8 6, 4 6, 4 2))',
            'MULTIPOINT((21 2), (12 2), (30 40))',
            'MultiLineString ((0 2, 1 1), (2 1, 1 2))',
            'MultiPolygon(((2 0, 3 1, 2 2, 1.5 1.5, 2 1, 1.5 0.5, 2 0)), ((1 0, 1.5 0.5, 1 1, 1.5 1.5, 1 2, 0 1, 1 0)))',
            'GEOMETRYCOLLECTION (POINT (4 0), LINESTRING (4 2, 5 3), POLYGON ((0 0, 3 0, 3 3, 0 3, 0 0), (1 1, 1 2, 2 2, 2 1, 1 1)))'
        ]);

        await stmt.close();

        const query = await pdo.query(
            "SELECT TOP 2 bigint,numeric,bit,smallint,decimal,smallmoney,int,tinyint,money,float,real,date,datetimeoffset,datetimeoffset AT TIME ZONE 'UTC' AS datetimeutc,datetime2,smalldatetime,datetime,time,char,varchar,text,nchar,nvarchar,ntext,binary,varbinary,image,rowversion,hierarchyid.ToString() as hierarchyid,uniqueidentifier,sql_variant,xml,point.STAsText() as point,linestring.STAsText() as linestring,circularstring.STAsText() as circularstring,compoundcurve.STAsText() as compoundcurve,polygon.STAsText() as polygon,curvepolygon.STAsText() as curvepolygon,multipoint.STAsText() as multipoint,multilinestring.STAsText() as multilinestring,multipolygon.STAsText() as multipolygon,geometrycollection.STAsText() as geometrycollection,geo_point.STAsText() as geo_point,geo_linestring.STAsText() as geo_linestring,geo_circularstring.STAsText() as geo_circularstring,geo_compoundcurve.STAsText() as geo_compoundcurve,geo_polygon.STAsText() as geo_polygon,geo_curvepolygon.STAsText() as geo_curvepolygon,geo_multipoint.STAsText() as geo_multipoint,geo_multilinestring.STAsText() as geo_multilinestring,geo_multipolygon.STAsText() as geo_multipolygon,geo_geometrycollection.STAsText() as geo_geometrycollection FROM types;"
        );

        let row = query.fetchDictionary().get() as { [key: string]: ValidBindings };
        expect(row.bigint).toBeNull();
        expect(row.numeric).toBeNull();
        expect(row.bit).toBeNull();
        expect(row.smallint).toBeNull();
        expect(row.decimal).toBeNull();
        expect(row.smallmoney).toBeNull();
        expect(row.int).toBeNull();
        expect(row.tinyint).toBeNull();
        expect(row.money).toBeNull();
        expect(row.float).toBeNull();
        expect(row.real).toBeNull();
        expect(row.date).toBeNull();
        expect(row.datetimeoffset).toBeNull();
        expect(row.datetime2).toBeNull();
        expect(row.smalldatetime).toBeNull();
        expect(row.datetime).toBeNull();
        expect(row.time).toBeNull();
        expect(row.char).toBeNull();
        expect(row.varchar).toBeNull();
        expect(row.text).toBeNull();
        expect(row.nchar).toBeNull();
        expect(row.nvarchar).toBeNull();
        expect(row.ntext).toBeNull();
        expect(row.binary).toBeNull();
        expect(row.varbinary).toBeNull();
        expect(row.image).toBeNull();
        expect(Buffer.isBuffer(row.rowversion)).toBeTruthy();
        expect(row.hierarchyid).toBeNull();
        expect(row.uniqueidentifier).toBeNull();
        expect(row.sql_variant).toBeNull();
        expect(row.xml).toBeNull();
        expect(row.point).toBeNull();
        expect(row.linestring).toBeNull();
        expect(row.circularstring).toBeNull();
        expect(row.compoundcurve).toBeNull();
        expect(row.polygon).toBeNull();
        expect(row.curvepolygon).toBeNull();
        expect(row.multipoint).toBeNull();
        expect(row.multilinestring).toBeNull();
        expect(row.multipolygon).toBeNull();
        expect(row.geometrycollection).toBeNull();
        expect(row.geo_point).toBeNull();
        expect(row.geo_linestring).toBeNull();
        expect(row.geo_circularstring).toBeNull();
        expect(row.geo_compoundcurve).toBeNull();
        expect(row.geo_polygon).toBeNull();
        expect(row.geo_curvepolygon).toBeNull();
        expect(row.geo_multipoint).toBeNull();
        expect(row.geo_multilinestring).toBeNull();
        expect(row.geo_multipolygon).toBeNull();
        expect(row.geo_geometrycollection).toBeNull();

        row = query.fetchDictionary().get() as { [key: string]: ValidBindings };
        expect(row.bigint).toEqual(BigInt('-9223372036854775807'));
        expect(row.numeric).toBe('1234567890123456789012345678.1234567891');
        expect(row.bit).toBe(1);
        expect(row.smallint).toBe(1);
        expect(row.decimal).toBe('1234567890123456789012345678.1234567891');
        expect(row.smallmoney).toBe('-214748.3456');
        expect(row.int).toBe(1000);
        expect(row.tinyint).toBe(100);
        expect(row.money).toBe('922337203685477.1200');
        expect(row.float).toBe('1.2345678901234568e+46');
        expect(row.real).toBe('1.2345678605116651e+38');
        expect(row.date).toBe('2014-01-01');
        expect(row.datetimeoffset).toBe('2004-10-19 10:23:54.1234567 +06:00');
        expect(row.datetimeutc).toBe('2004-10-19 04:23:54.1234567 +00:00');
        expect(row.datetime2).toBe('2004-10-19 08:23:54.1234567');
        expect(row.smalldatetime).toBe('2004-10-19 10:24:00.000');
        expect(row.datetime).toBe('2004-10-19 10:23:54.123');
        expect(row.time).toBe('10:23:54.1234567');
        expect(row.char).toBe('a');
        expect(row.varchar).toBe('abcd');
        expect(row.text).toBe('text');
        expect(row.nchar).toBe('c');
        expect(row.nvarchar).toBe('😀😂');
        expect(row.ntext).toBe('😀😃text');
        expect(row.binary).toEqual(Buffer.from('1'));
        expect(row.varbinary).toEqual(Buffer.from('101'));
        expect(row.image).toEqual(Buffer.from('image'));
        expect(Buffer.isBuffer(row.rowversion)).toBeTruthy();
        expect(row.hierarchyid).toBe('/1/3/');
        expect(row.uniqueidentifier).toBe('0E984725-C51C-4BF4-9960-E1C80E27ABA0');
        expect(row.sql_variant).toBe(9223372036854775806n);
        expect(row.xml).toBe('<content>abc</content>');
        expect(row.point).toBe('POINT (4 5)');
        expect(row.linestring).toBe('LINESTRING (-122.36 47.656, -122.343 47.656)');
        expect(row.circularstring).toBe('CIRCULARSTRING (1 1, 2 0, -1 1)');
        expect(row.compoundcurve).toBe('COMPOUNDCURVE (CIRCULARSTRING (1 0, 0 1, -1 0), (-1 0, 1.25 0))');
        expect(row.polygon).toBe(
            'POLYGON ((-122.358 47.653, -122.348 47.649, -122.348 47.658, -122.358 47.658, -122.358 47.653))'
        );
        expect(row.curvepolygon).toBe('CURVEPOLYGON ((4 2, 8 2, 8 6, 4 6, 4 2))');
        expect(row.multipoint).toBe('MULTIPOINT ((21 2), (12 2), (30 40))');
        expect(row.multilinestring).toBe('MULTILINESTRING ((0 2, 1 1), (2 1, 1 2))');
        expect(row.multipolygon).toBe(
            'MULTIPOLYGON (((2 0, 3 1, 2 2, 1.5 1.5, 2 1, 1.5 0.5, 2 0)), ((1 0, 1.5 0.5, 1 1, 1.5 1.5, 1 2, 0 1, 1 0)))'
        );
        expect(row.geometrycollection).toBe(
            'GEOMETRYCOLLECTION (POINT (4 0), LINESTRING (4 2, 5 3), POLYGON ((0 0, 3 0, 3 3, 0 3, 0 0), (1 1, 1 2, 2 2, 2 1, 1 1)))'
        );
        expect(row.geo_point).toBe('POINT (4 5)');
        expect(row.geo_linestring).toBe('LINESTRING (-122.36 47.656, -122.343 47.656)');
        expect(row.geo_circularstring).toBe('CIRCULARSTRING (1 1, 2 0, -1 1)');
        expect(row.geo_compoundcurve).toBe('COMPOUNDCURVE (CIRCULARSTRING (1 0, 0 1, -1 0), (-1 0, 1.25 0))');
        expect(row.geo_polygon).toBe(
            'POLYGON ((-122.358 47.653, -122.348 47.649, -122.348 47.658, -122.358 47.658, -122.358 47.653))'
        );
        expect(row.geo_curvepolygon).toBe('CURVEPOLYGON ((4 2, 8 2, 8 6, 4 6, 4 2))');
        expect(row.geo_multipoint).toBe('MULTIPOINT ((21 2), (12 2), (30 40))');
        expect(row.geo_multilinestring).toBe('MULTILINESTRING ((0 2, 1 1), (2 1, 1 2))');
        expect(row.geo_multipolygon).toBe(
            'MULTIPOLYGON (((2 0, 3 1, 2 2, 1.5 1.5, 2 1, 1.5 0.5, 2 0)), ((1 0, 1.5 0.5, 1 1, 1.5 1.5, 1 2, 0 1, 1 0)))'
        );
        expect(row.geo_geometrycollection).toBe(
            'GEOMETRYCOLLECTION (POINT (4 0), LINESTRING (4 2, 5 3), POLYGON ((0 0, 3 0, 3 3, 0 3, 0 0), (1 1, 1 2, 2 2, 2 1, 1 1)))'
        );
        await pdo.disconnect();
    });
});
