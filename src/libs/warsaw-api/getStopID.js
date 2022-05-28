const fetch = require('node-fetch')
const { warsawAPI } = require('../../../keys.json')

module.exports = async function(stopName) {
    const urlEncodedStopName = encodeURIComponent(stopName)

    const apiEndpoint = `https://api.um.warszawa.pl/api/action/dbtimetable_get/?id=b27f4c17-5c50-4a5b-89dd-236b282bc499&name=${urlEncodedStopName}&apikey=${warsawAPI}`
    const response = await fetch(apiEndpoint)
    const json = await response.json()

    const value = json.result[0].values[0].value
    return value
}