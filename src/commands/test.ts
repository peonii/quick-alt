import { SlashCommandBuilder } from '@discordjs/builders'
import { Client, CommandInteraction } from 'discord.js'

export const data = new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command')

export async function execute(client: Client, interaction: CommandInteraction) {
    await interaction.reply({ content: 'Test command executed!' })
}