import sharp from 'sharp'
import { SlashCommandBuilder } from '@discordjs/builders'
import fetch from 'node-fetch'
import { Client, MessageAttachment, CommandInteraction } from 'discord.js'

export const data = new SlashCommandBuilder()
        .setName('stretch')
        .setDescription('Stretch an image')
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('The image to stretch')
                .setRequired(false))

export async function execute(client: Client, interaction: CommandInteraction) {
    await interaction.deferReply()
    let image: MessageAttachment | null | undefined = interaction.options.getAttachment('image', false)
    let buffer
    if (image) {
        const response = await fetch(image.url)
        const arrayBuffer = await response.arrayBuffer()
        buffer = await Buffer.from(arrayBuffer)
    } else {
        // fetch last image sent in the channel
        const messages = await interaction.channel?.messages.fetch()
        const lastMessage = messages?.sort((a, b) => b.createdTimestamp - a.createdTimestamp).filter((m) => m.attachments.size > 0).first()
        try {
            image = lastMessage?.attachments.first()
        } catch (e) {
            await interaction.editReply({ content: 'No image found!' })
            return
        }
        const url = image?.url
        if (!url) return interaction.editReply({ content: 'No image found!' })
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        buffer = await Buffer.from(arrayBuffer)
    }

    if (image == null || image === undefined) {
        await interaction.editReply({ content: 'No image found!' })
        return
    }

    const width = image?.width
    if (width === null) {
        await interaction.editReply({ content: 'No image found!' })
        return
    }

    // stretch the image to 2x width
    const sharpBuf = await sharp(buffer)
    const stretched = await sharpBuf.resize(width * 2, image?.height, { fit: 'fill' }).toBuffer() // mhm

    await interaction.editReply({
        content: 'Here is your stretched image!',
        files: [{
            attachment: stretched,
            name: 'stretched.png'
        }]
    })
}
