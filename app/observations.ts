import {parse} from 'fast-xml-parser'

import {ftpHost, xmlParserConfig} from './constants'

import ftpHandler from './ftpHandler'
import { objectFilter } from './utils'
import { IGlobalLocation, States } from './interfaces'

export interface IObservation {
  state?: States
  wmo: number
  bomid: number
  forecastID: string
  name: string
  description: string
  time: Date
  loc: IGlobalLocation
  apparentTemp?: number
  deltaT?: number
  airTemperature?: number
  dewPoint?: number
  pressure?: number
  qnhPressure?: number
  relHumidity?: number
  windDir?: string
  windDirDeg?: number
  windSpdKMH?: number
  windSpdKnots?: number
  rainfall?: number
  rainfallHour?: number
  rainfall10?: number
  rainfall_24hr?: number
  maximumAirTemperature?: number
  minimumAirTemperature?: number
}

const observationFile = (location: States): string => {
  const link = (a: string) => `/anon/gen/fwo/ID${a}.xml`
  switch (location) {
    case States.ACT:
      console.warn('ACT shares the same data sources as NSW')
      return observationFile(States.NSW)
    case States.NSW:
      return link('N60920')
    case States.NT:
      return link('D60920')
    case States.QLD:
      return link('Q60920')
    case States.SA:
      return link('S60920')
    case States.TAS:
      return link('T60920')
    case States.VIC:
      return link('V60920')
    case States.WA:
      return link('W60920')
    default:
      console.warn(`Warning: The enum with the value ${location} does not mach any forecast file, defaulting to the NSW (${States.NSW}) forecast file`)
      return observationFile(States.NSW)
  }
}

const generateObservations = (stationData: any): IObservation => {
  const observations: any = {}

  stationData.period.level.element.forEach((element: any) => observations[element['@_type']] = element['#text'])

  const station: IObservation = {
    wmo: stationData['@_wmo-id'],
    bomid: stationData['@_bom-id'],
    forecastID: stationData['@_forecast-district-id'],
    name: stationData['@_stn-name'],
    description: stationData['@_description'],
    time: new Date(stationData.period['@_time-utc']),
    loc: {
      lat: stationData['@_lat'],
      lon: stationData['@_lon'],
      elevation: stationData['@_stn-height']
    },
    apparentTemp: observations.apparent_temp,
    deltaT: observations.delta_t,
    airTemperature: observations.air_temperature,
    dewPoint: observations.dew_point,
    pressure: observations.pres,
    qnhPressure: observations.qnh_pres,
    rainfallHour: observations.rain_hour,
    rainfall10: observations.rainfall10,
    relHumidity: observations['rel-humidity'],
    windDir: observations.wind_dir,
    windDirDeg: observations.wind_dir_deg,
    windSpdKMH: observations.wind_spd_kmh,
    windSpdKnots: observations.wind_spd,
    rainfall_24hr: observations.rainfall_24hr,
    rainfall: observations.rainfall,
    maximumAirTemperature: observations.maximum_air_temperature,
    minimumAirTemperature: observations.minimum_air_temperature
  }
  
  return objectFilter(station, (p: any) => typeof p === 'undefined')
}

export const getObservationsWMO = async (id: number, state: States): Promise<IObservation> => {
  const observationXMLFile = observationFile(state)
  const {product} = parse(await ftpHandler(ftpHost, observationXMLFile), xmlParserConfig)

  return generateObservations(product.observations.station.filter((s: any) => Number(s['@_wmo-id']) === id)[0])
}

export const getObservationsBOMID = async (id: number, state: States): Promise<IObservation> => {
  const observationXMLFile = observationFile(state)
  const {product} = parse(await ftpHandler(ftpHost, observationXMLFile), xmlParserConfig)

  return generateObservations(product.observations.station.filter((s: any) => Number(s['@_bom-id']) === id)[0])
}
