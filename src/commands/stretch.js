import sharp from 'sharp'
import { SlashCommandBuilder } from '@discordjs/builders'
import fetch from 'node-fetch'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stretch')
        .setDescription('Stretch an image')
        .addAttachmentOption(option => 
            option.setName('image')
                .setDescription('The image to stretch')
                .setRequired(false)),
    async execute(client, interaction) {
        interaction.deferReply()
        let image = interaction.options.getAttachment('image', false)
        let buffer
        if (image) {
            const response = await fetch(image.url)
            const arrayBuffer = await response.arrayBuffer()
            buffer = await Buffer.from(arrayBuffer)
        } else {
            // fetch last image sent in the channel
            const messages = await interaction.channel.messages.fetch()
            const lastMessage = messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp).filter((m) => m.attachments.size > 0).first()
            try {
                image = lastMessage.attachments.first()
            } catch (e) {
                await interaction.editReply({ content: 'No image found!', ephemeral: true })
                return
            }
            const url = image.url
            const response = await fetch(url, { responseType: 'arraybuffer' })
            const arrayBuffer = await response.arrayBuffer()
            buffer = await Buffer.from(arrayBuffer)
        }

        // stretch the image to 2x width
        const sharpBuf = await sharp(buffer)
        const stretched = await sharpBuf.resize(2 * image.width, image.height, { fit: 'fill' }).toBuffer() // mhm

        await interaction.editReply({
            content: 'Here is your stretched image!',
            files: [{
                attachment: stretched,
                name: image.filename
            }]
        })
    }
}