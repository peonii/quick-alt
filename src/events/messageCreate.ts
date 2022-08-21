import { ChannelType, Client, Message } from 'discord.js'
import { prefix } from '../../bot.config.json'

export const name = 'messageCreate'

export async function execute(client: Client, message: Message) {
    if (!(message.channel.type === ChannelType.DM)) {
        if (message.content.includes('quick alt'))
            message.channel.send('please')

        if (message.content.includes('i like lustre'))
            message.reply('have you considered suicide')


        if (message.content.startsWith(prefix)) {
            const args = message.content.split(' ')

            const commandName = args.shift()?.slice(prefix.length)

            if (!commandName) return

            const command = client.commands.get(commandName);

            if (!command) return message.reply('No command found with that name!')

            if (command.args.min > args.length) {
                return message.reply('Too little arguments provided!')
            }
            
            if (command.args.max < args.length) {
                return message.reply('Too many arguments provided!')
            }

            let attachment = null
            let reference = null
            
            if (message.reference) reference = await message.fetchReference()

            message.reply( reference.attachments.first().url)
            //if (message.attachments.first()) attachment = message.attachments.first()
            if (attachment) message.reply('att found')

            try {
                command.execute(client, message, args, attachment)
            } catch (err) {
                console.error(err)
                message.reply('Something failed whilst executing this command!')
            }
        }
    }
}