// @ts-nocheck
import { SlashCommandBuilder } from '@discordjs/builders'
import { Client, CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import getVehiclesAtPole from '../../libs/warsaw-api/getVehiclesAtPole'
import selectRandomStop from '../../libs/warsaw-api/selectRandomStop'
import getPointsOfDistrict from '../../libs/warsaw-api/getPointsOfDistrict'
import { User } from '../../db/dbObjects'

export const data = new SlashCommandBuilder()
        .setName('challenge')
        .setDescription('Random stop challenge - select a random stop and get points! (Cooldown: 24h)')
        
        
export async function execute(client: Client, interaction: CommandInteraction) {
    await interaction.deferReply()
    const user = interaction.user
    const userId = user.id
    const now = new Date()

    // check if player cooldown is over
    const [userData, created] = await User.findOrCreate({
        where: {
            id: userId
        },
        defaults: {
            id: userId,
            points: 0,
        }
    })

    const lastChallenge = 0//userData.lastChallenge
    const challengeCooldown = 24 * 60 * 60 * 1000
    if (lastChallenge && now.getTime() - lastChallenge.getTime() < challengeCooldown) {
        await interaction.editReply({ content: 'You have to wait 24h to challenge again!' })
        return
    }

    const startEmbed = new MessageEmbed()
        .setTitle(`Fetching your stop...`)
        .setColor('#0099ff')
        .setTimestamp()
        .setFooter(`Powered by UM Warszawy`)
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

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Lokalizacja')
                .setStyle('LINK')
                .setURL(`https://www.google.com/maps/search/?api=1&query=${stop.latitude},${stop.longitude}`)
        )

    const points = getPointsOfDistrict(stop.districtName)

    const finalEmbed = new MessageEmbed()
        .setTitle(`${stop.stopName} ${stop.poleID}`)
        .setColor('#0099ff')
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
        .setTimestamp()
        .setFooter({ text: `Powered by UM Warszawy - Stop ID ${stop.stopID}` })

    await interaction.editReply({ content: 'Here is your stop:', embeds: [finalEmbed], components: [row] })
    userData.lastChallengeStop = `${stop.stopID} ${stop.poleID}`
    userData.lastChallenge = now
}