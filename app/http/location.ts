import { State, GeoPos, grabJSON, loadState, Metadata, RawMetadata } from "./common"

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

interface ObservationRaw {
  metadata: RawMetadata
  data: {
    temp: number
    'temp_feels_like': number
    wind: {
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
  wind: WindObservation
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

export class Location {
  geohash: string
  id?: string
  name?: string
  state?: State
  timezone?: string
  location?: GeoPos
  marineAreaID?: string
  tidalPoint?: string

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

  private initWind(wind: ObservationRaw['data']['wind']): WindObservation {
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
}