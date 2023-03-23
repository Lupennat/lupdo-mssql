# Changelog

All notable changes to this project from 1.0.0 forward will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2023-03-23

### Changed

-   Update to Lupdo ^3.3.0

## [2.1.4] - 2023-03-20

### Fixed

"Requests can only be made in the LoggedIn state, not the SentClientRequest state"
Only one query can be executed on a connection at a time. You need to wait until the request callback is executed, either with an error or with the result before making another request.
(Refer to the [TDS protocol state diagram](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-tds/ce1cef02-f43c-4e37-a190-aaa444b96360) [bottom-half of the diagram] for a high level understanding of the TDS lifecycle).

## [2.1.3] - 2023-03-14

### Fixed

-   String parser fixed `?` matching

### Added

-   String parser convert `??` to `?`

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
