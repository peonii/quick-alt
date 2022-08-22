import { SlashCommandBuilder } from '@discordjs/builders'
import { AttachmentBuilder, Client, CommandInteraction, Message, PermissionsBitField } from 'discord.js'
import { MessageCommand } from '../../types/command'
import { prefix } from "../../../bot.config.json"

export const command: MessageCommand = {
    name: 'loveletter',
    description: 'Send an anonymous DM to someone!',
    async execute(client: Client, message: Message, args: Array<string>, attachment, options) {
        const userToSend = client.users.cache.find(user => user.id === args[0])

        if (!userToSend) {
            await message.reply('User not found!')
            return 1
        }

        const letter = args.slice(1).join(' ')

        if (!letter) {
            await message.reply('No letter provided!')
            return 1
        }

        try {
            const dm = await userToSend.send('Someone sent you a love letter~!\n\n' + letter)
        } catch (error) {
            await message.reply('This person has their DMs closed!')
            return 1
        }
        message.delete()

        try {
            await message.author.send('Sent letter to ' + userToSend.tag + '!')
            return 0
        } catch (error) {
            return 1
        }
    },
    args: {
        min: 2,
        max: 9999
    },
    cooldown: 300,
    permissions: []
}
