import { SlashCommandBuilder } from '@discordjs/builders'
import { Client, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Send a DM to a user')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to send the DM to')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('message')
            .setDescription('The message to send')
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName('amount')
            .setDescription('The amount of messages to send')
            .setRequired(false))
    .addIntegerOption(option =>
        option.setName('delay')
            .setDescription('The delay between messages (in seconds)')
            .setRequired(false));
            
export async function execute(client: Client, interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true })
    const user = interaction.options.getUser('user', true)
    const amount = interaction.options.getInteger('amount', false) || 1
    const delay = interaction.options.getInteger('delay', false) || 0
    const message = interaction.options.getString('message', true)

    const override = ['277016821809545216']

    if (amount > 10 && !override.includes(interaction.user.id)) return interaction.editReply({ content: 'You can only send 10 messages at a time!' })
    if (delay > 300 && !override.includes(interaction.user.id)) return interaction.editReply({ content: 'You can only send messages with a delay of less than 5 minutes!' })

    await setTimeout(async () => {
        for (let i = 0; i < amount; ++i) {
            await user.send(message)
        }
    }, delay * 1000)

    await interaction.editReply({ content: `Sent ${amount} DM(s) to ${user.username}` })
}