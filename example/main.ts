import { search, Location } from '../build/app'

const locationSearch = document.getElementById('locationSearch') as HTMLInputElement

const locationName	= document.getElementById('locationName')
const temp					= document.getElementById('temp')
const feelsLike			= document.getElementById('feelsLike')
const humid					= document.getElementById('humid')
const windDir				= document.getElementById('windDir')
const windSpeed			= document.getElementById('windSpeed')
const gustSpeed			= document.getElementById('gustSpeed')

let l: Location

async function updateDisplay() {
	if (!l) return
	
	locationName.innerText = l.name || '-'
	temp.innerText = await (await l.getTemp()).toString()
	feelsLike.innerText = await (await l.getFeelsLike()).toString()
	humid.innerText = await (await l.getHumidity()).toString()

	const wind = await l.getWind()
	const gust = await l.getGust()

	windDir.innerText = wind.direction || '-'
	windSpeed.innerText = wind.speedKMH.toString() || '-'
	gustSpeed.innerText = gust.speedKMH.toString() || '-'
}

locationSearch.addEventListener('keyup', async () => {
	const searchString = locationSearch.value
	const {data} = await search(searchString)

	if (data.length != 0) {
		l = new Location(data[0].geohash)
		await l.init()
		updateDisplay()
	}
})
