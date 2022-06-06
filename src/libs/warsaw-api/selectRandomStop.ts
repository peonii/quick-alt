import stopsIndex from '../../../data/warszawa.json'
import { googleMapsAPI } from '../../../keys.json'
import fetch from 'node-fetch'

export default async function() {
    const stops = stopsIndex.result
    const stop = stops[Math.floor(Math.random() * stops.length)]

    const latitude = stop.values[4].value
    const longitude = stop.values[5].value

    const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsAPI}`

    const location = await fetch(endpoint)
    const locationJSON = await location.json()

    const addressComponents = locationJSON.results[0].address_components
    const district = addressComponents.filter((el: any) => el.types.includes('sublocality_level_1'))[0]

    let districtName = '';
    if (district)
        districtName = district.long_name || district.short_name || ''

    return {
        stopID: stop.values[0].value,
        poleID: stop.values[1].value,
        stopName: stop.values[2].value,
        latitude,
        longitude,
        districtName
    }
}