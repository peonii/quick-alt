import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { User } from '../../db/dbObjects'


export const data = new SlashCommandBuilder()
    .setName('getpoints')
    .setDescription('Get points of the user.')

export async function execute(client: Client, interaction: CommandInteraction) {
    await interaction.deferReply()
    const id = interaction.user.id

    const [user, created] = await User.findOrCreate({
        where: {
            id
        },
        defaults: {
            id,
            points: 0,
        }
    })

    return interaction.editReply(`Your point balance is **${user.points}**!`)
}
