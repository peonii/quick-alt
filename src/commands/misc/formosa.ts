import { SlashCommandBuilder } from '@discordjs/builders'
import { AttachmentBuilder, Client, CommandInteraction, Message } from 'discord.js'
import { MessageCommand } from '../../types/command'
import { prefix } from "../../../bot.config.json"

export const command: MessageCommand = {
    name: 'formosa',
    description: 'Sends the .gmd2 file for the level Formosa by Eightos.',
    async execute(client: Client, message: Message, args: Array<string>, attachment, options) {
        const att = new AttachmentBuilder('https://cdn.discordapp.com/attachments/1009211878901305416/1011018968699506701/Formosa.gmd2')
        message.reply({ content: '', files: [att] })
        return 0
    },
    args: {
        min: 0,
        max: 0
    },
    cooldown: 0,
    permissions: []
}
