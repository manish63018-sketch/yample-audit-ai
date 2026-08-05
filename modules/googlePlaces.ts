import fetch from 'node-fetch'

export async function placesTextSearch(query: string, limit = 10) {
  const key = process.env.GOOGLE_PLACES_API_KEY
  if (!key) throw new Error('GOOGLE_PLACES_API_KEY not set')
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${key}`
  const resp = await fetch(url)
  const json = await resp.json()
  return (json.results || []).slice(0, limit)
}

export async function placeDetails(placeId: string) {
  const key = process.env.GOOGLE_PLACES_API_KEY
  if (!key) throw new Error('GOOGLE_PLACES_API_KEY not set')
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&key=${key}`
  const resp = await fetch(url)
  const json = await resp.json()
  return json.result
}

export default { placesTextSearch, placeDetails }
