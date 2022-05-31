const cron = require('node-cron');
const fs = require('fs');
const fetch = require('node-fetch');
const { warsawAPI, webhookId, webhookToken, dailyStopChannelID } = require('../../keys.json')
const { getVehiclesAtPole, selectRandomStop } = require('../libs/warsaw-api')
const { WebhookClient, Webhook, MessageEmbed } = require('discord.js')

module.exports = {
    cronJobs(client) {
        console.log('Scheduling cron jobs...')
        // fetch new bus stops
        cron.schedule('0 0 * * *', async () => {
            /*
            const locationApiEndpoint = `https://api.um.warszawa.pl/api/action/dbstore_get/?id=ab75c33d-3a26-4342-b36a-6e5fef0a3ac3&sortBy=id&apikey=${warsawAPI}`

            const data = await fetch(locationApiEndpoint)
                .then(res => res.json())
                .then(json => {
                    fs.writeFileSync('data/warszawa.json', JSON.stringify(json))
                })
            */


            let stop = await selectRandomStop()

            let lines = await getVehiclesAtPole(stop.stopID, stop.poleID)
            while (!lines) {
                stop = await selectRandomStop()
                lines = await getVehiclesAtPole(stop.stopID, stop.poleID)
            }
            const line = lines[Math.floor(Math.random() * lines.length)]
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
            console.log('send')

            const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken })
            console.log('send')
            const embed = new MessageEmbed()
                .setTitle(`${stop.stopName} ${stop.poleID}`)
                .setDescription(`${lineType} - Linia **${line}**${locationMsg}`)
                .setColor('#0099ff')

            const msg = await webhookClient.send({
                embeds: [
                    embed
                ],
            })

            const months = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia']

            const currentDate = new Date()
            const currentDateFormatted = `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`

            client.channels.cache.get(dailyStopChannelID).messages.cache.get(msg.id).startThread({
                reason: 'Daily stop',
                autoArchiveDuration: 1440,
                name: `${currentDateFormatted} - ${stop.stopName} ${stop.poleID}`,
            })
            //client.channels.cache.get(dailyStopChannelID).threads.create({})
        })
    },
}
