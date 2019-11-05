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