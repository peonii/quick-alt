import stopsIndex from '../../../data/warszawa.json'

export default async function() {
    const stops = stopsIndex.result
    const stop = stops[Math.floor(Math.random() * stops.length)]

    return {
        stopID: stop.values[0].value,
        poleID: stop.values[1].value,
        stopName: stop.values[2].value,
        latitude: stop.values[4].value,
        longitude: stop.values[5].value
    }
}