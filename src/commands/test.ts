import { SlashCommandBuilder } from '@discordjs/builders'
import { AttachmentBuilder, Client, CommandInteraction, Message } from 'discord.js'
import { MessageCommand } from '../types/command'
import Canvas from '@napi-rs/canvas'

export const command: MessageCommand = {
    name: 'test',
    description: 'test command',
    async execute(client: Client, message: Message, args: Array<string>, attachment) {
        if (!attachment || !attachment.width || !attachment.height) return message.reply('No attachment provided!')

        const canvas = Canvas.createCanvas(attachment.width, attachment.height)

        const ctx = canvas.getContext('2d')

        const image = await Canvas.loadImage(attachment.url)

        ctx.drawImage(image, 0, 0, attachment.width, attachment.height)

        ctx.font = '60px sans-serif'

        ctx.fillStyle = 'ffffff'
        ctx.strokeStyle = '000000'

        ctx.fillText('fuck off', 30, 100)

        const response = new AttachmentBuilder(await canvas.encode('webp'), { name: 'free-gcb.webp'} )

        return message.reply({ content: '<:fokuto:1000092063230079006>', files: [response] })
    },
    args: {
        min: 0,
        max: 0
    },
    attachment: true
}
