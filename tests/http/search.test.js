import test from 'ava'

import { search } from '../../build/http'

import canberraSearch from './canberra.search.result.json'

test('searchCanberra', async t => {
  const result = await search('canberra')
  t.deepEqual(result.data, canberraSearch.data)
})
