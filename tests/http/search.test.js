import test from 'ava'

import { search } from '../../build/http'

import canberraSearch from './canberra.search.json'
import sydneySearch from './sydney.search.json'

test('Search: Canberra', async t => {
	const result = await search('canberra')
	t.deepEqual(
		result.data.find(({ name }) => name == 'Canberra'), 
		canberraSearch.data.find(({ name }) => name == 'Canberra')
	)
})

test('Search: Sydney', async t => {
	const result = await search('sydney')

	t.deepEqual(
		result.data.find(({ name }) => name == 'Sydney'), 
		sydneySearch.data.find(({ name }) => name == 'Sydney')
	)
})
