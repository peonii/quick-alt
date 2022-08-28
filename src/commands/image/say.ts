import { ContextMenuCommandBuilder, ApplicationCommandType, Client, MessageContextMenuCommandInteraction, AttachmentBuilder, messageLink, Attachment } from "discord.js"
import Canvas from '@napi-rs/canvas'
import fetch from 'node-fetch'

export const command = {
    data: new ContextMenuCommandBuilder()
        .setName('Add a speech bubble')
        .setType(ApplicationCommandType.Message),
    async execute(client: Client, interaction: MessageContextMenuCommandInteraction) {
        let attachment = interaction.targetMessage.attachments.first()
        let attachmentURL = ''
        let attachmentWidth = 0
        let attachmentHeight = 0
        if (!attachment || !attachment.height || !attachment.width) {
            const embeds = interaction.targetMessage.embeds;
            if (!embeds) return

            const embed = embeds[0]

            if (embed.image) {
                attachmentURL = embed.image.url
                if (embed.image.width) {
                    attachmentWidth = embed.image.width
                }
                if (embed.image.height) {
                    attachmentHeight = embed.image.height
                }
            } else if (embed.thumbnail) {
                attachmentURL = embed.thumbnail.url
                if (embed.thumbnail.width) {
                    attachmentWidth = embed.thumbnail.width
                }
                if (embed.thumbnail.height) {
                    attachmentHeight = embed.thumbnail.height
                }
            }
        } else {
            attachmentURL = attachment.url
            attachmentWidth = attachment.width
            attachmentHeight = attachment.height
        }

        if (attachmentURL?.endsWith('.png') || attachmentURL?.endsWith('.jpg') || attachmentURL?.endsWith('.jpeg') || attachmentURL?.endsWith('.gif') || attachmentURL.endsWith('.webp')) {
            const offset = Math.floor(attachmentHeight * 0.26666)
            const canvas = Canvas.createCanvas(attachmentWidth, attachmentHeight + offset)
            const img = await Canvas.loadImage(attachmentURL)

            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, offset)
            ctx.strokeStyle = '#000000'
            ctx.fillStyle = '#ffffff'
            ctx.lineWidth = 0
            ctx.fillRect(0, 0, attachmentWidth, offset)
            ctx.lineWidth = 12

            ctx.ellipse(attachmentWidth / 2, (-offset * 4.5) + 2, attachmentWidth * 2, offset * 5, 0, 0, 2 * Math.PI)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(attachmentWidth / 2, offset * 0.4)
            ctx.lineTo((attachmentWidth / 2) * 0.8, offset * 1)
            ctx.lineTo((attachmentWidth / 2) * 1.4, offset * 0.4)
            ctx.closePath()
            ctx.stroke()
            ctx.fill()
            
            ctx.ellipse(attachmentWidth / 2, -offset * 4.5, attachmentWidth * 2, offset * 5, 0, 0, 2 * Math.PI)
            ctx.fill()
            ctx.fill()
            ctx.fill()


            const newAttachment = new AttachmentBuilder(await canvas.encode('webp'), { name: 'speechbubble.webp' })
            return interaction.reply({ content: '', files: [newAttachment] })
        } else {
            return interaction.reply('Unsupported file type!')
        }
    },
    cooldown: 5
}