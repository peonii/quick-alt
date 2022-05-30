const { SlashCommandBuilder } = require('@discordjs/builders')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const { getStopID, getCoordinatesOfStop, getVehiclesAtStop } = require('../libs/warsaw-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomstop')
        .setDescription('Get a random Warsaw bus/tram stop')
        .addBooleanOption(option =>
            option.setName('location')
                .setDescription('Get the location of the stop'))
        .addBooleanOption(option => 
            option.setName('line')
                .setDescription('Get a random line that courses at the stop')),
    async execute(client, interaction) {
        const startEmbed = new MessageEmbed()
            .setTitle(`Fetching your stop...`)
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter(`Powered by UM Warszawy`)
        await interaction.reply({content: 'Please wait...', embeds: [startEmbed]})
        const stops = require('../../data/warszawa.json')
        
        const randomStop = stops.stops[Math.floor(Math.random() * stops.stops.length)]
        const getLine = interaction.options.getBoolean('line')
        let stopID, lines

        // url encoded randomstop
        try {
            if (getLine !== false) {
                stopID = await getStopID(randomStop)

                lines = await getVehiclesAtStop(stopID)
            } else {
                throw new Error()
            }
        } catch {
            const finalEmbed = new MessageEmbed()
                .setTitle(`${randomStop}`)
                .setColor('#0099ff')
                .setTimestamp()
                .setFooter(`Powered by UM Warszawy`)

            return interaction.editReply({ content: 'Here is your stop:', embeds: [finalEmbed] })
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

        const getLocation = interaction.options.getBoolean('location', false)
        let [locationLat, locationLng] = getLocation ? getCoordinatesOfStop(stopID) : [null, null]

        const locationMsg = getLocation ? ` - [Lokalizacja](https://www.google.com/maps/search/?api=1&query=${locationLat},${locationLng})` : ''

        const finalEmbed = new MessageEmbed()
            .setTitle(`${randomStop}`)
            .setDescription(`${lineType} - Linia **${line}**` + locationMsg)
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter(`Powered by UM Warszawy - Stop ID ${stopID}`)

        await interaction.editReply({ content: 'Here is your stop:', embeds: [finalEmbed] })
    }
}
