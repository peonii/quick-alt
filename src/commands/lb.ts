import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { User } from '../db/dbObjects'
import { botOwnerId } from '../../bot.config.json'


export const data = new SlashCommandBuilder()
    .setName('lb')
    .setDescription('Points leaderboard')

export async function execute(client: Client, interaction: CommandInteraction) {
    await interaction.deferReply()

    const users = await User.findAll({
        attributes: ['id', 'points']
    })

    users.sort((a, b) => b.points - a.points)

    const usersSliced = users.slice(0, 10)

    let desc: String = '';

    for (const user of usersSliced) {
        const tag = (await client.users.fetch(user.id)).tag
        desc += `${tag} - ${user.points}\n`
    }

    const finalEmbed = new MessageEmbed()
        .setTitle('Leaderboard')
        .setDescription(`${desc}`)

    await interaction.editReply({ embeds: [finalEmbed], content: 'Here are the top 10 users:' })
}