const { SlashCommandBuilder } = require('@discordjs/builders')
const { Modal, TextInputComponent, MessageActionRow } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something'),
    async execute(client, interaction) {
        const modal = new Modal()
            .setCustomId('say')
            .setTitle('Say something')

        const messageToSend = new TextInputComponent()
            .setCustomId('saymessage')
            .setLabel('What should the bot say?')
            .setStyle('PARAGRAPH')

        const actionRow = new MessageActionRow().addComponents(messageToSend) // i love type checking

        modal.addComponents(actionRow)
            
        await interaction.showModal(modal)
    }
}