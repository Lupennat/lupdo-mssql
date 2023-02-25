# Changelog

All notable changes to this project from 1.0.0 forward will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.2] - 2023-02-25

### Added

-   Exported constants

## [2.1.1] - 2023-02-05

### Changed

-   Update `tedious-better-data-types`

### Added

-   `MssqlIsolationLevel` type;

## [2.1.0] - 2023-02-03

### Changed

-   The `server` option now also accepts a list of `host:port`; the pool will generate the connection using a random host from the list.

## [2.0.1] - 2023-01-20

### Added

-   `createMssqlPdo` function exported to better typing mssqlOptions

## [2.0.0] - 2023-01-19

### Changed

-   `tedious-better-data-types` fork instead tedious.

## [1.1.0] - 2023-01-19

### Fixed

-   `DateTimeOffset` format more consisent with ISO 8601/RFC 3339 no space between seconds and timezone

## [1.0.0] - 2023-01-18

First Public Release On Npm
