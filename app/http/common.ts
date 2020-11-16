import fetch from 'cross-fetch'

import { endPoint } from './constants'

export interface Metadata {
  responseTimestamp: Date
}

export interface RawMetadata {
  'response_timestamp': string
}

export interface GeoPos {
  lat: number
  lon: number
}

export async function grabJSON(url: string): Promise<any> {
  return (await (await fetch(`${endPoint}${url}`)).json())
}

export function loadMetadata(metadata: RawMetadata): Metadata {
  const resTimestamp = new Date(metadata['response_timestamp'])

  return {
    responseTimestamp: resTimestamp
  }
}

export enum State {
  ACT, NSW, VIC, TAS, QLD, SA, NT, WA
}

export function loadState(stateString: string): State {
  let state
  
  switch (stateString.toLowerCase()) {
    case 'act':
      state = State.ACT
      break
    
    case 'nsw':
      state = State.NSW
      break
    
    case 'vic':
      state = State.VIC
      break

    case 'tas':
      state = State.TAS
      break

    case 'qld':
      state = State.QLD
      break

    case 'sa':
      state = State.SA
      break

    case 'nt':
      state = State.NT
      break
    
    case 'wa':
      state = State.WA
      break

    default:
      throw new Error(`The state '${stateString}' is not identifiable`)
  }

  return state
}
