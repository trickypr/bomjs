import { grabJSON, loadMetadata, loadState, Metadata, RawMetadata, State } from './common'

export interface SearchLocation {
  geohash: string,
  id: string,
  name: string,
  postcode: number,
  state: State
}

export interface SearchResponse {
  metadata: Metadata,
  data: SearchLocation[]
}

interface RawSearchLocation {
  geohash: string,
  id: string,
  name: string,
  postcode: string,
  state: string
}

interface RawSearchResponse {
  metadata: RawMetadata,
  data: RawSearchLocation[]
}

function loadData(raw: RawSearchLocation[]): SearchLocation[] {
  return raw.map(({ geohash, id, name, postcode, state }) => {
    const item = {
      geohash,
      id,
      name,
      postcode: Number(postcode),
      state: loadState(state)
    }

    return item
  })
}

export async function search(query: string): Promise<SearchResponse> {
  const raw = await grabJSON(`locations?search=${query}`) as RawSearchResponse

  const metadata: Metadata = loadMetadata(raw.metadata)
  const data: SearchLocation[] = loadData(raw.data)

  return {
    metadata,
    data
  }
}