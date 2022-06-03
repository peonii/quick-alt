import { Client, CommandInteraction, CommandInteractionOptionResolver, Interaction } from 'discord.js'
import { handleCommand } from '../handlers/commands'

export const name = 'interactionCreate'

export async function execute(client: Client, interaction: Interaction) {
    if (interaction.isCommand()) return handleCommand(client, interaction)
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'say') {
            const sayMessage = interaction.fields.getTextInputValue('saymessage')
            interaction.reply({ content: `${sayMessage}` })
        }
    }
}