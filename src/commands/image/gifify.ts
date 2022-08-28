import { SlashCommandBuilder } from '@discordjs/builders'
import { ApplicationCommandType, AttachmentBuilder, Client, CommandInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, Message, MessageContextMenuCommandInteraction } from 'discord.js'
import { MessageCommand } from '../../types/command'
import { prefix } from "../../../bot.config.json"
import { createFFmpeg } from '@ffmpeg/ffmpeg'
import fetch from 'node-fetch'

export const command = {
    data: new ContextMenuCommandBuilder()
        .setName('Gifify this file')
        .setType(ApplicationCommandType.Message),
    async execute(client: Client, interaction: MessageContextMenuCommandInteraction) {
        const attachment = interaction.targetMessage.attachments.first()
        let attachmentURL = ''
        if (!attachment || !attachment.height || !attachment.width) {
            const embeds = interaction.targetMessage.embeds;
            if (!embeds) return

            const embed = embeds[0]

            if (embed.image) {
                attachmentURL = embed.image.url
            } else if (embed.thumbnail) {
                attachmentURL = embed.thumbnail.url
            } else if (embed.video) {
                attachmentURL = embed.video.url
            }
        } else {
            attachmentURL = attachment.url
        }
        if (attachmentURL.endsWith('.gif')) {
            return interaction.reply('You can\'t gifify a gif!')
        }
        interaction.channel?.send('fuck you peony i hate you ' + attachmentURL)
        const attachmentName = attachmentURL.split('/').pop()
        await interaction.channel?.send('<@277016821809545216> kill yourself ' + attachmentName)

        const temp = await fetch(attachmentURL).then(res => res.arrayBuffer())

        const buffer = Buffer.from(temp)

        await interaction.reply(':hourglass: Generating color palette for gif...')

        const ffmpeg = createFFmpeg()
        console.log('loading my favorite :33')
        await ffmpeg.load()
        console.log('bestie loaded')

        if (!attachmentName) return 1

        await ffmpeg.FS('writeFile', attachmentName, buffer)

        try {
            await ffmpeg.run(
                '-i', attachmentName,
                '-vf', 'palettegen=stats_mode=diff:max_colors=255:reserve_transparent=1',
                '-y',
                'palette.png'
            )
        } catch (e) {
            console.log(e)
            return interaction.reply('Unsupported file type!')
        }

        await interaction.editReply(':hourglass: Generating gif...')

        await ffmpeg.run(
            '-i', attachmentName,
            '-i', 'palette.png',
            '-lavfi', 'paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle',
            '-t', '5',
            '-f', 'gif',
            '-y',
            'output.gif'
        )
        let gifBuffer = null
        try {
            gifBuffer = await Buffer.from(await ffmpeg.FS('readFile', 'output.gif'))
        } catch (e) {
            console.log(e)
            return interaction.editReply('Unsupported file type!')
        }
        const gif = new AttachmentBuilder(gifBuffer, { name: 'output.gif' })

        try {
            await interaction.editReply({ content: 'Here is your gif!', files: [gif] })
        }
        catch (err) {
            console.log(err)
            return await interaction.editReply(':x: Oops! It appears an error occurred! The filesize is likely too large.')
        }
    },
    cooldown: 5
}
