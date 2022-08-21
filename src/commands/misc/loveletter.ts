import { SlashCommandBuilder } from '@discordjs/builders'
import { AttachmentBuilder, Client, CommandInteraction, Message } from 'discord.js'
import { MessageCommand } from '../../types/command'
import { prefix } from "../../../bot.config.json"

export const command: MessageCommand = {
    name: 'loveletter',
    description: 'Send an anonymous DM to someone!',
    async execute(client: Client, message: Message, args: Array<string>, attachment, options) {
        const userToSend = client.users.cache.find(user => user.id === args[0])

        if (!userToSend) return message.reply('User not found!')

        const letter = args.slice(1).join(' ')

        if (!letter) return message.reply('No letter provided!')

        try {
            const dm = await userToSend.send('Someone sent you a love letter~!\n\n' + letter)
        } catch (error) {
            return message.reply('This person has their DMs closed!')
        }
        message.delete()

        try {
            await message.author.send('Sent letter to ' + userToSend.tag + '!')
        } catch (error) {}
    },
    args: {
        min: 2,
        max: 9999
    },
    cooldown: 300
}
