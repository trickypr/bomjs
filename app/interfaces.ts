export enum States {
  ACT,
  NSW,
  QLD,
  TAS,
  VIC,
  NT,
  WA,
  SA
}

export interface IGlobalLocation {
  lat: number,
  lon: number,
  elevation?: number
}

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
