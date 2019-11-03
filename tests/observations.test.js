import test from 'ava'

import { getObservationsWMO, getObservationsBOMID, States } from '../dist/app'

test('WMO Station Observation', async t => {
  try {
    await getObservationsWMO(94768, States.NSW)
  } catch (err) {
    t.fail(err)
  }
  
  t.pass()
})

test('BOM ID Station Observation', async t => {
  try {
    await getObservationsBOMID(69017, States.NSW)
  } catch (err) {
    t.fail(err)
  }
  
  t.pass()
})
