# IObservation 
`IObservation` is the type returned by observation functions.

| Name          | Type           | Description        | Required |
| ------------- | -------------- | ------------------ | -------- |
| wmo           | number         | Station id         | true     | 
| bomid         | number         | Station id         | true     |
| forecastID    | string         | ID for forecasting | true     |
| name          | string         | The name of the station | true |
| description   | string         | Similar to name    | true     |
| time          | Date           | The time captured  | true     |
| loc           | [IGlobalLocation](./igloballocation.md)| Station Location   | true     |
| state         | States         | State / territory location| false |
| apparentTemp  | number         | Feels like temperature | false |
| deltaT        | number         | ???????            | false    |
| airTemperature| number         | Air temperature    | false    |
| dewPoint      | number         | Temperature for dew to form | false |
| pressure      | number         | Air pressure       | false |
| qnhPressure | number | ???????? | false |
| relHumidity | number | Humidity (%) | false |
| windDir     | string | Wind direction | false |
| windDirDeg | number | Wind direction degrees | false |
| windSpdKMH | number | Wind speed | false |
| windSpdKnots | number | Wind speed | false |
| rainfall | number | rainfall | false |
| rainfallHour | number | Rainfall for the hour | false 
| rainfall10 | number | Rainfall ???? | false |
| raifall_24hr | number | Rainfall 24hr | false |
| maximumAirTemperature | number | Max temperature for the day | false 
| minimumAirTemperature | number | Min temperature for the day | false

## Raw code 
```ts
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
```