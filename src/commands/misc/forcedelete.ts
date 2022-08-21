import { SlashCommandBuilder } from '@discordjs/builders'
import { AttachmentBuilder, Client, CommandInteraction, Message } from 'discord.js'
import { MessageCommand } from '../../types/command'
import { botOwnerId } from "../../../bot.config.json"

export const command: MessageCommand = {
    name: 'forcedelete',
    description: 'Delete the message you are replying to',
    async execute(client: Client, message: Message, args: Array<string>, attachment, options) {
        if (message.author.id !== botOwnerId) return message.reply('You are not allowed to use this command!')

        const messageToDelete = await message.fetchReference()
        if (!messageToDelete?.id) return message.reply('No message found to delete!')

        await messageToDelete.delete()
        await message.delete()

        if (options.verbose)
            message.channel.send('Removed message ' + messageToDelete.id)
    },
    args: {
        min: 0,
        max: 0
    },
    cooldown: 0
}
