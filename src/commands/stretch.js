const sharp = require('sharp')
const { SlashCommandBuilder } = require('@discordjs/builders')
const axios = require('axios')

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
            // fetch image file
            const response = await axios.get(image.url, { responseType: 'arraybuffer' })
            buffer = Buffer.from(response.data, 'binary')
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
            const response = await axios.get(url, { responseType: 'arraybuffer' })
            buffer = Buffer.from(response.data, 'binary')
        }

        // stretch the image to 2x width
        const sharpBuf = await sharp(buffer)
        const stretched = sharpBuf.resize(2 * image.width, image.height, { fit: 'fill' }).toBuffer() // mhm

        await interaction.editReply({
            content: 'Here is your stretched image!',
            files: [{
                attachment: stretched,
                name: image.filename
            }]
        })
    }
}