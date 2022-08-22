import { SlashCommandBuilder } from '@discordjs/builders'
import { ApplicationCommandType, AttachmentBuilder, Client, CommandInteraction, ContextMenuCommandBuilder, Message, MessageContextMenuCommandInteraction, PermissionsBitField } from 'discord.js'
import { MessageCommand } from '../../types/command'
import { botOwnerId } from "../../../bot.config.json"

export const command = {
    data: new ContextMenuCommandBuilder()
        .setName('Delete this message')
        .setType(ApplicationCommandType.Message),
    async execute(client: Client, interaction: MessageContextMenuCommandInteraction) {
        if (interaction.user.id !== botOwnerId) { 
            return interaction.reply({ content: 'You are not allowed to use this command!', ephemeral: true })
        }
        await interaction.targetMessage.delete()

        return interaction.reply({ content: 'Successfully removed message!', ephemeral: true })
    },
    cooldown: 0,
}
