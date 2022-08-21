import { SlashCommandBuilder } from '@discordjs/builders'
import { AttachmentBuilder, Client, CommandInteraction, Message } from 'discord.js'
import { MessageCommand } from '../../types/command'
import { prefix } from "../../../bot.config.json"
import { createFFmpeg } from '@ffmpeg/ffmpeg'
import fetch from 'node-fetch'

export const command: MessageCommand = {
    name: 'gifify',
    description: 'Turn any image or video into a gif',
    async execute(client: Client, message: Message, args: Array<string>, attachment, options) {
        if (attachment?.name?.endsWith('.gif')) return message.reply('You can\'t gifify a gif!')

        let buffer = null
        if (args[0]) {
            const url = args[0]
            const image = await fetch(url)
            const temp = await image.arrayBuffer()
            buffer = Buffer.from(temp)
        }
        else if (attachment) {
            const temp = await fetch(attachment.url).then(res => res.arrayBuffer())

            buffer = Buffer.from(temp)
        } else {
            return message.reply('No image or video found to gifify!')
        }

        const response = await message.reply(':hourglass: Generating color palette for gif...')

        const ffmpeg = createFFmpeg()
        await ffmpeg.load()
        if (!attachment?.name) return;

        await ffmpeg.FS('writeFile', attachment?.name, buffer)


        if (options.verbose) {
            message.reply(`Running ffmpeg command with args: \`-i ${attachment?.name} -vf palettegen=stats_mode=diff:max_colors=255:reserve_transparent=1 -y palette.png\``)
        }
        await ffmpeg.run(
            '-i', attachment?.name,
            '-vf', 'palettegen=stats_mode=diff:max_colors=255:reserve_transparent=1',
            '-y',
            'palette.png'
        )

        await response.edit(':hourglass: Generating gif...')

        if (options.verbose) {
            message.reply(`Running ffmpeg command with args: \`-i ${attachment?.name} -i palette.png -lavfi paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle -t 5 -f gif -y output.gif\``)
        }

        await ffmpeg.run(
            '-i', attachment?.name,
            '-i', 'palette.png',
            '-lavfi', 'paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle',
            '-t', '5',
            '-f', 'gif',
            '-y',
            'output.gif'
        )

        const gifBuffer = await Buffer.from(await ffmpeg.FS('readFile', 'output.gif'))
        const gif = new AttachmentBuilder(gifBuffer, { name: 'output.gif' })

        try {
            await response.edit({ content: '', files: [gif] })
        }
        catch (err) {
            console.log(err)
            await response.edit(':x: Oops! It appears an error occurred! The filesize is likely too large.')
            if (options.log_error) {
                const errorMessage = new AttachmentBuilder(JSON.stringify(err), { name: 'error.json' })

                await message.reply({ files: [errorMessage] })
            }
        }
    },
    args: {
        min: 0,
        max: 1
    },
    attachment: true,
    cooldown: 5
}
