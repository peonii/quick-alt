import { SlashCommandBuilder } from '@discordjs/builders'
import { AttachmentBuilder, Client, CommandInteraction, Message } from 'discord.js'
import { MessageCommand } from '../../types/command'
import { prefix } from "../../../bot.config.json"

export const command = {
    data: new SlashCommandBuilder()
        .setName('formosa')
        .setDescription('Send a Formosa .gmd2 file'),
    async execute(client: Client, interaction: CommandInteraction) {
        const att = new AttachmentBuilder('https://cdn.discordapp.com/attachments/1009211878901305416/1011018968699506701/Formosa.gmd2')
        return interaction.reply({ content: '', files: [att] })
    },
    cooldown: 0,
}
