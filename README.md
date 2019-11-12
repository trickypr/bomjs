<h1 align="center">BomJS</h1>
<p align="center">A wrapper over the Australian Bureau of Meteorology api</p>
<div align="center">
  <img src="https://img.shields.io/node/v/bomjs?style=flat-square" alt="Node version" />
  <img alt="npm (tag)" src="https://img.shields.io/npm/v/bomjs/latest?style=flat-square">
</div>

<p align="center"><a href="https://trickypr.github.io/bomjs/">Docs</a> • <a href="https://www.npmjs.com/package/bomjs">NPM</a> • <a href="https://github.com/trickypr/bomjs">Github</a></p>

## Install
```sh
yarn add bomjs
# or
npm install bomjs
```

## Grab some observations
```ts
import { getObservationsWMO, getObservationsBOMID, IObservation, States } from '../dist/app'

// WMO
const data: IObservation = await getObservationsWMO(94768, States.NSW)

// BOM ID
const data: IObservation = await getObservationsBOMID(69017, States.NSW)
```

## Grab forecasts
```ts 
import { getForecastFromDescription, getForecast, States } from '../build/app'

// From description
const forecast: IForecast = await getForecastFromDescription('canberra', States.NSW)

// From forecast id
const forecast: IForecast = await getForecast('NSW_PW012', States.NSW)
```

## Changelog 
- 1.0.0: Inital release
- 1.0.1: Include typescript in the npm bundle
- 1.0.2: Better docs for npm, and increase the build to `ES2018`

A more detailed change log is available on [the github repo](https://github.com/trickypr/bomjs/blob/master/CHANGELOG.md).
