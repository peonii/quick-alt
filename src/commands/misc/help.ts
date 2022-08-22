import { SlashCommandBuilder } from '@discordjs/builders'
import { AttachmentBuilder, Client, CommandInteraction, Message } from 'discord.js'
import { MessageCommand } from '../../types/command'
import { prefix, botOwnerId } from "../../../bot.config.json"

export const command: MessageCommand = {
    name: 'help',
    description: 'Help command',
    async execute(client: Client, message: Message, args: Array<string>, attachment, options) {
        let commands = client.commands.map(command => {
            if (command.permissions && !message.guild) {
                return `:x: ${prefix}**${command.name}** - ${command.description}`
            }
            if ((command.permissions && message.member?.permissions.has(command.permissions)) || !command.permissions || message.author.id === botOwnerId)
                return `:white_check_mark: ${prefix}**${command.name}** - ${command.description}`
            else {
                return `:x: ${prefix}**${command.name}** - ${command.description}`
            }
        }).join('\n')

        if (message.author.id === botOwnerId) commands += '\n\nOptions: `--verbose` `--log-error` `--bypass-cooldown` `--show-parsing`'
        commands += '\nBot made by **peony#6666** with :heart:'

        await message.reply(commands)
        return 0
    },
    args: {
        min: 0,
        max: 0
    },
    cooldown: 0,
    permissions: []
}
