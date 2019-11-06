# Getting started
::: tip
This tutorial will be using typescript You can learn a bit about typescript in their [typescript in 5 minutes tutorial](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html). 
:::

## Installation 
You can grab this from npm
```bash
yarn add bomjs
# or
npm install bomjs
```
Then import it into your project
```js
// ESNext / Typecript
import { getForecast /* Anything else */ } from 'bomjs'

// CommonJS / standard node
const { getForecast /* Anything else */ } = require('bomjs')
```

## Getting observations
There are two indexing systems for grabbing forecasts. You can either use `WMO` or `BOMID`. These are internal naming systems from BOM (More documentation needed).

```ts
import { getObservationsWMO, getObservationsBOMID, IObservation, States } from '../dist/app'

// WMO
const data: IObservation = await getObservationsWMO(94768, States.NSW)

// BOM ID
const data: IObservation = await getObservationsBOMID(69017, States.NSW)
```

Each of these functions will return an object that complies with the [IObservation](../docs/iobservation.html) interface.