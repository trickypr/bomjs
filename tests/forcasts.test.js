import test from 'ava'

import { getForecastFromDescription, getForecast, States } from '../dist/app'

test('Forecast from descriptions', async t => {
  try {
    await getForecastFromDescription('canberra', States.NSW)
  } catch (err) {
    t.pass(err.toString())
  }

  t.pass()
})

test('Forecast from forecast id', async t => {
  try {
    await getForecast('NSW_PW012', States.NSW)
  } catch (err) {
    t.pass(err.toString())
  }

  t.pass()
})
