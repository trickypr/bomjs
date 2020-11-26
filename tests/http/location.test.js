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

const observationTest = async (l, t) => {
	const temperature = await l.getTemp()
	const feelsLike   = await l.getFeelsLike()
	const humidity    = await l.getHumidity()
	const daysRain    = await l.getHumidity()
	const wind        = await l.getWind()

	await l.getGust()

	t.true(typeof temperature == 'number', 'Temperature')
	t.true(typeof feelsLike == 'number', 'Feels like')
	t.true(typeof humidity == 'number', 'Humidity')
	t.true(typeof daysRain == 'number', 'Day\'s rain')
	t.truthy(wind, 'Wind observation')
}

test('Observations: Canberra', async t => await observationTest(await canberra(), t))
test('Observations: Sydney', async t => await observationTest(await sydney(), t))

const dailyForecastTest = async (l, t) => {
	await l.getDailyForecast()
	t.pass()
}

test('Daily forecast: Canberra', async t => await dailyForecastTest(await canberra(), t))
test('Daily forecast: Sydney', async t => await dailyForecastTest(await sydney(), t))
