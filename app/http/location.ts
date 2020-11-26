import { State, GeoPos, grabJSON, loadState, Metadata, RawMetadata } from './common'

//* ----------------------------------------------------------------
//* Interfaces

// --------------------------------
// Location information

interface RawLocationInfo {
	geohash: string
	timezone: string
	latitude: number
	longitude: number
	'marine_area_id'?: string
	'tidal_point'?: string
	id: string
	name: string
	state: string
}

// ------------------------------
// Observation information

interface ObservationRaw {
	metadata: RawMetadata
	data: {
		temp: number
		'temp_feels_like': number
		wind?: {
			'speed_kilometre': number
			'speed_knot': number
			direction: string
		}
		gust?: {
			'speed_kilometre': number
			'speed_knot': number
		}
		'rain_since_9am': number
		humidity: number
		station: {
			'bom_id': string
			name: string
			distance: number 
		}
	}
}

interface ObservationData {
	responseTime: Date
	issueTime: Date
	temp: number
	feelsLike: number
	wind?: WindObservation
	gust?: GustObservation
	daysRain: number
	humidity: number
	station: Station
}

interface WindObservation {
	speedKMH: number
	speedKN: number
	direction: string
}

interface GustObservation {
	speedKMH: number
	speedKN: number
}

interface Station {
	bomID: string
	name: string
	distance: number
}

// --------------------------------
// Daily forecast information

interface RawDailyForecast {
	data: RawDailyForecastData[],
	metadata: {
		'response_timestamp': string
    'issue_time': string
    'forecast_region': string
    'forecast_type': string
	}
}

interface RawDailyForecastData {
	rain: DailyForecastRain
	uv: {
		catagory: string
		'end_time': string
		'max_index': number | null
		'start_time': string
	}
	astronimical: {
		'sunrise_time': string
		'sunset_time': string
	}
	now?: {
		'is_night': boolean
		'now_label': string
		'later_label': string
		'temp_now': number
		'temp_later': number
	}

	date: string
	'temp_max': number | null
	'temp_min': number | null

	'extended_text': string
	'icon_descriptor': string
	'short_text': string
	'fire_danger': string | null
}

interface DailyForecast {
	data: DailyForecastDay[]
	metadata: DailyForecastMetadata
}

interface DailyForecastDay {
	rain: DailyForecastRain
	uv: DailyForecastUV
	astronimical: DailyForecastAstronomical
	now?: DailyForecastNow

	date: Date
	maxTemp: number | null
	minTemp: number | null

	extendedText: string
	iconDiscriptor: string
	shortText: string
	fireDanger: string | null
}

interface DailyForecastRain {
	amount: {
		min?: number
		max?: number
		units?: string
	}
	chance?: number
}

interface DailyForecastUV {
	catagory?: string
	startTime?: Date
	endTime?: Date
	maxIndex?: number
}

interface DailyForecastAstronomical {
	sunrise: Date
	sunset: Date
}

interface DailyForecastNow {
	isNight: boolean
	
	nowLabel: string
	nowTemp: number

	laterLabel: string
	laterTemp: number
}

interface DailyForecastMetadata {
	responseTime: Date
	issueTime: Date
	forecastRegion: string
	forecastType: string
}

// ----------------------------------------------------------------
// Location class

export class Location {
	geohash: string
	id?: string
	name?: string
	state?: State
	timezone?: string
	location?: GeoPos
	marineAreaID?: string
	tidalPoint?: string

	// ----------------------------------------------------------------
	// Initialization

	constructor(geohash: string) {
		this.geohash = geohash
	}

	async init() {
		const data = await grabJSON(`locations/${this.geohash}`) as { metadata: Metadata , data: RawLocationInfo}
		const raw = data.data

		this.id = raw.id
		this.name = raw.name
		this.state = loadState(raw.state)
		this.timezone = raw.timezone
		this.location = {
			lat: raw.latitude,
			lon: raw.longitude
		}
		this.marineAreaID = raw['marine_area_id']
		this.tidalPoint = raw['tidal_point']
	}

