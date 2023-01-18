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
Lupdo driver for SQL Server

## exec return 
affected row anche su select

## set connection
occhio che vengono salvate e lanciate per ogni query

## data manipolazione
se usi la scala non fa round, se non la usi fa round dei primi 7 decimali gli ultimi 2 vengono sempre ignorati

SELECT   
     CAST('2007-05-08 12:35:29.123456789 +12:15' AS time(7)) AS 'time'   
    ,CAST('2007-05-08 12:35:29.123456789 +12:15' AS date) AS 'date'   
    ,CAST('2007-05-08 12:35:29.123' AS smalldatetime) AS   
        'smalldatetime'   
    ,CAST('2007-05-08 12:35:29.123' AS datetime) AS 'datetime'   
    ,CAST('2007-05-08 12:35:29.999999999 +12:15' AS datetime2(7)) AS   
        'datetime2'  
    ,CAST('2007-05-08 12:35:29.999999999 +12:15' AS datetimeoffset(7)) AS   
        'datetimeoffset';

12:35:30.0000000,
2007-05-08,
2007-05-08 12:35:00.000,
2007-05-08 12:35:29.123,
2007-05-08 12:35:30.0000000,
2007-05-08 12:35:30.0000000