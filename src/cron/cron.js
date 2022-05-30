const cron = require('node-cron');
const fs = require('fs');
const fetch = require('node-fetch');
const { warsawAPI, dailyStopWebhookURL } = require('../../keys.json')

module.exports = {
    cronJobs() {
        console.log('scheduled cron!')

        // fetch new bus stops
        cron.schedule('0,10,20,30,40,50 * * * * *', async () => {
            const locationApiEndpoint = `https://api.um.warszawa.pl/api/action/dbstore_get/?id=ab75c33d-3a26-4342-b36a-6e5fef0a3ac3&sortBy=id&apikey=${warsawAPI}`

            console.log('fetching stops!')
            const data = await fetch(locationApiEndpoint)
                .then(res => res.json())
                .then(json => {
                    console.log('fetching stops!')
                    fs.writeFileSync('data/warszawa.json', JSON.stringify(json))
                })
            console.log('fetching stops!')

            const { selectRandomStop } = require('../libs/warsaw-api/selectRandomStop')
            const { getVehiclesAtPole } = require('../libs/warsaw-api/getVehiclesAtPole')

            let stop = await selectRandomStop()

            let lines = await getVehiclesAtPole(stop.stopID, stop.poleID)
            console.log('fetching stops!')
            while (!lines) {
                stop = await selectRandomStop()
                lines = await getVehiclesAtPole(stop.stopID, stop.poleID)
            }
            const line = lines[Math.floor(Math.random() * lines.length)]
            console.log('fetching stops!')
            let lineType
            if (line.startsWith('S')) lineType = 'Szybka Kolej Miejska'
            else if (line.startsWith('R')) lineType = 'Kolej Mazowiecka'
            else if (line.startsWith('M')) lineType = 'Metro'
            else if (line.startsWith('WKD')) lineType = 'Warszawska Kolej Dojazdowa'
            else if (line.startsWith('N')) lineType = 'Autobus Nocny'
            else if (line.startsWith('L')) lineType = 'Autobus Lokalny'
            else if (line.startsWith('E')) lineType = 'Autobus Ekspresowy'
            else if (line.length === 3) lineType = 'Autobus'
            else lineType = 'Tramwaj'

            const locationMsg = ` - [Lokalizacja](https://www.google.com/maps/search/?api=1&query=${stop.latitude},${stop.longitude})`
            console.log('fetching stops!')

            fetch(dailyStopWebhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: `**${lineType} ${line}**${locationMsg}`
                })
            })
        })
    },
}
