import test from 'ava'

import { Location } from '../../build/http'

test('Init location: Canberra', async t => {
  const location = new Location('r3dp392')
  await location.init()

  t.pass()
})

test('Init location: Sydney', async t => {
  const location = new Location('r3gx2fe')
  await location.init()

  t.pass()
})

