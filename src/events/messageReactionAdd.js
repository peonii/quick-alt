module.exports = {
    name: 'messageReactionAdd',
    async execute(client, reaction) {
        const eten = await reaction.users.fetch('889396376746721320')
        if (eten && reaction.emoji.url && reaction.count === 1) {
            const msg = await reaction.message.channel.send('dzięki eten :+1:')
            setTimeout(() => msg.delete(), 1666)
        }

    }
}