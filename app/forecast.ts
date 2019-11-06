import { parse } from 'fast-xml-parser'

import {ftpHost, xmlParserConfig} from './constants'
import { States, IForecast, IPlaceForecasts } from './interfaces'
import ftpHandler from './ftpHandler'
import { objectFilter } from './utils'

const observationFile = (location: States): string[] => {
  const link = (a: string, b: string) => [`/anon/gen/fwo/ID${a}.xml`, `/anon/gen/fwo/ID${b}.xml`]
  switch (location) {
    case States.ACT:
      console.warn('ACT shares the same data sources as NSW')
      return observationFile(States.NSW)
    case States.NSW:
      return link('N11100', 'N11050')
    case States.NT:
      return link('D10208', 'D10198')
    case States.QLD:
      return link('Q11296', 'Q10605')
    case States.SA:
      return link('S11039', 'S10037')
    case States.TAS:
      return link('T13515', 'T13630')
    case States.VIC:
      return link('V10752', 'V10751')
    case States.WA:
      return link('W14100', 'W12400')
    default:
      console.warn(`Warning: The enum with the value ${location} does not mach any forecast file, defaulting to the NSW (${States.NSW}) forecast file`)
      return observationFile(States.NSW)
  }
}

const getFileCoreData = async (file: string) => parse(await ftpHandler(ftpHost, file), xmlParserConfig).product.forecast.area

const parseForecasts = (forecastRaw: any): IForecast => objectFilter({
  index: Number(forecastRaw['@_index']),
  startTime: new Date(forecastRaw['@_start-time-utc']),
  endDate: new Date(forecastRaw['@_end-time-utc']),
  forecast: forecastRaw.text['#text']
}, ((f: any) => typeof f === 'undefined'))

const genPlace = (station: any): IPlaceForecasts => {
  const forecasts: IForecast[] =  station['forecast-period'].map((forecastRaw: any) => parseForecasts(forecastRaw))
  
  return {
    forecastID: station['@_aac'],
    description: station['@_description'],
    forecasts
  }
}

export const getForecastFromDescription = async (description: string, state: States) => {
  const places = [...await getFileCoreData(observationFile(state)[0]), ...await getFileCoreData(observationFile(state)[1])]
  const place = places.filter((s: any) => s['@_description'].toLowerCase() === description.toLowerCase())[0]
  return genPlace(place)
}

export const getForecast = async (id: string, state: States) => {
  const places = [...await getFileCoreData(observationFile(state)[0]), ...await getFileCoreData(observationFile(state)[1])]
  const place = places.filter((s: any) => s['@_aac'].toLowerCase() === id.toLowerCase())[0]
  return genPlace(place)
}