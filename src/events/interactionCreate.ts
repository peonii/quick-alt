import { Client, CommandInteraction, CommandInteractionOptionResolver, Interaction, InteractionType } from 'discord.js'
import { handleCommand } from '../handlers/commands'

export const name = 'interactionCreate'

export async function execute(client: Client, interaction: Interaction) {
    if (interaction.isCommand()) return handleCommand(client, interaction)
    if (interaction.type === InteractionType.ModalSubmit) {
        if (interaction.customId === 'loveletter') {
            interaction.reply({ content: 'Sending love letter...', ephemeral: true })
        }
    }
}