CREATE DATABASE test_db
GO

ALTER DATABASE test_db SET ALLOW_SNAPSHOT_ISOLATION ON;
ALTER DATABASE test_db SET DELAYED_DURABILITY = FORCED;
GO

USE test_db;
GO

CREATE TABLE types (
bigint bigint NULL,
numeric numeric(38,10) NULL,
bit bit NULL,
smallint smallint NULL,
decimal decimal(38,10) NULL,
smallmoney smallmoney NULL,
int int NULL,
tinyint tinyint NULL,
money money NULL,
float float(53) NULL,
real real NULL,
date date NULL,
datetimeoffset datetimeoffset NULL,
datetime2 datetime2 NULL,
smalldatetime smalldatetime NULL,
datetime datetime NULL,
time time NULL,
char char NULL,
varchar varchar(25) NULL,
text text NULL,
nchar nchar NULL,
nvarchar nvarchar(25) NULL,
ntext ntext NULL,
binary binary NULL,
varbinary varbinary(25) NULL,
image image NULL,
rowversion rowversion NULL,
hierarchyid hierarchyid NULL,
uniqueidentifier uniqueidentifier NULL,
sql_variant sql_variant NULL,
xml xml NULL,
point geometry NULL,
linestring geometry NULL,
circularstring geometry NULL,
compoundcurve geometry NULL,
polygon geometry NULL,
curvepolygon geometry NULL,
multipoint geometry NULL,
multilinestring geometry NULL,
multipolygon geometry NULL,
geometrycollection geometry NULL,
geo_point geography NULL,
geo_linestring geography NULL,
geo_circularstring geography NULL,
geo_compoundcurve geography NULL,
geo_polygon geography NULL,
geo_curvepolygon geography NULL,
geo_multipoint geography NULL,
geo_multilinestring geography NULL,
geo_multipolygon geography NULL,
geo_geometrycollection geography NULL,
);
CREATE TABLE users (id bigint IDENTITY(1,1), name varchar(255) NOT NULL, gender varchar(255) NOT NULL, PRIMARY KEY (id));
CREATE TABLE companies (id int IDENTITY(1,1), name varchar(255) NOT NULL, opened datetime NOT NULL, active BIT NOT NULL, binary varbinary(MAX) NULL, PRIMARY KEY (id));
CREATE TABLE temporal (id int IDENTITY(1,1), date date NULL,datetimeoffset datetimeoffset NULL,datetime2 datetime2 NULL,smalldatetime smalldatetime NULL,datetime datetime NULL,time time NULL);
GO

INSERT INTO users (name, gender) VALUES ('Edmund','Multigender');
INSERT INTO users (name, gender) VALUES ('Kyleigh','Cis man');
INSERT INTO users (name, gender) VALUES ('Josefa','Cisgender male');
INSERT INTO users (name, gender) VALUES ('Cecile','Agender');
INSERT INTO users (name, gender) VALUES ('Sincere','Demi-girl');
INSERT INTO users (name, gender) VALUES ('Baron','Cisgender male');
INSERT INTO users (name, gender) VALUES ('Mckayla','Genderflux');
INSERT INTO users (name, gender) VALUES ('Wellington','Cisgender woman');
INSERT INTO users (name, gender) VALUES ('Tod','Demi-man');
INSERT INTO users (name, gender) VALUES ('Jeffrey','Androgyne');
INSERT INTO users (name, gender) VALUES ('Keenan','Two-spirit person');
INSERT INTO users (name, gender) VALUES ('Lucile','Man');
INSERT INTO users (name, gender) VALUES ('Kyra','Other');
INSERT INTO users (name, gender) VALUES ('Jermain','Gender neutral');
INSERT INTO users (name, gender) VALUES ('Kelli','Agender');
INSERT INTO users (name, gender) VALUES ('Jeffry','Two-spirit person');
INSERT INTO users (name, gender) VALUES ('Dawn','Male to female');
INSERT INTO users (name, gender) VALUES ('Ofelia','Cis female');
INSERT INTO users (name, gender) VALUES ('Icie','F2M');
INSERT INTO users (name, gender) VALUES ('Matilde','Trans');
INSERT INTO users (name, gender) VALUES ('Marcelina','Transgender female');
INSERT INTO users (name, gender) VALUES ('Destin','Male to female transsexual woman');
INSERT INTO users (name, gender) VALUES ('Reilly','Intersex man');
INSERT INTO users (name, gender) VALUES ('Casimer','Other');
INSERT INTO users (name, gender) VALUES ('Carli','Bigender');
INSERT INTO users (name, gender) VALUES ('Harry','Cis man');
INSERT INTO users (name, gender) VALUES ('Ellie','Omnigender');
INSERT INTO users (name, gender) VALUES ('Solon','Gender neutral');
INSERT INTO users (name, gender) VALUES ('Lesley','Cis');
INSERT INTO users (name, gender) VALUES ('Nikolas','Agender');
GO

INSERT INTO companies (name, opened, active) VALUES ('Satterfield Inc', '2022-10-22 00:00:00', 1);
INSERT INTO companies (name, opened, active) VALUES ('Grimes - Reinger', '2022-11-22 00:00:00', 0);
INSERT INTO companies (name, opened, active) VALUES ('Skiles LLC', '2022-12-12 00:00:00', 0);
INSERT INTO companies (name, opened, active) VALUES ('White, Hermiston and Kihn', '2020-10-01 00:00:00', 1);
INSERT INTO companies (name, opened, active) VALUES ('Huel LLC', '2018-12-22 00:00:00', 1);
INSERT INTO companies (name, opened, active) VALUES ('Aufderhar - Schroeder', '2019-12-22 00:00:00', 1);
INSERT INTO companies (name, opened, active) VALUES ('Powlowski - VonRueden', '2014-12-22 00:00:00', 1);
INSERT INTO companies (name, opened, active) VALUES ('Murray - Hagenes', '2015-12-22 00:00:00', 1);
INSERT INTO companies (name, opened, active) VALUES ('Bednar LLC', '2013-12-22 00:00:00', 1);
INSERT INTO companies (name, opened, active) VALUES ('Kirlin - Bednar', '2011-12-22 00:00:00', 1);
INSERT INTO companies (name, opened, active) VALUES ('Kassulke - Auer', '2010-12-22 00:00:00', 1);
INSERT INTO companies (name, opened, active) VALUES ('Orn - Pouros', '2021-12-22 00:00:00', 1);
INSERT INTO companies (name, opened, active) VALUES ('Greenfelder - Paucek', '2009-12-22 00:00:00', 1);
INSERT INTO companies (name, opened, active) VALUES ('Hand, Effertz and Shields', '2000-12-22 00:00:00', 1);
INSERT INTO companies (name, opened, active) VALUES ('Harber - Heidenreich', '2001-12-22 00:00:00', 0);
INSERT INTO companies (name, opened, active) VALUES ('Greenholt - Durgan', '2000-12-22 00:00:00', 1);
INSERT INTO companies (name, opened, active) VALUES ('Hauck - Murazik', '2000-12-22 00:00:00', 0);
INSERT INTO companies (name, opened, active) VALUES ('Beier and Sons', '1999-12-22 00:00:00', 0);
INSERT INTO companies (name, opened, active) VALUES ('Harvey Inc', '2022-12-22 00:00:00', 1);
GO

-- cursor and table