const fetch = require('node-fetch')
const { warsawAPI } = require('../../../keys.json')

module.exports = async function(stopID, poleID) {
    const lineApiEndpoint = `https://api.um.warszawa.pl/api/action/dbtimetable_get/?id=88cd555f-6f31-43ca-9de4-66c479ad5942&busstopId=${stopID}&busstopNr=${poleID}&apikey=${warsawAPI}`
    const res = await fetch(lineApiEndpoint)
    const json = await res.json()

    try {
        return json.result.map(line => line.values[0].value)
    } catch {
        return false
    }
}