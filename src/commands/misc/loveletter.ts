import { SlashCommandBuilder } from '@discordjs/builders'
import { ActionRowBuilder, Client, CommandInteraction, ModalActionRowComponentBuilder, ModalBuilder,  TextInputBuilder, TextInputStyle } from 'discord.js'
import { Command } from '../../types/command'

export const command = {
    data: new SlashCommandBuilder()
        .setName('loveletter')
        .setDescription('Send someone a love letter!')
        .addUserOption(opt => 
            opt.setName('user')
                .setDescription('The user to send the letter to')
                .setRequired(true)),
    async execute(client: Client, interaction: CommandInteraction) {
        const recipient = interaction.options.getUser('user')
        if (!recipient) return interaction.reply('You must specify a user to send the letter to!')

        const modal = new ModalBuilder()
            .setCustomId('loveletter')
            .setTitle('Love Letter')

        const content = new TextInputBuilder()
            .setCustomId('loveletter-content')
            .setLabel('What do you want to send to ' + recipient.tag + '?')
            .setStyle(TextInputStyle.Paragraph)

        const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(content)

        modal.addComponents(actionRow)

        await interaction.showModal(modal)
        const modalInteraction = await interaction.awaitModalSubmit({
            filter: (i) => {
                return true
            },
            time: 30000,
        })

        try {
            await recipient.send('Someone has sent a love letter to you!\n\n' + modalInteraction.fields.getTextInputValue('loveletter-content'))
        } catch (err) {
            return interaction.followUp({ content: 'This person has their DMs closed!', ephemeral: true })
        }
        return interaction.followUp({ content: `Successfully sent love letter to ${recipient.tag}!`, ephemeral: true })
    },
    cooldown: 300
}
