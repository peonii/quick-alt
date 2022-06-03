import { Client, Message } from 'discord.js'

export const name = 'messageCreate'

export async function execute(client: Client, message: Message) {
    if (!(message.channel.type === 'DM')) {
        if (message.content === 'h')
            message.channel.send('██╗░░██╗ \n██║░░██║ \n███████║ \n██╔══██║ \n██║░░██║ \n╚═╝░░╚═╝')

        if (message.content.includes('maki alt'))
            message.channel.send('no!!! i\'m the superior bot!!! b-baka...')

        if (message.content.toLowerCase().includes('nigger'))
            message.channel.send('Ok')

        if (message.content.toLowerCase().includes('querter') || message.content.toLowerCase().includes('qtr-chan') || message.content.toLowerCase().includes('qtr'))
            message.reply('you baka!!! dont you notice she changed her name??? please use raisa instead!!!')

        if (message.content.toLowerCase().includes('?stfu'))
            message.reply('literally 1984')
    }
}