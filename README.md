<p align="center">
	<a href="https://www.npmjs.com/package/lupdo-mssql" target="__blank">
        <img src="https://img.shields.io/npm/v/lupdo-mssql?color=0476bc&label=" alt="NPM version">
    </a>
	<a href="https://www.npmjs.com/package/lupdo-mssql" target="__blank">
        <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/lupdo-mssql?color=3890aa&label=">
    </a>
    <a href="https://app.codecov.io/github/Lupennat/lupdo-mssql" target="__blank">
        <img src="https://codecov.io/github/Lupennat/lupdo-mssql/branch/main/graph/badge.svg?token=64B998KKDF"/>
    </a>
    <a href="https://snyk.io/test/github/lupennat/lupdo-mssql" target="__blank">
        <img src="https://snyk.io/test/github/lupennat/lupdo-mssql/badge.svg">
    </a>
</p>

# lupdo-mssql

[Lupdo](https://www.npmjs.com/package/lupdo) Driver For SQL Server.

## Supported Databases

-   [sql-Server](https://www.microsoft.com/en-us/sql-server) (v2017,v2019,v2022)

## Third Party Library

Lupdo-mssql, under the hood, uses stable and performant npm packages:

-   [tedious](http://tediousjs.github.io/tedious/)

> **Note**
> Lupdo-mssql use [forked tedious-better-data-types](#tedious-fork) to preserve data integrity

## Usage

Base Example

```js
const { Pdo } = require('lupdo');
require('lupdo-mssql');
// ES6 or Typescrypt
import { Pdo } from 'lupdo';
import 'ludpo-mssql';

const pdo = new Pdo(
    'mssql',
    {
        server: 'localhost',
        options: {
            port: 1433,
            database: 'database'
        },
        authentication: {
            type: 'default',
            options: {
                userName: 'user',
                password: 'password'
            }
        }
    },
    { min: 2, max: 3 }
);

const run = async () => {
    const statement = await pdo.query('SELECT 2');
    const res = statement.fetchArray().all();
    console.log(res);
    await pdo.disconnect();
};

run();
```

## Driver Options

[http://tediousjs.github.io/tedious/api-connection.html#function_newConnection](http://tediousjs.github.io/tedious/api-connection.html#function_newConnection)

Lupdo-mssql [patch](#tedious-patch) for tedious expose 4 new options:

-   `customParsers: CustomParsers | undefined` [Custom Parsers](#custom-parsers) For Values Types. (default: `undefined`)
-   `returnDecimalAndNumericAsString?: boolean` If true, Numeric and Decimal will be serialized as [string](#decimal-and-numeric). (default: false)
-   `returnDateTimeAsObject?: boolean` If true, Dates and Times will be serialized as [object](#datetime-object). (default: false)
-   `returnMoneyAsString?: boolean` If true, Money and SmallMoney will be serialized as [string](#money). (default: false)

## Tedious Overrides

By default Ludpo-mssql overrides user connection options with this:

```ts
{
    tediousOptions.options.debug = undefined;
    tediousOptions.options.rowCollectionOnDone = false;
    tediousOptions.options.rowCollectionOnRequestCompletion = false;
    tediousOptions.options.abortTransactionOnError = false;
    tediousOptions.options.useColumnNames = false;
    tediousOptions.options.useUTC = false;
    tediousOptions.options.camelCaseColumns = false;
    tediousOptions.options.debug = {};
    tediousOptions.options.enableConcatNullYieldsNull = true;
    tediousOptions.options.enableCursorCloseOnCommit = false;
    tediousOptions.options.enableImplicitTransactions = false;
    tediousOptions.options.enableNumericRoundabort = false;
    tediousOptions.options.enableQuotedIdentifier = true;
    tediousOptions.options.columnNameReplacer = undefined;
    // new config after patch tedious
    tediousOptions.options.returnDecimalAndNumericAsString = true;
    tediousOptions.options.returnMoneyAsString = true;
    tediousOptions.options.returnDateTimeAsObject = true;
    tediousOptions.options.customParsers = mssqlParser;
}
```

Lupdo mssql has a custom type parser

-   `boolean` are returned as number 1 or 0
-   `intN` are returned as number or BigInt when necessary
-   `binary` are returned as Buffer
-   all others types are always returned as string

## Constants

-   `MSSQL_DATE_BINDING` Choose Mssql DateTime TYPE Binding between: [Default MSSQL_DATE_BINDING_TEMPORAL]
    -   `MSSQL_DATE_BINDING_TEMPORAL` Mssql DateTime TYPE Binding use [Temporal Instant](#temporal-types)
    -   `MSSQL_DATE_BINDING_DATE` Mssql DateTime TYPE Binding use Date
-   `MSSQL_PARAM_SMALLDATETIME` Param type for sql-server SmallDateTime

## Lupdo Exec

Ludpo-mssql will return affected row number, even if a select will be executed.

```ts
const affected = await pdo.exec("INSERT INTO test (name) values ('Claudio')");
console.log(affected); // 1
const affected = await pdo.exec('SELECT * FROM test');
console.log(affected); // row retrieved
```

## Parameters Binding

Lupdo-mssql does not support array of parameters.\
The use of TypedBinding is strongly recommended for prepared Statement.

> **Warning**
> Lupdo-mssql can only retrieve the correct type from the value in certain restricted circumstances.

## Parameters Binding Map To DB Type

-   PARAM_BINARY `Binary`
-   PARAM_BOOLEAN `Bit`
-   PARAM_CHAR `NChar`
-   PARAM_DATE `Date`
-   MSSQL_PARAM_SMALLDATETIME `SmallDateTime`
-   PARAM_DATETIME `DateTime`
-   PARAM_TIMESTAMP `DateTime2`
-   PARAM_DATETIMEZONE `DateTimeOffset`
-   PARAM_TEXT `NText;`
-   PARAM_DECIMAL `Decimal`
-   PARAM_FLOAT `Float` \*\*
-   PARAM_INTEGER `Int`
-   PARAM_NUMERIC `Numeric` \*\*
-   PARAM_TIME `Time`
-   PARAM_VARBINARY `VarBinary`
-   PARAM_BIGINT `NVarChar` \*\*
-   PARAM_VARCHAR `NVarChar`
-   PARAM_GEOMETRY `NVarChar`

\*\* when `value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER` Javascript can not safely generate a BigNumber so value will be sent to Database as `NVarChar`

## Parameter Value Map To DB Type

When parameter are bound as primitive Lupdo-mssql try to generate the right column Type with this rule

-   is Boolean `Bit`
-   is BigInt `NVarChar` or `Int`
-   is Number `Numeric` or `NvarChar` or `Int`
-   is Date `DateTime`
-   is Buffer `VarBinary`
-   others `NVarChar`

> **Warning**
> null value will be always typed as NVarChar, but is not compatible with some database column types and sql-server will raise an error. Please prefer Lupdo TypedBinding

## TypedBinding Options

option `{ scale: number }` is available for:

-   PARAM_TIMESTAMP
-   PARAM_DATETIMEZONE
-   PARAM_TIME

when scale is provided nanoseconds will be rounded to provided scale even if db column has a larger scale.

## Mssql Named Parameter

Lupdo-mssql support named parameter with syntax `:name`, the support is guaranteed only if all placeholder have a binding.\
Native `@param` syntax is supported.

## Mssql Numeric Parameter

Lupdo-mssql support numeric parameter with syntax `?`.

## Kill Connection

Lupdo-mssql support kill query.

## Mssql Output

Lupdo-mssql support queries with `OUTPUT`, results can be fetched from statement.

```ts
const stmt = pdo.query("INSERT INTO users (name, gender) OUTPUT INSERTED.* VALUES ('Claudio', 'All');");
console.log(stmt.fetchArray().all());
/*
[
    [33, 'Claudio', 'All']
]
*/
```

## Mssql lastInsertId

When `pdo.query()` is executed, lupdo-mssql automatically try to fetch LastInsertId and if available it will return last id when `stmt.lastInsertId()` is called.

Lupdo-mssql can fetch LastInsertId on real-time when called inside a `transaction` or when statement is prepared through `pdo.prepare()`.\
If you pass sequence name as parameter, it should retrieve current value of sequence.

> **Warning**
> Calling `stmt.lastInsertId()` without sequence name outside a transaction or a PreparedStatement should not works.

> **Note**
> You can always get insert ID through [`output syntax`](#mssql-output).

# Tedious Fork

[Here](https://github.com/tediousjs/tedious/issues/678) you can find a discussion about Tedious Data Types.\
Lupdo-mssql use a forked version [tedious-better-data-types](https://github.com/Lupennat/tedious-better-data-types) 

## Decimal and Numeric

Tedious by default read Decimal and Numeric bytes from Buffer as `Number`, when data are big decimal or big integer precision and scale are lost.\
Through the new options `returnDecimalAndNumericAsString` it will read byte from Buffer as `String` without loosing precision and scale.

> **Note**
> credits to [tedious-decimal](https://github.com/KAMAELUA/tedious-decimal) fork.

## Money

Tedious by default read Money bytes from Buffer as `Number`, when data are big decimal or big integer precision and scale are lost.\
Through the new options `returnMoneyAsString` it will read byte from Buffer as `Number` but it will cast `high` value through `BigInt` and merge low and high value as `String` without loosing precision and scale.

## Datetime Object

Tedious by default read Date and Time bytes from Buffer as `Number`, but to generate a real date (sql server do not return a real date) it use javascript `Date`. This cause a lot of problem due to Local System Timezone and it also lost precision due to microseconds and nanoseconds (tedious try to fix it with date.deltaNanoseconds).\
Through the new options `returnDateTimeAsObject` it will return db data as a DateObject.

```ts
interface DateTimeObject {
    // year from which start adding
    startingYear: number;
    // day to add
    days?: number;
    // minutes to add
    minutes?: number;
    // milliseconds to add
    milliseconds?: number;
    // nanoseconds to add
    nanoseconds?: number;
    // timezone offset in minutes
    offset?: number;
}
```

Here an example to generate a Temporal.ZoneDateTime.

```ts
// dto is DateTimeObject
const timezone = dto.offset ? offsetToTimezone(dto.offset) : '+00:00';
// console.log(dto);
const instant = Temporal.Instant.from(
    `${dto.startingYear.toString().padStart(4, '0')}-01-01 00:00:00.000000000${timezone}`
);
const minutes = (dto.minutes ?? 0) + (dto.offset ?? 0);

let zdt = instant.toZonedDateTimeISO(timezone).add({
    days: dto.days ?? 0,
    milliseconds: dto.milliseconds ?? 0,
    nanoseconds: dto.nanoseconds ?? 0
});

if (minutes !== 0) {
    zdt = zdt[minutes > 0 ? 'add' : 'subtract']({
        minutes: Math.abs(minutes)
    });
}
```

## Custom Parsers

Tedious by default doesn't Have a Custom Parser. This cause a lot of problem due to Complexity of Variant Type And `TypeN`.\
Through the new options `customParsers` it will apply a custom Callback if type is found on `customParsers`.
First Parameter is The original callback, second parameter is the value decoded from the buffer.\
Before quit custom function must to call the original callback with the value, otherwise iterator will be stuck forever.

```ts
type CustomParserCallback = (parserCallback: (value: unknown) => void, ...value: any[]) => void;

interface CustomParsers {
    BigInt?: CustomParserCallback;
    Binary?: CustomParserCallback;
    Bit?: CustomParserCallback;
    Char?: CustomParserCallback;
    Date?: CustomParserCallback;
    DateTime?: CustomParserCallback;
    DateTime2?: CustomParserCallback;
    DateTimeOffset?: CustomParserCallback;
    Decimal?: CustomParserCallback;
    Float?: CustomParserCallback;
    Image?: CustomParserCallback;
    Int?: CustomParserCallback;
    Money?: CustomParserCallback;
    NChar?: CustomParserCallback;
    NText?: CustomParserCallback;
    Real?: CustomParserCallback;
    SmallDateTime?: CustomParserCallback;
    SmallInt?: CustomParserCallback;
    SmallMoney?: CustomParserCallback;
    Text?: CustomParserCallback;
    Time?: CustomParserCallback;
    TinyInt?: CustomParserCallback;
    UDT?: CustomParserCallback;
    UniqueIdentifier?: CustomParserCallback;
    Xml?: CustomParserCallback;
}
```

Here An Example:

```ts
const customParser = {
    BigInt: function (parserCallback: (value: unknown) => void, value: string | null): void {
        if (value === null) {
            return parserCallback(null);
        }
        const bigint = BigInt(value);
        if (bigint > Number.MAX_SAFE_INTEGER || bigint < Number.MIN_SAFE_INTEGER) {
            parserCallback(bigint);
        } else {
            parserCallback(Number(value));
        }
    }
};
```

# Temporal Types

[tedious-better-data-types](https://github.com/Lupennat/tedious-better-data-types) add new Types to Manage Date And Time columns:

-   TYPES.DateTemporal
-   TYPES.DateTime2Temporal
-   TYPES.DateTimeOffsetTemporal
-   TYPES.DateTimeTemporal
-   TYPES.SmallDateTimeTemporal
-   TYPES.TimeTemporal

this new TYPES use an experimental [@js-temporal/polyfill](https://github.com/js-temporal/temporal-polyfill) for javascript [Temporal](https://tc39.es/proposal-temporal/docs/index.html).

through these new types, full data consistency is ensured, when you bind a date string to a parameter.

```sql
SELECT
     CAST('2007-05-17 23:59:59.999999999' AS time(7)) AS 'time'
    ,CAST('2007-05-08 23:59:29.999999999 -14:00' AS date) AS 'date'
    ,CAST('2007-05-13 23:59:29.998' AS smalldatetime) AS
        'smalldatetime'
    ,CAST('2007-05-13 23:59:29.999' AS datetime) AS 'datetime'
    ,CAST('2007-05-13 23:59:59.998456789 -01:00' AS datetime2(7)) AS
        'datetime2'
    ,CAST('2007-05-13 23:59:59.998456789 -01:00' AS datetimeoffset(7))AS
        'datetimeoffset';
```

Output from these query will be always consistent no matter which is your timezone locale.\
The `options.useUTC` does not affect temporal types.

Valid string Dates are ISO 8601/RFC 3339 string like `2020-01-23T17:04:36.491865121-08:00` or `2020-01-24T01:04Z`.

```txt
[YYYY-MM-DD][T| ][hh:{mm:ss.sssssssss}][Z|±hh{:mm}]
```

> **Warning**
> when string contains microseconds and/or timezone `TYPES.DateTimeTemporal` and `TYPES.SmallDateTimeTemporal` will raise an error.

Output String Date will Be:

-   TYPES.DateTemporal output `YYYY-MM-DD`
-   TYPES.DateTime2Temporal `YYYY-MM-DD hh:mm:ss.ssssssss`
-   TYPES.DateTimeOffsetTemporal `YYYY-MM-DD hh:mm:ss.ssssssss+hh:mm`
-   TYPES.DateTimeTemporal `YYYY-MM-DD hh:mm:ss.sss`
-   TYPES.SmallDateTimeTemporal `YYYY-MM-DD hh:mm:00.000`
-   TYPES.TimeTemporal `hh:mm:ss.sssssss`

> **Warning**
> Using a date with the new Temporal Types, do not guarantee consistence for datetimeoffset type. Use Strings.

> **Note**
> Since the temporal library is still experimental, package has been locked to version 0.4.3
