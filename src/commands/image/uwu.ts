import { SlashCommandBuilder } from '@discordjs/builders'
import { AttachmentBuilder, Client, CommandInteraction, Message } from 'discord.js'
import { MessageCommand } from '../../types/command'
import { prefix } from "../../../bot.config.json"
import Canvas from '@napi-rs/canvas'

export const command: MessageCommand = {
    name: 'uwu',
    description: 'Uwuify an image! (make it completely pink)',
    async execute(client: Client, message: Message, args: Array<string>, attachment, options) {
        //TODO: add support for links

        if (!attachment) {
            message.reply('No image found to uwuify!')
            return 1
        }

        if (!attachment.height || !attachment.width) throw new Error('Image has no height or width!')

        const canvas = Canvas.createCanvas(attachment.width, attachment.height)

        const ctx = canvas.getContext('2d')

        const image = await Canvas.loadImage(attachment.url)

        ctx.filter = 'grayscale(1)'
        ctx.drawImage(image, 0, 0)
        ctx.filter = 'grayscale(0)'

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = 255 * (imageData.data[i] / 255)
            imageData.data[i+1] = 160 * (imageData.data[i+1] / 255)
            imageData.data[i+2] = 255 * (imageData.data[i+2] / 255)
            imageData.data[i+3] = 255
        }

        ctx.putImageData(imageData, 0, 0)

        const newAttachment = new AttachmentBuilder(await canvas.encode('webp'), { name: 'uwuified.webp' })

        await message.reply({ content: '', files: [newAttachment] })
        return 0
    },
    args: {
        min: 0,
        max: 1
    },
    cooldown: 0,
    permissions: []
}
