import test from 'ava'

import { Location } from '../../build/http'

const startLocation = async l => {
  const location = new Location(l)
  await location.init()

  return location
}

const canberra = async () => startLocation('r3dp392')
const sydney   = async () => startLocation('r3gx2fe')

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

test('Temperature: Canberra', async t => {
  const location = await canberra()
  const temperature = await location.getTemp()

  t.true(typeof temperature == 'number')
})

test('Temperature: Sydney', async t => {
  const location = await sydney()
  const temperature = await location.getTemp()

  t.true(typeof temperature == 'number')
})
