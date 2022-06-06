import cron from 'cron'
import fs from 'fs'
import fetch from 'node-fetch'
import { warsawAPI, webhookId, webhookToken, dailyStopChannelID } from '../../keys.json'
import getVehiclesAtPole from '../libs/warsaw-api/getVehiclesAtPole'
import selectRandomStop from '../libs/warsaw-api/selectRandomStop'
import { WebhookClient, MessageEmbed, Client, TextChannel, MessageActionRow, MessageButton } from 'discord.js'
import getPointsOfDistrict from '../libs/warsaw-api/getPointsOfDistrict'

let client: Client<boolean>

const fetchBusStops = new cron.CronJob(
    '30 0 * * *',
    async function() {
        const locationApiEndpoint = `https://api.um.warszawa.pl/api/action/dbstore_get/?id=ab75c33d-3a26-4342-b36a-6e5fef0a3ac3&sortBy=id&apikey=${warsawAPI}`

        const data = await fetch(locationApiEndpoint)
            .then(res => res.json())
            .then(json => {
                fs.writeFileSync('data/warszawa.json', JSON.stringify(json))
            })


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

        const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken })
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Lokalizacja')
                    .setStyle('LINK')
                    .setURL(`https://www.google.com/maps/search/?api=1&query=${stop.latitude},${stop.longitude}`)
            )
        const points = getPointsOfDistrict(stop.districtName)
        console.log('send')
        const embed = new MessageEmbed()
            .setTitle(`${stop.stopName} ${stop.poleID}`)
            .addFields(
                {
                    name: 'Dzielnica',
                    value: `${stop.districtName} - ${points}pkt`
                },
                {
                    name: 'Linia',
                    value: `${lineType} - Linia **${line}**`
                },
            )
            .setColor('#0099ff')

        const msg = await webhookClient.send({
            embeds: [
                embed
            ],
            components: [
                row
            ]
        })

        const months = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia']

        const currentDate = new Date()
        const currentDateFormatted = `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`

        const stopChannel: TextChannel = client.channels.cache.get(dailyStopChannelID) as TextChannel

        
        stopChannel.messages.cache.get(msg.id)?.startThread({
            reason: 'Daily stop',
            autoArchiveDuration: 1440,
            name: `${currentDateFormatted} - ${stop.stopName} ${stop.poleID}`,
        })
        //client.channels.cache.get(dailyStopChannelID).threads.create({})
    }
)

export default async function(c: Client<boolean>) {
    client = c
    console.log('Scheduling cron jobs...')
    fetchBusStops.start()
}