import { Channel, ChannelType, Client, GuildChannel, Message, TextChannel } from 'discord.js'
import { prefix } from '../../bot.config.json'

export const name = 'messageCreate'

export async function execute(client: Client, message: Message) {
    if (!(message.channel.type === ChannelType.DM)) {
        if (message.content.includes('quick alt'))
            message.channel.send('please')

        if (message.content.includes('i like lustre'))
            message.reply('have you considered suicide')

        if (message.content.includes('i hate peony'))
            message.delete()


        if (message.content.startsWith(prefix)) {
            if (message.author.bot) return;
            let args = message.content.split(' ')

            const commandName = args.shift()?.slice(prefix.length)

            if (!commandName) return

            const command = client.commands.get(commandName);

            if (!command) return message.reply('No command found with that name!')

            let opts = args.filter((arg: string) => arg.startsWith('--'))
            let options = {
                verbose: false,
                log_error: false
            }

            opts.forEach((opt: string) => {
                if (opt === '--verbose') options.verbose = true
                if (opt === '--log-error') options.log_error = true
            })

            args = args.filter((arg: string) => !arg.startsWith('--'))

            if (command.args.min > args.length) {
                return message.reply('Too little arguments provided!')
            }
            
            if (command.args.max < args.length) {
                return message.reply('Too many arguments provided!')
            }

            let attachment = null
            let reference: Message | null | undefined = null

            if (message.reference) {
                reference = await message.fetchReference()
                if (!reference?.id) return;
                
                const ch = client.channels.cache.find((ch: any) => ch.id === reference?.channelId)
                if (!(ch instanceof TextChannel)) return;
                reference = ch.messages.cache.find((msg: Message) => msg.id === reference?.id)
            }

            if (message.attachments.first()) attachment = message.attachments.first()
            if (!attachment && reference?.attachments) attachment = reference.attachments.first()

            if (!attachment) {

                // fetch last attachment
                console.log('fetching')
                const lastMessages = await message.channel.messages.fetch()
                console.log('fetched')
                const lastMessage = lastMessages.find((msg: Message) => msg.attachments.size > 0)

                if (lastMessage) attachment = lastMessage.attachments.first()
            }


            try {
                command.execute(client, message, args, attachment, options)
            } catch (err) {
                console.error(err)
                message.reply('Something failed whilst executing this command!')
                if (options.log_error) {
                    const errorMessage = JSON.stringify(err)
                    message.reply(errorMessage)
                }
            }
        }
    }
}