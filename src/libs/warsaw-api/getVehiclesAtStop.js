const fetch = require('node-fetch')
const { warsawAPI } = require('../../../keys.json')

module.exports = async function(stopID) {
    const indexes = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]

    const responses = await Promise.all(indexes.map(async (index) => {
        const lineApiEndpoint = `https://api.um.warszawa.pl/api/action/dbtimetable_get/?id=88cd555f-6f31-43ca-9de4-66c479ad5942&busstopId=${stopID}&busstopNr=${index}&apikey=${warsawAPI}`
        const res = await fetch(lineApiEndpoint)
        const json = await res.json()
        return json
    }))

    let lines = []

    for (let i = 0; i < responses.length; i++) {
        if (responses[i].result.length == 0) continue
        const line = responses[i].result[0].values[0].value
        lines.push(line)
    }

    return lines
}