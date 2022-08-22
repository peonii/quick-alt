import { SlashCommandBuilder } from '@discordjs/builders'
import { AttachmentBuilder, Client, CommandInteraction, Message, PermissionsBitField } from 'discord.js'
import { MessageCommand } from '../../types/command'
import { botOwnerId } from "../../../bot.config.json"

export const command: MessageCommand = {
    name: 'forcedelete',
    description: 'Delete the message you are replying to',
    async execute(client: Client, message: Message, args: Array<string>, attachment, options) {
        if (message.author.id !== botOwnerId) { 
            message.reply('You are not allowed to use this command!')
            return 1
        }
        const messageToDelete = await message.fetchReference()
        if (!messageToDelete?.id) {
            message.reply('No message found to delete!')
            return 1
        }

        await messageToDelete.delete()
        await message.delete()

        if (options.verbose)
            message.channel.send('Removed message ' + messageToDelete.id)

        return 0
    },
    args: {
        min: 0,
        max: 0
    },
    cooldown: 0,
    permissions: [PermissionsBitField.Flags.ManageMessages]
}