	//* ----------------------------------------------------------------
	//* Observation functions
	//* ----------------------------------------------------------------

	// ------------------------------
	// Observation helper functions

	private async observationData(): Promise<ObservationData> {
		const raw = await grabJSON(`locations/${this.geohash}/observations`) as ObservationRaw

		const data: ObservationData = {
			responseTime: new Date(raw.metadata.response_timestamp),
			issueTime: new Date(raw.metadata.issue_time || ''),
			temp: raw.data.temp,
			feelsLike: raw.data.temp_feels_like,
			wind: this.initWind(raw.data.wind),
			gust: this.initGust(raw.data.gust),
			daysRain: raw.data.rain_since_9am,
			humidity: raw.data.humidity,
			station: this.initStation(raw.data.station)
		}

		return data
	}

	private initWind(wind: ObservationRaw['data']['wind']): WindObservation | undefined {
		if (!wind) return

		return {
			speedKMH: wind.speed_kilometre,
			speedKN: wind.speed_knot,
			direction: wind.direction
		}
	}

	private initGust(wind: ObservationRaw['data']['gust']): GustObservation | undefined {
		if (!wind) return

		return {
			speedKMH: wind.speed_kilometre,
			speedKN: wind.speed_knot
		}
	}

	private initStation(station: ObservationRaw['data']['station']): Station {
		return {
			bomID: station.bom_id,
			name: station.name,
			distance: station.distance
		}
	}

	// ------------------------------
	// Observationg getter functions

	async getTemp(): Promise<number> {
		const observation = await this.observationData()
		return observation.temp
	}

	async getFeelsLike(): Promise<number> {
		const observation = await this.observationData()
		return observation.feelsLike
	}

	async getHumidity(): Promise<number> {
		const observation = await this.observationData()
		return observation.humidity
	}

	async getDaysRain(): Promise<number> {
		const observation = await this.observationData()
		return observation.daysRain
	}

	async getWind(): Promise<WindObservation | undefined> {
		const observation = await this.observationData()
		return observation.wind
	}

	async getGust(): Promise<GustObservation | undefined> {
		const observation = await this.observationData()
		return observation.gust
	}

	//* ----------------------------------------------------------------
	//* Forecast functions
	//* ----------------------------------------------------------------

	// ---------------------------
	// Forecast helper functions

	private async dailyForcast(): Promise<DailyForecast> {
		const {metadata, data: forecasts} = await grabJSON(`locations/${this.geohash}/forecasts/daily`) as RawDailyForecast
		
		const createUV = (uv: RawDailyForecastData['uv']): DailyForecastUV => 
			({
				catagory: uv.catagory,
				endTime: new Date(uv.end_time),
				startTime: new Date(uv.start_time),
				maxIndex: uv.max_index ? uv.max_index : undefined
			})

		const createAstro = (a: RawDailyForecastData['astronimical']): DailyForecastAstronomical => 
			({
				sunrise: new Date(a.sunrise_time),
				sunset: new Date(a.sunset_time),
			})

		const createNow = (n: RawDailyForecastData['now']): DailyForecastNow =>
			({
				isNight: n?.is_night || false,
				nowLabel: n?.now_label || '',
				laterLabel: n?.later_label || '',
				nowTemp: n?.temp_now || 0,
				laterTemp: n?.temp_later || 0,
			})

		return {
			metadata: {
				responseTime: new Date(metadata.response_timestamp),
				issueTime: new Date(metadata.issue_time),
				forecastRegion: metadata.forecast_region,
				forecastType: metadata.forecast_type
			},
			data: forecasts.map(f => ({
				rain: f.rain,
				uv: createUV(f.uv),
				astronimical: createAstro(f.astronimical),
				now: f.now ? createNow(f.now) : undefined,
				date: new Date(f.date),
				maxTemp: f.temp_max,
				minTemp: f.temp_min,
				extendedText: f.extended_text,
				iconDiscriptor: f.icon_descriptor,
				shortText: f.short_text,
				fireDanger: f.fire_danger
			}))
		}
	}
}