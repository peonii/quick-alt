import { SlashCommandBuilder } from '@discordjs/builders'
import fetch from 'node-fetch'
import { Client, CommandInteraction, MessageEmbed } from 'discord.js'
import getVehiclesAtPole from '../libs/warsaw-api/getVehiclesAtPole'
import selectRandomStop from '../libs/warsaw-api/selectRandomStop'
import getPointsOfDistrict from '../libs/warsaw-api/getPointsOfDistrict'

export const data = new SlashCommandBuilder()
        .setName('randomstop')
        .setDescription('Get a random Warsaw bus/tram stop')
        
        
export async function execute(client: Client, interaction: CommandInteraction) {
    const startEmbed = new MessageEmbed()
        .setTitle(`Fetching your stop...`)
        .setColor('#0099ff')
        .setTimestamp()
        .setFooter(`Powered by UM Warszawy`)
    await interaction.reply({content: 'Please wait...', embeds: [startEmbed]})
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
    const points = getPointsOfDistrict(stop.districtName)

    const finalEmbed = new MessageEmbed()
        .setTitle(`${stop.stopName} ${stop.poleID} (${stop.districtName} - ${points})`)
        .setDescription(`${lineType} - Linia **${line}**` + locationMsg)
        .setColor('#0099ff')
        .setTimestamp()
        .setFooter(`Powered by UM Warszawy - Stop ID ${stop.stopID}`)

    await interaction.editReply({ content: 'Here is your stop:', embeds: [finalEmbed] })
}