import { SlashCommandBuilder } from '@discordjs/builders'
import { Client, CommandInteraction } from 'discord.js'
import crypto from 'node:crypto'

export const data = new SlashCommandBuilder()
        .setName('encrypt')
        .setDescription('Encrypts a message')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to encrypt')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('hash')
                .setDescription('The hash to use')
                .setRequired(true)
                .addChoices(
                    { name: 'SHA256', value: 'sha256'},
                    { name: 'SHA512', value: 'sha512'},
                    { name: 'SHA1', value: 'sha1'},
                    { name: 'MD5', value: 'md5'}
                ))

export async function execute(client: Client, interaction: CommandInteraction) {
    const message = interaction.options.getString('message', true)
    const hashOption = interaction.options.getString('hash', true)

    const hash = crypto.createHash(hashOption)
    hash.update(message)
    const encrypted = hash.digest('hex')
    await interaction.reply({ content: encrypted })
}