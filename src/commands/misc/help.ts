import { SlashCommandBuilder } from '@discordjs/builders'
import { AttachmentBuilder, Client, CommandInteraction, Message } from 'discord.js'
import { MessageCommand } from '../../types/command'
import { prefix } from "../../../bot.config.json"

export const command: MessageCommand = {
    name: 'help',
    description: 'Help command',
    async execute(client: Client, message: Message, args: Array<string>, attachment, options) {
        let commands = client.commands.map(command => {
            return `${prefix}**${command.name}** - ${command.description}`
        }).join('\n')

        commands += '\n\nOptions: `--verbose` `--log-error`'
        commands += '\nBot made by **peony#6666** with :heart:'

        return message.reply(commands)
    },
    args: {
        min: 0,
        max: 0
    }
}
