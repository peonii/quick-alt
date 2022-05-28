const fetch = require('node-fetch')
const { warsawAPI } = require('../../../keys.json')

module.exports = async function(stopID) {
    const locationApiEndpoint = `https://api.um.warszawa.pl/api/action/dbstore_get/?id=ab75c33d-3a26-4342-b36a-6e5fef0a3ac3&sortBy=id&apikey=${warsawAPI}`
    const locationResponseRaw = await fetch(locationApiEndpoint)
    const locationResponse = await locationResponseRaw.json()

    const locationFiltered = locationResponse.result.filter((location) => location.values[0].value == stopID)
    const locationLat = locationFiltered[0].values[4].value
    const locationLng = locationFiltered[0].values[5].value

    return [locationLat, locationLng]
}