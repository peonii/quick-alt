const stops = require('../../../data/warszawa.json').result

module.exports = async function() {
    const stop = stops[Math.floor(Math.random() * stops.length)]

    return {
        stopID: stop.values[0].value,
        poleID: stop.values[1].value,
        stopName: stop.values[2].value,
        latitude: stop.values[4].value,
        longitude: stop.values[5].value
    }
}