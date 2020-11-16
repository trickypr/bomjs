import { State, GeoPos, grabJSON, loadState, Metadata } from "./common"

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

interface ObservationData {

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

  private async observationData(): any {
    const { data } = await grabJSON(`locations/${this.geohash}/observations`)
  }

  async getTemp(): number {

  }
}