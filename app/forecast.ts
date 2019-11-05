import {writeFileSync} from 'fs'

import {ftpHost, xmlParserConfig} from './constants'

import { States } from "./interfaces"
import ftpHandler from "./ftpHandler"
import { parse } from 'fast-xml-parser'
import { objectFilter } from './utils'

export interface IForecast {
  index: number
  startTime: Date
  endDate: Date
  forecast: string
  fireDanger?: string
  uv?: string
}

export interface IPlaceForecasts {
  forecastID: string
  description: string
  forecasts: IForecast[]
}

const observationFile = (location: States): string[] => {
  switch (location) {
    case States.ACT:
        console.warn('ACT shares the same data sources as NSW')
      return observationFile(States.NSW)
    case States.NSW:
      return ['/anon/gen/fwo/IDN11100.xml', '/anon/gen/fwo/IDN11050.xml']
    case States.NT:
      return ['/anon/gen/fwo/IDD10208.xml', '/anon/gen/fwo/IDD10198.xml']
    case States.QLD:
      return ['/anon/gen/fwo/IDQ11296.xml', '/anon/gen/fwo/IDQ10605.xml']
    case States.SA:
      return ['/anon/gen/fwo/IDS11039.xml', '/anon/gen/fwo/IDS10037.xml']
    case States.TAS:
      return ['/anon/gen/fwo/IDT13515.xml', '/anon/gen/fwo/IDT13630.xml']
    case States.VIC:
      return ['/anon/gen/fwo/IDV10752.xml', '/anon/gen/fwo/IDV10751.xml']
    case States.WA:
      return ['/anon/gen/fwo/IDW14100.xml', '/anon/gen/fwo/IDW12400.xml']
  }

  console.warn(`Warning: The enum with the value ${location} does not mach any forecast file, defaulting to the NSW (${States.NSW}) forecast file`)
  return observationFile(States.NSW)
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