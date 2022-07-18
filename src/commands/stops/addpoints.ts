import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { User } from '../../db/dbObjects'
import { botOwnerId } from '../../../bot.config.json'


export const data = new SlashCommandBuilder()
    .setName('addpoints')
    .setDescription('Add points to the user.')
    .addUserOption(option => option.setName('user').setDescription('The user to add points to').setRequired(true))
    .addIntegerOption(option => option.setName('points').setDescription('How many points to add').setRequired(true))

export async function execute(client: Client, interaction: CommandInteraction) {
    await interaction.deferReply()
    const discordUser = interaction.options.getUser('user', true)
    const pointsToAdd = interaction.options.getInteger('points', true)
    const id = discordUser.id
    
    if (interaction.user.id !== botOwnerId) {
        return await interaction.editReply('You are not allowed to run this command!')
    }

    const [user, _created] = await User.findOrCreate({
        where: {
            id
        },
        defaults: {
            id,
            points: 0,
        }
    })
    user.points += pointsToAdd
    await user.save()
    await interaction.editReply(`Successfully added ${pointsToAdd} points to ${discordUser.tag}! (Current point balance is ${user.points})`)
}
