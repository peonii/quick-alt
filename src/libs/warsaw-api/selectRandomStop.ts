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
    let foundDistrict = 'Strefa II'

    const addressComponents = locationJSON.results.map((el: any) => el.address_components)
    for (const addressComponent of addressComponents) {
        const district = addressComponent.filter((el: any) => el.types.includes('sublocality_level_1'))
        if (district) {
            foundDistrict = district.long_name || district.short_name || 'Strefa II'
            break
        }
    }
    
    return {
        stopID: stop.values[0].value,
        poleID: stop.values[1].value,
        stopName: stop.values[2].value,
        latitude,
        longitude,
        districtName: foundDistrict
    }
}