# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2019-11-7 
### Added 
 - `getObservationsWMO` function 
 - `getObservationsBOMID` function
 - `getForecastFromDescription` function
 - `getForecast` function
 - `States` Enum
 - `IGlobalLocation` interface
 - `IForecast` interface 
 - `IPlaceForecasts` interface
 - `IObservation` interface
 - Add an ftp handler with a cache

## [1.0.1] - 2019-11-8
### Changes
 - Include typescript in the npm package

## [1.0.2] - 2019-11-12
### Added
 - Changelog

### Changes
 - Increase compile target from `ES2017` to `ES2018`
 - Update typescript, @typescript-eslint/parser and @typescript-eslint/eslint-plugin
 - Update `README.md` to be more helpful
 - NPM home page

### Removed
 - Removed support for node 8. Oldest supported version is node 10.